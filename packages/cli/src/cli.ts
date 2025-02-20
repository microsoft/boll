import * as fs from "fs";
import { ConfigGenerator } from "./config-generator";
import {
  Config,
  configFileName,
  ConfigRegistryInstance,
  Logger,
  ResultSet,
  RuleRegistryInstance,
  RuleResult,
  GroupedResult,
  Suite
} from "@boll/core";
import { promisify } from "util";
import { resolve } from "path";
import { Formatter } from "./lib/formatter";
import { DefaultFormatter } from "./lib/default-formatter";
import { VsoFormatter } from "./lib/vso-formatter";
import { ParsedCommand, parser } from "./parser";
const fileExistsAsync = promisify(fs.exists);

export enum Status {
  Ok,
  Error,
  Warn
}

export class Cli {
  constructor(private logger: Logger) {}

  async run(args: string[]): Promise<Status> {
    const parsedCommand: ParsedCommand = parser.parseArgs(args);
    const formatter: Formatter = parsedCommand.azure_devops ? new VsoFormatter() : new DefaultFormatter();
    if (parsedCommand.command === "run") {
      const suite = await this.buildSuite();
      const result = await suite.run(this.logger);

      if (parsedCommand.groupBy === "none") {
        this.logResults(result, formatter);
      } else {
        const groupedResult =
          parsedCommand.groupBy === "rule" ? result.getResultsByRule() : result.getResultsByRegistry();
        this.logGroupedResults(groupedResult, formatter);
      }

      if (result.hasErrors) {
        this.logger.error(formatter.finishWithErrors());
        return Status.Error;
      }
      if (result.hasWarnings) {
        this.logger.warn(formatter.finishWithWarnings());
        return Status.Warn;
      }

      return Status.Ok;
    }
    if (parsedCommand.command === "init") {
      await ConfigGenerator.run();
      return Status.Ok;
    }
    return Status.Error;
  }

  private logResults(result: Record<"errors" | "warnings", RuleResult[]>, formatter: Formatter) {
    result.errors.forEach(e => {
      this.logger.error(formatter.error(e.formattedMessage));
    });
    result.warnings.forEach(e => {
      this.logger.warn(formatter.warn(e.formattedMessage));
    });
  }

  private logGroupedResults(result: GroupedResult, formatter: Formatter) {
    const groups = Object.keys(result);
    groups.forEach(entry => {
      this.logger.log("\n" + "🔽 " + entry);
      this.logResults(result[entry], formatter);
    });
  }

  private async buildSuite(): Promise<Suite> {
    const fullConfigPath = resolve(configFileName);
    const exists = await fileExistsAsync(fullConfigPath);
    if (!exists) {
      this.logger.error(`Unable to find ${fullConfigPath}; consider running "init" to create example config.`);
    }
    const config = new Config(ConfigRegistryInstance, RuleRegistryInstance, this.logger);
    config.load(this.getConfig(fullConfigPath));
    return await config.buildSuite();
  }

  private getConfig(filename: string): Record<string, any> {
    const contents = fs.readFileSync(resolve(filename), "utf-8");
    return JSON.parse(contents);
  }
}
