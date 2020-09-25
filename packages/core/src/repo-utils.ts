import { execSync } from "child_process";
import * as path from "path";
import { asBollDirectory, BollDirectory } from "./boll-directory";
import { BollFile } from "./boll-file";

interface FileCache {
  [branch: string]: {
    [file: string]: string;
  };
}

let repoRoot: BollDirectory | undefined = undefined;
export function getRepoRoot(): BollDirectory {
  if (repoRoot) return repoRoot;
  repoRoot = asBollDirectory(execSync("git rev-parse --show-toplevel").toString());
  return repoRoot;
}

export function isRoot(dirOrFile: BollFile | BollDirectory) {
  const root = getRepoRoot();
  return !dirOrFile.slice(root.length + 1).includes(path.sep);
}

const fileCache: FileCache = {};
export function getFileContentOnBranch(file: BollFile, branch: string) {
  if (fileCache[branch][file]) return fileCache[branch][file];
  const normalizedFileName = file.slice(getRepoRoot().length).replace(/\\/g, "/");
  const fileContent = execSync(`git -P show ${branch}:${normalizedFileName}`).toString();
  fileCache[branch][file] = fileContent;
  return fileContent;
}
