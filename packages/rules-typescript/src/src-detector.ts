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

const ruleName = "SrcDetector";

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
  get name(): string {
    return ruleName;
  }

  async check(fileContext: FileContext): Promise<Result[]> {
    return this.checkImportPaths(fileContext.filename, this.getImportPaths(fileContext.source));
  }

  checkImportPaths(fileName: BollFile, importPaths: ImportPathAndLineNumber[]): Result[] {
    const results = importPaths
      .filter(i => i.path.toLowerCase().includes("/src/"))
      .map(i => {
        return new Failure(
          ruleName,
          fileName,
          asBollLineNumber(i.lineNumber),
          "Import includes 'src', but should not. Import from root package instead."
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
        console.log('==================================>>>>>>>>>>>>');
        console.log('path : ' + n.moduleSpecifier.getText());
        console.log('lineNumber : ' + lineNumber);
        importPaths.push({
          path: n.moduleSpecifier.getText(),
          lineNumber: lineNumber
        });
      }
    });
    return importPaths;
  }
}
