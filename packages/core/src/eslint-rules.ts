import { ESLint } from "eslint";
import { BollFile } from "./boll-file";
import { BollDirectory } from "./boll-directory";
import { Logger, NullLogger } from "./logger";

export interface ESLintRulesOptions {
  resolvePluginsRelativeTo?: BollDirectory;
  logger?: Logger;
}

export class ESLintRules {
  private _eslint: ESLint;
  private _logger: Logger;

  constructor(options?: ESLintRulesOptions) {
    let eslintOptions = {};

    if (options && options.resolvePluginsRelativeTo) {
      eslintOptions = { resolvePluginsRelativeTo: options.resolvePluginsRelativeTo };
    }

    this._eslint = new ESLint(eslintOptions);
    this._logger = options && options.logger ? options.logger : NullLogger;
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
