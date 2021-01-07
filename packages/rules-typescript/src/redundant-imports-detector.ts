import {
  asBollLineNumber,
  BollFile,
  Failure,
  FileContext,
  ImportPathAndLineNumber,
  PackageRule,
  Result,
  Success
} from "@boll/core";
import { isImportDeclaration, SourceFile } from "typescript";

const ruleName = "RedundantImportsDetector";

/**
 * RedundantImportsDetector will detect imports
 * that are importing from a location that another import
 * in the same file is already importing from.
 *
 * Imports from the same location should be done in the
 * same import statement.
 */
export class RedundantImportsDetector implements PackageRule {
  get name(): string {
    return ruleName;
  }

  async check(fileContext: FileContext): Promise<Result[]> {
    return this.checkImportPaths(fileContext.filename, this.getImportPaths(fileContext.source));
  }

  checkImportPaths(fileName: BollFile, importPaths: ImportPathAndLineNumber[]): Result[] {
    const importLocations: Set<string> = new Set();
    const results = importPaths
      .filter(i => (importLocations.has(i.path) ? true : (importLocations.add(i.path), false)))
      .map(i => {
        return new Failure(
          ruleName,
          fileName,
          asBollLineNumber(i.lineNumber),
          "Already used as an import source; please combine import statements"
        );
      });
    if (results.length > 0) {
      return results;
    }
    return [new Success(ruleName)];
  }

  getImportPaths(sourceFile: SourceFile): ImportPathAndLineNumber[] {
    const importPaths: ImportPathAndLineNumber[] = [];
    let lineNumber = 1;
    sourceFile.forEachChild(n => {
      const totalLines = n.getFullText().split(/\r?\n/).length;
      lineNumber = lineNumber + totalLines - 1;
      if (isImportDeclaration(n)) {
        importPaths.push({
          path: n.moduleSpecifier.getText(),
          lineNumber: lineNumber
        });
      }
    });
    return importPaths;
  }
}
