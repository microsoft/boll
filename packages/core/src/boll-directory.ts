import * as path from "path";

export type BollDirectory = string & { __id: "BollDirectory" };

export function asBollDirectory(dirPath: string): BollDirectory {
  return path.resolve(dirPath) as BollDirectory;
}
