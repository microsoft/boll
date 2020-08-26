import { FileContext } from "../lib/file-context";
import { PackageRule } from "../lib/package-rule";
import { Result } from "../lib/result-set";
import { isImportDeclaration, SourceFile } from "typescript";

/**
 * RedundantImportsDetector will detect imports
 * that are importing from a location that another import
 * in the same file is already importing from.
 *
 * Imports from the same location should be done in the
 * same import statement.
 */
export class RedundantImportsDetector implements PackageRule {
  _importLocationSet: Set<string> = new Set();

  check(fileContext: FileContext): Result[] {
    return [this.checkImportPaths(this.getImportPaths(fileContext.source))];
  }

  checkImportPaths(importPaths: string[]) {
    if (importPaths.some((i) => (this._importLocationSet.has(i) ? true : (this._importLocationSet.add(i), false)))) {
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
