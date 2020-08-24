export type BollDirectory = string & { __id: "BollDirectory" };

export function asBollDirectory(path: string): BollDirectory {
  return path as BollDirectory;
}
