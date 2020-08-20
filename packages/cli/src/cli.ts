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
export class Cli {
  constructor(private logger: Logger, private suite: Suite) {}

  async run(args: string[]): Promise<void> {
    const parsedCommand: ParsedCommand = parser.parseArgs(args);
    if (parsedCommand.command === "run") {
      await this.suite.run(this.logger);
    }
    if (parsedCommand.command === "init") {
      await ConfigGenerator.run();
    }
  }
}
