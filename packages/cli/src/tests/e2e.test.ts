import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { NullLogger } from "../lib/logger";
import { buildSuite } from "../main";
export const test = baretest("e2e");

test("should catch an error in project-a", async () => {
  await inFixtureDir("project-a", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-b", async () => {
  await inFixtureDir("project-b", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-c", async () => {
  await inFixtureDir("project-c", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-d", async () => {
  await inFixtureDir("project-d", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-e", async () => {
  await inFixtureDir("project-e", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(2, result.errors.length);
  });
});

test("should find no issues with clean-project", async () => {
  await inFixtureDir("clean", async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    console.log(result.errors);
    assert.strictEqual(0, result.errors.length);
  });
});
