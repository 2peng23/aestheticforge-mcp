import { createRequire } from "node:module";
import { execFile } from "node:child_process";
import { Workspace } from "../security/workspace.js";
const require = createRequire(import.meta.url);
export async function runLighthouse(
  workspace: Workspace,
  url: string,
  output: string,
) {
  await workspace.resolve(output, true);
  let executable: string;
  try {
    executable = require.resolve("lighthouse/cli/index.js");
  } catch {
    throw new Error(
      "Optional Lighthouse is not installed. Run the server on Node22.19+ and install current lighthouse separately (npm install --no-save --package-lock=false lighthouse@13.6.0). Review its explicit network permission before use.",
    );
  }
  const result = await new Promise<string>((resolve, reject) =>
    execFile(
      process.execPath,
      [
        executable,
        url,
        "--output=json",
        "--output-path=stdout",
        "--quiet",
        "--no-enable-error-reporting",
        "--disable-full-page-screenshot",
        "--skip-audits=screenshot-thumbnails,final-screenshot",
        "--chrome-flags=--headless --disable-gpu",
      ],
      {
        timeout: 120_000,
        maxBuffer: 8_000_000,
        env: {
          PATH: process.env.PATH,
          HOME: process.env.HOME,
          CHROME_PATH: process.env.AESTHETICFORGE_BROWSER_PATH,
        },
      },
      (error, stdout, stderr) =>
        error
          ? reject(new Error(`Lighthouse failed: ${stderr.slice(0, 2000)}`))
          : resolve(stdout),
    ),
  );
  const report = JSON.parse(result);
  const safe = await workspace.artifact(
    output,
    JSON.stringify(report, null, 2),
  );
  return {
    path: safe,
    lighthouseVersion: report.lighthouseVersion,
    fetchTime: report.fetchTime,
    categories: report.categories,
    audits: report.audits,
    limits:
      "Lab score, not real-user Core Web Vitals. This optional tool has explicit external network permission.",
  };
}
