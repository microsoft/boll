import { Logger } from "./logger";
import { ResultSet } from "./result-set";
import { SrcDetector } from "../rules/src-detector";
import ts from "typescript";
import fs from "fs";
import path from "path";
import glob from "glob";
import { promisify } from "util";
const readFileAsync = promisify(fs.readFile);
const globAsync = promisify(glob);

async function getSourceFile(file: string) {
  const normalizedFile = path.normalize(file).replace(/\\/g, "/");
  const content = await readFileAsync(normalizedFile);
  return ts.createSourceFile(
    normalizedFile,
    content.toString("utf8"),
    ts.ScriptTarget.ES5,
    true
  );
}

export class Suite {
  async run(logger: Logger): Promise<ResultSet> {
    this._hasRun = true;

    const resultSet = new ResultSet();
    const rules = [new SrcDetector()];
    const sourceFilePaths = await globAsync("./**/*.ts");
    const sourceFiles = await Promise.all(sourceFilePaths.map(getSourceFile));

    rules.forEach((r) => {
      sourceFiles.forEach((s) => {
        const result = r.check(s);
        result.filename = s.fileName;
        resultSet.add(result);
      });
    });

    return resultSet;
  }

  private _hasRun = false;
  get hasRun(): boolean {
    return this._hasRun;
  }
}
