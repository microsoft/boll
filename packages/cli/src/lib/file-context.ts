import { Package, DependencyMap } from "./package";
import { SourceFile } from "typescript";

export class FileContext {
  constructor(
    public packageContext: Package,
    public filename: string,
    public source: SourceFile
  ) {}

  get packageDependencies(): DependencyMap {
    return this.packageContext.dependencies;
  }
}
