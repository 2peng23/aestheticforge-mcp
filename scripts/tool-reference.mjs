import { writeFileSync } from "node:fs";
import { Workspace } from "../dist/security/workspace.js";
import { BrowserService } from "../dist/browser/session.js";
import { createTools } from "../dist/tools/registry.js";
import { z } from "zod";
const workspace = await Workspace.create([process.cwd()]);
const tools = createTools(workspace, new BrowserService(workspace));
let document =
  "# Tool reference\n\nGenerated from the executable registry. Every input schema below is the actual validated schema. All paths are within startup-authorized roots. All results appear as `structuredContent.result` and JSON text. Errors set `isError:true`.\n\nDesign compilation validates supplied facts/contracts; it does not independently author creative decisions. Source tools apply client-authored source. Browser audits are measured inventories/heuristics with limits explained in methodology.md.\n";
for (const tool of tools) {
  document += `\n## ${tool.name}\n\n${tool.description}\n\nPotential file/app mutation: ${tool.mutates ? "yes (dry-run where offered)" : "no"}.\n\n\`\`\`json\n${JSON.stringify(z.toJSONSchema(tool.schema), null, 2)}\n\`\`\`\n`;
}
writeFileSync("docs/tools.md", document);
