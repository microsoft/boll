import { inFixtureDir } from "@boll/test-internal";
import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { IgnoreFiles } from "../ignore";

export const test: any = baretest("Ignore files");

function assertArrayContentsEqual(actual: string[], expected: string[]) {
  if (actual.length !== expected.length) {
    assert.fail("Array lengths are not the same");
  }

  // const missingPaths: string[] = [];
  // actual.forEach(p => !expected.find(v => v === p) && missingPaths.push(p));
  // console.log(missingPaths);

  actual.sort();
  expected.sort();
  assert.deepStrictEqual(actual, expected);
}

test("Should produce a glob matching all files in ./a/b/ (relative to .gitignore)", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("a/b/");
  assert.deepStrictEqual(result, ["./a/b/**/*"]);
});

test("Should produce a glob matching all files with a path containing a/", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("a/");
  assert.deepStrictEqual(result, ["./**/a/**/*"]);
});

test("Should produce a glob matching all files in directory /a or files named a (relative to .gitignore)", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("/a");
  assert.deepStrictEqual(result, ["./a/**/*", "./a"]);
});

test("Should produce a glob matching all directories and files matching a", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("a");
  assert.deepStrictEqual(result, ["./**/a/**/*", "./**/a"]);
});

test("Should produce a glob matching all files matching pattern *.js and all files nested in a directory ending in the characters .js", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("*.js");
  assert.deepStrictEqual(result, ["./**/*.js/**/*", "./**/*.js"]);
});

test("Should produce a glob matching all files in directory abc (relative to .gitignore file)", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("abc/**");
  assert.deepStrictEqual(result, ["./abc/**"]);
});

test("Should match all files inside any directory b or files named b nested in directory a", async () => {
  const sut = new IgnoreFiles();
  const result = await sut.getGlobFromIgnorePattern("a/**/b");
  assert.deepStrictEqual(result, ["./a/**/b/**/*", "./a/**/b"]);
});

test("", async () => {
  await inFixtureDir("ignore/ignore-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [path.resolve("./a/a"), path.resolve("./a/b"), path.resolve("./a/c")]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-file-or-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [
      path.resolve("./a/a"),
      path.resolve("./a/b"),
      path.resolve("./a/c"),
      path.resolve("./b/a/a"),
      path.resolve("./b/a/b"),
      path.resolve("./b/a/c"),
      path.resolve("./b/b/a"),
      path.resolve("./b/c/a"),
      path.resolve("./c/a/a/a"),
      path.resolve("./c/a/a/b"),
      path.resolve("./c/a/a/c"),
      path.resolve("./c/a/b/a"),
      path.resolve("./c/a/b/b"),
      path.resolve("./c/a/b/c"),
      path.resolve("./c/a/c/a"),
      path.resolve("./c/a/c/b"),
      path.resolve("./c/a/c/c"),
      path.resolve("./c/b/a/a"),
      path.resolve("./c/b/a/b"),
      path.resolve("./c/b/a/c"),
      path.resolve("./c/b/b/a"),
      path.resolve("./c/b/c/a"),
      path.resolve("./c/c/a/a"),
      path.resolve("./c/c/a/b"),
      path.resolve("./c/c/a/c"),
      path.resolve("./c/c/b/a"),
      path.resolve("./c/c/c/a")
    ]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-file-type", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [
      path.resolve("./.js/a"),
      path.resolve("./.js/b"),
      path.resolve("./.js/c"),
      path.resolve("./a/a/a.js"),
      path.resolve("./a/b.js"),
      path.resolve("./a/c.js"),
      path.resolve("./b/a/b/c/a.js"),
      path.resolve("./b/a/b/b.js"),
      path.resolve("./b/a/b/c.js"),
      path.resolve("./b/a/a.js"),
      path.resolve("./a.js")
    ]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-file-type-in-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [path.resolve("./a/a.js"), path.resolve("./a/b.js"), path.resolve("./a/c.js")]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-file-type-in-nested-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [
      path.resolve("./a/a/b/a.js"),
      path.resolve("./a/a/b/b.js"),
      path.resolve("./a/b/b/a.js"),
      path.resolve("./a/b/b/b.js"),
      path.resolve("./a/b/a.js"),
      path.resolve("./a/b/b.js")
    ]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-nested-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [
      path.resolve("./a/a/b/a"),
      path.resolve("./a/a/b/b"),
      path.resolve("./a/b/a/a"),
      path.resolve("./a/b/a/b"),
      path.resolve("./a/b/b/a"),
      path.resolve("./a/b/b/b")
    ]);
  });
});

test("", async () => {
  await inFixtureDir("ignore/ignore-nested-file-or-directory", __dirname, async () => {
    const sut = new IgnoreFiles();
    const result = await sut.getIgnoredFiles();
    assertArrayContentsEqual(result, [
      path.resolve("./a/a/a/b"),
      path.resolve("./a/a/b/a"),
      path.resolve("./a/a/b/b"),
      path.resolve("./a/b/a/a"),
      path.resolve("./a/b/a/b"),
      path.resolve("./a/b/b/a"),
      path.resolve("./a/b/b/b")
    ]);
  });
});
