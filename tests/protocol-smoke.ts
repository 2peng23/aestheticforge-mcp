import assert from "node:assert/strict";
import path from "node:path";
import { Client } from "@modelcontextprotocol/client";
import { StdioClientTransport } from "@modelcontextprotocol/client/stdio";
const root = path.resolve("examples/demo");
const transport = new StdioClientTransport({
  command: process.execPath,
  args: [path.resolve("dist/server/cli.js"), "--root", root],
  stderr: "pipe",
});
let stderr = "";
transport.stderr?.on("data", (chunk) => (stderr += chunk));
const client = new Client({ name: "aestheticforge-smoke", version: "1.0.0" });
try {
  await client.connect(transport);
  const listed = await client.listTools();
  assert(listed.tools.length >= 60);
  const response = await client.callTool({
    name: "detect_framework",
    arguments: { project: root },
  });
  assert(!response.isError);
  assert(JSON.stringify(response).includes("HTML/CSS/JavaScript"));
  const forbidden = await client.callTool({
    name: "inspect_component_api",
    arguments: { file: "/etc/passwd" },
  });
  assert(forbidden.isError);
  process.stdout.write(
    JSON.stringify(
      {
        tools: listed.tools.length,
        discovery: true,
        unauthorizedPathRejected: true,
        stderr,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await client.close();
}
