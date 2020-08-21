import { Result } from "../lib/result-set";
import {
  SourceFile,
  isImportDeclaration,
  ImportDeclaration,
  isStringLiteral,
} from "typescript";
import { FileContext } from "../lib/file-context";
import { DependencyMap } from "../lib/package";

/**
 * TransitiveDependencyDetector will detect usages of non direct dependencies
 * in import statements of typescript source files.
 *
 * If package `A` depends on `B`, `A` is free to import things
 * at will from package `B`. However, if `B` depends on `C`, `A` may
 * be able to access `C` in some environments even without specifying
 * a dependency in `package.json`.
 *
 * This rule catches instances of this chain in typescript source
 * files.
 */
export class TransitiveDependencyDetector {
  check(file: FileContext): Result[] {
    const imports = this.getModuleImports(file.source);
    return imports
      .filter((i) => !this.isValidImport(file.packageDependencies, i))
      .map((i) =>
        Result.fail(
          `"${i}" is used as a module import, but not listed as a dependency. (Either add as a direct dependency or remove usage.)`
        )
      );
  }
  isValidImport(packageDependencies: DependencyMap, importPath: string): any {
    const validImports = Object.keys(packageDependencies);
    return validImports.some(
      (moduleName) =>
        importPath === moduleName || importPath.startsWith(`${moduleName}/`)
    );
  }

  checkImportPaths(importPaths: string[]) {
    if (importPaths.some((i) => i.toLowerCase().includes("/src/"))) {
      return Result.fail(importPaths.join(", "));
    }
    return Result.succeed();
  }

  getModuleImports(sourceFile: SourceFile): string[] {
    const importPaths: string[] = [];
    sourceFile.forEachChild((n) => {
      if (isImportDeclaration(n)) {
        const path = this.getPathFromNode(n);
        if (!path.startsWith(".")) {
          importPaths.push(path);
        }
      }
    });
    return importPaths;
  }

  private getPathFromNode(n: ImportDeclaration) {
    if (isStringLiteral(n.moduleSpecifier)) {
      const moduleSpecifier = n.moduleSpecifier.getText();
      return moduleSpecifier.slice(1, moduleSpecifier.length - 1);
    }
    throw new Error(`Don't know how to parse import statement ${n.getText()}`);
  }
}
