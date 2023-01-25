import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { CheckSeverity, FileGlob, PackageMetaRule, PackageRule } from "./types";
import { Logger } from "./logger";

export interface InstantiatedRule {
  name: string;
  severity: CheckSeverity;
}

export interface RuleOptions {
  logger: Logger;
  [key: string]: string | Logger;
}

export class BasePackageRule<T> {
  constructor(public name: string, public severity: CheckSeverity, public rule: T, public options?: RuleOptions) {}
}

export class InstantiatedPackageRule extends BasePackageRule<PackageRule> implements InstantiatedRule {
  check(file: FileContext): Promise<Result[]> {
    return this.rule.check(file, this.options);
  }
}

export class InstantiatedPackageMetaRule extends BasePackageRule<PackageMetaRule> implements InstantiatedRule {
  check(files: FileContext[]): Promise<Result[]> {
    return this.rule.check(files, this.options);
  }
}

export class RuleSet {
  constructor(
    public fileGlob: FileGlob,
    public fileChecks: InstantiatedPackageRule[],
    public metaChecks: InstantiatedPackageMetaRule[]
  ) {}
}
