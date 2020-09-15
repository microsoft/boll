import { PackageRule } from "../lib/types";
import { Result, Success, Failure } from "../lib/result-set";
import { asBollFile } from "../lib/boll-file";
import { asBollLineNumber } from "../lib/boll-line-number";
import { FileContext } from "../lib/file-context";

/**
 * ESLintPreferConstRule will esnure that the prefer-const
 * ESLint rule is enabled on all source files and that the
 * rule is enabled as an error.
 */
const ruleName = "ESLintPreferConstRule";
export class ESLintPreferConstRule implements PackageRule {
  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    const resultSet: Result[] = [];
    const filename = asBollFile(file.filename);
    const config = await file.eslintConfig;
    const preferConst = config && config.rules && config.rules["prefer-const"];

    if (preferConst) {
      if (preferConst[0] === "error" || preferConst[0] === 2) {
        resultSet.push(new Success(ruleName));
      } else {
        resultSet.push(
          new Failure(
            ruleName,
            filename,
            asBollLineNumber(0),
            `prefer-const rule exists but at level "${preferConst[0]}" instead of "error"`
          )
        );
      }
    } else {
      resultSet.push(new Failure(ruleName, filename, asBollLineNumber(0), "prefer-const ESLint rule is not enabled"));
    }

    return resultSet;
  }
}
