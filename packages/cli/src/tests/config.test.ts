import * as assert from "assert";
import baretest from "baretest";
import { Config, RecommendedConfig } from "../lib/config";

export const test = baretest("Config");

test("should load default suite when extended from recommended", async () => {
  const sut = new Config();
  sut.load({
    extends: "boll:recommended",
  });
  const suite = sut.buildSuite();
  assert.equal(suite.checks.length, RecommendedConfig.checks!.length);
});
