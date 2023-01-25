import * as assert from "assert";
import baretest from "baretest";
import { CrossPackageDependencyDetector } from "../cross-package-dependency-detector";
import { asBollDirectory, asBollFile, getSourceFile, Failure, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";
export const test: any = baretest("Cross package dependency detector");

test("Should pass if no cross-package dependencies detected", async () => {
  const importPaths = [
    { path: "./foo", lineNumber: 0 },
    { path: "./foo/bar", lineNumber: 1 }
  ];
  const sut = new CrossPackageDependencyDetector();
  const result = sut.checkImportPaths(asBollDirectory("/a/b/c"), asBollFile("/a/b/c/baz.ts"), importPaths);
  assert.strictEqual(1, result.length);
  assert.strictEqual(ResultStatus.success, result[0].status);
});

test("Should fail if cross-package dependency detected", async () => {
  const importPaths = [
    { path: "./foo", lineNumber: 0 },
    { path: "./foo/bar", lineNumber: 1 },
    { path: "../foo/bar", lineNumber: 2 }
  ];
  const sut = new CrossPackageDependencyDetector();
  const result = sut.checkImportPaths(asBollDirectory("/a/b/c"), asBollFile("/a/b/c/baz.ts"), importPaths);
  assert.strictEqual(1, result.length);
  assert.strictEqual(ResultStatus.failure, result[0].status);
});

test("Should fail for missing imports if few imports are declared in devDependencies and devDeps mode is enabled", async () => {
  await inFixtureDir("cross-package-dep-detector", __dirname, async () => {
    const sut = new CrossPackageDependencyDetector();
    const result = await sut.check(await getSourceFile(asBollDirectory("."), "cross-package-dep-detector.ts", {}));
    const failure = result[0] as Failure;
    const failure1 = result[1] as Failure;
    const failure2 = result[2] as Failure;
    assert.strictEqual(3, result.length);
    assert.strictEqual(ResultStatus.failure, failure.status);
    assert.strictEqual(4, failure.line);
    assert.strictEqual(ResultStatus.failure, failure1.status);
    assert.strictEqual(8, failure1.line);
    assert.strictEqual(ResultStatus.failure, failure2.status);
    assert.strictEqual(9, failure2.line);
  });
});
