import { Cli } from "../cli";
import { Suite } from "../lib/suite";
import { DefaultLogger } from "../lib/logger";

const suite = new Suite();
const cli = new Cli(DefaultLogger, suite);
cli.run(process.argv.slice(2));
