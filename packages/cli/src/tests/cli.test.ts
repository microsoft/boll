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

test("should create example config file when invoked with `init`", async () => {
  await inTmpDir(async () => {
    const configExistsPrecondition = await existsAsync("boll.config.js");
    assert.equal(false, configExistsPrecondition);

    const sut = new Cli(NullLogger);
    await sut.run(["init"]);

    const configExistsExpected = await existsAsync(".boll.config.js");
    assert.equal(true, configExistsExpected);
  });
});
