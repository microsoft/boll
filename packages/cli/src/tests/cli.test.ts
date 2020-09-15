import * as assert from "assert";
import baretest from "baretest";
import { inTmpDir } from "./test-helper";
import { Cli } from "../cli";
import { exists } from "fs";
import { NullLogger } from "@boll/core";
import { promisify } from "util";
const existsAsync = promisify(exists);

export const test: any = baretest("CLI");

test("should create example config file when invoked with `init`", async () => {
  await inTmpDir(async () => {
    const configExistsPrecondition = await existsAsync("boll.config.js");
    assert.strictEqual(false, configExistsPrecondition);

    const sut = new Cli(NullLogger);
    await sut.run(["init"]);

    const configExistsExpected = await existsAsync(".boll.config.js");
    assert.strictEqual(true, configExistsExpected);
  });
});
