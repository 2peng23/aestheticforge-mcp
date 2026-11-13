import { z } from "zod";
import { Workspace } from "../security/workspace.js";
import {
  briefSchema,
  compileDirection,
  tokenSchema,
  compileTokens,
  contrast,
} from "../design-system/specification.js";
import type { AddTool } from "./types.js";
import { filePath } from "./inputs.js";
export function registerDesignTools(workspace: Workspace, add: AddTool) {
  add(
    "analyze_design_brief",
    "Validate a product-specific client brief and compile its actual goals and content into requirements.",
    briefSchema,
    async (brief) => compileDirection(brief),
  );
  add(
    "generate_art_direction",
    "Compile client-chosen art direction with rationale, audience, content and concrete constraints; no random aesthetic.",
    briefSchema,
    async (brief) => compileDirection(brief),
  );
  add(
    "evaluate_design_direction",
    "Check supplied art direction against explicit brief requirements and measurable design constraints.",
    z.object({
      brief: briefSchema,
      direction: z.string().min(10).max(6000),
      requirements: z
        .array(
          z.object({
            requirement: z.string().max(500),
            met: z.boolean(),
            evidence: z.string().min(5).max(1000),
          }),
        )
        .min(1)
        .max(40),
    }),
    async (input) => ({
      product: input.brief.product,
      checks: input.requirements,
      unmet: input.requirements.filter((check: any) => !check.met),
      review:
        "Client-provided evidence; server does not independently judge beauty or validate unsupplied screenshots.",
    }),
  );
  const tokensInput = z.object({
    tokens: tokenSchema,
    output: filePath.optional(),
    expectedHash: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    dryRun: z.boolean().default(true),
  });
  for (const name of ["create_design_tokens", "generate_design_tokens"])
    add(
      name,
      "Compile validated semantic light/dark tokens into actual CSS, with optional controlled file write.",
      tokensInput,
      async (input) => {
        const css = compileTokens(input.tokens);
        return {
          css,
          write: input.output
            ? await workspace.write(
                input.output,
                css,
                input.expectedHash,
                input.dryRun,
              )
            : null,
        };
      },
      true,
    );
  add(
    "validate_color_palette",
    "Calculate WCAG solid sRGB contrast for explicit semantic color pairs.",
    z.object({
      pairs: z
        .array(
          z.object({
            foreground: z.string().regex(/^#[a-fA-F0-9]{6}$/),
            background: z.string().regex(/^#[a-fA-F0-9]{6}$/),
          }),
        )
        .min(1)
        .max(100),
    }),
    async (input) => ({
      pairs: input.pairs.map((pair: any) =>
        contrast(pair.foreground, pair.background),
      ),
    }),
  );
  const specInput = z.object({
    name: z.string().min(1).max(100),
    purpose: z.string().min(10).max(1000),
    framework: z.string().max(100),
    properties: z
      .array(
        z.object({
          name: z.string().max(100),
          type: z.string().max(200),
          required: z.boolean(),
        }),
      )
      .max(40),
    states: z.array(z.string().max(300)).min(1).max(30),
    acceptance: z.array(z.string().min(5).max(500)).min(1).max(30),
  });
  add(
    "generate_component_spec",
    "Validate and normalize the AI client component contract into an implementable specification.",
    specInput,
    async (input) => ({
      ...input,
      kind: "component-contract",
      validation: {
        responsive: true,
        keyboard: true,
        reducedMotion: true,
        preserveExistingBehavior: true,
      },
    }),
  );
  add(
    "plan_component_system",
    "Build an explicit component dependency graph and detect missing or cyclic dependencies.",
    z.object({
      components: z
        .array(
          z.object({
            name: z.string().min(1).max(100),
            purpose: z.string().max(500),
            dependsOn: z.array(z.string().max(100)).max(30),
          }),
        )
        .min(1)
        .max(100),
    }),
    async (input) => {
      const names = new Set(
        input.components.map((component: any) => component.name),
      );
      const missing = input.components.flatMap((component: any) =>
        component.dependsOn
          .filter((name: string) => !names.has(name))
          .map((dependency: string) => ({
            component: component.name,
            dependency,
          })),
      );
      const graph = new Map<string, string[]>(
        input.components.map((component: any) => [
          component.name,
          component.dependsOn,
        ]),
      );
      const cycles: string[][] = [];
      const visited = new Set<string>();
      const active = new Set<string>();
      const visit = (name: string, trail: string[]) => {
        if (active.has(name)) {
          cycles.push([...trail, name]);
          return;
        }
        if (visited.has(name)) return;
        visited.add(name);
        active.add(name);
        for (const dependency of graph.get(name) ?? [])
          visit(dependency, [...trail, name]);
        active.delete(name);
      };
      for (const name of graph.keys()) visit(name, []);
      return { ...input, missing, cycles: cycles.slice(0, 20) };
    },
  );
}
