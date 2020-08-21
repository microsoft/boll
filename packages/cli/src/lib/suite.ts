import { Logger } from "./logger";
import { ResultSet } from "./result-set";
import { SrcDetector } from "../rules/src-detector";
import ts from "typescript";
import fs from "fs";
import path from "path";
import glob from "glob";
import { promisify } from "util";
import { TransitiveDependencyDetector } from "../rules/transitive-dep-detector";
import { Package } from "./package";
import { FileContext } from "./file-context";
const readFileAsync = promisify(fs.readFile);
const globAsync = promisify(glob);

async function getSourceFile(
  filename: string,
  packageContext: Package
): Promise<FileContext> {
  const normalizedFile = path.normalize(filename).replace(/\\/g, "/");
  const content = await readFileAsync(normalizedFile);
  const source = ts.createSourceFile(
    normalizedFile,
    content.toString("utf8"),
    ts.ScriptTarget.ES5,
    true
  );
  return new FileContext(packageContext, filename, source);
}

export class Suite {
  private _hasRun = false;

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const rules = [new SrcDetector(), new TransitiveDependencyDetector()];
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await globAsync("./{,!(node_modules)/**}/*.ts");
    const sourceFiles = await Promise.all(
      sourceFilePaths.map((filename) => getSourceFile(filename, packageContext))
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
