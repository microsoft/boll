import { extname } from "path";
import { PackageRule, FileContext, asBollLineNumber, Result, Success, Failure, BollDirectory } from "@boll/core";
import * as path from "path";

export interface PackageConsistencyOptions {
  checkPrivatePackage: boolean;
  checkDirectoryName: boolean;
}

const defaultOptions: PackageConsistencyOptions = {
  checkPrivatePackage: true,
  checkDirectoryName: true
};

const ruleName = "PackageConsistency";

/**
 * PackageConsistency ensures
 * - Package name should match package directory name.
 * - Packages must specify version
 * - Packages should be private by default
 */
export class PackageConsistency implements PackageRule {
  options: PackageConsistencyOptions;

  constructor(options: Partial<PackageConsistencyOptions> = defaultOptions) {
    this.options = { ...defaultOptions, ...options };
  }

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (extname(file.filename) !== ".json") {
      return [];
    }
    const failures: Result[] = [];
    const contents = JSON.parse(file.content);
    if (!contents.version) {
      failures.push(new Failure(ruleName, file.filename, asBollLineNumber(0), `Missing a "version" field.`));
    }

    if (this.options.checkPrivatePackage && !contents.private) {
      failures.push(
        new Failure(ruleName, file.filename, asBollLineNumber(0), `Should specify "private" field to true.`)
      );
    }

    if (this.options.checkDirectoryName && !this.doNamesAlign(contents.name, file.packageRoot)) {
      failures.push(
        new Failure(ruleName, file.filename, asBollLineNumber(0), `Package name should match directory name`)
      );
    }

    return failures;
  }

  doNamesAlign(name: string, packageRoot: BollDirectory): boolean {
    const packageNameParts = name.split("/");
    const packageBaseName = packageNameParts[packageNameParts.length - 1];
    const directoryBasename = path.basename(packageRoot);
    return packageBaseName === directoryBasename;
  }
}
