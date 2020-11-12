import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { getRepoRoot } from "../git-utils";

export const test: any = baretest("Git Utils");

test("Should correctly parse repo root", async () => {
  const sut = getRepoRoot;
  const result = sut();
  assert.deepStrictEqual(result, path.resolve(process.cwd(), "../.."));
});
