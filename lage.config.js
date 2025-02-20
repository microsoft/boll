// @ts-check
/**
 * Lage config (the types are slightly incorrect about what's required/optional)
 * @type {Partial<Omit<import('lage').ConfigOptions, 'cacheOptions'>> & { cacheOptions?: Partial<import('lage').CacheOptions> }}
 */
const config = {
  pipeline: {
    build: ["^build"],
    docs: ["build"],
    test: ["build"]
  },
  npmClient: "yarn",
  cacheOptions: {
    // These are relative to the git root, and affects the hash of the cache.
    // Any of these file changes will invalidate the cache.
    environmentGlob: [
      // Folder globs MUST end with **/* to include all files!
      "!.yarn/**/*",
      "!node_modules/**/*",
      "!**/node_modules/**/*",
      ".github/workflows/*",
      ".*rc",
      "*.config.js",
      "package.json",
      "yarn.lock"
    ],
    /**
     * Subset of files in package directories that will be saved into the cache.
     */
    outputGlob: ["dist/**/*", "apidocs/**/*", "src/api/**/*"]
  }
};
module.exports = config;
