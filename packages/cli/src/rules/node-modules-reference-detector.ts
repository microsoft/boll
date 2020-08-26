import { FileContext } from "../lib/file-context";
import { PackageRule } from "../lib/package-rule";
import { Result } from "../lib/result-set";
import { isImportDeclaration, SourceFile } from "typescript";

const MULTI_LINE_COMMENT_REGEXP = /\/\*(.|\n|\r)*\*\//g;
const SINGLE_LINE_COMMENT_REGEXP = /\/\/.*(\n|\r)*/g;

/**
 * NodeModulesReferenceDetector will detect references to
 * the node_modules directory in code and imports.
 *
 * Imports should only be done from packages explicitly
 * declared in package.json.
 */
export class NodeModulesReferenceDetector implements PackageRule {
  check(fileContext: FileContext): Result[] {
    return this.checkParsedSourceLines(this.getParsedSourceLines(fileContext.source));
  }

  checkParsedSourceLines(parsedSourceLines: string[]): Result[] {
    const results: Result[] = [];
    parsedSourceLines.forEach(
      (l) =>
        l.includes("node_modules") && results.push(Result.fail(`Explicit reference to "node_modules" directory: ${l}`))
    );
    !results.length && results.push(Result.succeed());
    return results;
  }

  getParsedSourceLines(sourceFile: SourceFile): string[] {
    const parsedSourceLines: string[] = [];
    sourceFile.forEachChild((c) => {
      const trimmedNodeText = c.getFullText().trim();
      const multiLineCommentsRemovedText = trimmedNodeText
        .split(MULTI_LINE_COMMENT_REGEXP)
        .map((n) => n.trim())
        .filter((n) => n)
        .join("");
      const singleLineCommentsRemovedText = multiLineCommentsRemovedText
        .split(SINGLE_LINE_COMMENT_REGEXP)
        .map((n) => n && n.trim())
        .filter((n) => n)
        .join("");
      parsedSourceLines.push(singleLineCommentsRemovedText);
    });
    return parsedSourceLines;
  }
}
