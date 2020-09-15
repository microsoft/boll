import * as assert from "assert";
import baretest from "baretest";
import * as path from "path";
import { asBollFile } from "../lib/boll-file";
import { asBollLineNumber } from "../lib/boll-line-number";
import { Success, Failure } from "../lib/result-set";

export const test = baretest("Output formatter");

const assertContains = (needle: string, haystack: string) => {
  const message = `Expected '${haystack}' to contain '${needle}'`;
  assert.ok(haystack.includes(needle), message);
};

test("includes the name of the source file", () => {
  const sut = new Failure("ignore", asBollFile("src/foo.tsx"), asBollLineNumber(-1), "ignore");
  assertContains(path.normalize("src/foo.tsx"), sut.formattedMessage);
});

test("includes the line of the offense", () => {
  const sut = new Failure("ignore", asBollFile("ignore"), asBollLineNumber(3), "ignore");
  assertContains(":3", sut.formattedMessage);
});

test("includes the name of the rule", () => {
  const sut = new Failure("ExampleRule", asBollFile("ignore"), asBollLineNumber(-1), "ignore");
  assertContains("ExampleRule", sut.formattedMessage);
});

test("includes descriptive text", () => {
  const sut = new Failure("ignore", asBollFile("ignore"), asBollLineNumber(-1), "lorem ipsum dolor");
  assertContains("lorem ipsum dolor", sut.formattedMessage);
});

test("variations", () => {
  const sut = new Failure("OtherRule", asBollFile("src/bar.ts"), asBollLineNumber(1), "ignore");
  assertContains("OtherRule", sut.formattedMessage);
  assertContains(`${path.normalize("src/bar.ts")}:1`, sut.formattedMessage);
});

test("success", () => {
  const sut = new Success("OtherRule");
  assertContains("OtherRule", sut.formattedMessage);
  assertContains("Succeeded", sut.formattedMessage);
});
