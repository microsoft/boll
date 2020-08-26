import { FileContext } from "./file-context";
import { Result } from "./result-set";

export interface CheckConfiguration {
  rule: string;
  options?: {};
}

export interface ConfigDefinition {
  name?: string;
  checks?: CheckConfiguration[];
  extends?: string;
}

export interface PackageRule {
  check(file: FileContext): Result[];
}
