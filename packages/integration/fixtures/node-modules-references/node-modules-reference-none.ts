import * as FakeImport from "@foo/bar/lib/fake";

/**
 * Multiline comment test
 * node_modules
 */
const dummyCode = "foo";
const moreDummyCode = dummyCode.split("o");
const fakeObject = new FakeImport(dummyCode, moreDummyCode);

// This is a comment containing the word node_modules. This should not be flagged.
fakeObject.doNothing(); // Inline comment containing node_modules.
