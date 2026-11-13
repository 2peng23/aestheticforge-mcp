# MCP client setup

Replace `/absolute/path/aestheticforge-mcp` and `/absolute/project` with actual absolute paths. The executable is `dist/server/cli.js`. Build before configuring a client. No tool here changes your installed client settings.

## Codex

In `~/.codex/config.toml` (or supported project configuration):

```toml
[mcp_servers.aestheticforge]
command = "node"
args = ["/absolute/path/aestheticforge-mcp/dist/server/cli.js", "--root", "/absolute/project"]
startup_timeout_sec = 20
tool_timeout_sec = 180
```

For installed Chrome, add `env = { AESTHETICFORGE_BROWSER_PATH = "/absolute/path/to/chrome" }`. Multiwidth audits may need a larger tool timeout. Reference: [Codex MCP](https://developers.openai.com/codex/mcp).

## Claude Code

```sh
claude mcp add --transport stdio --scope project aestheticforge -- node /absolute/path/aestheticforge-mcp/dist/server/cli.js --root /absolute/project
```

This creates the project-scoped configuration after client confirmation. See [Claude Code MCP](https://code.claude.com/docs/en/mcp).

## Cursor

Use `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "aestheticforge": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/aestheticforge-mcp/dist/server/cli.js",
        "--root",
        "/absolute/project"
      ]
    }
  }
}
```

See [Cursor MCP](https://cursor.com/docs/mcp).

## VS Code

Current VS Code Copilot supports portable root `.mcp.json`:

```json
{
  "mcpServers": {
    "aestheticforge": {
      "type": "stdio",
      "command": "node",
      "args": [
        "/absolute/path/aestheticforge-mcp/dist/server/cli.js",
        "--root",
        "/absolute/project"
      ]
    }
  }
}
```

Some installed versions use editor-managed `.vscode/mcp.json` with the same entry inside `servers` instead of `mcpServers`. Use the format supported by that installed client. Reference: [VS Code MCP configuration](https://code.visualstudio.com/docs/agents/reference/mcp-configuration).

The SDK integration test exercises stdio discovery, structured results and authorization errors. Actual installation into all four client applications has not been performed; configuration compatibility is documented, not represented as GUI-tested.
