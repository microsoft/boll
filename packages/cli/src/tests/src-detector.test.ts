import * as assert from "assert";
import baretest from "baretest";
import { asBollFile, ResultStatus } from "@boll/core";
import { SrcDetector } from "../rules/src-detector";
export const test: any = baretest("Source detector");

test("Should pass if no `src` detected in imports", async () => {
  const importPaths = ["a", "b/c/d/e/f"];
  const sut = new SrcDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.success, result[0].status);
});

test("Should fail if `src` detected in imports", async () => {
  const importPaths = ["a/src/b", "b/c/d/e/f"];
  const sut = new SrcDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.failure, result[0].status);
});
