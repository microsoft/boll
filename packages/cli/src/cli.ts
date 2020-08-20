import { ArgumentParser } from "argparse";
import { Suite } from "./suite";

const parser = new ArgumentParser({ description: "@boll/cli" });
const subParser = parser.addSubparsers({
  description: "commands",
  dest: "command",
});
const runParser = subParser.addParser("run");

type Logger = (msg: string) => void;
type ParsedCommand = {
  command: "run";
};
export class Cli {
  constructor(private logger: Logger, private suite: Suite) {}

  run(args: string[]): void {
    const parsedCommand: ParsedCommand = parser.parseArgs(args);
    if (parsedCommand.command === "run") {
      this.suite.run(this.logger);
    }
  }
}
