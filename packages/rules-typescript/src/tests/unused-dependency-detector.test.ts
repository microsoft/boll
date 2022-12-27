import * as assert from "assert";
import baretest from "baretest";
import { readFileSync } from "fs";
import { UnusedDependencyDetector } from "../unused-dependency-detector";
import { asBollDirectory, asBollFile, Failure, FileContext, parse, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";
import * as fs from "fs";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

export const test: any = baretest("Unused dep detector");

test("Should succeed because all declared dependencies are imported in code", async () => {
  const sut = new UnusedDependencyDetector({
    packageContextOverride: {
      dependencies: { foo: "0.0.1", bar: "0.0.2" },
      devDependencies: {
        baz: "0.0.3"
      }
    }
  });
  const results = sut.checkPackageImports([["foo"], ["bar", "foo"], ["baz", "bar"]], []);
  assert.deepStrictEqual(results.length, 1);
  assert.deepStrictEqual(results[0].status, ResultStatus.success);
});

test("Should succeed because all declared dependencies are imported in code (with more deps)", async () => {
  const sut = new UnusedDependencyDetector({
    packageContextOverride: {
      dependencies: {
        foo: "0.0.1",
        bar: "0.0.2",
        "@foo/bar": "0.0.3",
        "@bar/foo": "0.0.4",
        "@baz/foo": "0.0.5",
        test: "0.0.6"
      },
      devDependencies: {
        "@types/foo": "0.0.7",
        "@types/bar": "0.0.8",
        "@types/test": "0.0.9",
        baz: "0.0.10",
        "test-test": "0.0.11"
      }
    }
  });
  const results = sut.checkPackageImports(
    [["foo", "bar"], ["@foo/bar", "@bar/foo", "@baz/foo/bar"], ["test/lib/test/test"], ["baz", "test-test/lib"]],
    []
  );
  assert.deepStrictEqual(results.length, 1);
  assert.deepStrictEqual(results[0].status, ResultStatus.success);
});

test("Should succeed because `baz` is excluded", async () => {
  const sut = new UnusedDependencyDetector({
    exclude: ["baz"],
    packageContextOverride: {
      dependencies: { foo: "0.0.1", bar: "0.0.2" },
      devDependencies: {
        "@types/foo": "0.0.3",
        baz: "0.0.4"
      }
    }
  });
  const results = sut.checkPackageImports(
    [
      ["foo", "@test/test"],
      ["bar", "@foo/bar"],
      ["foo", "bar"]
    ],
    []
  );
  assert.deepStrictEqual(results.length, 1);
  assert.deepStrictEqual(results[0].status, ResultStatus.success);
});

test("Should succeed because all declared dependencies are imported in code and devDependencies are ignored", async () => {
  const sut = new UnusedDependencyDetector({
    ignoreDevDependencies: true,
    packageContextOverride: {
      dependencies: { foo: "0.0.1", bar: "0.0.2" },
      devDependencies: {
        baz: "0.0.3"
      }
    }
  });
  const results = sut.checkPackageImports([["foo"], ["bar"]], []);
  assert.deepStrictEqual(results.length, 1);
  assert.deepStrictEqual(results[0].status, ResultStatus.success);
});

test("Should fail because baz is not used as an import", async () => {
  const sut = new UnusedDependencyDetector({
    packageContextOverride: {
      dependencies: { foo: "0.0.1", bar: "0.0.2" },
      devDependencies: {
        baz: "0.0.3"
      }
    }
  });
  const results = sut.checkPackageImports(
    [
      ["foo", "@test/test"],
      ["bar", "@foo/bar"],
      ["foo", "bar"]
    ],
    []
  );
  assert.deepStrictEqual(results.length, 1);
  assert.deepStrictEqual(results[0].status, ResultStatus.failure);
  assert.deepStrictEqual(
    results[0].formattedMessage.includes("baz") && results[0].formattedMessage.includes("devDependency"),
    true
  );
});

test("Should fail because multiple deps are not used", async () => {
  const sut = new UnusedDependencyDetector({
    packageContextOverride: {
      dependencies: {
        foo: "0.0.1",
        bar: "0.0.2",
        "@foo/bar": "0.0.3",
        "@bar/foo": "0.0.4",
        "@baz/foo": "0.0.5",
        test: "0.0.6"
      },
      devDependencies: {
        "@types/foo": "0.0.7",
        "@types/bar": "0.0.8",
        "@types/test": "0.0.9",
        baz: "0.0.10",
        "test-test": "0.0.11"
      }
    }
  });

  const results = sut.checkPackageImports([["foo"], ["@foo/bar/baz"], ["test/lib/test/test"], ["test-test/lib"]], []);
  assert.deepStrictEqual(results.length, 4);
  results.forEach(r => assert.deepStrictEqual(r.status, ResultStatus.failure));
  results.forEach(r =>
    assert.deepStrictEqual(
      [
        ["bar", "dependency"],
        ["@bar/foo", "dependency"],
        ["@baz/foo", "dependency"],
        ["baz", "devDependency"]
      ].some(d => (r as Failure).text.startsWith(d[0]) && r.formattedMessage.includes(d[1])),
      true
    )
  );
  [{ bar: "dependency" }, { "@bar/foo": "dependency" }, { "@baz/foo": "dependency" }, { baz: "devDependency" }];
});

test("Fixture test should succeed because all declared dependencies are imported in code", async () => {
  await inFixtureDir("unused-deps/succeed", __dirname, async () => {
    const pkgJson = (await readFileAsync(asBollFile("package.json"))).toString();
    const sut = new UnusedDependencyDetector();
    const results = await sut.check(
      ["a.ts", "b.ts", "c.ts"].map(
        f =>
          new FileContext(asBollDirectory("."), parse(pkgJson), asBollFile(f), readFileSync(asBollFile(f)).toString())
      )
    );
    assert.deepStrictEqual(results.length, 1);
    assert.deepStrictEqual(results[0].status, ResultStatus.success);
  });
});

test("Fixture test should succeed because unused dependencies are excluded", async () => {
  await inFixtureDir("unused-deps/succeed-exclude", __dirname, async () => {
    const sut = new UnusedDependencyDetector({ exclude: ["baz"] });
    const pkgJson = (await readFileAsync(asBollFile("package.json"))).toString();
    const results = await sut.check(
      ["a.ts", "b.ts", "c.ts"].map(
        f =>
          new FileContext(asBollDirectory("."), parse(pkgJson), asBollFile(f), readFileSync(asBollFile(f)).toString())
      )
    );
    assert.deepStrictEqual(results.length, 1);
    assert.deepStrictEqual(results[0].status, ResultStatus.success);
  });
});

test("Fixture test should succeed because devDependencies are ignored", async () => {
  await inFixtureDir("unused-deps/succeed-ignore-dev-deps", __dirname, async () => {
    const sut = new UnusedDependencyDetector({ ignoreDevDependencies: true });
    const results = await sut.check(
      ["a.ts", "b.ts", "c.ts"].map(
        f =>
          new FileContext(
            asBollDirectory("."),
            parse(asBollFile("package.json")),
            asBollFile(f),
            readFileSync(asBollFile(f)).toString()
          )
      )
    );
    assert.deepStrictEqual(results.length, 1);
    assert.deepStrictEqual(results[0].status, ResultStatus.success);
  });
});

test("Fixture test should fail because a dependency is not imported in code", async () => {
  await inFixtureDir("unused-deps/fail-unused-dep", __dirname, async () => {
    const pkgJson = (await readFileAsync(asBollFile("package.json"))).toString();
    const sut = new UnusedDependencyDetector();
    const results = await sut.check(
      ["a.ts", "b.ts", "c.ts"].map(
        f =>
          new FileContext(asBollDirectory("."), parse(pkgJson), asBollFile(f), readFileSync(asBollFile(f)).toString())
      )
    );
    assert.deepStrictEqual(results.length, 1);
    assert.deepStrictEqual(results[0].status, ResultStatus.failure);
    assert.deepStrictEqual(
      (results[0] as Failure).text.startsWith("baz") && results[0].formattedMessage.includes("dependency"),
      true
    );
  });
});

test("Fixture test should fail because several dependencies are not imported in code", async () => {
  await inFixtureDir("unused-deps/fail-unused-deps", __dirname, async () => {
    const sut = new UnusedDependencyDetector();
    const pkgJson = (await readFileAsync(asBollFile("package.json"))).toString();
    const results = await sut.check(
      ["a.ts", "b.ts", "c.ts"].map(
        f =>
          new FileContext(asBollDirectory("."), parse(pkgJson), asBollFile(f), readFileSync(asBollFile(f)).toString())
      )
    );
    assert.deepStrictEqual(results.length, 4);
    results.forEach(r => assert.deepStrictEqual(r.status, ResultStatus.failure));
    results.forEach(r => {
      assert.deepStrictEqual(
        [
          ["baz", "dependency"],
          ["test", "dependency"],
          ["foo-baz", "dependency"],
          ["foo-bar", "devDependency"]
        ].some(e => {
          return (r as Failure).text.startsWith(e[0]) && r.formattedMessage.includes(e[1]);
        }),
        true
      );
    });
  });
});
