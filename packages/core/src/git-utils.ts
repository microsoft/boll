import { execSync } from "child_process";
import { glob } from "glob";
import { resolve } from "path";
import { promisify } from "util";
const globAsync = promisify(glob);

const defaultIgnoreFileName = ".gitignore";

let repoRoot: string | undefined = undefined;
let ignoreFiles: { [cwd: string]: { [ignoreFileName: string]: string[] } } = {};

export function getRepoRoot(): string {
  if (repoRoot) {
    return repoRoot;
  }
  try {
    repoRoot = resolve(
      execSync("git rev-parse --show-toplevel")
        .toString()
        .trim()
    );
    return repoRoot;
  } catch (e) {
    console.warn(e);
    return process.cwd();
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
    await globAsync(`./{!(node_modules)/**/${ignoreFileNameOrDefault},${ignoreFileNameOrDefault}}`, {
      cwd: cwdOrDefault
    })
  ).map(p => resolve(cwdOrDefault, p));
  return ignoreFiles[cwdOrDefault][ignoreFileNameOrDefault];
}
