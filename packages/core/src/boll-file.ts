import * as path from "path";

export type BollFile = string & { __id: "BollFile" };

export function asBollFile(filePath: string): BollFile {
  return path.resolve(filePath) as BollFile;
}
