import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "@boll/test-internal";
import { buildSuite } from "@boll/cli/dist/main";
import { NullLogger } from "@boll/core";
import { bootstrapRecommendedConfiguration } from "@boll/recommended";
export const test: any = baretest("e2e");

test("should catch an error in project-a", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-b", async () => {
  await inFixtureDir("project-b", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-c", async () => {
  await inFixtureDir("project-c", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-d", async () => {
  await inFixtureDir("project-d", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(1, result.errors.length);
  });
});

test("should catch an error in project-e", async () => {
  await inFixtureDir("project-e", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);
    assert.strictEqual(2, result.errors.length);
  });
});

test("should catch an error in monorepo", async () => {
  await inFixtureDir("monorepo", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);

    assert.ok(result.errors[0].formattedMessage.includes("No boll config"));
    assert.ok(result.errors[1].formattedMessage.includes('No "lint" script found'));

    assert.strictEqual(2, result.errors.length);
  });
});

test("should find no issues with clean-project", async () => {
  await inFixtureDir("clean", __dirname, async () => {
    const suite = await buildSuite(NullLogger);
    const result = await suite.run(NullLogger);

    assert.strictEqual(
      0,
      result.errors.length,
      result.errors.length > 0 ? result.errors[0].formattedMessage : "everything is ok!"
    );
  });
});
