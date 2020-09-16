import { asBollLineNumber, Failure, FileContext, PackageRule, Result, Success } from "@boll/core";

const ruleName = "TSLintNoNamespaceRule";

/**
 * TSLintNoNamespaceRule will esnure that the no-namespace
 * TSLint rule is enabled on all source files and that the
 * rule is enabled as an error.
 */
export class TSLintNoNamespaceRule implements PackageRule {
  get name(): string {
    return ruleName;
  }

  check(fileContext: FileContext): Result[] {
    const config = fileContext.tslintConfig;
    if (!config)
      return [
        new Failure(
          ruleName,
          fileContext.filename,
          asBollLineNumber(0),
          "Could not find a valid TSLint config for file"
        )
      ];
    const ruleOptions = config.rules.get("no-namespace");
    if (!ruleOptions)
      return [
        new Failure(
          ruleName,
          fileContext.filename,
          asBollLineNumber(0),
          `No rule called "no-namespace" was found in the TSLint config`
        )
      ];
    const isRuleEnabled = ruleOptions.ruleSeverity && ruleOptions.ruleSeverity === "error";
    if (!isRuleEnabled)
      return [
        new Failure(
          ruleName,
          fileContext.filename,
          asBollLineNumber(0),
          `Rule severity set to "${ruleOptions.ruleSeverity}" instead of "error"`
        )
      ];
    return [new Success(ruleName)];
  }
}
