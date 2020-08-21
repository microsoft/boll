import { Result } from "../lib/result-set";
import { SourceFile, SyntaxKind, isImportDeclaration } from "typescript";
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
          `"${i} is a module import, but not correctly listed as a dependency."`
        )
      );
  }
  isValidImport(packageDependencies: DependencyMap, importPath: string): any {
    throw new Error("Method not implemented.");
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
        const path = n.moduleSpecifier.getText();
        if (!path.startsWith(".")) {
          importPaths.push(path);
        }
      }
    });
    return importPaths;
  }
}
