import { asBollLineNumber, BollFile, Failure, FileContext, PackageRule, Result, Success } from "@boll/core";
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

  check(fileContext: FileContext): Result[] {
    return this.checkImportPaths(fileContext.filename, this.getImportPaths(fileContext.source));
  }

  checkImportPaths(fileName: BollFile, importPaths: string[]): Result[] {
    const results = importPaths
      .filter(i => i.toLowerCase().includes("/src/"))
      .map(i => {
        return new Failure(
          ruleName,
          fileName,
          asBollLineNumber(0),
          "Import includes 'src', but should not. Import from root package instead."
        );
      });
    if (results.length > 0) {
      return results;
    }

    return [new Success(ruleName)];
  }

  getImportPaths(sourceFile: SourceFile): string[] {
    const importPaths: string[] = [];
    sourceFile.forEachChild(n => {
      if (isImportDeclaration(n)) {
        importPaths.push(n.moduleSpecifier.getText());
      }
    });
    return importPaths;
  }
}
