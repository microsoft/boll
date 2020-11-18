import { extname } from "path";
import { PackageRule, FileContext, asBollLineNumber, Result, Success, Failure } from "@boll/core";

export interface EnforceRationaleOptions {
  [file: string]: string[];
}

const defaultOptions: EnforceRationaleOptions = {};

const ruleName = "EnforceRationale";

/**
 * EnforceRationale ensures specified fields in package.json require a rationale for
 * any additions.
 */
export class EnforceRationale implements PackageRule {
  constructor(private options: EnforceRationaleOptions = defaultOptions) {}

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (extname(file.filename) !== ".json") {
      return [new Success(ruleName)];
    }

    if (!Object.keys(this.options).length) {
      return [new Success(ruleName)];
    }

    const failures: Result[] = [];

    if (this.options[file.relativeFilename]) {
      const fields = this.options[file.relativeFilename];
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
        const isPrimitiveArray = Array.isArray(entries) && entries.every(v => typeof v !== "object");
        const isObjectArray = Array.isArray(entries) && entries.every(v => typeof v === "object");
        if (entries) {
          if (isPrimitiveArray) {
            (entries as any[]).forEach(v => {
              if (!rationaleEntries || !rationaleEntries[v]) {
                failures.push(
                  new Failure(
                    ruleName,
                    file.filename,
                    asBollLineNumber(0),
                    `No rationale provided for ${f} entry "${v}" in ${file.filename}`
                  )
                );
              }
            });
          } else if (isObjectArray) {
            (entries as any[]).forEach((v, i) => {
              if (!v["rationale"]) {
                failures.push(
                  new Failure(
                    ruleName,
                    file.filename,
                    asBollLineNumber(0),
                    `No rationale provided for ${f} entry at index ${i}" in ${file.filename}`
                  )
                );
              }
            });
          } else {
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
        }
      });
      return failures.length ? failures : [new Success(ruleName)];
    }
    return [new Success(ruleName)];
  }

  private getEntriesForField(contents: any, field: string) {
    const fieldParts = field.split(".");
    let entries = contents && contents[fieldParts[0]];

    // Try to deference the field first
    for (let i = 1; i < fieldParts.length; i++) {
      if (!entries) {
        break;
      }
      entries = entries[fieldParts[i]];
    }

    // If no entries found, try seeing if contents contains the whole field name
    if (!entries) {
      entries = contents && contents[field];
    }

    return entries;
  }
}
