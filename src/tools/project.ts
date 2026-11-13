import { z } from "zod";
import { Workspace, hash } from "../security/workspace.js";
import {
  inspectProject,
  publicProject,
  inconsistencyReport,
  inspectSource,
} from "../analyzers/project.js";
import type { AddTool } from "./types.js";
import { filePath, projectInput } from "./inputs.js";
export function registerProjectTools(workspace: Workspace, add: AddTool) {
  const projectTool = (
    name: string,
    description: string,
    select: (project: Awaited<ReturnType<typeof inspectProject>>) => unknown,
  ) =>
    add(name, description, projectInput, async (input) =>
      select(await inspectProject(workspace, input.project)),
    );
  projectTool(
    "analyze_project",
    "Inspect actual source files, manifest, framework evidence, route conventions and tokens.",
    publicProject,
  );
  projectTool(
    "detect_framework",
    "Detect installed frontend packages and Laravel files without running project commands.",
    (project) => ({
      frameworks: project.frameworks,
      dependencyVersions: project.dependencyVersions,
      scripts: project.scripts,
    }),
  );
  projectTool(
    "discover_pages",
    "Discover file-convention routes and literal internal links; dynamic routes need runtime review.",
    (project) => ({
      pages: project.pages,
      limitations: project.limits.routeDiscovery,
    }),
  );
  projectTool(
    "inspect_components",
    "Inventory real component files and named exports.",
    (project) => ({ components: project.components }),
  );
  projectTool(
    "inspect_design_tokens",
    "Extract actual CSS custom property declarations with source paths.",
    (project) => ({ tokens: project.tokens }),
  );
  projectTool(
    "analyze_existing_styles",
    "Extract real typography, literal color, spacing and token declarations.",
    (project) => ({
      colors: project.colors,
      typography: project.typography,
      spacing: project.spacing,
      tokens: project.tokens,
    }),
  );
  projectTool(
    "identify_ui_inconsistencies",
    "Report token overrides and literal style diversity; contextual differences need review.",
    inconsistencyReport,
  );
  projectTool(
    "analyze_typography",
    "Extract authored type declarations and scales; no invented typography quality score.",
    (project) => ({
      declarations: project.typography,
      uniqueSizes: [
        ...new Set(
          project.typography
            .filter((item) => item.property === "font-size")
            .map((item) => item.value),
        ),
      ],
    }),
  );
  projectTool(
    "audit_spacing",
    "Inspect exact CSS spacing declarations and distinct authored values.",
    (project) => ({
      declarations: project.spacing,
      uniqueValues: [...new Set(project.spacing.map((item) => item.value))],
    }),
  );
  projectTool(
    "audit_component_consistency",
    "Compare source inventories, token overrides and exact duplicate components.",
    (project) => ({
      components: project.components,
      ...inconsistencyReport(project),
    }),
  );
  projectTool(
    "validate_design_system",
    "Validate static custom property references and report unresolved references for client review.",
    (project) => {
      const declared = new Set(project.tokens.map((token) => token.name));
      const unresolved = project.sources.flatMap((source) =>
        [...source.content.matchAll(/var\((--[\w-]+)(\s*,)?/g)]
          .filter((match) => !declared.has(match[1]) && !match[2])
          .map((match) => ({ file: source.file, reference: match[1] })),
      );
      return {
        unresolved,
        referencesChecked: project.sources.length,
        note: "External dependencies and runtime-injected tokens may resolve these references.",
      };
    },
  );
  projectTool(
    "detect_duplicate_components",
    "Find byte-identical component sources using SHA-256, excluding unrelated files.",
    (project) => {
      const groups = new Map<string, string[]>();
      for (const component of project.components) {
        const files = groups.get(component.hash) ?? [];
        files.push(component.file);
        groups.set(component.hash, files);
      }
      return {
        duplicates: [...groups]
          .filter(([, files]) => files.length > 1)
          .map(([hash, files]) => ({ hash, files })),
      };
    },
  );
  add(
    "inspect_component_api",
    "Read a source file, exports/imports and hash needed for safe writes.",
    z.object({ file: filePath }),
    (input) => inspectSource(workspace, input.file),
  );
  const writeInput = z.object({
    file: filePath,
    source: z.string().max(2_000_000),
    expectedHash: z
      .string()
      .regex(/^[a-f0-9]{64}$/)
      .optional(),
    dryRun: z.boolean().default(true),
    purpose: z.string().min(10).max(1000),
  });
  for (const name of [
    "implement_component",
    "implement_page",
    "refactor_component",
  ])
    add(
      name,
      "Apply AI-client-authored source exactly, preserving the framework. Default dry-run; existing files require expectedHash. Never executes source.",
      writeInput,
      async (input) => ({
        purpose: input.purpose,
        ...(await workspace.write(
          input.file,
          input.source,
          input.expectedHash,
          input.dryRun,
        )),
        verificationRequired: [
          "Run application-specific type/build and interaction tests.",
          "Capture rendered before/after evidence.",
        ],
      }),
      true,
    );
  add(
    "validate_component",
    "Inspect basic source invariants and referenced local imports; application compiler remains authoritative.",
    z.object({ file: filePath }),
    async (input) => {
      const source = await workspace.read(input.file);
      const references = [...source.matchAll(/from\s*["'](\.[^"']+)["']/g)].map(
        (match) => match[1],
      );
      return {
        file: input.file,
        hash: hash(source),
        empty: !source.trim(),
        mergeConflictMarkers: /^(?:<<<<<<<|=======|>>>>>>>)/m.test(source),
        relativeImports: references,
        limitations:
          "Framework compilation and runtime tests must run in the host coding client; this server does not execute arbitrary project scripts.",
      };
    },
  );
}
