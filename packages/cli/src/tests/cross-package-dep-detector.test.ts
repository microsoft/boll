import * as assert from "assert";
import baretest from "baretest";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { asBollDirectory, asBollFile, ResultStatus } from "@boll/core";
export const test: any = baretest("Cross package dependency detector");

test("Should pass if no cross-package dependencies detected", async () => {
  const importPaths = ["./foo", "./foo/bar"];
  const sut = new CrossPackageDependencyDetector();
  const result = sut.checkImportPaths(asBollDirectory("/a/b/c"), asBollFile("/a/b/c/baz.ts"), importPaths);
  assert.equal(1, result.length);
  assert.equal(ResultStatus.success, result[0].status);
});

test("Should fail if cross-package dependency detected", async () => {
  const importPaths = ["./foo", "./foo/bar", "../foo/bar"];
  const sut = new CrossPackageDependencyDetector();
  const result = sut.checkImportPaths(asBollDirectory("/a/b/c"), asBollFile("/a/b/c/baz.ts"), importPaths);
  assert.equal(1, result.length);
  assert.equal(ResultStatus.failure, result[0].status);
});
