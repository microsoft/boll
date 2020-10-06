import { extname } from "path";
import { PackageRule, FileContext, asBollLineNumber, Result, Success, Failure, Logger } from "@boll/core";

export interface EnforceRationaleRuleOptions {
  [file: string]: string[];
}

const ruleName = "EnforceRationale";

/**
 * EnforceRationale ensures specified fields in package.json require a rationale for
 * any additions.
 */
export class EnforceRationaleRule implements PackageRule {
  constructor(private logger: Logger, private options?: EnforceRationaleRuleOptions) {}

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (extname(file.filename) !== ".json") {
      return [new Success(ruleName)];
    }

    if (!this.options) {
      return [new Success(ruleName)];
    }

    const failures: Result[] = [];
    const fileKey = file.filename.slice(process.cwd().length + 1);

    if (this.options[fileKey]) {
      const fields = this.options[fileKey];
      const contents = JSON.parse(file.content);
      const rationale = contents.rationale;

      if (fields.some(f => contents[f] && Object.keys(contents[f])) && !rationale) {
        failures.push(
          new Failure(
            ruleName,
            file.filename,
            asBollLineNumber(0),
            `${file.filename} does not contain a "rationale" field`
          )
        );
        return failures;
      }

      fields.forEach(f => {
        const entries = this.getEntriesForField(contents, f);
        const rationaleEntries = this.getEntriesForField(rationale, f);
        if (entries) {
          Object.keys(entries).forEach(k => {
            if (!rationaleEntries || !rationaleEntries[k]) {
              failures.push(
                new Failure(
                  ruleName,
                  file.filename,
                  asBollLineNumber(0),
                  `No rationale provided for ${f}.${k} in ${file.filename}`
                )
              );
            }
          });
        }
      });
      return failures.length ? failures : [new Success(ruleName)];
    }
    return [new Success(ruleName)];
  }

  private getEntriesForField(contents: any, field: string) {
    const fieldParts = field.split(".");
    let entries = contents && contents[fieldParts[0]];
    for (let i = 1; i < fieldParts.length; i++) {
      if (!entries) {
        break;
      }
      entries = entries[fieldParts[i]];
    }
    return entries;
  }
}
