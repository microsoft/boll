import { Result } from "./result-set";
import { SourceFile, SyntaxKind, isImportDeclaration } from "typescript";

/**
 * SrcDetector will detect usages of `src` in
 * import statements of typescript source files.
 *
 * `src` as a portion of a path indicates that source
 * files from upstream dependencies are being compiled
 * in a project rather than being consumed from compiled
 * sources.
 */
export class SrcDetector {
  check(sourceFile: SourceFile): Result {
    return this.checkImportPaths(this.getImportPaths(sourceFile));
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
