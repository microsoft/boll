import * as FakeImport from "@foo/bar/node_modules/foo/bar";

const dummyCode = "foo";
const moreDummyCode = dummyCode.split("o");
const dummyScriptPath = "../../node_modules/some-package/lib/some-script.js";
const fakeObject = new FakeImport(dummyCode, moreDummyCode, dummyScriptPath);

// This is a comment containing the word node_modules. This should not be flagged.
fakeObject.doNothing();
