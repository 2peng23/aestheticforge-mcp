import { describe, it, expect } from "vitest";
import { discoverFileRoutes } from "../src/adapters/routes.js";
describe("framework route conventions", () => {
  it("discovers only Next App pages and excludes layout, helpers, styles and API handlers", () => {
    const routes = discoverFileRoutes(
      [
        "app/page.tsx",
        "src/app/(team)/notes/page.tsx",
        "app/layout.tsx",
        "app/loading.tsx",
        "app/api/route.ts",
        "app/helper.ts",
        "app/global.css",
      ],
      ["Next.js", "React"],
    );
    expect(routes.map((route) => route.route)).toEqual(["/", "/notes/"]);
  });
  it("discovers Next Pages routes but excludes reserved files and API routes", () => {
    const routes = discoverFileRoutes(
      [
        "pages/index.tsx",
        "pages/users/[id].tsx",
        "pages/_app.tsx",
        "pages/_document.tsx",
        "pages/api/ping.ts",
      ],
      ["Next.js"],
    );
    expect(routes.map((route) => route.route)).toEqual(["/", "/users/:id"]);
  });
  it("uses Nuxt and SvelteKit conventions without treating loaders or templates as pages", () => {
    expect(
      discoverFileRoutes(
        [
          "app/pages/index.vue",
          "app/pages/products/[id].vue",
          "app/components/Header.vue",
        ],
        ["Nuxt"],
      ).map((route) => route.route),
    ).toEqual(["/", "/products/:id"]);
    expect(
      discoverFileRoutes(
        [
          "src/routes/+page.svelte",
          "src/routes/notes/+page.svelte",
          "src/routes/notes/+page.server.ts",
          "src/routes/+layout.svelte",
        ],
        ["SvelteKit"],
      ).map((route) => route.route),
    ).toEqual(["/", "/notes/"]);
  });
  it("does not invent Vue/Laravel routes from arbitrary component and view filenames", () => {
    expect(
      discoverFileRoutes(
        [
          "src/pages/About.vue",
          "resources/views/secret.blade.php",
          "routes/web.php",
        ],
        ["Vue", "Laravel Blade"],
      ),
    ).toEqual([]);
  });
  it("discovers real static HTML documents preserving the served extension", () => {
    expect(
      discoverFileRoutes(
        ["index.html", "about.html", "notes/index.html"],
        ["HTML/CSS/JavaScript"],
      ).map((route) => route.route),
    ).toEqual(["/", "/about.html", "/notes/"]);
  });
});
