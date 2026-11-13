import { afterEach, beforeEach, describe, it, expect } from "vitest";
import { promises as filesystem } from "node:fs";
import path from "node:path";
import os from "node:os";
import { Workspace, hash } from "../src/security/workspace.js";
import { BrowserService } from "../src/browser/session.js";
import { inspectProject } from "../src/analyzers/project.js";
import { createTools, executeTool } from "../src/tools/registry.js";
import { contrast } from "../src/design-system/specification.js";
let root: string;
let workspace: Workspace;
beforeEach(async () => {
  root = await filesystem.mkdtemp(
    path.join(os.tmpdir(), "aestheticforge-test-"),
  );
  workspace = await Workspace.create([root]);
});
afterEach(async () => {
  await filesystem.rm(root, { recursive: true, force: true });
});
describe("authorization and controlled source writes", () => {
  it("denies traversal, private files, external symlinks and private symlink aliases", async () => {
    await filesystem.writeFile(path.join(root, ".env"), "API_KEY=secret");
    await filesystem.symlink(
      path.join(root, ".env"),
      path.join(root, "Alias.ts"),
    );
    await filesystem.symlink(os.tmpdir(), path.join(root, "outside"));
    await expect(workspace.read(path.join(root, ".env"))).rejects.toThrow();
    await expect(workspace.read(path.join(root, "Alias.ts"))).rejects.toThrow();
    await expect(
      workspace.resolve(path.join(root, "..", "other.ts")),
    ).rejects.toThrow();
    await expect(
      workspace.resolve(path.join(root, "outside", "evil.ts")),
    ).rejects.toThrow();
  });
  it("requires the actual source hash and defaults to dry-run", async () => {
    const file = path.join(root, "Button.tsx");
    await filesystem.writeFile(file, "export const Button = 1;");
    await expect(
      workspace.write(file, "export const Button = 2;", undefined, false),
    ).rejects.toThrow(/expectedHash/);
    await workspace.write(
      file,
      "export const Button = 2;",
      hash("export const Button = 1;"),
    );
    expect(await workspace.read(file)).toBe("export const Button = 1;");
    await workspace.write(
      file,
      "export const Button = 2;",
      hash("export const Button = 1;"),
      false,
    );
    expect(await workspace.read(file)).toBe("export const Button = 2;");
    await expect(
      workspace.write(file, "stale", hash("export const Button = 1;"), false),
    ).rejects.toThrow();
  });
  it("creates approved source without shell execution and blocks unsupported outputs", async () => {
    await workspace.write(
      path.join(root, "Card.vue"),
      "<template>Ready</template>",
      undefined,
      false,
    );
    expect(await workspace.read(path.join(root, "Card.vue"))).toContain(
      "Ready",
    );
    await expect(
      workspace.write(
        path.join(root, "execute.sh"),
        "touch /tmp/unsafe",
        undefined,
        false,
      ),
    ).rejects.toThrow();
  });
});
describe("actual source evidence", () => {
  it("detects installed framework, routes, tokens and exact duplicates", async () => {
    await filesystem.mkdir(path.join(root, "app"), { recursive: true });
    await filesystem.writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ dependencies: { next: "15.0.0", react: "19.0.0" } }),
    );
    await filesystem.writeFile(
      path.join(root, "app/page.tsx"),
      "export default function Page(){return <h1>Actual</h1>}",
    );
    await filesystem.writeFile(
      path.join(root, "Button.tsx"),
      "export const Button = () => <button>Save</button>;",
    );
    await filesystem.copyFile(
      path.join(root, "Button.tsx"),
      path.join(root, "Duplicate.tsx"),
    );
    await filesystem.writeFile(
      path.join(root, "styles.css"),
      ":root{--ink:#112233;--spacing:8px}",
    );
    const project = await inspectProject(workspace, root);
    expect(project.frameworks).toContain("Next.js");
    expect(project.pages.some((page) => page.route === "/")).toBe(true);
    expect(project.tokens.find((token) => token.name === "--ink")?.value).toBe(
      "#112233",
    );
    const tool = createTools(workspace, new BrowserService(workspace)).find(
      (tool) => tool.name === "detect_duplicate_components",
    )!;
    const report = await executeTool(tool, { project: root });
    expect(report.duplicates[0].files).toHaveLength(2);
  });
});
it("computes known WCAG contrast values rather than invented quality scores", () => {
  expect(contrast("#000000", "#ffffff").ratio).toBe(21);
  expect(contrast("#ffffff", "#ffffff").normalTextAA).toBe(false);
});
it("requires explicit remote origin and rejects credentials and non-web URLs", () => {
  const browser = new BrowserService(workspace);
  expect(() => browser.validateURL("https://example.com")).toThrow();
  expect(() => browser.validateURL("file:///etc/passwd")).toThrow();
  expect(() => browser.validateURL("http://user:secret@localhost")).toThrow();
  expect(browser.validateURL("http://127.0.0.1:3000").origin).toBe(
    "http://127.0.0.1:3000",
  );
});
it("all registered tool names are unique and reject malformed input", async () => {
  const tools = createTools(workspace, new BrowserService(workspace));
  expect(new Set(tools.map((tool) => tool.name)).size).toBe(tools.length);
  for (const tool of tools) {
    await expect(executeTool(tool, {})).rejects.toThrow();
  }
});
it("sanitizes nested secret keys and artifact JSON before persistence", async () => {
  const { sanitize } = await import("../src/security/privacy.js");
  expect(
    sanitize({
      token: "secret",
      nested: { authorization: "Bearer secret" },
      html: "<input value=private>",
      url: "https://example.com?token=private",
      email: "user@example.com",
    }),
  ).toEqual({
    token: "[REDACTED]",
    nested: { authorization: "[REDACTED]" },
    url: "https://example.com/?redacted",
    email: "[EMAIL REDACTED]",
  });
  const file = path.join(root, "report.json");
  await workspace.artifact(
    file,
    JSON.stringify({
      password: "secret",
      url: "https://example.com?token=private",
    }),
  );
  expect(await filesystem.readFile(file, "utf8")).not.toContain("private");
});
it("rejects oversized decoded PNG dimensions before allocating image pixels", async () => {
  const { compareImages } = await import("../src/browser/session.js");
  const bytes = Buffer.alloc(24);
  Buffer.from("89504e470d0a1a0a", "hex").copy(bytes);
  bytes.writeUInt32BE(500000, 16);
  bytes.writeUInt32BE(500000, 20);
  const file = path.join(root, "oversized.png");
  await filesystem.writeFile(file, bytes);
  await expect(compareImages(workspace, file, file)).rejects.toThrow(
    /16 megapixels/,
  );
});
it("excludes package, network and cloud credentials through direct and canonical alias paths", async () => {
  await filesystem.mkdir(path.join(root, ".aws"));
  const credentialFiles = [
    ".npmrc",
    ".netrc",
    ".pypirc",
    ".aws/credentials",
    "credentials.json",
  ];
  for (const [index, file] of credentialFiles.entries()) {
    const target = path.join(root, file);
    await filesystem.writeFile(target, "sensitive credential contents");
    const alias = path.join(root, `CredentialAlias${index}.ts`);
    await filesystem.symlink(target, alias);
    await expect(workspace.read(target)).rejects.toThrow(/Private|private/);
    await expect(workspace.read(alias)).rejects.toThrow(/private/);
  }
  await expect(
    workspace.write(
      path.join(root, ".aws", "new-config.json"),
      "{}",
      undefined,
      false,
    ),
  ).rejects.toThrow(/Private|private/);
  const inventory = await workspace.list(root);
  expect(inventory).not.toContain(".npmrc");
  expect(inventory).not.toContain(".netrc");
  expect(inventory).not.toContain(".aws/credentials");
  expect(inventory).not.toContain("credentials.json");
});
