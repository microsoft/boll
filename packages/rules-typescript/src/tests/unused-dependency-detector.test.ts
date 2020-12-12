import * as assert from "assert";
import baretest from "baretest";
import { UnusedDependencyDetector } from "../unused-dependency-detector";
import { asBollDirectory, asBollFile, FileContext, getSourceFile, Package, ResultStatus } from "@boll/core";
import { inFixtureDir } from "@boll/test-internal";

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
      ].some(d => r.formattedMessage.includes(d[0]) && r.formattedMessage.includes(d[1])),
      true
    )
  );
  [{ bar: "dependency" }, { "@bar/foo": "dependency" }, { "@baz/foo": "dependency" }, { baz: "devDependency" }];
});
