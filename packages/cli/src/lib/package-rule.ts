import { FileContext } from "./file-context";
import { Result } from "./result-set";

export interface PackageRule {
  check(file: FileContext): Result[];
}
