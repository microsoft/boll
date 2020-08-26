import fs from "fs";
import path from "path";
import ts from "typescript";
import { promisify } from "util";
import { BollDirectory } from "./boll-directory";
import { BollFile, asBollFile } from "./boll-file";
import { DependencyMap, Package } from "./package";
const readFileAsync = promisify(fs.readFile);

export class FileContext {
  constructor(
    public packageRoot: BollDirectory,
    public packageContext: Package,
    public filename: BollFile,
    public source: ts.SourceFile
  ) {}

  get packageDependencies(): DependencyMap {
    return this.packageContext.dependencies;
  }
}

export async function getSourceFile(
  projectRoot: BollDirectory,
  filename: string,
  packageContext: Package
): Promise<FileContext> {
  const normalizedFile = path.normalize(filename).replace(/\\/g, "/");
  const content = await readFileAsync(normalizedFile);
  const source = ts.createSourceFile(
    normalizedFile,
    content.toString("utf8"),
    ts.ScriptTarget.ES5,
    true
  );
  return new FileContext(
    projectRoot,
    packageContext,
    asBollFile(filename),
    source
  );
}
