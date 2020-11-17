import { inFixtureDir } from "@boll/test-internal";
import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { GlobsForIgnorePattern, IgnoredFiles, IgnorePattern } from "../ignore";

export const test: any = baretest("Ignore files");

function assertArrayContentsEqual(actual: string[], expected: string[]) {
  actual.sort();
  expected.sort();
  assert.deepStrictEqual(actual, expected);
}

test("Should produce a glob matching all files in ./a/b/ (relative to .gitignore)", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("a/b/", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./a/b/**/*"]);
});

test("Should produce a glob matching all files with a path containing a/", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("a/", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./**/a/**/*"]);
});

test("Should produce a glob matching all files in directory /a or files named a (relative to .gitignore)", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("/a", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./a/**/*", "./a"]);
});

test("Should produce a glob matching all directories and files matching a", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("a", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./**/a/**/*", "./**/a"]);
});

test("Should produce a glob matching all files matching pattern *.js and all files nested in a directory ending in the characters .js", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("*.js", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./**/*.js/**/*", "./**/*.js"]);
});

test("Should produce a glob matching all files in directory abc (relative to .gitignore file)", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("abc/**", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./abc/**"]);
});

test("Should match all files inside any directory b or files named b nested in directory a", () => {
  const sut = new GlobsForIgnorePattern(new IgnorePattern("a/**/b", ".gitignored"));
  const result = sut.globs;
  assert.deepStrictEqual(result, ["./a/**/b/**/*", "./a/**/b"]);
});

test("Should match all files in directory a (relative to ignore file)", async () => {
  await inFixtureDir("ignore/ignore-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assert.deepStrictEqual(
      result,
      [
        "./a/a/a",
        "./a/a/b",
        "./a/a/c",
        "./a/b/a",
        "./a/b/b",
        "./a/b/c",
        "./a/c/a",
        "./a/c/b",
        "./a/c/c",
        "./b/a/a",
        "./b/a/b",
        "./b/a/c",
        "./c/a/a",
        "./c/a/b",
        "./c/a/c"
      ].map(p => path.resolve(p))
    );
  });
});

test("Should match all files in directories named a and all files named a", async () => {
  await inFixtureDir("ignore/ignore-file-or-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./a/a",
        "./a/b",
        "./a/c",
        "./b/a/a",
        "./b/a/b",
        "./b/a/c",
        "./b/b/a",
        "./b/c/a",
        "./c/a/a/a",
        "./c/a/a/b",
        "./c/a/a/c",
        "./c/a/b/a",
        "./c/a/b/b",
        "./c/a/b/c",
        "./c/a/c/a",
        "./c/a/c/b",
        "./c/a/c/c",
        "./c/b/a/a",
        "./c/b/a/b",
        "./c/b/a/c",
        "./c/b/b/a",
        "./c/b/c/a",
        "./c/c/a/a",
        "./c/c/a/b",
        "./c/c/a/c",
        "./c/c/b/a",
        "./c/c/c/a"
      ].map(p => path.resolve(p))
    );
  });
});

test("Should match any files ending in .js and ignore any files in directories containing .js", async () => {
  await inFixtureDir("ignore/ignore-file-type", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./.js/a",
        "./.js/b",
        "./.js/c",
        "./a/a/a.js",
        "./a/b.js",
        "./a/c.js",
        "./b/a/b/c/a.js",
        "./b/a/b/b.js",
        "./b/a/b/c.js",
        "./b/a/a.js",
        "./a.js"
      ].map(p => path.resolve(p))
    );
  });
});

test("Should match any files ending in .js in directory a (relative to ignore file)", async () => {
  await inFixtureDir("ignore/ignore-file-type-in-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      ["./a/a.js", "./a/b.js", "./a/c.js"].map(p => path.resolve(p))
    );
  });
});

test("Should match any files ending in .js in any directory b nested inside of directory a (relative to ignore file)", async () => {
  await inFixtureDir("ignore/ignore-file-type-in-nested-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      ["./a/a/b/a.js", "./a/a/b/b.js", "./a/b/b/a.js", "./a/b/b/b.js", "./a/b/a.js", "./a/b/b.js"].map(p =>
        path.resolve(p)
      )
    );
  });
});

test("Should match any files in directory b nested in directory a (relative to ignore file)", async () => {
  await inFixtureDir("ignore/ignore-nested-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      ["./a/a/b/a", "./a/a/b/b", "./a/b/a/a", "./a/b/a/b", "./a/b/b/a", "./a/b/b/b"].map(p => path.resolve(p))
    );
  });
});

test("Should match any files in directory b or any files named b nested in directory a (relative to ignore file)", async () => {
  await inFixtureDir("ignore/ignore-nested-file-or-directory", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      ["./a/a/a/b", "./a/a/b/a", "./a/a/b/b", "./a/b/a/a", "./a/b/a/b", "./a/b/b/a", "./a/b/b/b"].map(p =>
        path.resolve(p)
      )
    );
  });
});

