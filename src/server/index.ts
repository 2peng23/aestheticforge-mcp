import { McpServer } from "@modelcontextprotocol/server";
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { z } from "zod";
import { Workspace, redact } from "../security/workspace.js";
import { BrowserService } from "../browser/session.js";
import { createTools, executeTool } from "../tools/registry.js";
export async function createServer(
  roots: string[],
  origins: string[] = [],
  executablePath?: string,
) {
  const workspace = await Workspace.create(roots);
  const browser = new BrowserService(workspace, origins, executablePath);
  const server = new McpServer({
    name: "aestheticforge-mcp",
    version: "0.1.0",
  });
  for (const tool of createTools(workspace, browser)) {
    server.registerTool(
      tool.name,
      {
        description: tool.description,
        inputSchema: tool.schema,
        outputSchema: z.object({ result: z.unknown() }),
        annotations: {
          readOnlyHint: !tool.mutates,
          destructiveHint: false,
          openWorldHint: true,
        },
      },
      async (input) => {
        try {
          const result = await executeTool(tool, input);
          return {
            content: [{ type: "text", text: JSON.stringify(result) }],
            structuredContent: { result },
          };
        } catch (error) {
          return {
            isError: true,
            content: [
              {
                type: "text",
                text: redact(
                  error instanceof Error ? error.message : String(error),
                ),
              },
            ],
          };
        }
      },
    );
  }
  const close = server.close.bind(server);
  server.close = async () => {
    await browser.close();
    await close();
  };
  return server;
}
export async function startServer(
  roots: string[],
  origins: string[] = [],
  executablePath?: string,
) {
  const server = await createServer(roots, origins, executablePath);
  await server.connect(new StdioServerTransport());
  return server;
}
