import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { CheckSeverity, FileGlob, PackageMetaRule, PackageRule } from "./types";

export interface InstantiatedRule {
  name: string;
  severity: CheckSeverity;
}

export class InstantiatedPackageRule implements InstantiatedRule {
  constructor(public name: string, public severity: CheckSeverity, public rule: PackageRule) {}

  check(file: FileContext): Promise<Result[]> {
    return this.rule.check(file);
  }
}

export class InstantiatedPackageMetaRule implements InstantiatedRule {
  constructor(public name: string, public severity: CheckSeverity, public rule: PackageMetaRule) {}

  check(files: FileContext[]): Promise<Result[]> {
    return this.rule.check(files);
  }
}

export class RuleSet {
  constructor(
    public fileGlob: FileGlob,
    public fileChecks: InstantiatedPackageRule[],
    public metaChecks: InstantiatedPackageMetaRule[]
  ) {}
}
