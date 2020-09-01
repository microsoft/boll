import { FileContext } from "../lib/file-context";
import { PackageRule } from "../lib/types";
import { Result, Success, Failure } from "../lib/result-set";
import { isImportDeclaration, SourceFile } from "typescript";
import { BollFile } from "../lib/boll-file";
import { asBollLineNumber } from "../lib/boll-line-number";

/**
 * RedundantImportsDetector will detect imports
 * that are importing from a location that another import
 * in the same file is already importing from.
 *
 * Imports from the same location should be done in the
 * same import statement.
 */
const ruleName = "RedundantImportsDetector";
export class RedundantImportsDetector implements PackageRule {
  check(fileContext: FileContext): Result[] {
    return this.checkImportPaths(fileContext.filename, this.getImportPaths(fileContext.source));
  }

  checkImportPaths(fileName: BollFile, importPaths: string[]): Result[] {
    const importLocations: Set<string> = new Set();
    const results = importPaths
      .filter((i) => (importLocations.has(i) ? true : (importLocations.add(i), false)))
      .map((i) => {
        return new Failure(
          ruleName,
          fileName,
          asBollLineNumber(0),
          "Already used as an import source; please combine import statements"
        );
      });
    if (results.length > 0) {
      return results;
    }
    return [new Success(ruleName)];
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
