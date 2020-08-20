import baretest from "baretest";
import * as assert from "assert";
import { Cli } from "../cli";
import { Suite } from "../lib/suite";
import { NullLogger } from "../lib/logger";
import { promisify } from "util";
import os from "os";
import path from "path";
import { exists } from "fs";
import { inTmpDir } from "./test-helper";
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
