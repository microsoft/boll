import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { NoRedundantDepsRule } from "../no-redundant-deps";
import { asBollDirectory, getSourceFile, NullLogger, ResultStatus } from "@boll/core";

export const test: any = baretest("NoRedundantDepsTest");

const sut = new NoRedundantDepsRule(NullLogger);
const emptyPackageContentsStub = { dependencies: {} };

test("passes when no peerDeps present", async () => {
  await inFixtureDir("simple", async () => {
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.success);
  });
});

test("passes when no overlap between dependencies and peerDeps", async () => {
  await inFixtureDir("complex", async () => {
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.success);
  });
});

test("fails when overlap between dependencies and peerDeps", async () => {
  await inFixtureDir("redundant", async () => {
    const source = await getSourceFile(asBollDirectory("."), "package.json", emptyPackageContentsStub);
    const result = await sut.check(source);
    assert.strictEqual(result.length, 1);
    assert.strictEqual(result[0].status, ResultStatus.failure);
  });
});
