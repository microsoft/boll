import baretest from "baretest";
import * as assert from "assert";
import { Suite } from "../suite";
import { NullLogger } from "../logger";
import { promisify } from "util";
import { exists } from "fs";
import { inFixtureDir } from "./test-helper";
const existsAsync = promisify(exists);

export const test = baretest("e2e (project-a)");

const suite = new Suite();

test("should create example config file when invoked with `init`", async () => {
  await inFixtureDir("project-a", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(1, result.errors.length);
  });
});
