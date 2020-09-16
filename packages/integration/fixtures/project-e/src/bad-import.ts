import { foo } from "@foo/bar/node_modules/@bar/some/path";

/**
 * This serves to test the flagging of references to
 * node_modules directories in imports/code.
 * */

// Create a string with path containing node_modules
const scriptSrc = "../../node_modules/@foo/some/path";
