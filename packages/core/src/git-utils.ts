import { execSync } from "child_process";
import fg from "fast-glob";
import { resolve } from "path";

const defaultIgnoreFileName = ".gitignore";

let repoRoot: string | undefined = undefined;
let ignoreFiles: { [cwd: string]: { [ignoreFileName: string]: string[] } } = {};

/** 
 * Some build environments don't have git on the path during build phase.
 * Yet we want to lint during the build to not lave any pref on the table.
 * This allows these repo'sto short-circuit the call to git and determine
 * the repo root to avoid the message.
 */
export function setRepoRoot(root: string): void {
  repoRoot = root;
}

export function getRepoRoot(): string {
  if (repoRoot) {
    return repoRoot;
  }
  try {
    repoRoot = resolve(execSync("git rev-parse --show-toplevel").toString().trim());
    return repoRoot;
  } catch (e) {
    repoRoot = process.cwd();
    console.warn(`Warning: Failed to execute git command to determ ine repo root. Using ${repoRoot}: ${e}`);
    return repoRoot;
  }
}

export async function getIgnoreFiles(cwd?: string, ignoreFileName?: string): Promise<string[]> {
  const cwdOrDefault = cwd ?? process.cwd();
  const ignoreFileNameOrDefault = ignoreFileName ?? defaultIgnoreFileName;
  if (ignoreFiles[cwdOrDefault] && ignoreFiles[cwdOrDefault][ignoreFileNameOrDefault]) {
    return ignoreFiles[cwdOrDefault][ignoreFileNameOrDefault];
  }
  !ignoreFiles[cwdOrDefault] && (ignoreFiles[cwdOrDefault] = {});
  ignoreFiles[cwdOrDefault][ignoreFileNameOrDefault] = (
    await fg(`./**/${ignoreFileNameOrDefault}`, {
      cwd: cwdOrDefault,
      ignore: ["./**/node_modules/**"]
    })
  ).map(p => resolve(cwdOrDefault, p));
  return ignoreFiles[cwdOrDefault][ignoreFileNameOrDefault];
}
