import * as assert from "assert";
import * as path from "path";
import baretest from "baretest";
import { inFixtureDir } from "./test-helper";
import { ConfigRuleBase } from "@boll/core";

export const test: any = baretest("Config Rule Base");

test("should correctly parse JS config", async () => {
  await inFixtureDir("configs", async () => {
    const sut = new ConfigRuleBase({ path: path.resolve(process.cwd(), "./base-config.js") });
    const data = await sut._rawData;
    assert.deepEqual(data, { foo: "bar", test: { foo: "bar" }, bar: [1, 2, 3] });
  });
});

test("should correctly parse YAML config", async () => {
  await inFixtureDir("configs", async () => {
    const sut = new ConfigRuleBase({ path: path.resolve(process.cwd(), "./base-config.yaml") });
    const data = await sut._rawData;
    assert.deepEqual(data, { foo: "bar", test: { foo: "bar" }, bar: [1, 2, 3] });
  });
});

test("should correctly parse JSON config", async () => {
  await inFixtureDir("configs", async () => {
    const sut = new ConfigRuleBase({ path: path.resolve(process.cwd(), "./base-config.json") });
    const data = await sut._rawData;
    assert.deepEqual(data, { foo: "bar", test: { foo: "bar" }, bar: [1, 2, 3] });
  });
});
