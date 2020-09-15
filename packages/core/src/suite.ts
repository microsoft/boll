import fs from "fs";
import path from "path";
import { asBollDirectory } from "./boll-directory";
import { FileGlob, Rule } from "./types";
import { getSourceFile } from "./file-context";
import { Logger } from "./logger";
import { Package } from "./package";
import { ResultSet } from "./result-set";
import { TypescriptSourceGlob } from "./glob";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);

export class Suite {
  private _hasRun = false;
  public fileGlob: FileGlob = new TypescriptSourceGlob();

  public checks: Rule[] = [];

  get hasRun(): boolean {
    return this._hasRun;
  }

  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const packageContext = await this.loadPackage(logger);
    const sourceFilePaths = await this.fileGlob.findFiles();
    const projectRoot = asBollDirectory(process.cwd());
    const sourceFiles = await Promise.all(
      sourceFilePaths.map(filename => getSourceFile(projectRoot, filename, packageContext))
    );

    this.checks.forEach(r => {
      sourceFiles.forEach(s => {
        if (s.shouldSkip(r)) return;
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
