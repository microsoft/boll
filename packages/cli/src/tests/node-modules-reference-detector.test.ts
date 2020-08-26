import * as assert from "assert";
import baretest from "baretest";
import path from "path";
import { ResultStatus } from "../lib/result-set";
import { NodeModulesReferenceDetector } from "../rules/node-modules-reference-detector";
import { getSourceFile } from "../lib/file-context";
import { asBollDirectory } from "../lib/boll-directory";
import { Package } from "../lib/package";
export const test = baretest("Node modules reference detector");

const TEST_FILE_DIR = path.join(__dirname, "..", "..", "fixtures", "unit-test-files");

test("Should pass if no references to node_modules exist in source code", async () => {
  const sut = new NodeModulesReferenceDetector();
  const result = sut.check(
    await getSourceFile(
      asBollDirectory(TEST_FILE_DIR),
      path.join(TEST_FILE_DIR, "node-modules-reference-none.ts"),
      new Package({})
    )
  );
  assert.equal(1, result.length);
  assert.equal(ResultStatus.success, result[0].status);
});

test("Should failt if references to node_modules exist in source code", async () => {
  const sut = new NodeModulesReferenceDetector();
  const result = sut.check(
    await getSourceFile(
      asBollDirectory(TEST_FILE_DIR),
      path.join(TEST_FILE_DIR, "node-modules-reference.ts"),
      new Package({})
    )
  );
  assert.equal(2, result.length);
  assert.equal(ResultStatus.failure, result[0].status);
  assert.equal(ResultStatus.failure, result[1].status);
});
