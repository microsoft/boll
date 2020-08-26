import { Cli, Status } from "../cli";
import { DefaultLogger } from "../lib/logger";

const cli = new Cli(DefaultLogger);
async function doStuff() {
  const result = await cli.run(process.argv.slice(2));
  if (result !== Status.Ok) {
    console.error("Failure!");
    process.exit(1);
  }
}
doStuff();
