import { createServer } from "node:http";
import { promises as filesystem } from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { Workspace } from "../dist/security/workspace.js";
import { BrowserService } from "../dist/browser/session.js";
import { createTools, executeTool } from "../dist/tools/registry.js";
const project = path.resolve("examples/demo");
const output = path.resolve(
  "artifacts",
  new Date().toISOString().replace(/[:.]/g, "-"),
);
await filesystem.mkdir(output, { recursive: true });
const workspace = await Workspace.create([project, output]);
const browser = new BrowserService(
  workspace,
  [],
  process.env.AESTHETICFORGE_BROWSER_PATH,
);
const tools = createTools(workspace, browser);
const call = async (name: string, input: unknown) => {
  const tool = tools.find((tool) => tool.name === name);
  assert(tool, `missing ${name}`);
  return executeTool(tool, input);
};
const original = await filesystem.readFile(
  path.join(project, "index.html"),
  "utf8",
);
const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
    if (!["index.html", "about.html"].includes(file)) {
      response.writeHead(404).end();
      return;
    }
    response.setHeader("Content-Type", "text/html");
    response.end(await filesystem.readFile(path.join(project, file)));
  } catch {
    response.writeHead(500).end();
  }
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert(address && typeof address !== "string");
const url = `http://127.0.0.1:${address.port}`;
try {
  const analysis = await call("analyze_project", { project });
  const before = await call("generate_responsive_report", {
    url,
    widths: [320, 390, 768, 1440],
    outputDirectory: path.join(output, "before"),
  });
  assert(before.results.some((result: any) => result.geometry.overflow.length));
  const accessibilityBefore = await call("run_accessibility_audit", { url });
  assert(
    accessibilityBefore.violations.some(
      (violation: any) => violation.id === "label",
    ),
  );
  const specification = await call("generate_art_direction", {
    product: "Fieldnotes",
    audience: "Small project teams reviewing working notes",
    primaryTask: "Save and review a team note on a phone or desktop",
    personality: ["practical", "warm", "editorial"],
    constraints: ["Preserve form behavior", "Preserve sample branding"],
    content: ["Team notes", "Save note", "About this sample"],
    direction: "minimalist",
    rationale:
      "The existing paper and dark-green palette suits concise field notes; improve reflow while retaining the task hierarchy.",
  });
  const file = path.join(project, "index.html");
  const inspected = await call("inspect_component_api", { file });
  const source = original
    .replace(/min-width:\s*1000px/, "min-width: 0")
    .replace(
      /input,\s*button\s*\{/,
      "input { max-width:100%; min-width:0; } input,button {",
    )
    .replace(
      /<input\s+id="note"/,
      '<label for="note">New team note</label><input id="note"',
    );
  const change = await call("refactor_component", {
    file,
    source,
    expectedHash: inspected.hash,
    dryRun: false,
    purpose:
      "Fix confirmed narrow-screen overflow and the missing note input label.",
  });
  const after = await call("generate_responsive_report", {
    url,
    widths: [320, 375, 390, 430, 600, 768, 900, 1024, 1280, 1440, 1920],
    outputDirectory: path.join(output, "after"),
  });
  assert(
    after.results.every((result: any) => result.geometry.overflow.length === 0),
  );
  const accessibilityAfter = await call("run_accessibility_audit", { url });
  assert.equal(accessibilityAfter.violations.length, 0);
  const flow = await call("audit_user_flow", {
    url,
    width: 390,
    actions: [
      { type: "fill", selector: "#note", value: "Verified sample note" },
      { type: "click", selector: "button[type=submit]" },
      { type: "expect-text", selector: "#feedback", value: "Note saved." },
    ],
  });
  await browser.page({ url, width: 390 }, async (page) => {
    await page.locator("#note").fill("Functional test");
    await page.locator("button[type=submit]").click();
    assert.equal(await page.locator("#feedback").textContent(), "Note saved.");
    assert.equal(
      await page.locator("#note-list li").last().textContent(),
      "Functional test",
    );
  });
  const comparison = await call("compare_screenshots", {
    before: path.join(output, "before/viewport-390.png"),
    after: path.join(output, "after/viewport-390.png"),
    output: path.join(output, "diff-390.png"),
  });
  assert(comparison.changedPixels > 0);
  const report = {
    verifiedAt: new Date().toISOString(),
    analysis,
    specification,
    before,
    accessibilityBefore,
    change,
    after,
    accessibilityAfter,
    flow,
    comparison,
    applicationTests: { noteSaved: true, liveFeedback: true },
    limitations: [
      "Automated accessibility is not complete WCAG conformance.",
      "Subjective design review requires client/human review.",
      "Static framework analysis remains heuristic.",
    ],
  };
  await filesystem.writeFile(
    path.join(output, "acceptance-report.json"),
    JSON.stringify(report, null, 2),
  );
  process.stdout.write(
    JSON.stringify(
      {
        output,
        frameworks: analysis.frameworks,
        tools: tools.length,
        beforeOverflow: before.results.map((result: any) => ({
          width: result.width,
          count: result.geometry.overflow.length,
        })),
        afterOverflow: after.results.map((result: any) => ({
          width: result.width,
          count: result.geometry.overflow.length,
        })),
        beforeAxe: accessibilityBefore.violations.length,
        afterAxe: accessibilityAfter.violations.length,
        changedPixels: comparison.changedPixels,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await filesystem.writeFile(path.join(project, "index.html"), original);
  await new Promise<void>((resolve) => server.close(() => resolve()));
}
