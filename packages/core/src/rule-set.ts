import { FileContext } from "./file-context";
import { Result } from "./result-set";
import { CheckSeverity, FileGlob, PackageRule } from "./types";

export class InstantiatedPackageRule {
  constructor(public name: string, public severity: CheckSeverity, public rule: PackageRule) {}

  check(file: FileContext): Promise<Result[]> {
    return this.rule.check(file);
  }
}

export class RuleSet {
  constructor(public fileGlob: FileGlob, public checks: InstantiatedPackageRule[]) {}
}
