import fs from "graceful-fs";
import ts from "typescript";
import { promisify } from "util";
import { BollDirectory } from "./boll-directory";
import { BollFile, asBollFile } from "./boll-file";
import { ESLintRules } from "./eslint-rules";
import { DependencyMap, Package } from "./package";
import { PackageRule } from "./types";
const readFileAsync = promisify(fs.readFile);

export class FileContext {
  private _parsedIgnoreChecks = false;
  private _ignoredChecks: string[] = [];
  private _sourceFileLoaded: boolean = false;
  private _sourceFile?: ts.SourceFile = undefined;
  private _eslintConfigLoaded: boolean = false;
  private _eslintConfig?: Promise<any> = undefined;

  constructor(
    public packageRoot: BollDirectory,
    public packageContext: Package,
    public filename: BollFile,
    public content: string,
    private eslintRules: ESLintRules
  ) {}

  get source(): ts.SourceFile {
    if (this._sourceFileLoaded) return this._sourceFile!;
    this._sourceFile = ts.createSourceFile(this.filename, this.content, ts.ScriptTarget.ES5, true);
    this._sourceFileLoaded = true;
    return this._sourceFile;
  }

  get eslintConfig(): Promise<any> {
    if (this._eslintConfigLoaded) return this._eslintConfig!;
    this._eslintConfig = this.eslintRules.getSourceFileConfig(asBollFile(this.source.fileName));
    this._eslintConfigLoaded = true;
    return this._eslintConfig;
  }

  get packageDependencies(): DependencyMap {
    return this.packageContext.dependencies;
  }

  get ignoredChecks(): string[] {
    if (this._parsedIgnoreChecks) return this._ignoredChecks;

    this.content.match(/boll-disable.*/g)?.forEach((line) => {
      const capture = line.match(/boll-disable\s([\w,\s-]*)/);
      if (capture && capture.length > 0 && capture[1]) {
        capture[1]
          .split(",")
          .map((x) => x.trim())
          .forEach((rule) => this._ignoredChecks.push(rule));
      }
    });

    this._parsedIgnoreChecks = true;
    return this._ignoredChecks;
  }

  shouldSkip(r: PackageRule) {
    return this.ignoredChecks.includes(r.name);
  }
}

export async function getSourceFile(
  projectRoot: BollDirectory,
  filename: string,
  packageContext: Package,
  eslintRules: ESLintRules
): Promise<FileContext> {
  const bollFile = asBollFile(filename);
  const content = await readFileAsync(bollFile);
  return new FileContext(projectRoot, packageContext, bollFile, content.toString("utf8"), eslintRules);
}
