import baretest from "baretest";
import * as assert from "assert";
import { Cli } from "./cli";
import { Suite } from "./suite";
export const test = baretest("CLI");

const logger = (msg: string) => {};
const suite = new Suite();

/* handled by argparse, difficult to test as well.
test("should display help message when invoked with --help", () => {
  let printed = "nothing printed";
  const helpLogger = (msg: string) => {
    printed = msg;
  };
  const sut = new Cli(helpLogger, suite);
  sut.run(["--help"]);
  assert.notEqual(printed, "nothing printed");
});
*/

test("should run lint suite when invoked with `run`", () => {
  const lintSuite = new Suite();
  const sut = new Cli(logger, lintSuite);
  sut.run(["run"]);
  assert.equal(true, lintSuite.hasRun);
});

test("should create example config file when invoked with `init`", () => {});
