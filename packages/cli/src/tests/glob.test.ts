import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { asBollFile } from "../lib/boll-file";
import { FileGlob } from "../lib/types";
import { TypescriptSourceGlob } from "../lib/glob";

export const test = baretest("Glob");

test("should find .ts source", async () => {
  await inFixtureDir("project-a", async () => {
    const glob: FileGlob = new TypescriptSourceGlob();
    const results = await glob.findFiles();
    assert.ok(
      results.includes(asBollFile("src/bad-import.ts")),
      `expected results to include bad-import.ts, but was ${results.join(", ")}`
    );
  });
});

test("should find .tsx source", async () => {
  await inFixtureDir("project-a", async () => {
    const glob: FileGlob = new TypescriptSourceGlob();
    const results = await glob.findFiles();
    assert.ok(
      results.includes(asBollFile("src/foo.tsx")),
      `expected results to include foo.tsx, but was ${results.join(", ")}`
    );
  });
});

test("should not return files explicitly excluded", async () => {
  await inFixtureDir("glob", async () => {
    const glob: FileGlob = new TypescriptSourceGlob({ exclude: ["./**/b.ts"] });
    const results = await glob.findFiles();
    assert.deepEqual(results, [asBollFile("a/a.ts")]);
  });
});

test("should return files explicitly included", async () => {
  await inFixtureDir("glob", async () => {
    const glob: FileGlob = new TypescriptSourceGlob({ include: ["./c/*"] });
    const results = await glob.findFiles();
    assert.deepEqual(results, [asBollFile("a/a.ts"), asBollFile("b/b.ts"), asBollFile("c/c.someextension")]);
  });
});
