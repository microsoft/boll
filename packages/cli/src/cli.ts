import { ArgumentParser } from "argparse";
import { Suite } from "./lib/suite";
import { Logger } from "./lib/logger";
import { ConfigGenerator } from "./config-generator";

const parser = new ArgumentParser({ description: "@boll/cli" });
const subParser = parser.addSubparsers({
  description: "commands",
  dest: "command",
});
const runParser = subParser.addParser("run");
const initParser = subParser.addParser("init");

type ParsedCommand = {
  command: "run" | "init";
};

export enum Status {
  Ok,
  Error,
}

export class Cli {
  constructor(private logger: Logger, private suite: Suite) {}

  async run(args: string[]): Promise<Status> {
    const parsedCommand: ParsedCommand = parser.parseArgs(args);
    if (parsedCommand.command === "run") {
      const result = await this.suite.run(this.logger);
      result.errors.forEach((e) => {
        this.logger.error(e.text);
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
}
