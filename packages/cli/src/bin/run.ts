import { Cli } from "../cli";
import { Suite } from "../suite";

const suite = new Suite();
const cli = new Cli(console.log, suite);
cli.run(process.argv.slice(2));
