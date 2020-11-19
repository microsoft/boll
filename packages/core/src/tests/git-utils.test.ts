import { inFixtureDir } from "@boll/test-internal";
import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { getIgnoreFiles, getRepoRoot } from "../git-utils";

export const test: any = baretest("Git Utils");

test("Should correctly parse repo root", async () => {
  const sut = getRepoRoot;
  const result = sut();
  assert.deepStrictEqual(result, path.resolve(process.cwd(), "../.."));
});

test("Should correctly find specified ignore file", async () => {
  await inFixtureDir("git-utils", __dirname, async () => {
    const sut = getIgnoreFiles;
    const result = await sut(process.cwd(), ".ignore");
    assert.deepStrictEqual(
      result.sort(),
      [
        "./.ignore",
        "./a/.ignore",
        "./a/a/.ignore",
        "./a/b/.ignore",
        "./a/c/.ignore",
        "./b/.ignore",
        "./b/a/.ignore",
        "./b/b/.ignore",
        "./b/c/.ignore",
        "./c/.ignore",
        "./c/a/.ignore",
        "./c/b/.ignore",
        "./c/c/.ignore"
      ]
        .map(p => path.resolve(p))
        .sort()
    );
  });
});
