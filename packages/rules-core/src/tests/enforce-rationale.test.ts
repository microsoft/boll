import * as assert from "assert";
import baretest from "baretest";
import { NoRedundantDepsRule } from "../no-redundant-deps";
import { asBollDirectory, getSourceFile, NullLogger, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";
import { EnforceRationaleRule } from "../enforce-rationale";

export const test: any = baretest("Enforce Rationale");

const emptyPackageContentsStub = { dependencies: {} };

test("Passes when valid rationale is provided", async () => {
  await inFixtureDir("valid-rationale", __dirname, async () => {
    const sut = new EnforceRationaleRule(NullLogger, { fields: ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.success);
  });
});

test("Fails when an a rationale not provided for certain fields", async () => {
  await inFixtureDir("invalid-rationale", __dirname, async () => {
    const sut = new EnforceRationaleRule(NullLogger, { fields: ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 5);
    result.forEach(r => assert.strictEqual(r.status, ResultStatus.failure));
  });
});

test("Fails if no rationale field exists", async () => {
  await inFixtureDir("no-rationale", __dirname, async () => {
    const sut = new EnforceRationaleRule(NullLogger, { fields: ["a", "b", "c"] });
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.failure);
  });
});
