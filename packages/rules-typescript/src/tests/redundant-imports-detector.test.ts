import * as assert from "assert";
import baretest from "baretest";
import { RedundantImportsDetector } from "../redundant-imports-detector";
import { asBollFile, ResultStatus } from "@boll/core";
export const test: any = baretest("Redunant imports detector");

test("Should pass if no redundant import paths", async () => {
  const importPaths = [
    { path: "a", lineNumber: 0 },
    { path: "b/c/d/e/f", lineNumber: 1 },
    { path: "b/c/d/e/g", lineNumber: 2 },
  ];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.success, result[0].status);
});

test("Should fail if there are redundant import paths", async () => {
  const importPaths = [
    { path: "a/b", lineNumber: 0 },
    { path: "b/c/d/e/f", lineNumber: 1 },
    { path: "a/b", lineNumber: 2 },
  ];
  const sut = new RedundantImportsDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.equal(ResultStatus.failure, result[0].status);
});
