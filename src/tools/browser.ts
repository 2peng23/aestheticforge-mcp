import { z } from "zod";
import path from "node:path";
import { promises as filesystem } from "node:fs";
import { Workspace } from "../security/workspace.js";
import { inspectProject } from "../analyzers/project.js";
import { BrowserService, compareImages } from "../browser/session.js";
import type { AddTool } from "./types.js";
import { filePath, projectInput, pageInput, action } from "./inputs.js";
export function registerBrowserTools(
  workspace: Workspace,
  browser: BrowserService,
  add: AddTool,
) {
  const geometryTools: Record<string, string[]> = {
    analyze_responsive_layout: [
      "viewport",
      "document",
      "overflow",
      "overlaps",
      "touchTargets",
    ],
    detect_horizontal_overflow: ["viewport", "document", "overflow"],
    detect_element_overlap: ["viewport", "overlaps"],
    audit_mobile_navigation: [
      "viewport",
      "navigation",
      "touchTargets",
      "overflow",
    ],
    validate_touch_targets: ["viewport", "touchTargets"],
    audit_navigation: ["navigation", "landmarks"],
    audit_forms: ["forms"],
    audit_information_hierarchy: ["headings", "landmarks"],
    audit_ui_states: ["states"],
    audit_interaction_feedback: ["states", "animations"],
    analyze_motion_opportunities: ["animations", "states"],
    audit_animation_performance: ["animations"],
    inspect_layout_geometry: [
      "viewport",
      "document",
      "overflow",
      "overlaps",
      "touchTargets",
      "headings",
      "landmarks",
    ],
  };
  for (const [name, fields] of Object.entries(geometryTools))
    add(
      name,
      "Inspect browser-rendered " +
        fields.join(", ") +
        ". Results are measured evidence and labeled heuristics.",
      pageInput,
      async (input) => {
        const result: any = await browser.geometry(input);
        return Object.fromEntries([
          ...fields.map((field) => [field, result[field]]),
          ["limits", result.limits],
        ]);
      },
    );
  const screenshotInput = pageInput.extend({
    output: filePath,
    fullPage: z.boolean().default(false),
  });
  add(
    "capture_page_screenshot",
    "Capture real rendered PNG with inputs and marked private content masked.",
    screenshotInput,
    (input) => browser.screenshot(input, input.output, input.fullPage),
    true,
  );
  const matrixInput = pageInput.extend({
    widths: z
      .array(z.number().int().min(320).max(3840))
      .min(1)
      .max(15)
      .default([320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920]),
    outputDirectory: filePath.optional(),
  });
  for (const name of ["capture_viewport_matrix", "generate_responsive_report"])
    add(
      name,
      "Measure layout at explicit common and intermediate widths; optionally save masked screenshots.",
      matrixInput,
      async (input) => {
        const results = [];
        for (const width of [...new Set(input.widths)] as number[]) {
          const options = { ...input, width };
          const geometry = await browser.geometry(options);
          const capture = input.outputDirectory
            ? await browser.screenshot(
                options,
                path.join(input.outputDirectory, `viewport-${width}.png`),
              )
            : null;
          results.push({ width, geometry, capture });
        }
        return {
          url: input.url,
          results,
          methodology:
            "Independent contexts, DPR1, en-US, UTC; each route sampled after network idle.",
        };
      },
      true,
    );
  for (const name of [
    "run_accessibility_audit",
    "generate_accessibility_report",
    "validate_semantics",
  ])
    add(
      name,
      "Run real axe-core WCAG2/2.1/2.2 AA rules; returns violations and incomplete checks, never a conformance claim.",
      pageInput,
      (input) => browser.accessibility(input),
    );
  for (const name of [
    "inspect_keyboard_navigation",
    "validate_focus_visibility",
  ])
    add(
      name,
      "Exercise Tab navigation and collect actual active-element focus styles.",
      pageInput.extend({ steps: z.number().int().min(1).max(50).default(12) }),
      (input) => browser.keyboard(input, input.steps),
    );
  for (const name of [
    "audit_user_flow",
    "validate_interaction",
    "validate_page_states",
  ])
    add(
      name,
      "Execute explicit safe browser interaction steps against the real app; sensitive form fields blocked.",
      pageInput.extend({ actions: z.array(action).max(30) }),
      (input) => browser.flow(input, input.actions),
      true,
    );
  add(
    "test_reduced_motion",
    "Compare actual animations under normal and reduced-motion emulation.",
    pageInput,
    async (input) => ({
      normal: await browser.geometry(input),
      reduced: await browser.geometry({ ...input, reducedMotion: true }),
      note: "Review animation lists and actual readability; reduced animation is not automatically correct behavior.",
    }),
  );
  add(
    "generate_interaction_spec",
    "Compile explicit state transition graph and check all referenced states exist.",
    z.object({
      component: z.string().max(100),
      states: z.array(z.string().max(100)).min(1).max(30),
      transitions: z
        .array(
          z.object({
            from: z.string().max(100),
            to: z.string().max(100),
            trigger: z.string().max(200),
            durationMs: z.number().min(0).max(2000),
            property: z.enum([
              "transform",
              "opacity",
              "color",
              "height",
              "width",
            ]),
            reducedMotion: z.string().min(5).max(300),
          }),
        )
        .max(100),
    }),
    async (input) => ({
      ...input,
      invalidTransitions: input.transitions.filter(
        (transition: any) =>
          !input.states.includes(transition.from) ||
          !input.states.includes(transition.to),
      ),
      layoutAnimatingTransitions: input.transitions.filter((transition: any) =>
        ["height", "width"].includes(transition.property),
      ),
    }),
  );
  const comparisonInput = z.object({
    before: filePath,
    after: filePath,
    output: filePath.optional(),
    threshold: z.number().min(0).max(1).default(0.1),
  });
  for (const name of ["compare_screenshots", "detect_visual_regression"])
    add(
      name,
      "Compare real PNG pixels with pixelmatch and optional diff artifact; changes are not quality judgments.",
      comparisonInput,
      (input) =>
        compareImages(
          workspace,
          input.before,
          input.after,
          input.output,
          input.threshold,
        ),
      true,
    );
  add(
    "inspect_asset_sizes",
    "Measure actual local asset file bytes; no invented transfer savings.",
    projectInput,
    async (input) => {
      const project = await inspectProject(workspace, input.project);
      const assets = await Promise.all(
        project.files
          .filter((file) =>
            /\.(png|jpe?g|gif|webp|avif|svg|woff2?|mp4|webm)$/i.test(file),
          )
          .map(async (file) => ({
            file,
            bytes: (
              await filesystem.stat(
                await workspace.resolve(path.join(project.root, file)),
              )
            ).size,
          })),
      );
      return {
        assets,
        note: "Local bytes; browser resource timing measures transferred bytes.",
      };
    },
  );
  for (const name of [
    "analyze_rendering_performance",
    "detect_layout_shift",
    "generate_performance_report",
  ])
    add(
      name,
      "Measure navigation/resource/paint timings and observed layout shifts in a real browser lab session.",
      pageInput,
      (input) => browser.performance(input),
    );
  add(
    "run_lighthouse_audit",
    "Run optional installed Lighthouse via bounded Node CLI. Requires explicit network permission; Lighthouse may fetch third-party page resources.",
    pageInput.extend({ output: filePath, allowNetwork: z.literal(true) }),
    async (input) => {
      browser.validateURL(input.url);
      const { runLighthouse } = await import("../browser/lighthouse.js");
      return runLighthouse(workspace, input.url, input.output);
    },
    true,
  );
  for (const name of ["generate_ux_report", "generate_visual_review"])
    add(
      name,
      "Combine actual rendered geometry, axe and focus evidence into a review report; client judges subjective design.",
      pageInput.extend({ output: filePath.optional() }),
      async (input) => {
        const report = {
          url: input.url,
          geometry: await browser.geometry(input),
          accessibility: await browser.accessibility(input),
          keyboard: await browser.keyboard(input, 10),
          manualReview: [
            "Complete the primary user task and recovery paths.",
            "Assess brand identity and composition from screenshots.",
            "Inspect long content, zoom, screen reader and mobile keyboard behavior.",
          ],
          subjectiveScore: null,
        };
        const output = input.output
          ? await workspace.artifact(
              input.output,
              JSON.stringify(report, null, 2),
            )
          : null;
        return { ...report, output };
      },
      true,
    );
}
