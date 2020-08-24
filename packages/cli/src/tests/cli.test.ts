import * as assert from "assert";
import baretest from "baretest";
import { inTmpDir } from "./test-helper";
import { Cli } from "../cli";
import { NullLogger } from "../lib/logger";
import { Suite } from "../lib/suite";
import { exists } from "fs";
import { promisify } from "util";
const existsAsync = promisify(exists);

export const test = baretest("CLI");

const suite = new Suite();

test("should run lint suite when invoked with `run`", async () => {
  const lintSuite = new Suite();
  const sut = new Cli(NullLogger, lintSuite);
  await sut.run(["run"]);
  assert.equal(true, lintSuite.hasRun);
});

test("should create example config file when invoked with `init`", async () => {
  await inTmpDir(async () => {
    const configExistsPrecondition = await existsAsync("boll.config.js");
    assert.equal(false, configExistsPrecondition);

    const sut = new Cli(NullLogger, suite);
    await sut.run(["init"]);

    const configExistsExpected = await existsAsync(".boll.config.js");
    assert.equal(true, configExistsExpected);
  });
});
