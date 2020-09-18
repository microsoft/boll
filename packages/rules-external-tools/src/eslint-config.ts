import { BollDirectory, BollFile, Logger } from "@boll/core";
import { ESLint } from "eslint";

export interface ESLintRulesOptions {
  resolvePluginsRelativeTo?: BollDirectory;
  logger: Logger;
}

export class ESLintRules {
  private _eslint: ESLint;
  private _logger: Logger;

  constructor(options: ESLintRulesOptions) {
    let eslintOptions = {};

    if (options && options.resolvePluginsRelativeTo) {
      eslintOptions = { resolvePluginsRelativeTo: options.resolvePluginsRelativeTo };
    }

    this._eslint = new ESLint(eslintOptions);
    this._logger = options.logger;
  }

  public async getSourceFileConfig(file: BollFile) {
    try {
      return await this._eslint.calculateConfigForFile(file);
    } catch (err) {
      this._logger.warn(
        `Error encountered trying to get ESLint config for file ${file}. Please check to make sure that an ESLint configuration file was provided for this project.`
      );
      this._logger.warn(`\tFull error:\n\t${err}`);
      return undefined;
    }
  }
}
