import {
  asBollLineNumber,
  Failure,
  FileContext,
  Result,
  Success,
  PackageMetaRule,
  asBollFile,
  Package
} from "@boll/core";
import { ImportDeclaration, isImportDeclaration, isStringLiteral, SourceFile } from "typescript";

const ruleName = "UnusedDependencyDetector";
const exclude = ["@types"];

export interface UnusedDependencyDetectorOptions {
  exclude: string[];
  ignoreDevDependencies: boolean;
  packageContextOverride: Partial<Package>;
}

interface DependencyCount {
  [dependency: string]: number;
}

/**
 * UnusedDependencyDetector detects packages declared as dependencies
 * or devDependencies that are not imported anywhere in code.
 */
export class UnusedDependencyDetector implements PackageMetaRule {
  private _exclude: Set<string>;

  constructor(private options?: Partial<UnusedDependencyDetectorOptions>) {
    this._exclude = options && options.exclude ? new Set([...exclude, ...options.exclude]) : new Set(exclude);
  }

  get name(): string {
    return ruleName;
  }

  async check(files: FileContext[]): Promise<Result[]> {
    return this.checkPackageImports(
      files.map(f => this.getFilePackageImports(f.source)),
      files
    );
  }

  getFilePackageImports(sourceFile: SourceFile): string[] {
    const importPaths: string[] = [];
    sourceFile.forEachChild(n => {
      if (isImportDeclaration(n)) {
        const path = this.getPathFromNode(n);
        if (!path.startsWith(".")) {
          importPaths.push(path);
        }
      }
    });
    return importPaths;
  }

  checkPackageImports(packageImports: string[][], files: FileContext[]): Result[] {
    const { dependencies, devDependencies } = this.initializeDependencyCounts(files);
    packageImports.forEach(fi => {
      fi.forEach(i => {
        const packageName = this.getPackageNameFromImportPath(i);
        dependencies[packageName] !== undefined && dependencies[packageName]++;
        devDependencies[packageName] !== undefined && devDependencies[packageName]++;
      });
    });

    const results: Result[] = [
      ...Object.keys(dependencies)
        .filter(d => dependencies[d] === 0 && !this.isExcluded(d))
        .map(
          d =>
            new Failure(
              ruleName,
              asBollFile("package.json"),
              // TODO: Determine how to properly parse line number for package.json
              asBollLineNumber(0),
              `${d} is declared as a dependency in package.json but is not imported in code.`
            )
        ),
      ...Object.keys(devDependencies)
        .filter(
          d =>
            devDependencies[d] === 0 &&
            !this.isExcluded(d) &&
            ((this.options && !this.options.ignoreDevDependencies) || (!this.options && true))
        )
        .map(
          d =>
            new Failure(
              ruleName,
              asBollFile("package.json"),
              // TODO: Determine how to properly parse line number for package.json
              asBollLineNumber(0),
              `${d} is declared as a devDependency in package.json but is not imported in code.`
            )
        )
    ];
    return results.length ? results : [new Success(ruleName)];
  }

  private getPathFromNode(n: ImportDeclaration): string {
    if (isStringLiteral(n.moduleSpecifier)) {
      const moduleSpecifier = n.moduleSpecifier.getText();
      return moduleSpecifier.slice(1, moduleSpecifier.length - 1);
    }
    throw new Error(`Don't know how to parse import statement ${n.getText()}`);
  }

  private isExcluded(dep: string) {
    // This allows exclusions to be specified as a package name (e.g. foo or @foo/bar)
    // or just the first part of the package name (e.g. @types)
    return this._exclude.has(this.getPackageNameFromImportPath(dep)) || this._exclude.has(dep.split("/")[0]);
  }

  private getPackageNameFromImportPath(path: string) {
    return path
      .split("/")
      .slice(0, path.startsWith("@") ? 2 : 1)
      .join("/");
  }

  private initializeDependencyCounts(files: FileContext[]) {
    const dependencies: DependencyCount = {},
      devDependencies: DependencyCount = {};
    if (this.options && this.options.packageContextOverride) {
      Object.keys(this.options.packageContextOverride.dependencies || {}).forEach(d => (dependencies[d] = 0));
      Object.keys(this.options.packageContextOverride.devDependencies || {}).forEach(d => (devDependencies[d] = 0));
    } else {
      // Use use deps from first file since they all share the same package context
      const file = files[0];
      Object.keys(file.packageDependencies || {}).forEach(d => (dependencies[d] = 0));
      Object.keys(file.packageDevDependencies || {}).forEach(d => (devDependencies[d] = 0));
    }
    return { dependencies, devDependencies };
  }
}
