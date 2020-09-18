import * as assert from "assert";
import baretest from "baretest";
import { getSourceFile } from "../file-context";
import { inFixtureDir } from "./test-helper";
import { Package } from "../package";
import { ESLintRules } from "../eslint-rules";
export const test: any = baretest("Source detector");

test("should keep track of a disabled rule in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", async cwd => {
    const sut = await getSourceFile(cwd, "simple-disable.ts", new Package({}), new ESLintRules());
    assert.deepStrictEqual(sut.ignoredChecks, ["MadeUpCheckName"]);
  });
});

test("should keep track of multiple disabled rules in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", async cwd => {
    const sut = await getSourceFile(cwd, "multiple-disable.ts", new Package({}), new ESLintRules());
    assert.deepStrictEqual(sut.ignoredChecks, ["MadeUpCheckName", "AlsoMadeUpName"]);
  });
});
