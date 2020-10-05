import { basename } from "path";
import { PackageRule, FileContext, asBollLineNumber, Result, Success, Failure, Logger } from "@boll/core";

/**
 * EnforceRationale ensures specified fields in package.json require a rationale for
 * any additions.
 */
const ruleName = "EnforceRationale";
export class EnforceRationaleRule implements PackageRule {
  constructor(private logger: Logger, private options?: any) {}

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (basename(file.filename) !== "package.json") {
      return [new Success(ruleName)];
    }

    if (!this.options || !this.options.fields) {
      return [new Success(ruleName)];
    }

    if (typeof this.options.fields !== "object") {
      return [
        new Failure(
          ruleName,
          file.filename,
          asBollLineNumber(0),
          `The "fields" option for rule ${ruleName} should be an array`
        )
      ];
    }

    const fields = this.options.fields as string[];
    const contents = JSON.parse(file.content);

    if (fields.length && !contents.rationale) {
      return [
        new Failure(ruleName, file.filename, asBollLineNumber(0), `package.json does not contain a "rationale" field`)
      ];
    }

    const failures: Failure[] = [];
    const rationale: { [key: string]: { [key: string]: string } } = contents.rationale;
    (this.options.fields as string[]).forEach(field => {
      const values = contents[field];
      Object.keys(values).forEach(value => {
        if (!rationale[field] || !rationale[field][value]) {
          failures.push(
            new Failure(
              ruleName,
              file.filename,
              asBollLineNumber(0),
              `No rationale was provided for ${field}.${value}.`
            )
          );
        }
      });
    });

    if (failures.length) {
      return failures;
    }

    return [new Success(ruleName)];
  }
}
