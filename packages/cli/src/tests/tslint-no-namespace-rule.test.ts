import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir, inTmpDir, tempRename } from "./test-helper";
import { Cli } from "../cli";
import { exists } from "fs";
import { asBollDirectory, asBollFile, getSourceFile, NullLogger, Package, ResultStatus } from "@boll/core";
import { promisify } from "util";
import { TSLintNoNamespaceRule } from "../rules/tslint-no-namespace-rule";
const existsAsync = promisify(exists);

export const test: any = baretest("TSLint No Namespace Rule");

test("Should fail because the no-namespace rule is not enabled", async () => {
  await inFixtureDir("configs/tslint/no-namespace", async () => {
    const sut = new TSLintNoNamespaceRule();
    const results = sut.check(await getSourceFile(asBollDirectory("."), "no-namespace.ts", new Package({})));
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0].status, ResultStatus.failure);
    assert.strictEqual(results[0].formattedMessage.includes(`Rule severity set to "off" instead of "error"`), true);
  });
});

test("Should succeed because the no-namespace rule is enabled", async () => {
  await inFixtureDir("configs/tslint/no-namespace", async () => {
    await tempRename(asBollFile("tslint.json"), "not-tslint.json", async () => {
      const sut = new TSLintNoNamespaceRule();
      const results = sut.check(await getSourceFile(asBollDirectory("."), "no-namespace.ts", new Package({})));
      assert.strictEqual(results.length, 1);
      assert.strictEqual(results[0].status, ResultStatus.success);
    });
  });
});
