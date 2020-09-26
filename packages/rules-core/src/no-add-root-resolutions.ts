import {
  PackageRule,
  Result,
  Success,
  Failure,
  asBollFile,
  asBollLineNumber,
  FileContext,
  isRoot,
  asPackageJson,
  getFileContentOnBranch,
  BollDirectory
} from "@boll/core";

const ruleName = "NoAddRootResolutions";
const success = [new Success(ruleName)];

/**
 * NoAddRootResolutions makes sure no new dependencies are added to
 * the `resolutions` field in the root `package.json`.
 */
export class NoAddRootResolutions implements PackageRule {
  constructor(private branch?: string, private root?: BollDirectory) {}

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (isRoot(file.filename, this.root)) {
      const packageJson = asPackageJson(file);
      const mainBranchPackageJson = asPackageJson(
        new FileContext(
          file.packageRoot,
          file.packageContext,
          file.filename,
          getFileContentOnBranch(asBollFile(file.filename), this.branch || "master")
        )
      );
      if (!mainBranchPackageJson.resolutions || (mainBranchPackageJson.resolutions && !packageJson.resolutions))
        return success;
      const resolutions = new Set<string>();
      Object.keys(mainBranchPackageJson.resolutions).forEach(d => resolutions.add(d));
      const addedDeps = Object.keys(packageJson.resolutions!).filter(d => !resolutions.has(d));
      const failures = addedDeps.map(
        d =>
          new Failure(
            ruleName,
            asBollFile(file.filename),
            asBollLineNumber(0),
            `Detected added resolution to root package.json: ${d}`
          )
      );
      return failures.length ? failures : success;
    }
    return success;
  }
}
