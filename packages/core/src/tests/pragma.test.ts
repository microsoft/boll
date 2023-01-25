import * as assert from "assert";
import baretest from "baretest";
import { getSourceFile } from "../file-context";
import { inFixtureDir } from "@boll/test-internal";
import { Package } from "../package";
export const test: any = baretest("Source detector");

test("should keep track of a disabled rule in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "simple-disable.ts", {});
    assert.deepStrictEqual(sut.ignoredChecks, ["MadeUpCheckName"]);
  });
});

test("should keep track of multiple disabled rules in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "multiple-disable.ts", {});
    assert.deepStrictEqual(sut.ignoredChecks, ["MadeUpCheckName", "AlsoMadeUpName"]);
  });
});

test("should keep track of a disabled next line rule in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "simple-disable-next-line.ts", {});
    const expectedResult = new Map();
    expectedResult.set(3, ["MadeUpCheckName"]);
    assert.deepStrictEqual(sut.ignoredChecksByLine, expectedResult);
  });
});

test("should keep track of a disabled next line rules in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "multiple-disable-next-line.ts", {});
    const expectedResult = new Map();
    expectedResult.set(1, ["MadeUpCheckName", "AlsoMadeUpName"]);
    expectedResult.set(4, ["MadeUpCheckName"]);
    assert.deepStrictEqual(sut.ignoredChecksByLine, expectedResult);
  });
});
