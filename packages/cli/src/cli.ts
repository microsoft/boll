import { ConfigGenerator } from "./config-generator";
import { Logger, RuleResult, GroupedResult } from "@boll/core";
import { Formatter } from "./lib/formatter";
import { DefaultFormatter } from "./lib/default-formatter";
import { VsoFormatter } from "./lib/vso-formatter";
import { ParsedCommand, parser } from "./parser";
import { buildSuite } from "./main";

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
      const suite = await buildSuite(this.logger);
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
}
