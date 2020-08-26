import fs from "fs";
import glob from "glob";
import path from "path";
import { Logger } from "./logger";
import { Package } from "./package";
import { PackageRule } from "./package-rule";
import { ResultSet } from "./result-set";
import { CrossPackageDependencyDetector } from "../rules/cross-package-dependency-detector";
import { SrcDetector } from "../rules/src-detector";
import { TransitiveDependencyDetector } from "../rules/transitive-dependency-detector";
import { promisify } from "util";
import { asBollDirectory } from "./boll-directory";
import { getSourceFile } from "./file-context";
import { RedundantImportsDetector } from "../rules/redundant-imports-detector";
import { NodeModulesReferenceDetector } from "../rules/node-modules-reference-detector";
const readFileAsync = promisify(fs.readFile);
const globAsync = promisify(glob);

export class Suite {
  private _hasRun = false;

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const rules: PackageRule[] = [
      new SrcDetector(),
      new TransitiveDependencyDetector(),
      new CrossPackageDependencyDetector(),
      new RedundantImportsDetector(),
      new NodeModulesReferenceDetector(),
    ];
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await globAsync("./{,!(node_modules)/**}/*.ts");
    const projectRoot = asBollDirectory(process.cwd());
    const sourceFiles = await Promise.all(
      sourceFilePaths.map((filename) => getSourceFile(projectRoot, filename, packageContext))
    );

    rules.forEach((r) => {
      sourceFiles.forEach((s) => {
        const results = r.check(s);
        resultSet.add(results);
      });
    });

    return resultSet;
  }

  private async loadPackage(logger: Logger) {
    const filename = path.resolve("./package.json");
    try {
      const packageBuffer = await readFileAsync(filename);
      const packageJson = JSON.parse(packageBuffer.toString("utf-8"));
      const packageContext = new Package(packageJson.dependencies || {});
      return packageContext;
    } catch (e) {
      logger.error(`Error loading ${filename}`);
      throw e;
    }
  }
}
