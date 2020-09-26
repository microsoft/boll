import { PackageRule, FileContext, asBollFile, asBollLineNumber, Result, Success, Failure, Logger } from "@boll/core";
<<<<<<< HEAD:packages/rules-external-tools/src/eslint-prefer-const-rule.ts
import { ESLintRules } from "./eslint-config";

const ruleName = "ESLintPreferConstRule";
=======
import { ESLint } from "eslint";
import { ESLintRules } from "./eslint-config";
>>>>>>> main:packages/rules-typescript/src/eslint-prefer-const-rule.ts

/**
 * ESLintPreferConstRule will esnure that the prefer-const
 * ESLint rule is enabled on all source files and that the
 * rule is enabled as an error.
 */
export class ESLintPreferConstRule implements PackageRule {
  configLoader: ESLintRules;
  constructor(private logger: Logger) {
    this.configLoader = new ESLintRules({ logger });
  }

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    const resultSet: Result[] = [];
    const config = await this.configLoader.getSourceFileConfig(file.filename);
    const preferConst = config && config.rules && config.rules["prefer-const"];

    if (preferConst) {
      if (preferConst[0] === "error" || preferConst[0] === 2) {
        resultSet.push(new Success(ruleName));
      } else {
        resultSet.push(
          new Failure(
            ruleName,
            file.filename,
            asBollLineNumber(0),
            `prefer-const rule exists but at level "${preferConst[0]}" instead of "error"`
          )
        );
      }
    } else {
      resultSet.push(
        new Failure(ruleName, file.filename, asBollLineNumber(0), "prefer-const ESLint rule is not enabled")
      );
    }

    return resultSet;
  }
}
