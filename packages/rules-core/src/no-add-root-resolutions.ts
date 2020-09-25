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
  getFileContentOnBranch
} from "@boll/core";

const ruleName = "NoAddRootResolutions";
const success = [new Success(ruleName)];
export class NoAddRootResolutions implements PackageRule {
  constructor(private branch?: string) {}

  get name(): string {
    return ruleName;
  }

  async check(file: FileContext): Promise<Result[]> {
    if (isRoot(file.filename)) {
      const packageManifest = asPackageJson(file);
      const mainBranchPackageManifest = asPackageJson(
        new FileContext(
          file.packageRoot,
          file.packageContext,
          file.filename,
          getFileContentOnBranch(asBollFile(file.filename), this.branch || "master")
        )
      );
      if (
        !mainBranchPackageManifest.resolutions ||
        (mainBranchPackageManifest.resolutions && !packageManifest.resolutions)
      )
        return success;
      const resolutions = new Set<string>();
      Object.keys(mainBranchPackageManifest.resolutions).forEach(d => resolutions.add(d));
      const addedDeps = Object.keys(packageManifest.resolutions!).filter(d => !resolutions.has(d));
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
