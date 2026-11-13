import { promises as filesystem } from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
export const hash = (source: string | Buffer) =>
  createHash("sha256").update(source).digest("hex");
export { redact } from "./privacy.js";
import { sanitize } from "./privacy.js";
const privateFile =
  /(^|\/)(?:\.env(?:\.[^/]+)?|\.git|\.ssh|\.npmrc|\.netrc|\.pypirc|\.aws|\.azure|credentials(?:\.json)?|id_rsa|id_ed25519|[^/]*\.(?:pem|key|p12))($|\/)/i;
export class Workspace {
  private constructor(public readonly roots: string[]) {}
  static async create(roots: string[]) {
    if (!roots.length)
      throw new Error("Provide at least one --root authorized-directory.");
    if (roots.length > 16)
      throw new Error("At most 16 filesystem roots may be authorized.");
    const canonicalRoots = await Promise.all(
      roots.map(async (root) => {
        const canonical = await filesystem.realpath(path.resolve(root));
        if (!(await filesystem.stat(canonical)).isDirectory())
          throw new Error("Authorized roots must be directories.");
        return canonical;
      }),
    );
    return new Workspace(canonicalRoots);
  }
  async resolve(candidate: string, writable = false): Promise<string> {
    const absolute = path.resolve(candidate);
    if (privateFile.test(absolute.replaceAll("\\", "/")))
      throw new Error("Private files and repository metadata are excluded.");
    let existing = absolute;
    let ancestor = absolute;
    for (;;) {
      try {
        existing = await filesystem.realpath(ancestor);
        break;
      } catch (failure: any) {
        if (failure.code !== "ENOENT") throw failure;
        const parent = path.dirname(ancestor);
        if (parent === ancestor) throw failure;
        ancestor = parent;
      }
    }
    if (privateFile.test(existing.replaceAll("\\", "/")))
      throw new Error("Canonical path is private.");
    const resolvedCandidate = path.join(
      existing,
      path.relative(ancestor, absolute),
    );
    const root = this.roots.find(
      (root) =>
        resolvedCandidate === root ||
        resolvedCandidate.startsWith(root + path.sep),
    );
    if (!root)
      throw new Error("Path is outside an authorized filesystem root.");
    if (writable && this.roots.includes(resolvedCandidate))
      throw new Error("Cannot replace an authorized root.");
    return resolvedCandidate;
  }
  async read(file: string) {
    const safe = await this.resolve(file);
    const stat = await filesystem.stat(safe);
    if (stat.size > 2_000_000)
      throw new Error("Text files are limited to 2 MB.");
    return filesystem.readFile(safe, "utf8");
  }
  async list(project: string) {
    const root = await this.resolve(project);
    const entries: string[] = [];
    const ignored = new Set([
      "node_modules",
      ".git",
      "dist",
      "build",
      ".next",
      ".nuxt",
      "coverage",
      "artifacts",
      "vendor",
      ".aestheticforge",
    ]);
    let directoriesVisited = 0;
    const visit = async (directory: string, depth: number) => {
      if (depth > 14 || entries.length >= 5000 || directoriesVisited++ >= 1000)
        return;
      for (const entry of await filesystem.readdir(directory, {
        withFileTypes: true,
      })) {
        if (entries.length >= 5000) break;
        if (
          entry.isSymbolicLink() ||
          ignored.has(entry.name) ||
          privateFile.test(entry.name)
        )
          continue;
        const absolute = path.join(directory, entry.name);
        if (entry.isDirectory()) await visit(absolute, depth + 1);
        else if (entry.isFile())
          entries.push(path.relative(root, absolute).split(path.sep).join("/"));
      }
    };
    await visit(root, 0);
    return entries;
  }
  async write(
    file: string,
    content: string,
    expectedHash: string | undefined,
    dryRun = true,
  ) {
    if (Buffer.byteLength(content) > 2_000_000)
      throw new Error("Writes limited to 2 MB.");
    const safe = await this.resolve(file, true);
    if (
      !/\.(?:css|scss|sass|less|html|jsx|tsx|js|ts|vue|svelte|json|md|blade\.php)$/.test(
        safe,
      )
    )
      throw new Error(
        "Only source and design document extensions may be written.",
      );
    let before: string | null = null;
    let existingMode = 0o600;
    try {
      before = await this.read(safe);
      existingMode = (await filesystem.stat(safe)).mode & 0o777;
    } catch (failure: any) {
      if (failure.code !== "ENOENT") throw failure;
    }
    if (before !== null && expectedHash !== hash(before))
      throw new Error(
        "Existing files require matching expectedHash; inspect the file before modifying it.",
      );
    if (before === null && expectedHash)
      throw new Error("Expected file does not exist.");
    const summary = {
      path: safe,
      dryRun,
      beforeHash: before === null ? null : hash(before),
      afterHash: hash(content),
      created: before === null,
      bytes: Buffer.byteLength(content),
      lineDelta: content.split("\n").length - (before?.split("\n").length ?? 0),
    };
    if (!dryRun) {
      await filesystem.mkdir(path.dirname(safe), { recursive: true });
      await this.resolve(safe, true);
      const temporary = safe + `.${process.pid}.${Date.now()}.tmp`;
      await filesystem.writeFile(temporary, content, {
        flag: "wx",
        mode: existingMode,
      });
      try {
        if (before !== null && hash(await this.read(safe)) !== expectedHash)
          throw new Error("File changed during write.");
        if (before === null) {
          await filesystem.link(temporary, safe);
        } else {
          await filesystem.rename(temporary, safe);
        }
      } finally {
        await filesystem.rm(temporary, { force: true });
      }
    }
    return summary;
  }
  async artifact(file: string, content: string | Buffer) {
    if (typeof content === "string" && file.endsWith(".json"))
      content = JSON.stringify(sanitize(JSON.parse(content)), null, 2);
    const safe = await this.resolve(file, true);
    await filesystem.mkdir(path.dirname(safe), { recursive: true });
    await this.resolve(safe, true);
    await filesystem.writeFile(safe, content, { flag: "wx" });
    return safe;
  }
}
