import { Cli, Status } from "../cli";
import { DefaultLogger } from "@boll/core";

async function doStuff() {
  const cli = new Cli(DefaultLogger);
  const result = await cli.run(process.argv.slice(2));
  if (result === Status.Error) {
    process.exit(1);
  }
}
doStuff();
