import glob from "glob";
import { promisify } from "util";
import { ConfigRuleBase } from "./config-rule-base";
import { EslintConfig } from "../types/eslint-config";
import { asBollDirectory } from "./boll-directory";
const globAsync = promisify(glob);

// export interface EslintRuleOptions {
//   packageDirectories: string[];
// }

// const optionsFields = ["packageDirectories"];

// function parseEslintRuleOptions(options: any, optionsFields: string[]): EslintRuleOptions {
//   const missingField = optionsFields.find((f) => !options[f]);
//   if (missingField) {
//     throw new Error(`Eslint rule options is missing required field ${missingField}`);
//   }
//   return {
//     packageDirectories: options["packageDirectories"],
//   };
// }

async function getEslintConfigFiles() {
  return await globAsync("./**/.eslintrc*");
}

export class EslintRuleBase extends ConfigRuleBase {
  constructor() {
    // const parsedOptions = parseEslintRuleOptions(options, optionsFields);
    const paths = globAsync("./**/.eslintrc*");
    super(paths);
    this.doSomething();
  }

  async doSomething() {
    const data = (await this._rawData) as EslintConfig;
  }

  async searchToProjectRoot() {}
}
