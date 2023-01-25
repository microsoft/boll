import * as assert from "assert";
import baretest from "baretest";
import { getSourceFile } from "../file-context";
import { inFixtureDir } from "@boll/test-internal";
import { Package } from "../package";
import { Failure, Result, ResultSet } from "../result-set";
import { Suite } from "../suite";
import { asBollLineNumber } from "../boll-line-number";
export const test: any = baretest("Source detector");

test("should skip a single disabled next line rules in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "simple-disable-next-line.ts", {});
    const suite = new Suite();
    const results: Result[] = [];
    const failure1: Failure = new Failure(
      "MadeUpCheckName",
      sut.filename,
      asBollLineNumber(4),
      "Failed due to MadeUpCheckName rule"
    );
    results.push(failure1);
    const filteredResult = await suite.filterIgnoredChecksByLine(results, sut);
    assert.strictEqual(0, filteredResult.length);
  });
});

test("should skip a multiple disabled next line rules in a FileContext", async () => {
  await inFixtureDir("standalone-source-files", __dirname, async cwd => {
    const sut = await getSourceFile(cwd, "multiple-disable-next-line.ts", {});
    const suite = new Suite();
    const results: Result[] = [];
    const failure: Failure = new Failure(
      "MadeUpCheckName",
      sut.filename,
      asBollLineNumber(2),
      "Failed due to MadeUpCheckName rule"
    );
    results.push(failure);
    const failure1: Failure = new Failure(
      "AlsoMadeUpName",
      sut.filename,
      asBollLineNumber(2),
      "Failed due to MadeUpCheckName rule"
    );
    results.push(failure1);
    const failure2: Failure = new Failure(
      "MadeUpCheckName",
      sut.filename,
      asBollLineNumber(5),
      "Failed due to MadeUpCheckName rule"
    );
    results.push(failure2);
    const filteredResult = await suite.filterIgnoredChecksByLine(results, sut);
    assert.strictEqual(0, filteredResult.length);
  });
});
