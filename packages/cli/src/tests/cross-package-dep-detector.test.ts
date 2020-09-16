import * as assert from "assert";
import baretest from "baretest";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { asBollDirectory, asBollFile, ResultStatus } from "@boll/core";
export const test: any = baretest("Cross package dependency detector");

test("Should pass if no cross-package dependencies detected", async () => {
  const importPaths = [
    { path: "./foo", lineNumber: 0 },
    { path: "./foo/bar", lineNumber: 1 },
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
    { path: "../foo/bar", lineNumber: 2 },
  ];
  const sut = new CrossPackageDependencyDetector();
  const result = sut.checkImportPaths(asBollDirectory("/a/b/c"), asBollFile("/a/b/c/baz.ts"), importPaths);
  assert.strictEqual(1, result.length);
  assert.strictEqual(ResultStatus.failure, result[0].status);
});
