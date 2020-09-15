import * as assert from "assert";
import baretest from "baretest";
import { RedundantImportsDetector } from "../rules/redundant-imports-detector";
import { asBollFile, ResultStatus } from "@boll/core";
export const test: any = baretest("Redunant imports detector");

test("Should pass if no redundant import paths", async () => {
  const importPaths = ["a", "b/c/d/e/f", "b/c/d/e/g"];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.success, result[0].status);
});

test("Should fail if there are redundant import paths", async () => {
  const importPaths = ["a/b", "b/c/d/e/f", "a/b"];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.failure, result[0].status);
});
