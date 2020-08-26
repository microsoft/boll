import * as path from "path";
import { BollDirectory } from "../lib/boll-directory";
import { BollFile } from "../lib/boll-file";
import { FileContext } from "../lib/file-context";
import { PackageRule } from "../lib/types";
import { Result } from "../lib/result-set";
import { SourceFile, isImportDeclaration, ImportDeclaration, isStringLiteral } from "typescript";

/**
 * CrossPackageDependencyDetector will detect usages of files
 * stored directly in other packages that happen to be in a known
 * location on disk.
 *
 * Instead of referencing these files via file path, they should be
 * referenced through their package name.
 * (eg `import { Foo } from "@company/package"` instead of `import Foo from '../../the-package/foo'`)
 */
export class CrossPackageDependencyDetector implements PackageRule {
  check(file: FileContext): Result[] {
    const imports = this.getFileImports(file.source);
    return this.checkImportPaths(file.packageRoot, file.filename, imports);
  }

  getFileImports(sourceFile: SourceFile): string[] {
    const importPaths: string[] = [];
    sourceFile.forEachChild((n) => {
      if (isImportDeclaration(n)) {
        const path = this.getPathFromNode(n);
        if (path.startsWith(".")) {
          importPaths.push(path);
        }
      }
    });
    return importPaths;
  }

  checkImportPaths(packageRoot: BollDirectory, sourceFilePath: BollFile, importPaths: string[]): Result[] {
    const resultSet: Result[] = [];
    importPaths.forEach((i) => {
      const resolvedPath = path.resolve(path.dirname(sourceFilePath), i);
      if (!resolvedPath.startsWith(packageRoot + path.sep)) {
        resultSet.push(Result.fail(`${sourceFilePath} imports ${resolvedPath}, which spans a package boundary.`));
      }
    });
    if (resultSet.length > 0) {
      return resultSet;
    }
    return [Result.succeed()];
  }

  private getPathFromNode(n: ImportDeclaration) {
    if (isStringLiteral(n.moduleSpecifier)) {
      const moduleSpecifier = n.moduleSpecifier.getText();
      return moduleSpecifier.slice(1, moduleSpecifier.length - 1);
    }
    throw new Error(`Don't know how to parse import statement ${n.getText()}`);
  }
}
