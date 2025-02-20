// @ts-check
/** @type {import("beachball").BeachballConfig} */
const config = {
  access: "public",
  changehint: 'Run "yarn change" to generate a change file',
  branch: "main",
  groupChanges: true,
  ignorePatterns: ["**/fixtures/**/*", "**/tests/**/*"],
  disallowedChangeTypes: [
    "prerelease",
    // If a major release is needed, temporarily remove this line.
    "major"
  ]
};
module.exports = config;
