# AestheticForge MCP

A local MCP server for evidence-based interface engineering. It inspects actual project files, compiles client-authored design specifications and tokens, applies controlled source changes, and verifies running pages with Playwright, axe-core, PNG comparisons, and browser timing data.

The AI coding client supplies creative decisions and framework-specific source. The server supplies explicit contracts, safe operations and measurable evidence. It does not pretend a generic text response is a finished interface or that automated checks prove beauty, usability, or complete WCAG conformance.

## Install

Requires Node.js 20.20+ and npm. Browser tools need Chromium or compatible Chrome. No hosting, account, or paid service is required.

```sh
git clone https://github.com/YOUR_ORGANIZATION/aestheticforge-mcp.git
cd aestheticforge-mcp
npm ci
npx playwright install chromium
npm run build
npm test
npm run smoke
```

The URL above is a publication placeholder; this checkout has not been published. `npm install` also works and builds through `prepare`. On Linux, Playwright may need system packages: `npx playwright install --with-deps chromium`.

```sh
node /absolute/path/aestheticforge-mcp/dist/server/cli.js --root /absolute/project
```

Add `--root /absolute/artifacts` for a separate existing output directory. All roots must already exist. No root is implicitly granted. To use installed Chrome, set `AESTHETICFORGE_BROWSER_PATH` to its executable. Only exact explicitly granted remote origins can be loaded with `--origin https://example.com`. Browser subresources are restricted to the selected page origin and startup-authorized origins.

The executable npm package is prepared for future `npx -y aestheticforge-mcp` distribution. That command requires publication first; it has not been tested against the public package name.

## What works

All 60 requested tool names are registered, with Zod input validation, structured results and MCP errors. See [tool reference](docs/tools.md) for exact scope and input schemas generated from the running registry.

- Source intelligence for HTML/CSS/JS, React, Next, Vue, Nuxt, Svelte/SvelteKit, Laravel Blade and Inertia dependency/file conventions. Discovery is static and heuristic; it does not execute application code or evaluate dynamic routers.
- Actual CSS tokens, styles, typography, spacing, imports and component duplicates. Semantic token CSS supports light/dark colors and reduced-motion durations.
- Design and component specifications compiled from explicit product facts, client-selected direction, rationale, contracts and state graphs. Creative judgment remains with the AI client or human.
- Source writes supplied by the AI client, default dry-run, existing-file hash preconditions and atomic replacement. No arbitrary project command execution or automatic framework migration.
- Real screenshots, width matrices, overflow, candidate control overlap, touch target dimensions, forms, headings, landmarks, keyboard focus and explicit interaction/assertion steps.
- Actual axe-core WCAG A/AA rules, normal/reduced-motion animation evidence, resource/navigation/paint timings and observed layout shifts. Geometry and computed-style checks are evidence, with documented limits.
- PNG pixel differences, optional diff images and evidence reports. Screenshots mask all inputs and explicitly private content; use synthetic data throughout.
- Optional actual Lighthouse CLI integration with explicit `allowNetwork: true`. It is not bundled: Use Node22.19+ for the server and install current Lighthouse13.6 separately. Review [limitations](docs/methodology.md) before using it.

## Demonstration

```sh
npm run demo
```

For installed Chrome on macOS:

```sh
AESTHETICFORGE_BROWSER_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run demo
```

The demonstration starts an isolated local server, discovers the sample app, captures baseline screens, proves narrow-screen overflow and an unlabeled form field, compiles a project-specific direction, applies a hash-checked correction, runs eleven viewport widths, runs axe, saves before/after diffs and tests the note-saving interaction. It restores the sample source in `finally` and saves results under `artifacts/<timestamp>/acceptance-report.json`. The deliberate baseline defects are retained for repeatability.

## MCP clients

See [client configurations](docs/clients.md) for Codex, Claude Code, Cursor and VS Code. Configurations are documented against official references and validated by an SDK stdio integration test; GUI client installation has not been exercised. Stdout is reserved for MCP traffic. Diagnostics use stderr.

## Verification and limits

Run `npm run build`, `npm test`, `npm run smoke`, `npm run demo`, and `npm pack --dry-run`. No remote publication occurs. Browser tests have been run on macOS Chrome; Windows/Linux, other browsers, client applications, every framework compiler, screen readers, physical mobile devices are not claimed tested. Lighthouse13.6 was separately exercised on the local sample under Node25.

[Security](docs/security.md) · [Methodology and limitations](docs/methodology.md) · [Contributing](CONTRIBUTING.md) · [API sources](references/official-apis.md)
