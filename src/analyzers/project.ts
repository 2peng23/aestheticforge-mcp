import { discoverFileRoutes } from "../adapters/routes.js";
import path from "node:path";
import { Workspace, hash, redact } from "../security/workspace.js";
const sourcePattern =
  /\.(?:css|scss|sass|less|html|jsx|tsx|js|ts|vue|svelte|php)$/;
export async function inspectProject(workspace: Workspace, project: string) {
  const root = await workspace.resolve(project);
  const files = await workspace.list(root);
  let manifest: any = {};
  if (files.includes("package.json"))
    manifest = JSON.parse(
      await workspace.read(path.join(root, "package.json")),
    );
  const dependencies = {
    ...manifest.dependencies,
    ...manifest.devDependencies,
  };
  const frameworks: string[] = [];
  for (const [packageName, name] of Object.entries({
    next: "Next.js",
    nuxt: "Nuxt",
    vue: "Vue",
    react: "React",
    "@sveltejs/kit": "SvelteKit",
    svelte: "Svelte",
    "@inertiajs/vue3": "Inertia.js",
    "@inertiajs/react": "Inertia.js",
  }))
    if (dependencies[packageName]) frameworks.push(name);
  let composer: {
    require?: Record<string, string>;
    "require-dev"?: Record<string, string>;
  } = {};
  if (files.includes("composer.json"))
    composer = JSON.parse(
      await workspace.read(path.join(root, "composer.json")),
    );
  if (
    files.includes("artisan") ||
    composer.require?.["laravel/framework"] ||
    composer["require-dev"]?.["laravel/framework"]
  )
    frameworks.push(
      files.some((file) => file.endsWith(".blade.php"))
        ? "Laravel Blade"
        : "Laravel",
    );
  if (!frameworks.length) frameworks.push("HTML/CSS/JavaScript");
  const sources = await Promise.all(
    files
      .filter((file) => sourcePattern.test(file))
      .slice(0, 200)
      .map(async (file) => {
        try {
          return { file, content: await workspace.read(path.join(root, file)) };
        } catch {
          return { file, content: "" };
        }
      }),
  );
  const components = sources
    .filter((source) => /\.(tsx|jsx|vue|svelte|blade\.php)$/.test(source.file))
    .map((source) => ({
      file: source.file,
      bytes: Buffer.byteLength(source.content),
      hash: hash(source.content),
      exports: [
        ...source.content.matchAll(
          /export\s+(?:default\s+)?(?:function|class|const)\s+(\w+)/g,
        ),
      ].map((match) => match[1]),
    }));
  const pages = discoverFileRoutes(files, frameworks);
  const linkedRoutes = sources.flatMap((source) =>
    [
      ...source.content.matchAll(
        /(?:href|path)\s*[=:]\s*["'](\/[^"'\s]*)["']/g,
      ),
    ].map((match) => ({
      file: source.file,
      route: match[1],
      evidence: "literal-link",
    })),
  );
  const declaredLaravelRoutes = sources
    .filter((source) => /(^|\/)routes\/.*\.php$/.test(source.file))
    .flatMap((source) =>
      [
        ...source.content.matchAll(/Route::(?:get|view)\(\s*["']([^"']+)["']/g),
      ].map((match) => ({
        file: source.file,
        route: match[1],
        evidence:
          "Laravel literal GET/view route; enclosing prefixes and macros require manual review",
      })),
    );
  const tokens = sources.flatMap((source) =>
    [...source.content.matchAll(/(--[\w-]+)\s*:\s*([^;}]+)/g)].map((match) => ({
      name: match[1],
      value: match[2].trim(),
      file: source.file,
    })),
  );
  const colors = sources.flatMap((source) =>
    [...source.content.matchAll(/#[0-9a-f]{3,8}\b/gi)].map((match) => ({
      value: match[0].toLowerCase(),
      file: source.file,
    })),
  );
  const typography = sources.flatMap((source) =>
    [
      ...source.content.matchAll(
        /(font-family|font-size|font-weight|line-height|letter-spacing)\s*:\s*([^;}]+)/g,
      ),
    ].map((match) => ({
      property: match[1],
      value: match[2].trim(),
      file: source.file,
    })),
  );
  const spacing = sources.flatMap((source) =>
    [
      ...source.content.matchAll(
        /(?:padding|margin|gap)(?:-[a-z]+)?\s*:\s*([^;}]+)/g,
      ),
    ].map((match) => ({ value: match[1].trim(), file: source.file })),
  );
  return {
    root,
    name: manifest.name ?? path.basename(root),
    frameworks,
    scripts: manifest.scripts ?? {},
    dependencyVersions: dependencies,
    files,
    components,
    pages: [...pages, ...linkedRoutes, ...declaredLaravelRoutes],
    tokens,
    colors,
    typography,
    spacing,
    limits: {
      maxFiles: 5000,
      maxInspectedSources: 200,
      routeDiscovery:
        "Static heuristics; runtime-generated routes require browser exploration.",
    },
    sources,
  };
}
export function publicProject(
  project: Awaited<ReturnType<typeof inspectProject>>,
) {
  const { sources, ...result } = project;
  return JSON.parse(redact(JSON.stringify(result)));
}
export function inconsistencyReport(
  project: Awaited<ReturnType<typeof inspectProject>>,
) {
  const grouped = new Map<string, Set<string>>();
  for (const token of project.tokens) {
    const values = grouped.get(token.name) ?? new Set();
    values.add(token.value);
    grouped.set(token.name, values);
  }
  return {
    tokenConflicts: [...grouped]
      .filter(([, values]) => values.size > 1)
      .map(([name, values]) => ({
        name,
        values: [...values],
        classification: "context-dependent",
        note: "May be intentional light/dark or scoped overrides.",
      })),
    literalColors: [...new Set(project.colors.map((color) => color.value))],
    spacingValues: [...new Set(project.spacing.map((space) => space.value))],
    manualReview: [
      "Assess whether contextual token overrides are intentional.",
      "Evaluate content hierarchy and brand character in rendered screenshots.",
    ],
  };
}
export async function inspectSource(workspace: Workspace, file: string) {
  const source = await workspace.read(file);
  return {
    file,
    hash: hash(source),
    source: redact(source),
    imports: [
      ...source.matchAll(/import\s+[^;]*?from\s*["']([^"']+)["']/g),
    ].map((match) => match[1]),
    interfaces: [...source.matchAll(/(?:interface|type)\s+(\w+)/g)].map(
      (match) => match[1],
    ),
  };
}
