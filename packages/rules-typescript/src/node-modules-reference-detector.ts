import { asBollLineNumber, BollFile, Failure, FileContext, PackageRule, Result, Success } from "@boll/core";
import { SourceFile } from "typescript";

const MULTI_LINE_COMMENT_REGEXP = /\/\*(.|\n|\r)*\*\//g;
const SINGLE_LINE_COMMENT_REGEXP = /\/\/.*(\n|\r)*/g;

const ruleName = "NodeModulesReferenceDetector";

interface SourceLineAndLineNumber {
  line: string;
  lineNumber: number;
}

/**
 * NodeModulesReferenceDetector will detect references to
 * the node_modules directory in code and imports.
 *
 * Imports should only be done from packages explicitly
 * declared in package.json.
 */
export class NodeModulesReferenceDetector implements PackageRule {
  get name(): string {
    return ruleName;
  }

  async check(fileContext: FileContext): Promise<Result[]> {
    return this.checkParsedSourceLines(fileContext.filename, this.getParsedSourceLines(fileContext.source));
  }

  checkParsedSourceLines(fileName: BollFile, parsedSourceLines: SourceLineAndLineNumber[]): Result[] {
    const results: Result[] = [];
    parsedSourceLines.forEach(
      l =>
        l.line.includes("node_modules") &&
        results.push(
          new Failure(
            ruleName,
            fileName,
            asBollLineNumber(l.lineNumber),
            `Explicit reference to "node_modules" directory: ${l}`
          )
        )
    );
    if (results.length > 0) {
      return results;
    }
    return [new Success(ruleName)];
  }

  getParsedSourceLines(sourceFile: SourceFile): SourceLineAndLineNumber[] {
    const parsedSourceLines: SourceLineAndLineNumber[] = [];
    let lineNumber = 1;
    sourceFile.forEachChild(n => {
      const totalLines = n.getFullText().split(/\r?\n/).length;
      lineNumber = lineNumber + totalLines - 1;
      const trimmedNodeText = n.getFullText().trim();
      const multiLineCommentsRemovedText = trimmedNodeText
        .split(MULTI_LINE_COMMENT_REGEXP)
        .map(n => n && n.trim())
        .filter(n => n)
        .join('\r\n');
      const singleLineCommentsRemovedText = multiLineCommentsRemovedText
        .split(SINGLE_LINE_COMMENT_REGEXP)
        .map(n => n && n.trim())
        .filter(n => n)
        .join('\r\n');
      parsedSourceLines.push({ line: singleLineCommentsRemovedText, lineNumber: lineNumber });
    });
    return parsedSourceLines;
  }
}
