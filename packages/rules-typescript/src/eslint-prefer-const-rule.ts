import { PackageRule, FileContext, asBollFile, asBollLineNumber, Result, Success, Failure } from "@boll/core";

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
