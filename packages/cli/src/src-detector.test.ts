import baretest from "baretest";
import * as assert from "assert";
const test = baretest("Source detector");

test("Should pass if no `src` detected in source files", async () => {
  assert.equal(1, 2);
});

test.run();
