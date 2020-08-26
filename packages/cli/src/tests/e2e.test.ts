import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { NullLogger } from "../lib/logger";
import { Suite } from "../lib/suite";
export const test = baretest("e2e");

const suite = new Suite();

test("should catch an error in project-a", async () => {
  await inFixtureDir("project-a", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(1, result.errors.length);
  });
});

test("should catch an error in project-b", async () => {
  await inFixtureDir("project-b", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(1, result.errors.length);
  });
});

test("should catch an error in project-c", async () => {
  await inFixtureDir("project-c", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(1, result.errors.length);
  });
});

test("should catch an error in project-d", async () => {
  await inFixtureDir("project-d", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(1, result.errors.length);
  });
});

test("should catch an error in project-e", async () => {
  await inFixtureDir("project-e", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(2, result.errors.length);
  });
});

test("should find no issues with clean-project", async () => {
  await inFixtureDir("clean", async () => {
    const result = await suite.run(NullLogger);
    assert.equal(0, result.errors.length);
  });
});
