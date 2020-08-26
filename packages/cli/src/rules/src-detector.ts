import { FileContext } from "../lib/file-context";
import { PackageRule } from "../lib/types";
import { Result } from "../lib/result-set";
import { isImportDeclaration, SourceFile } from "typescript";

/**
 * SrcDetector will detect usages of `src` in
 * import statements of typescript source files.
 *
 * `src` as a portion of a path indicates that source
 * files from upstream dependencies are being compiled
 * in a project rather than being consumed from compiled
 * sources.
 */
export class SrcDetector implements PackageRule {
  check(fileContext: FileContext): Result[] {
    return [this.checkImportPaths(this.getImportPaths(fileContext.source))];
  }

  checkImportPaths(importPaths: string[]) {
    if (importPaths.some((i) => i.toLowerCase().includes("/src/"))) {
      return Result.fail(importPaths.join(", "));
    }
    return Result.succeed();
  }

  getImportPaths(sourceFile: SourceFile): string[] {
    const importPaths: string[] = [];
    sourceFile.forEachChild((n) => {
      if (isImportDeclaration(n)) {
        importPaths.push(n.moduleSpecifier.getText());
      }
    });
    return importPaths;
  }
}
