import { FileGlob, PackageRule } from "./types";

export class RuleSet {
  constructor(public fileGlob: FileGlob, public checks: PackageRule[]) {}
}
