import * as assert from "assert";
import baretest from "baretest";
import { RedundantImportsDetector } from "../redundant-imports-detector";
import { asBollDirectory, asBollFile, getSourceFile, Failure, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";
export const test: any = baretest("Redunant imports detector");

test("Should pass if no redundant import paths", async () => {
  const importPaths = [
    { path: "a", lineNumber: 0 },
    { path: "b/c/d/e/f", lineNumber: 1 },
    { path: "b/c/d/e/g", lineNumber: 2 }
  ];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.strictEqual(ResultStatus.success, result[0].status);
});

test("Should fail if there are redundant import paths", async () => {
  const importPaths = [
    { path: "a/b", lineNumber: 0 },
    { path: "b/c/d/e/f", lineNumber: 1 },
    { path: "a/b", lineNumber: 2 }
  ];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.strictEqual(ResultStatus.failure, result[0].status);
});

test("Should fail for missing imports if few imports are declared in devDependencies and devDeps mode is enabled", async () => {
  await inFixtureDir("redundant-imports-detector", __dirname, async () => {
    const sut = new RedundantImportsDetector();
    const result = await sut.check(await getSourceFile(asBollDirectory("."), "redundant-imports-detector.ts", {}));
    const failure = result[0] as Failure;
    const failure1 = result[1] as Failure;
    assert.strictEqual(2, result.length);
    assert.strictEqual(ResultStatus.failure, failure.status);
    assert.strictEqual(8, failure.line);
    assert.strictEqual(ResultStatus.failure, failure1.status);
    assert.strictEqual(15, failure1.line);
  });
});
