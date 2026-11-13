import { sanitize } from "../security/privacy.js";
import { Workspace } from "../security/workspace.js";
import { BrowserService } from "../browser/session.js";
import type { ToolDefinition, AddTool } from "./types.js";
import { registerProjectTools } from "./project.js";
import { registerDesignTools } from "./design.js";
import { registerBrowserTools } from "./browser.js";
export type { ToolDefinition } from "./types.js";
export function createTools(
  workspace: Workspace,
  browser: BrowserService,
): ToolDefinition[] {
  const tools: ToolDefinition[] = [];
  const add: AddTool = (
    name,
    description,
    schema,
    execute,
    mutates = false,
  ) => {
    tools.push({ name, description, schema, execute, mutates });
  };
  registerProjectTools(workspace, add);
  registerDesignTools(workspace, add);
  registerBrowserTools(workspace, browser, add);
  return tools;
}
export async function executeTool(tool: ToolDefinition, input: unknown) {
  const parsed = tool.schema.parse(input);
  const result = await tool.execute(parsed);
  return sanitize(result);
}