/*test("Should correctly match ignored files with ignore files in nested directories", async () => {
  // root directory
  await inFixtureDir("ignore/nested-ignore-files", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored" });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./apps/a/dist/ignore",
        "./apps/a/dist/test.css",
        "./apps/a/dist/test.html",
        "./apps/a/dist/test.ignore",
        "./apps/a/dist/test.js",
        "./apps/a/dist/test.test",
        "./apps/a/dist/test.ts",
        "./apps/a/lib/ignore",
        "./apps/a/lib/test.css",
        "./apps/a/lib/test.html",
        "./apps/a/lib/test.ignore",
        "./apps/a/lib/test.js",
        "./apps/a/lib/test.test",
        "./apps/a/lib/test.ts",
        "./apps/a/node_modules/a/dist/ignore",
        "./apps/a/node_modules/a/dist/test.css",
        "./apps/a/node_modules/a/dist/test.html",
        "./apps/a/node_modules/a/dist/test.ignore",
        "./apps/a/node_modules/a/dist/test.js",
        "./apps/a/node_modules/a/dist/test.test",
        "./apps/a/node_modules/a/dist/test.ts",
        "./apps/a/node_modules/a/lib/ignore",
        "./apps/a/node_modules/a/lib/test.css",
        "./apps/a/node_modules/a/lib/test.html",
        "./apps/a/node_modules/a/lib/test.ignore",
        "./apps/a/node_modules/a/lib/test.js",
        "./apps/a/node_modules/a/lib/test.test",
        "./apps/a/node_modules/a/lib/test.ts",
        "./apps/a/node_modules/a/src/ignore",
        "./apps/a/node_modules/b/dist/ignore",
        "./apps/a/node_modules/b/dist/test.css",
        "./apps/a/node_modules/b/dist/test.html",
        "./apps/a/node_modules/b/dist/test.ignore",
        "./apps/a/node_modules/b/dist/test.js",
        "./apps/a/node_modules/b/dist/test.test",
        "./apps/a/node_modules/b/dist/test.ts",
        "./apps/a/node_modules/b/lib/ignore",
        "./apps/a/node_modules/b/lib/test.css",
        "./apps/a/node_modules/b/lib/test.html",
        "./apps/a/node_modules/b/lib/test.ignore",
        "./apps/a/node_modules/b/lib/test.js",
        "./apps/a/node_modules/b/lib/test.test",
        "./apps/a/node_modules/b/lib/test.ts",
        "./apps/a/node_modules/b/src/ignore",
        "./apps/a/node_modules/c/dist/ignore",
        "./apps/a/node_modules/c/dist/test.css",
        "./apps/a/node_modules/c/dist/test.html",
        "./apps/a/node_modules/c/dist/test.ignore",
        "./apps/a/node_modules/c/dist/test.js",
        "./apps/a/node_modules/c/dist/test.test",
        "./apps/a/node_modules/c/dist/test.ts",
        "./apps/a/node_modules/c/lib/ignore",
        "./apps/a/node_modules/c/lib/test.css",
        "./apps/a/node_modules/c/lib/test.html",
        "./apps/a/node_modules/c/lib/test.ignore",
        "./apps/a/node_modules/c/lib/test.js",
        "./apps/a/node_modules/c/lib/test.test",
        "./apps/a/node_modules/c/lib/test.ts",
        "./apps/a/node_modules/c/src/ignore",
        "./apps/a/src/ignore",
        "./apps/b/dist/ignore",
        "./apps/b/dist/test.css",
        "./apps/b/dist/test.html",
        "./apps/b/dist/test.ignore",
        "./apps/b/dist/test.js",
        "./apps/b/dist/test.test",
        "./apps/b/dist/test.ts",
        "./apps/b/lib/ignore",
        "./apps/b/lib/test.css",
        "./apps/b/lib/test.html",
        "./apps/b/lib/test.ignore",
        "./apps/b/lib/test.js",
        "./apps/b/lib/test.test",
        "./apps/b/lib/test.ts",
        "./apps/b/node_modules/a/dist/ignore",
        "./apps/b/node_modules/a/dist/test.css",
        "./apps/b/node_modules/a/dist/test.html",
        "./apps/b/node_modules/a/dist/test.ignore",
        "./apps/b/node_modules/a/dist/test.js",
        "./apps/b/node_modules/a/dist/test.test",
        "./apps/b/node_modules/a/dist/test.ts",
        "./apps/b/node_modules/a/lib/ignore",
        "./apps/b/node_modules/a/lib/test.css",
        "./apps/b/node_modules/a/lib/test.html",
        "./apps/b/node_modules/a/lib/test.ignore",
        "./apps/b/node_modules/a/lib/test.js",
        "./apps/b/node_modules/a/lib/test.test",
        "./apps/b/node_modules/a/lib/test.ts",
        "./apps/b/node_modules/a/src/ignore",
        "./apps/b/node_modules/b/dist/ignore",
        "./apps/b/node_modules/b/dist/test.css",
        "./apps/b/node_modules/b/dist/test.html",
        "./apps/b/node_modules/b/dist/test.ignore",
        "./apps/b/node_modules/b/dist/test.js",
        "./apps/b/node_modules/b/dist/test.test",
        "./apps/b/node_modules/b/dist/test.ts",
        "./apps/b/node_modules/b/lib/ignore",
        "./apps/b/node_modules/b/lib/test.css",
        "./apps/b/node_modules/b/lib/test.html",
        "./apps/b/node_modules/b/lib/test.ignore",
        "./apps/b/node_modules/b/lib/test.js",
        "./apps/b/node_modules/b/lib/test.test",
        "./apps/b/node_modules/b/lib/test.ts",
        "./apps/b/node_modules/b/src/ignore",
        "./apps/b/node_modules/c/dist/ignore",
        "./apps/b/node_modules/c/dist/test.css",
        "./apps/b/node_modules/c/dist/test.html",
        "./apps/b/node_modules/c/dist/test.ignore",
        "./apps/b/node_modules/c/dist/test.js",
        "./apps/b/node_modules/c/dist/test.test",
        "./apps/b/node_modules/c/dist/test.ts",
        "./apps/b/node_modules/c/lib/ignore",
        "./apps/b/node_modules/c/lib/test.css",
        "./apps/b/node_modules/c/lib/test.html",
        "./apps/b/node_modules/c/lib/test.ignore",
        "./apps/b/node_modules/c/lib/test.js",
        "./apps/b/node_modules/c/lib/test.test",
        "./apps/b/node_modules/c/lib/test.ts",
        "./apps/b/node_modules/c/src/ignore",
        "./apps/b/src/ignore",
        "./apps/c/dist/ignore",
        "./apps/c/dist/test.css",
        "./apps/c/dist/test.html",
        "./apps/c/dist/test.ignore",
        "./apps/c/dist/test.js",
        "./apps/c/dist/test.test",
        "./apps/c/dist/test.ts",
        "./apps/c/lib/ignore",
        "./apps/c/lib/test.css",
        "./apps/c/lib/test.html",
        "./apps/c/lib/test.ignore",
        "./apps/c/lib/test.js",
        "./apps/c/lib/test.test",
        "./apps/c/lib/test.ts",
        "./apps/c/node_modules/a/dist/ignore",
        "./apps/c/node_modules/a/dist/test.css",
        "./apps/c/node_modules/a/dist/test.html",
        "./apps/c/node_modules/a/dist/test.ignore",
        "./apps/c/node_modules/a/dist/test.js",
        "./apps/c/node_modules/a/dist/test.test",
        "./apps/c/node_modules/a/dist/test.ts",
        "./apps/c/node_modules/a/lib/ignore",
        "./apps/c/node_modules/a/lib/test.css",
        "./apps/c/node_modules/a/lib/test.html",
        "./apps/c/node_modules/a/lib/test.ignore",
        "./apps/c/node_modules/a/lib/test.js",
        "./apps/c/node_modules/a/lib/test.test",
        "./apps/c/node_modules/a/lib/test.ts",
        "./apps/c/node_modules/a/src/ignore",
        "./apps/c/node_modules/b/dist/ignore",
        "./apps/c/node_modules/b/dist/test.css",
        "./apps/c/node_modules/b/dist/test.html",
        "./apps/c/node_modules/b/dist/test.ignore",
        "./apps/c/node_modules/b/dist/test.js",
        "./apps/c/node_modules/b/dist/test.test",
        "./apps/c/node_modules/b/dist/test.ts",
        "./apps/c/node_modules/b/lib/ignore",
        "./apps/c/node_modules/b/lib/test.css",
        "./apps/c/node_modules/b/lib/test.html",
        "./apps/c/node_modules/b/lib/test.ignore",
        "./apps/c/node_modules/b/lib/test.js",
        "./apps/c/node_modules/b/lib/test.test",
        "./apps/c/node_modules/b/lib/test.ts",
        "./apps/c/node_modules/b/src/ignore",
        "./apps/c/node_modules/c/dist/ignore",
        "./apps/c/node_modules/c/dist/test.css",
        "./apps/c/node_modules/c/dist/test.html",
        "./apps/c/node_modules/c/dist/test.ignore",
        "./apps/c/node_modules/c/dist/test.js",
        "./apps/c/node_modules/c/dist/test.test",
        "./apps/c/node_modules/c/dist/test.ts",
        "./apps/c/node_modules/c/lib/ignore",
        "./apps/c/node_modules/c/lib/test.css",
        "./apps/c/node_modules/c/lib/test.html",
        "./apps/c/node_modules/c/lib/test.ignore",
        "./apps/c/node_modules/c/lib/test.js",
        "./apps/c/node_modules/c/lib/test.test",
        "./apps/c/node_modules/c/lib/test.ts",
        "./apps/c/node_modules/c/src/ignore",
        "./apps/c/src/ignore",
        "./ignore/a/dist/ignore",
        "./ignore/a/dist/test.css",
        "./ignore/a/dist/test.html",
        "./ignore/a/dist/test.ignore",
        "./ignore/a/dist/test.js",
        "./ignore/a/dist/test.test",
        "./ignore/a/dist/test.ts",
        "./ignore/a/lib/ignore",
        "./ignore/a/lib/test.css",
        "./ignore/a/lib/test.html",
        "./ignore/a/lib/test.ignore",
        "./ignore/a/lib/test.js",
        "./ignore/a/lib/test.test",
        "./ignore/a/lib/test.ts",
        "./ignore/a/src/ignore",
        "./ignore/a/src/test.css",
        "./ignore/a/src/test.html",
        "./ignore/a/src/test.ignore",
        "./ignore/a/src/test.js",
        "./ignore/a/src/test.test",
        "./ignore/a/src/test.ts",
        "./ignore/b/dist/ignore",
        "./ignore/b/dist/test.css",
        "./ignore/b/dist/test.html",
        "./ignore/b/dist/test.ignore",
        "./ignore/b/dist/test.js",
        "./ignore/b/dist/test.test",
        "./ignore/b/dist/test.ts",
        "./ignore/b/lib/ignore",
        "./ignore/b/lib/test.css",
        "./ignore/b/lib/test.html",
        "./ignore/b/lib/test.ignore",
        "./ignore/b/lib/test.js",
        "./ignore/b/lib/test.test",
        "./ignore/b/lib/test.ts",
        "./ignore/b/src/ignore",
        "./ignore/b/src/test.css",
        "./ignore/b/src/test.html",
        "./ignore/b/src/test.ignore",
        "./ignore/b/src/test.js",
        "./ignore/b/src/test.test",
        "./ignore/b/src/test.ts",
        "./ignore/c/dist/ignore",
        "./ignore/c/dist/test.css",
        "./ignore/c/dist/test.html",
        "./ignore/c/dist/test.ignore",
        "./ignore/c/dist/test.js",
        "./ignore/c/dist/test.test",
        "./ignore/c/dist/test.ts",
        "./ignore/c/lib/ignore",
        "./ignore/c/lib/test.css",
        "./ignore/c/lib/test.html",
        "./ignore/c/lib/test.ignore",
        "./ignore/c/lib/test.js",
        "./ignore/c/lib/test.test",
        "./ignore/c/lib/test.ts",
        "./ignore/c/src/ignore",
        "./ignore/c/src/test.css",
        "./ignore/c/src/test.html",
        "./ignore/c/src/test.ignore",
        "./ignore/c/src/test.js",
        "./ignore/c/src/test.test",
        "./ignore/c/src/test.ts",
        "./node_modules/a/dist/ignore",
        "./node_modules/a/dist/test.css",
        "./node_modules/a/dist/test.html",
        "./node_modules/a/dist/test.ignore",
        "./node_modules/a/dist/test.js",
        "./node_modules/a/dist/test.test",
        "./node_modules/a/dist/test.ts",
        "./node_modules/a/lib/ignore",
        "./node_modules/a/lib/test.css",
        "./node_modules/a/lib/test.html",
        "./node_modules/a/lib/test.ignore",
        "./node_modules/a/lib/test.js",
        "./node_modules/a/lib/test.test",
        "./node_modules/a/lib/test.ts",
        "./node_modules/a/src/ignore",
        "./node_modules/a/src/test.css",
        "./node_modules/a/src/test.html",
        "./node_modules/a/src/test.ignore",
        "./node_modules/a/src/test.js",
        "./node_modules/a/src/test.test",
        "./node_modules/a/src/test.ts",
        "./node_modules/b/dist/ignore",
        "./node_modules/b/dist/test.css",
        "./node_modules/b/dist/test.html",
        "./node_modules/b/dist/test.ignore",
        "./node_modules/b/dist/test.js",
        "./node_modules/b/dist/test.test",
        "./node_modules/b/dist/test.ts",
        "./node_modules/b/lib/ignore",
        "./node_modules/b/lib/test.css",
        "./node_modules/b/lib/test.html",
        "./node_modules/b/lib/test.ignore",
        "./node_modules/b/lib/test.js",
        "./node_modules/b/lib/test.test",
        "./node_modules/b/lib/test.ts",
        "./node_modules/b/src/ignore",
        "./node_modules/b/src/test.css",
        "./node_modules/b/src/test.html",
        "./node_modules/b/src/test.ignore",
        "./node_modules/b/src/test.js",
        "./node_modules/b/src/test.test",
        "./node_modules/b/src/test.ts",
        "./node_modules/c/dist/ignore",
        "./node_modules/c/dist/test.css",
        "./node_modules/c/dist/test.html",
        "./node_modules/c/dist/test.ignore",
        "./node_modules/c/dist/test.js",
        "./node_modules/c/dist/test.test",
        "./node_modules/c/dist/test.ts",
        "./node_modules/c/lib/ignore",
        "./node_modules/c/lib/test.css",
        "./node_modules/c/lib/test.html",
        "./node_modules/c/lib/test.ignore",
        "./node_modules/c/lib/test.js",
        "./node_modules/c/lib/test.test",
        "./node_modules/c/lib/test.ts",
        "./node_modules/c/src/ignore",
        "./node_modules/c/src/test.css",
        "./node_modules/c/src/test.html",
        "./node_modules/c/src/test.ignore",
        "./node_modules/c/src/test.js",
        "./node_modules/c/src/test.test",
        "./node_modules/c/src/test.ts",
        "./packages/a/dist/ignore",
        "./packages/a/dist/test.css",
        "./packages/a/dist/test.html",
        "./packages/a/dist/test.ignore",
        "./packages/a/dist/test.js",
        "./packages/a/dist/test.test",
        "./packages/a/dist/test.ts",
        "./packages/a/lib/ignore",
        "./packages/a/lib/test.css",
        "./packages/a/lib/test.html",
        "./packages/a/lib/test.ignore",
        "./packages/a/lib/test.js",
        "./packages/a/lib/test.test",
        "./packages/a/lib/test.ts",
        "./packages/a/src/ignore",
        "./packages/b/dist/ignore",
        "./packages/b/dist/test.css",
        "./packages/b/dist/test.html",
        "./packages/b/dist/test.ignore",
        "./packages/b/dist/test.js",
        "./packages/b/dist/test.test",
        "./packages/b/dist/test.ts",
        "./packages/b/lib/ignore",
        "./packages/b/lib/test.css",
        "./packages/b/lib/test.html",
        "./packages/b/lib/test.ignore",
        "./packages/b/lib/test.js",
        "./packages/b/lib/test.test",
        "./packages/b/lib/test.ts",
        "./packages/b/src/ignore",
        "./packages/c/dist/ignore",
        "./packages/c/dist/test.css",
        "./packages/c/dist/test.html",
        "./packages/c/dist/test.ignore",
        "./packages/c/dist/test.js",
        "./packages/c/dist/test.test",
        "./packages/c/dist/test.ts",
        "./packages/c/lib/ignore",
        "./packages/c/lib/test.css",
        "./packages/c/lib/test.html",
        "./packages/c/lib/test.ignore",
        "./packages/c/lib/test.js",
        "./packages/c/lib/test.test",
        "./packages/c/lib/test.ts",
        "./packages/c/src/ignore"
      ].map(p => path.resolve(p))
    );
  });

  // ./apps/ directory
  await inFixtureDir("ignore/nested-ignore-files/apps", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./a/dist/ignore",
        "./a/dist/test.css",
        "./a/dist/test.html",
        "./a/dist/test.ignore",
        "./a/dist/test.js",
        "./a/dist/test.test",
        "./a/dist/test.ts",
        "./a/lib/ignore",
        "./a/lib/test.css",
        "./a/lib/test.html",
        "./a/lib/test.ignore",
        "./a/lib/test.js",
        "./a/lib/test.test",
        "./a/lib/test.ts",
        "./a/node_modules/a/dist/ignore",
        "./a/node_modules/a/dist/test.css",
        "./a/node_modules/a/dist/test.html",
        "./a/node_modules/a/dist/test.ignore",
        "./a/node_modules/a/dist/test.js",
        "./a/node_modules/a/dist/test.test",
        "./a/node_modules/a/dist/test.ts",
        "./a/node_modules/a/lib/ignore",
        "./a/node_modules/a/lib/test.css",
        "./a/node_modules/a/lib/test.html",
        "./a/node_modules/a/lib/test.ignore",
        "./a/node_modules/a/lib/test.js",
        "./a/node_modules/a/lib/test.test",
        "./a/node_modules/a/lib/test.ts",
        "./a/node_modules/a/src/ignore",
        "./a/node_modules/a/src/test.ignore",
        "./a/node_modules/b/dist/ignore",
        "./a/node_modules/b/dist/test.css",
        "./a/node_modules/b/dist/test.html",
        "./a/node_modules/b/dist/test.ignore",
        "./a/node_modules/b/dist/test.js",
        "./a/node_modules/b/dist/test.test",
        "./a/node_modules/b/dist/test.ts",
        "./a/node_modules/b/lib/ignore",
        "./a/node_modules/b/lib/test.css",
        "./a/node_modules/b/lib/test.html",
        "./a/node_modules/b/lib/test.ignore",
        "./a/node_modules/b/lib/test.js",
        "./a/node_modules/b/lib/test.test",
        "./a/node_modules/b/lib/test.ts",
        "./a/node_modules/b/src/ignore",
        "./a/node_modules/b/src/test.ignore",
        "./a/node_modules/c/dist/ignore",
        "./a/node_modules/c/dist/test.css",
        "./a/node_modules/c/dist/test.html",
        "./a/node_modules/c/dist/test.ignore",
        "./a/node_modules/c/dist/test.js",
        "./a/node_modules/c/dist/test.test",
        "./a/node_modules/c/dist/test.ts",
        "./a/node_modules/c/lib/ignore",
        "./a/node_modules/c/lib/test.css",
        "./a/node_modules/c/lib/test.html",
        "./a/node_modules/c/lib/test.ignore",
        "./a/node_modules/c/lib/test.js",
        "./a/node_modules/c/lib/test.test",
        "./a/node_modules/c/lib/test.ts",
        "./a/node_modules/c/src/ignore",
        "./a/node_modules/c/src/test.ignore",
        "./a/src/ignore",
        "./a/src/test.ignore",
        "./a/src/test.test",
        "./b/dist/ignore",
        "./b/dist/test.css",
        "./b/dist/test.html",
        "./b/dist/test.ignore",
        "./b/dist/test.js",
        "./b/dist/test.test",
        "./b/dist/test.ts",
        "./b/lib/ignore",
        "./b/lib/test.css",
        "./b/lib/test.html",
        "./b/lib/test.ignore",
        "./b/lib/test.js",
        "./b/lib/test.test",
        "./b/lib/test.ts",
        "./b/node_modules/a/dist/ignore",
        "./b/node_modules/a/dist/test.css",
        "./b/node_modules/a/dist/test.html",
        "./b/node_modules/a/dist/test.ignore",
        "./b/node_modules/a/dist/test.js",
        "./b/node_modules/a/dist/test.test",
        "./b/node_modules/a/dist/test.ts",
        "./b/node_modules/a/lib/ignore",
        "./b/node_modules/a/lib/test.css",
        "./b/node_modules/a/lib/test.html",
        "./b/node_modules/a/lib/test.ignore",
        "./b/node_modules/a/lib/test.js",
        "./b/node_modules/a/lib/test.test",
        "./b/node_modules/a/lib/test.ts",
        "./b/node_modules/a/src/ignore",
        "./b/node_modules/a/src/test.ignore",
        "./b/node_modules/b/dist/ignore",
        "./b/node_modules/b/dist/test.css",
        "./b/node_modules/b/dist/test.html",
        "./b/node_modules/b/dist/test.ignore",
        "./b/node_modules/b/dist/test.js",
        "./b/node_modules/b/dist/test.test",
        "./b/node_modules/b/dist/test.ts",
        "./b/node_modules/b/lib/ignore",
        "./b/node_modules/b/lib/test.css",
        "./b/node_modules/b/lib/test.html",
        "./b/node_modules/b/lib/test.ignore",
        "./b/node_modules/b/lib/test.js",
        "./b/node_modules/b/lib/test.test",
        "./b/node_modules/b/lib/test.ts",
        "./b/node_modules/b/src/ignore",
        "./b/node_modules/b/src/test.ignore",
        "./b/node_modules/c/dist/ignore",
        "./b/node_modules/c/dist/test.css",
        "./b/node_modules/c/dist/test.html",
        "./b/node_modules/c/dist/test.ignore",
        "./b/node_modules/c/dist/test.js",
        "./b/node_modules/c/dist/test.test",
        "./b/node_modules/c/dist/test.ts",
        "./b/node_modules/c/lib/ignore",
        "./b/node_modules/c/lib/test.css",
        "./b/node_modules/c/lib/test.html",
        "./b/node_modules/c/lib/test.ignore",
        "./b/node_modules/c/lib/test.js",
        "./b/node_modules/c/lib/test.test",
        "./b/node_modules/c/lib/test.ts",
        "./b/node_modules/c/src/ignore",
        "./b/node_modules/c/src/test.ignore",
        "./b/src/ignore",
        "./b/src/test.ignore",
        "./c/dist/ignore",
        "./c/dist/test.css",
        "./c/dist/test.html",
        "./c/dist/test.ignore",
        "./c/dist/test.js",
        "./c/dist/test.test",
        "./c/dist/test.ts",
        "./c/lib/ignore",
        "./c/lib/test.css",
        "./c/lib/test.html",
        "./c/lib/test.ignore",
        "./c/lib/test.js",
        "./c/lib/test.test",
        "./c/lib/test.ts",
        "./c/node_modules/a/dist/ignore",
        "./c/node_modules/a/dist/test.css",
        "./c/node_modules/a/dist/test.html",
        "./c/node_modules/a/dist/test.ignore",
        "./c/node_modules/a/dist/test.js",
        "./c/node_modules/a/dist/test.test",
        "./c/node_modules/a/dist/test.ts",
        "./c/node_modules/a/lib/ignore",
        "./c/node_modules/a/lib/test.css",
        "./c/node_modules/a/lib/test.html",
        "./c/node_modules/a/lib/test.ignore",
        "./c/node_modules/a/lib/test.js",
        "./c/node_modules/a/lib/test.test",
        "./c/node_modules/a/lib/test.ts",
        "./c/node_modules/a/src/ignore",
        "./c/node_modules/a/src/test.ignore",
        "./c/node_modules/a/src/test.test",
        "./c/node_modules/b/dist/ignore",
        "./c/node_modules/b/dist/test.css",
        "./c/node_modules/b/dist/test.html",
        "./c/node_modules/b/dist/test.ignore",
        "./c/node_modules/b/dist/test.js",
        "./c/node_modules/b/dist/test.test",
        "./c/node_modules/b/dist/test.ts",
        "./c/node_modules/b/lib/ignore",
        "./c/node_modules/b/lib/test.css",
        "./c/node_modules/b/lib/test.html",
        "./c/node_modules/b/lib/test.ignore",
        "./c/node_modules/b/lib/test.js",
        "./c/node_modules/b/lib/test.test",
        "./c/node_modules/b/lib/test.ts",
        "./c/node_modules/b/src/ignore",
        "./c/node_modules/b/src/test.ignore",
        "./c/node_modules/b/src/test.test",
        "./c/node_modules/c/dist/ignore",
        "./c/node_modules/c/dist/test.css",
        "./c/node_modules/c/dist/test.html",
        "./c/node_modules/c/dist/test.ignore",
        "./c/node_modules/c/dist/test.js",
        "./c/node_modules/c/dist/test.test",
        "./c/node_modules/c/dist/test.ts",
        "./c/node_modules/c/lib/ignore",
        "./c/node_modules/c/lib/test.css",
        "./c/node_modules/c/lib/test.html",
        "./c/node_modules/c/lib/test.ignore",
        "./c/node_modules/c/lib/test.js",
        "./c/node_modules/c/lib/test.test",
        "./c/node_modules/c/lib/test.ts",
        "./c/node_modules/c/src/ignore",
        "./c/node_modules/c/src/test.ignore",
        "./c/node_modules/c/src/test.test",
        "./c/src/ignore",
        "./c/src/test.ignore",
        "./c/src/test.test"
      ].map(p => path.resolve(p))
    );
  });

  // ./apps/a/ directory
  await inFixtureDir("ignore/nested-ignore-files/apps/a", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./node_modules/a/dist/ignore",
        "./node_modules/a/dist/test.css",
        "./node_modules/a/dist/test.html",
        "./node_modules/a/dist/test.ignore",
        "./node_modules/a/dist/test.js",
        "./node_modules/a/dist/test.test",
        "./node_modules/a/dist/test.ts",
        "./node_modules/a/lib/ignore",
        "./node_modules/a/lib/test.css",
        "./node_modules/a/lib/test.html",
        "./node_modules/a/lib/test.ignore",
        "./node_modules/a/lib/test.js",
        "./node_modules/a/lib/test.test",
        "./node_modules/a/lib/test.ts",
        "./node_modules/a/src/ignore",
        "./node_modules/a/src/test.css",
        "./node_modules/a/src/test.html",
        "./node_modules/a/src/test.ignore",
        "./node_modules/a/src/test.js",
        "./node_modules/a/src/test.test",
        "./node_modules/a/src/test.ts",
        "./node_modules/b/dist/ignore",
        "./node_modules/b/dist/test.css",
        "./node_modules/b/dist/test.html",
        "./node_modules/b/dist/test.ignore",
        "./node_modules/b/dist/test.js",
        "./node_modules/b/dist/test.test",
        "./node_modules/b/dist/test.ts",
        "./node_modules/b/lib/ignore",
        "./node_modules/b/lib/test.css",
        "./node_modules/b/lib/test.html",
        "./node_modules/b/lib/test.ignore",
        "./node_modules/b/lib/test.js",
        "./node_modules/b/lib/test.test",
        "./node_modules/b/lib/test.ts",
        "./node_modules/b/src/ignore",
        "./node_modules/b/src/test.css",
        "./node_modules/b/src/test.html",
        "./node_modules/b/src/test.ignore",
        "./node_modules/b/src/test.js",
        "./node_modules/b/src/test.test",
        "./node_modules/b/src/test.ts",
        "./node_modules/c/dist/ignore",
        "./node_modules/c/dist/test.css",
        "./node_modules/c/dist/test.html",
        "./node_modules/c/dist/test.ignore",
        "./node_modules/c/dist/test.js",
        "./node_modules/c/dist/test.test",
        "./node_modules/c/dist/test.ts",
        "./node_modules/c/lib/ignore",
        "./node_modules/c/lib/test.css",
        "./node_modules/c/lib/test.html",
        "./node_modules/c/lib/test.ignore",
        "./node_modules/c/lib/test.js",
        "./node_modules/c/lib/test.test",
        "./node_modules/c/lib/test.ts",
        "./node_modules/c/src/ignore",
        "./node_modules/c/src/test.css",
        "./node_modules/c/src/test.html",
        "./node_modules/c/src/test.ignore",
        "./node_modules/c/src/test.js",
        "./node_modules/c/src/test.test",
        "./node_modules/c/src/test.ts",
        "./src/ignore",
        "./src/test.ignore",
        "./src/test.test"
      ].map(p => path.resolve(p))
    );
  });

  // ./apps/b/ directory
  await inFixtureDir("ignore/nested-ignore-files/apps/b", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./node_modules/a/dist/ignore",
        "./node_modules/a/dist/test.css",
        "./node_modules/a/dist/test.html",
        "./node_modules/a/dist/test.ignore",
        "./node_modules/a/dist/test.js",
        "./node_modules/a/dist/test.test",
        "./node_modules/a/dist/test.ts",
        "./node_modules/a/lib/ignore",
        "./node_modules/a/lib/test.css",
        "./node_modules/a/lib/test.html",
        "./node_modules/a/lib/test.ignore",
        "./node_modules/a/lib/test.js",
        "./node_modules/a/lib/test.test",
        "./node_modules/a/lib/test.ts",
        "./node_modules/a/src/ignore",
        "./node_modules/a/src/test.css",
        "./node_modules/a/src/test.html",
        "./node_modules/a/src/test.ignore",
        "./node_modules/a/src/test.js",
        "./node_modules/a/src/test.test",
        "./node_modules/a/src/test.ts",
        "./node_modules/b/dist/ignore",
        "./node_modules/b/dist/test.css",
        "./node_modules/b/dist/test.html",
        "./node_modules/b/dist/test.ignore",
        "./node_modules/b/dist/test.js",
        "./node_modules/b/dist/test.test",
        "./node_modules/b/dist/test.ts",
        "./node_modules/b/lib/ignore",
        "./node_modules/b/lib/test.css",
        "./node_modules/b/lib/test.html",
        "./node_modules/b/lib/test.ignore",
        "./node_modules/b/lib/test.js",
        "./node_modules/b/lib/test.test",
        "./node_modules/b/lib/test.ts",
        "./node_modules/b/src/ignore",
        "./node_modules/b/src/test.css",
        "./node_modules/b/src/test.html",
        "./node_modules/b/src/test.ignore",
        "./node_modules/b/src/test.js",
        "./node_modules/b/src/test.test",
        "./node_modules/b/src/test.ts",
        "./node_modules/c/dist/ignore",
        "./node_modules/c/dist/test.css",
        "./node_modules/c/dist/test.html",
        "./node_modules/c/dist/test.ignore",
        "./node_modules/c/dist/test.js",
        "./node_modules/c/dist/test.test",
        "./node_modules/c/dist/test.ts",
        "./node_modules/c/lib/ignore",
        "./node_modules/c/lib/test.css",
        "./node_modules/c/lib/test.html",
        "./node_modules/c/lib/test.ignore",
        "./node_modules/c/lib/test.js",
        "./node_modules/c/lib/test.test",
        "./node_modules/c/lib/test.ts",
        "./node_modules/c/src/ignore",
        "./node_modules/c/src/test.css",
        "./node_modules/c/src/test.html",
        "./node_modules/c/src/test.ignore",
        "./node_modules/c/src/test.js",
        "./node_modules/c/src/test.test",
        "./node_modules/c/src/test.ts",
        "./src/ignore",
        "./src/test.css",
        "./src/test.html",
        "./src/test.ignore"
      ].map(p => path.resolve(p))
    );
  });

  // ./apps/c/ directory
  await inFixtureDir("ignore/nested-ignore-files/apps/c", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./node_modules/a/dist/ignore",
        "./node_modules/a/dist/test.css",
        "./node_modules/a/dist/test.html",
        "./node_modules/a/dist/test.ignore",
        "./node_modules/a/dist/test.js",
        "./node_modules/a/dist/test.test",
        "./node_modules/a/dist/test.ts",
        "./node_modules/a/lib/ignore",
        "./node_modules/a/lib/test.css",
        "./node_modules/a/lib/test.html",
        "./node_modules/a/lib/test.ignore",
        "./node_modules/a/lib/test.js",
        "./node_modules/a/lib/test.test",
        "./node_modules/a/lib/test.ts",
        "./node_modules/a/src/ignore",
        "./node_modules/a/src/test.ignore",
        "./node_modules/a/src/test.test",
        "./node_modules/b/dist/ignore",
        "./node_modules/b/dist/test.css",
        "./node_modules/b/dist/test.html",
        "./node_modules/b/dist/test.ignore",
        "./node_modules/b/dist/test.js",
        "./node_modules/b/dist/test.test",
        "./node_modules/b/dist/test.ts",
        "./node_modules/b/lib/ignore",
        "./node_modules/b/lib/test.css",
        "./node_modules/b/lib/test.html",
        "./node_modules/b/lib/test.ignore",
        "./node_modules/b/lib/test.js",
        "./node_modules/b/lib/test.test",
        "./node_modules/b/lib/test.ts",
        "./node_modules/b/src/ignore",
        "./node_modules/b/src/test.ignore",
        "./node_modules/b/src/test.test",
        "./node_modules/c/dist/ignore",
        "./node_modules/c/dist/test.css",
        "./node_modules/c/dist/test.html",
        "./node_modules/c/dist/test.ignore",
        "./node_modules/c/dist/test.js",
        "./node_modules/c/dist/test.test",
        "./node_modules/c/dist/test.ts",
        "./node_modules/c/lib/ignore",
        "./node_modules/c/lib/test.css",
        "./node_modules/c/lib/test.html",
        "./node_modules/c/lib/test.ignore",
        "./node_modules/c/lib/test.js",
        "./node_modules/c/lib/test.test",
        "./node_modules/c/lib/test.ts",
        "./node_modules/c/src/ignore",
        "./node_modules/c/src/test.ignore",
        "./node_modules/c/src/test.test",
        "./src/ignore",
        "./src/test.ignore",
        "./src/test.test"
      ].map(p => path.resolve(p))
    );
  });

  // ./packages/ directory
  await inFixtureDir("ignore/nested-ignore-files/packages", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./a/dist/ignore",
        "./a/dist/test.css",
        "./a/dist/test.html",
        "./a/dist/test.ignore",
        "./a/dist/test.js",
        "./a/dist/test.test",
        "./a/dist/test.ts",
        "./a/lib/ignore",
        "./a/lib/test.css",
        "./a/lib/test.html",
        "./a/lib/test.ignore",
        "./a/lib/test.js",
        "./a/lib/test.test",
        "./a/lib/test.ts",
        "./a/src/ignore",
        "./a/src/test.css",
        "./a/src/test.ts",
        "./b/dist/ignore",
        "./b/dist/test.css",
        "./b/dist/test.html",
        "./b/dist/test.ignore",
        "./b/dist/test.js",
        "./b/dist/test.test",
        "./b/dist/test.ts",
        "./b/lib/ignore",
        "./b/lib/test.css",
        "./b/lib/test.html",
        "./b/lib/test.ignore",
        "./b/lib/test.js",
        "./b/lib/test.test",
        "./b/lib/test.ts",
        "./b/src/ignore",
        "./b/src/test.css",
        "./b/src/test.html",
        "./b/src/test.ignore",
        "./b/src/test.js",
        "./b/src/test.test",
        "./b/src/test.ts",
        "./c/dist/ignore",
        "./c/dist/test.css",
        "./c/dist/test.html",
        "./c/dist/test.ignore",
        "./c/dist/test.js",
        "./c/dist/test.test",
        "./c/dist/test.ts",
        "./c/lib/ignore",
        "./c/lib/test.css",
        "./c/lib/test.html",
        "./c/lib/test.ignore",
        "./c/lib/test.js",
        "./c/lib/test.test",
        "./c/lib/test.ts",
        "./c/src/ignore",
        "./c/src/test.css"
      ].map(p => path.resolve(p))
    );
  });

  // ./packages/a/ directory
  await inFixtureDir("ignore/nested-ignore-files/packages/a", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./src/ignore",
        "./src/test.css",
        "./src/test.html",
        "./src/test.test",
        "./src/test.ts"
      ].map(p => path.resolve(p))
    );
  });

  // ./packages/b/ directory
  await inFixtureDir("ignore/nested-ignore-files/packages/b", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./src/ignore",
        "./src/test.css",
        "./src/test.html",
        "./src/test.ignore",
        "./src/test.js",
        "./src/test.test",
        "./src/test.ts"
      ].map(p => path.resolve(p))
    );
  });

  // ./packages/c/ directory
  await inFixtureDir("ignore/nested-ignore-files/packages/c", __dirname, async () => {
    const sut = new IgnoredFiles({ ignoreFileName: ".gitignored", root: path.resolve("../..") });
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(
      result,
      [
        "./dist/ignore",
        "./dist/test.css",
        "./dist/test.html",
        "./dist/test.ignore",
        "./dist/test.js",
        "./dist/test.test",
        "./dist/test.ts",
        "./lib/ignore",
        "./lib/test.css",
        "./lib/test.html",
        "./lib/test.ignore",
        "./lib/test.js",
        "./lib/test.test",
        "./lib/test.ts",
        "./src/ignore",
        "./src/test.css",
        "./src/test.js",
        "./src/test.ts"
      ].map(p => path.resolve(p))
    );
  });
});
*/
