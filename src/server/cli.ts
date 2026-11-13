#!/usr/bin/env node
import { startServer } from "./index.js";
import { redact } from "../security/workspace.js";
try {
  const arguments_ = process.argv.slice(2);
  const roots: string[] = [];
  const origins: string[] = [];
  if (arguments_.includes("--help")) {
    process.stdout.write(
      "Usage: aestheticforge-mcp --root /authorized/project [--root /output] [--origin https://approved.example]\nBrowser: npx playwright install chromium, or AESTHETICFORGE_BROWSER_PATH\n",
    );
    process.exit(0);
  }
  for (let index = 0; index < arguments_.length; index++) {
    const argument = arguments_[index];
    const value = arguments_[++index];
    if (
      !value ||
      value.startsWith("--") ||
      !["--root", "--origin"].includes(argument)
    )
      throw new Error(
        "Expected --root directory or --origin exact-origin. Use --help.",
      );
    if (argument === "--root") roots.push(value);
    else {
      let url: URL;
      try {
        url = new URL(value);
      } catch {
        throw new Error("--origin must be a valid exact HTTP(S) origin.");
      }
      if (!["https:", "http:"].includes(url.protocol) || url.origin !== value)
        throw new Error(
          "--origin must be an exact HTTP(S) origin without credentials, path or query.",
        );
      origins.push(value);
    }
  }
  const server = await startServer(
    roots,
    origins,
    process.env.AESTHETICFORGE_BROWSER_PATH,
  );
  let closing = false;
  const close = async () => {
    if (closing) return;
    closing = true;
    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      process.stderr.write(
        redact(error instanceof Error ? error.message : String(error)) + "\n",
      );
      process.exit(1);
    }
  };
  process.on("SIGINT", close);
  process.on("SIGTERM", close);
  process.stdin.on("end", close);
} catch (error) {
  process.stderr.write(
    redact(error instanceof Error ? error.message : String(error)) + "\n",
  );
  process.exitCode = 1;
}
