import { BollDirectory } from "./boll-directory";
import { BollFile } from "./boll-file";
import { DependencyMap, Package } from "./package";
import { SourceFile } from "typescript";

export class FileContext {
  constructor(
    public packageRoot: BollDirectory,
    public packageContext: Package,
    public filename: BollFile,
    public source: SourceFile
  ) {}

  get packageDependencies(): DependencyMap {
    return this.packageContext.dependencies;
  }
}
