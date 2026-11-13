# Official API references

Checked November 13, 2026, against official documentation and installed package types:

- [MCP TypeScript SDK v2 package architecture](https://github.com/modelcontextprotocol/typescript-sdk/blob/main/docs/get-started/packages.md): current split `@modelcontextprotocol/server` and `@modelcontextprotocol/client`, version2.4.0. Uses `McpServer.registerTool`, Zod4 schemas and `StdioServerTransport`. The SDK includes compatibility with older clients/protocol eras.
- [MCP TypeScript SDK v2 API](https://ts.sdk.modelcontextprotocol.io/v2/api/%40modelcontextprotocol/server/server/mcp): tool configuration and result contracts.
- [Playwright browsers](https://playwright.dev/docs/browsers), [network routing](https://playwright.dev/docs/network), [emulation](https://playwright.dev/docs/emulation), [screenshots](https://playwright.dev/docs/screenshots): Playwright1.65.0, Chromium-compatible Chrome.
- [Axe Playwright integration](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/playwright): version4.13.0 selected for Node20 compatibility. Later4.14 requires Node22.
- [Lighthouse official repository](https://github.com/GoogleChrome/lighthouse): CLI JSON output and runtime requirements. Optional and not part of default dependencies.
- [WCAG2.2 contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html): 4.5:1 normal text,3:1 large text. Opaque sRGB calculations are implemented without invented scores.

The npm lockfile is authoritative for installed versions. No framework is upgraded, migrated or executed by source discovery.
