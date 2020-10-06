import * as assert from "assert";
import baretest from "baretest";
import { EnforceRationale } from "../enforce-rationale";
import { asBollDirectory, getSourceFile, NullLogger, Result, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

export const test: any = baretest("Enforce Rationale");

const emptyPackageContentsStub = { dependencies: {} };

test("Passes when valid rationale is provided", async () => {
  await inFixtureDir("rationale", __dirname, async () => {
    const sut = new EnforceRationale(NullLogger, { "valid-rationale.json": ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "valid-rationale.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.success);
  });
});

test("Fails when a rationale not provided for certain fields", async () => {
  await inFixtureDir("rationale", __dirname, async () => {
    const sut = new EnforceRationale(NullLogger, { "invalid-rationale.json": ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "invalid-rationale.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 5);
    result.forEach(r => assert.strictEqual(r.status, ResultStatus.failure));
  });
});

test("Fails if no rationale field exists", async () => {
  await inFixtureDir("rationale", __dirname, async () => {
    const sut = new EnforceRationale(NullLogger, { "no-rationale.json": ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "no-rationale.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.failure);
  });
});

test("Comprehensive test with multiple checked files", async () => {
  await inFixtureDir("rationale", __dirname, async () => {
    const options = {
      "1.json": ["a", "b", "c"],
      "2.json": ["a", "b", "d.a", "d.b.c"],
      "3.json": ["a", "b", "c"],
      "4.json": ["a", "b", "c"]
    };
    const sut = new EnforceRationale(NullLogger, options);
    const files = [...Object.keys(options), "5.json"];
    const successes: Result[] = [];
    const failures: Result[] = [];
    for (const file of files) {
      const source = await getSourceFile(asBollDirectory("."), file, emptyPackageContentsStub);
      const result = await sut.check(source);
      result.forEach(r => (r.status === ResultStatus.success ? successes.push(r) : failures.push(r)));
    }
    assert.strictEqual(successes.length, 3);
    assert.strictEqual(failures.length, 7);
  });
});
