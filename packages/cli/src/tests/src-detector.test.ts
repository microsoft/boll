import * as assert from "assert";
import baretest from "baretest";
import { ResultStatus } from "../lib/types";
import { SrcDetector } from "../rules/src-detector";
import { FileContext } from "../lib/file-context";
import { asBollFile } from "../lib/boll-file";
export const test = baretest("Source detector");

test("Should pass if no `src` detected in imports", async () => {
  const importPaths = ["a", "b/c/d/e/f"];
  const sut = new SrcDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.strictEqual(ResultStatus.success, result[0].status);
});

test("Should fail if `src` detected in imports", async () => {
  const importPaths = ["a/src/b", "b/c/d/e/f"];
  const sut = new SrcDetector();
  const result = sut.checkImportPaths(asBollFile("a"), importPaths);
  assert.strictEqual(ResultStatus.failure, result[0].status);
});
