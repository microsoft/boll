import { Cli, Status } from "../cli";
import { Suite } from "../lib/suite";
import { DefaultLogger } from "../lib/logger";

const suite = new Suite();
const cli = new Cli(DefaultLogger, suite);
async function doStuff() {
  const result = await cli.run(process.argv.slice(2));
  if (result !== Status.Ok) {
    console.error("Failure!");
    process.exit(1);
  }
}
doStuff();
