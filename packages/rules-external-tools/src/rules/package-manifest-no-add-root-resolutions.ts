import {
  PackageManifestRule,
  PackageManifestContext,
  Result,
  Success,
  Failure,
  asBollFile,
  asBollLineNumber
} from "@boll/core";

const ruleName = "PackageManifestNoAddRootResolutions";
const success = [new Success(ruleName)];
export class PackageManifestNoAddRootResolutions implements PackageManifestRule {
  constructor(private branch?: string) {}

  get name(): string {
    return ruleName;
  }

  async check(packageManifestContext: PackageManifestContext): Promise<Result[]> {
    if (packageManifestContext.isRoot) {
      const packageManifest = await packageManifestContext.getPackageManifest();
      const mainBranchPackageManifest = await packageManifestContext.getPackageManifestOnMainBranch(this.branch);
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
            asBollFile(packageManifestContext.fileName),
            asBollLineNumber(0),
            `Detected added resolution to root package.json: ${d}`
          )
      );
      return failures.length ? failures : success;
    }
    return success;
  }
}
