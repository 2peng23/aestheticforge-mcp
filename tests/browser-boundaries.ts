import { createServer } from "node:http";
import { promises as filesystem } from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { Workspace } from "../dist/security/workspace.js";
import { BrowserService } from "../dist/browser/session.js";
let privateRequests = 0;
const privateServer = createServer((_request, response) => {
  privateRequests++;
  response.end("private");
});
await new Promise<void>((resolve) =>
  privateServer.listen(0, "127.0.0.1", resolve),
);
const privateAddress = privateServer.address();
assert(privateAddress && typeof privateAddress !== "string");
const server = createServer((_request, response) => {
  response.setHeader("content-type", "text/html");
  response.end(
    `<html><body><img src="http://127.0.0.1:${privateAddress.port}/private"><input id="password" type="password"><input id="email" type="email"><p id="result">Ready</p></body></html>`,
  );
});
await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
const address = server.address();
assert(address && typeof address !== "string");
const root = await filesystem.mkdtemp(
  path.join(os.tmpdir(), "aestheticforge-browser-"),
);
const workspace = await Workspace.create([root]);
const browser = new BrowserService(
  workspace,
  [],
  process.env.AESTHETICFORGE_BROWSER_PATH,
);
const url = `http://127.0.0.1:${address.port}`;
try {
  await browser.page({ url }, async (page) => {
    assert.equal(await page.locator("#result").textContent(), "Ready");
  });
  assert.equal(
    privateRequests,
    0,
    "unrelated loopback service must never be requested",
  );
  await assert.rejects(
    browser.flow({ url }, [
      { type: "fill", selector: "#password", value: "never transmit" },
    ]),
    /Sensitive/,
  );
  await assert.rejects(
    browser.flow({ url }, [
      { type: "fill", selector: "#email", value: "private@example.com" },
    ]),
    /Sensitive/,
  );
  await browser.flow({ url }, [
    { type: "expect-text", selector: "#result", value: "Ready" },
  ]);
  await assert.rejects(
    browser.flow({ url }, [
      { type: "expect-text", selector: "#result", value: "Wrong" },
    ]),
    /did not match/,
  );
  console.log(
    JSON.stringify({
      crossOriginLoopbackBlocked: true,
      sensitiveInputBlocked: true,
      assertionsWork: true,
    }),
  );
} finally {
  await browser.close();
  await Promise.all([
    new Promise<void>((resolve) => server.close(() => resolve())),
    new Promise<void>((resolve) => privateServer.close(() => resolve())),
  ]);
  await filesystem.rm(root, { recursive: true, force: true });
}
