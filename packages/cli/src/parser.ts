import { ArgumentParser } from "argparse";

export const parser = new ArgumentParser({ description: "@boll/cli" });
parser.addArgument("--azure-devops", { help: "Enable Azure DevOps pipeline output formatter.", action: "storeTrue" });

const subParser = parser.addSubparsers({
  description: "commands",
  dest: "command"
});

subParser.addParser("init");

const runParser = subParser.addParser("run");
runParser.addArgument("--groupBy", {
  help: "Group results by rule name or registry name",
  choices: ["rule", "registry", "none"],
  defaultValue: "none"
});

export type ParsedCommand = {
  azure_devops: boolean;
  command: "run" | "init";
  groupBy: "rule" | "registry" | "none";
};
