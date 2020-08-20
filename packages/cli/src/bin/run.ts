import { Cli } from "../cli";
import { Suite } from "../suite";
import { DefaultLogger } from "../logger";

const suite = new Suite();
const cli = new Cli(DefaultLogger, suite);
cli.run(process.argv.slice(2));
