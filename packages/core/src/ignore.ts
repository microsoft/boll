import fs from "fs";
import * as path from "path";
import fg from "fast-glob";
import parseGitignore from "parse-gitignore";
import { asBollFile, BollFile } from "./boll-file";
import { getIgnoreFiles } from "./git-utils";

export interface IgnoredFilesOptions {
  ignoreFileName?: string;
  root?: string;
}

interface IgnoreFileToIgnorePatterns {
  [file: string]: IgnorePattern[];
}

interface IgnoreFileToGlobs {
  [file: string]: GlobsForIgnorePattern[];
}

export class IgnoredFiles {
  private ignoreFileName: string;
  private root: string;

  constructor(private options?: IgnoredFilesOptions) {
    // Allow an option to specify ignore file name (used in testing), otherwise default to git ignore file name
    this.ignoreFileName = (this.options && this.options.ignoreFileName) ?? ".gitignore";
    // Allow an option to specify the root where it will look for ignore files,
    // otherwise just search in the current working directory
    this.root = (this.options && this.options.root) ?? process.cwd();
  }

  async getIgnoredFiles(): Promise<BollFile[]> {
    const ignoreFiles = await this.getIgnoreFiles();

    if (!ignoreFiles.length) {
      return [];
    }

    const ignoreFileToIgnorePatterns = this.getIgnorePatternsFromFiles(ignoreFiles);
    const ignoreFileToGlobs = this.getGlobsFromIgnorePatterns(ignoreFileToIgnorePatterns);
    const ignoredFiles: BollFile[] = [];
    const ignoredFilesPromises: Promise<void>[] = [];

    for (const ignoreFiles of Object.keys(ignoreFileToGlobs))
      for (const globsForIgnoreFile of ignoreFileToGlobs[ignoreFiles]) {
        const ignore =
          process.cwd().startsWith(globsForIgnoreFile.cwd) && process.cwd().length !== globsForIgnoreFile.cwd.length
            ? process
                .cwd()
                .substring(globsForIgnoreFile.cwd.length + 1)
                .split(path.sep)
                .map((v, i, a) => `./${a.slice(0, i).join("/")}${i > 0 ? "/" : ""}!(${v})/**`)
            : [];
        for (const glob of globsForIgnoreFile.globs) {
          ignoredFilesPromises.push(
            fg(glob, { dot: true, cwd: globsForIgnoreFile.cwd, ignore }).then(files => {
              const filesAsBollFiles = files.map(f => asBollFile(path.resolve(globsForIgnoreFile.cwd, f)));
              ignoredFiles.push(...filesAsBollFiles);
            })
          );
        }
      }

    await Promise.all(ignoredFilesPromises);
    return Array.from(new Set(ignoredFiles));
  }

  private async getIgnoreFiles(): Promise<string[]> {
    return (
      (await getIgnoreFiles(this.root, this.ignoreFileName))
        // Only want ignore files that apply to the current working directory
        .filter(p => process.cwd().startsWith(path.dirname(p)))
        // Sanity check to make sure it only returns files that exist
        .filter(p => fs.existsSync(p))
    );
  }

  private getIgnorePatternsFromFiles(ignoreFiles: string[]): IgnoreFileToIgnorePatterns {
    return ignoreFiles.reduce<IgnoreFileToIgnorePatterns>((ignoreFileToIgnorePatterns, ignoreFile) => {
      ignoreFileToIgnorePatterns[ignoreFile] = parseGitignore(fs.readFileSync(ignoreFile)).map(
        p => new IgnorePattern(p, ignoreFile)
      );
      return ignoreFileToIgnorePatterns;
    }, {});
  }

  private getGlobsFromIgnorePatterns(ignoreFileToIgnorePatterns: IgnoreFileToIgnorePatterns): IgnoreFileToGlobs {
    return Object.keys(ignoreFileToIgnorePatterns).reduce<IgnoreFileToGlobs>((ignoreFileToGlobs, file) => {
      const ignorePatterns = ignoreFileToIgnorePatterns[file];
      ignoreFileToGlobs[file] = ignorePatterns.map(p => new GlobsForIgnorePattern(p));
      return ignoreFileToGlobs;
    }, {});
  }
}

export class IgnorePattern {
  public pattern: string;
  public isNegated: boolean;
  public isRelative: boolean;
  public isDir: boolean;
  public endsWithAsterisk: boolean;

  constructor(initialPattern: string, public ignoreFile: string) {
    this.isNegated = initialPattern.startsWith("!");
    this.isRelative = initialPattern.slice(0, -1).includes("/");
    this.isDir = initialPattern.endsWith("/");
    this.endsWithAsterisk = initialPattern.endsWith("*");
    this.pattern = initialPattern.substring(this.isNegated ? 1 : 0).replace(/\\/g, "");
  }
}

export class GlobsForIgnorePattern {
  public globs: string[];
  public cwd: string;

  constructor(public ignorePattern: IgnorePattern) {
    this.globs = this.getGlobFromIgnorePattern(this.ignorePattern);
    // Current working directory for the glob is whatever directory the ignore file is located in;
    // this is necessary because some ignore patterns are relative to where the ignore file is located
    this.cwd = path.dirname(this.ignorePattern.ignoreFile);
  }

  private getGlobFromIgnorePattern(ignorePattern: IgnorePattern): string[] {
    // TODO: Need to figure out how to deal with patterns starting with `!`
    if (ignorePattern.isNegated) {
      return [];
    }

    if (ignorePattern.isRelative && ignorePattern.isDir) {
      return ignorePattern.pattern.startsWith("/")
        ? [`.${ignorePattern.pattern}**/*`]
        : ignorePattern.pattern.startsWith("./")
        ? [`${ignorePattern.pattern}**/*`]
        : [`./${ignorePattern.pattern}**/*`];
    } else if (ignorePattern.isRelative && !ignorePattern.isDir) {
      if (ignorePattern.endsWithAsterisk) {
        return ignorePattern.pattern.startsWith("/")
          ? [`.${ignorePattern.pattern}`]
          : ignorePattern.pattern.startsWith("./")
          ? [`${ignorePattern.pattern}`]
          : [`./${ignorePattern.pattern}`];
      } else {
        return ignorePattern.pattern.startsWith("/")
          ? [`.${ignorePattern.pattern}/**/*`, `.${ignorePattern.pattern}`]
          : ignorePattern.pattern.startsWith("./")
          ? [`${ignorePattern.pattern}/**/*`, `${ignorePattern.pattern}`]
          : [`./${ignorePattern.pattern}/**/*`, `./${ignorePattern.pattern}`];
      }
    } else if (!ignorePattern.isRelative && ignorePattern.isDir) {
      return [`./**/${ignorePattern.pattern}**/*`];
    } else {
      return ignorePattern.endsWithAsterisk
        ? [`./**/${ignorePattern.pattern}`]
        : [`./**/${ignorePattern.pattern}/**/*`, `./**/${ignorePattern.pattern}`];
    }
  }
}
