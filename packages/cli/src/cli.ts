import * as fs from "fs";
import { bootstrapConfigurations } from "./config/bootstrap";
import { Config } from "./lib/config";
import { ConfigGenerator } from "./config-generator";
import { ConfigRegistryInstance } from "./lib/config-registry";
import { Logger } from "./lib/logger";
import { RuleRegistryInstance } from "./lib/rule-registry";
import { Suite } from "./lib/suite";
import { ArgumentParser } from "argparse";
import { promisify } from "util";
import { resolve } from "path";
import { configFileName } from "./lib/constants";
const fileExistsAsync = promisify(fs.exists);

const parser = new ArgumentParser({ description: "@boll/cli" });
const subParser = parser.addSubparsers({
  description: "commands",
  dest: "command",
});
subParser.addParser("run");
subParser.addParser("init");

type ParsedCommand = {
  command: "run" | "init";
};

export enum Status {
  Ok,
  Error,
}

export class Cli {
  constructor(private logger: Logger) {}

  async run(args: string[]): Promise<Status> {
    const parsedCommand: ParsedCommand = parser.parseArgs(args);
    if (parsedCommand.command === "run") {
      const suite = await this.buildSuite();
      const result = await suite.run(this.logger);
      result.errors.forEach((e) => {
        this.logger.error(e.formattedMessage);
      });
      if (result.hasErrors) {
        return Status.Error;
      }
      return Status.Ok;
    }
    if (parsedCommand.command === "init") {
      await ConfigGenerator.run();
      return Status.Ok;
    }
    return Status.Error;
  }

  private async buildSuite(): Promise<Suite> {
    const fullConfigPath = resolve(configFileName);
    const exists = await fileExistsAsync(fullConfigPath);
    if (!exists) {
      this.logger.error(`Unable to find ${fullConfigPath}; consider running "init" to create example config.`);
    }
    bootstrapConfigurations();
    const config = new Config(ConfigRegistryInstance, RuleRegistryInstance);
    config.load(require(fullConfigPath));
    return config.buildSuite();
  }
}
