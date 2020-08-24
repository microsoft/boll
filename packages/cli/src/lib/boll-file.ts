export type BollFile = string & { __id: "BollFile" };

export function asBollFile(path: string): BollFile {
  return path as BollFile;
}
