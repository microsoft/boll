import { Cli, Status } from "../cli";
import { DefaultLogger } from "@boll/core";

const cli = new Cli(DefaultLogger);
async function doStuff() {
  const result = await cli.run(process.argv.slice(2));
  if (result !== Status.Ok) {
    console.error("@boll/cli detected lint errors");
    process.exit(1);
  }
}
doStuff();
