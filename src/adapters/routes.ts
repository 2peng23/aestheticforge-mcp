export type DiscoveredRoute = { file: string; route: string; evidence: string };
function routePath(file: string) {
  return ("/" + file)
    .replace(/\([^/]+\)\//g, "")
    .replace(/@[^/]+\//g, "")
    .replace(/\[\[\.\.\.(.*?)\]\]/g, ":$1*?")
    .replace(/\[\.\.\.(.*?)\]/g, ":$1*")
    .replace(/\[\[(.*?)\]\]/g, ":$1?")
    .replace(/\[(.*?)\]/g, ":$1")
    .replace(/\/+/g, "/");
}
export function discoverFileRoutes(
  files: string[],
  frameworks: string[],
): DiscoveredRoute[] {
  const routes: DiscoveredRoute[] = [];
  for (const file of files) {
    if (frameworks.includes("Next.js")) {
      const appPage = file.match(/^(?:src\/)?app\/(.*\/)?page\.(?:jsx?|tsx?)$/);
      if (appPage)
        routes.push({
          file,
          route: routePath(appPage[1] ?? ""),
          evidence: "Next.js App Router page convention; route groups omitted",
        });
      const pages = file.match(/^(?:src\/)?pages\/(.+)\.(?:jsx?|tsx?)$/);
      if (
        pages &&
        !pages[1].startsWith("api/") &&
        !/(^|\/)_(?:app|document|error)$/.test(pages[1])
      )
        routes.push({
          file,
          route: routePath(pages[1].replace(/(^|\/)index$/, "$1")),
          evidence: "Next.js Pages Router convention",
        });
    } else if (frameworks.includes("Nuxt")) {
      const page = file.match(/^(?:(?:src|app)\/)?pages\/(.+)\.vue$/);
      if (page)
        routes.push({
          file,
          route: routePath(page[1].replace(/(^|\/)index$/, "$1")),
          evidence: "Nuxt pages convention",
        });
    } else if (frameworks.includes("SvelteKit")) {
      const page = file.match(/^(?:src\/)?routes\/(.*\/)?\+page\.svelte$/);
      if (page)
        routes.push({
          file,
          route: routePath(page[1] ?? ""),
          evidence: "SvelteKit +page.svelte convention",
        });
    }
    if (file.endsWith(".html") && !file.startsWith("public/"))
      routes.push({
        file,
        route: routePath(file.replace(/(^|\/)index\.html$/, "$1")),
        evidence: "Static HTML file; deployment base path may differ",
      });
  }
  return routes;
}
