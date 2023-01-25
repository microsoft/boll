import * as assert from "assert";
import baretest from "baretest";
import { inFixtureDir } from "@boll/test-internal";
import { asBollFile } from "../boll-file";
import { FileGlob } from "../types";
import { TypescriptSourceGlob, WorkspacesGlob } from "../glob";

export const test: any = baretest("Glob");

test("should find .ts source", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const glob: FileGlob = new TypescriptSourceGlob();
    const results = await glob.findFiles();
    assert.ok(
      results.includes(asBollFile("src/bad-import.ts")),
      `expected results to include bad-import.ts, but was ${results.join(", ")}`
    );
  });
});

test("should find .tsx source", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const glob: FileGlob = new TypescriptSourceGlob();
    const results = await glob.findFiles();
    assert.ok(
      results.includes(asBollFile("src/foo.tsx")),
      `expected results to include foo.tsx, but was ${results.join(", ")}`
    );
  });
});

test("should not include .d.ts files", async () => {
  await inFixtureDir("project-a", __dirname, async () => {
    const glob: FileGlob = new TypescriptSourceGlob();
    const results = await glob.findFiles();
    assert.ok(
      !results.includes(asBollFile("src/some-thing.d.ts")),
      `expected results not to include some-thing.d.ts, but was ${results.join(", ")}`
    );
  });
});

test("should not return files explicitly excluded", async () => {
  await inFixtureDir("glob", __dirname, async () => {
    const glob: FileGlob = new TypescriptSourceGlob({ exclude: ["./**/b.ts"] });
    const results = await glob.findFiles();
    assert.deepStrictEqual(results.sort(), [asBollFile("a/a.ts")].sort());
  });
});

test("should return files explicitly included", async () => {
  await inFixtureDir("glob", __dirname, async () => {
    const glob: FileGlob = new TypescriptSourceGlob({ include: ["./c/*"] });
    const results = await glob.findFiles();
    assert.deepStrictEqual(
      results.sort(),
      [asBollFile("a/a.ts"), asBollFile("b/b.ts"), asBollFile("c/c.someextension")].sort()
    );
  });
});

test("should find packages in a monorepo", async () => {
  await inFixtureDir("monorepo", __dirname, async fixtureDir => {
    const glob: FileGlob = new WorkspacesGlob(fixtureDir);
    const results = await glob.findFiles();
    assert.deepStrictEqual(
      results.sort(),
      [
        asBollFile("packages/hip-glasses-smoke/package.json"),
        asBollFile("packages/large-worms-pull/package.json"),
        asBollFile("packages/lemon-foxes-exist/package.json"),
        asBollFile("packages/many-taxes-wash/package.json"),
        asBollFile("packages/yellow-hairs-film/package.json")
      ].sort()
    );
  });
});
