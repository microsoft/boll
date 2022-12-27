import {
  asBollLineNumber,
  Package,
  Failure,
  FileContext,
  ImportPathAndLineNumber,
  PackageRule,
  Result
} from "@boll/core";
import { ImportDeclaration, isImportDeclaration, isStringLiteral, SourceFile } from "typescript";

const ruleName = "TransitiveDependencyDetector";

export interface Options {
  ignorePackages: string[];
  allowDevDependencies: boolean;
}

const defaultOptions: Options = {
  ignorePackages: [],
  allowDevDependencies: false
};

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
export class TransitiveDependencyDetector implements PackageRule {
  private options: Options = { ...defaultOptions };

  constructor(...options: Partial<Options>[]) {
    options.forEach(o => {
      this.options = {
        ...this.options,
        ...o
      };
    });
  }

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    const imports = this.getModuleImports(file.source);

    const errors = imports
      .filter(i => !this.isValidImport(file.packageDependencies, file.packageDevDependencies, i.path))
      .map(
        i =>
          new Failure(
            ruleName,
            file.filename,
            asBollLineNumber(i.lineNumber),
            `"${i.path}" is used as a module import, but not listed as a dependency. (Either add as a direct dependency or remove usage.)`
          )
      );

    return errors;
  }

  isValidImport(
    packageDependencies: Package["dependencies"],
    packageDevDependencies: Package["devDependencies"],
    importPath: string
  ): any {
    let validImports = Object.keys(packageDependencies || {}).concat(this.options.ignorePackages);

    if (this.options.allowDevDependencies) {
      validImports = validImports.concat(Object.keys(packageDevDependencies || {}));
    }
    return validImports.some(moduleName => importPath === moduleName || importPath.startsWith(`${moduleName}/`));
  }

  getModuleImports(sourceFile: SourceFile): ImportPathAndLineNumber[] {
    const importPaths: ImportPathAndLineNumber[] = [];
    let lineNumber = 1;
    sourceFile.forEachChild(n => {
      const totalLines = n.getFullText().split(/\r?\n/).length;
      lineNumber = lineNumber + totalLines - 1;
      if (isImportDeclaration(n)) {
        const path = this.getPathFromNode(n);
        if (!path.startsWith(".")) {
          importPaths.push({ path, lineNumber: lineNumber });
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
