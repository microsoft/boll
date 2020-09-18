import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { buildSuite } from "@boll/cli/dist/main";
import { NullLogger } from "@boll/core";
import { bootstrapRecommendedConfiguration } from '@boll/recommended'
export const test: any = baretest("e2e");

test.before(async () => {
  bootstrapRecommendedConfiguration();
})

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
    assert.strictEqual(0, result.errors.length);
  });
});
