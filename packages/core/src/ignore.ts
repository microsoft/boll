import fs from "fs";
import * as path from "path";
import { glob } from "glob";
import parseGitignore from "parse-gitignore";
import { promisify } from "util";
import { asBollFile, BollFile } from "./boll-file";
const globAsync = promisify(glob);

export interface IgnoredFilesOptions {
  ignoreFileName?: string;
}

export class IgnoredFiles {
  private gitIgnoreFileName = "./gitignore";

  constructor(private options?: IgnoredFilesOptions) {}

  async getIgnoredFiles(): Promise<BollFile[]> {
    // TODO: This returns an array but to start it will only ever
    // have one or zero elements since `getIgnoreFiles` only searches
    // for a root level `.gitignore`
    const ignoreFiles = await this.getIgnoreFiles();

    if (!ignoreFiles.length) {
      return [];
    }

    const ignorePatterns = this.getIgnorePatternsFromFile(ignoreFiles[0]);
    const globs = this.getGlobsFromIgnorePatterns(ignorePatterns);
    const ignoredFiles = [];

    for (const glob of globs) {
      const files = await globAsync(glob, { dot: true, nodir: true });
      const filesAsBollFiles = files.map(f => asBollFile(f));
      ignoredFiles.push(...filesAsBollFiles);
    }

    return Array.from(new Set(ignoredFiles));
  }

  async getIgnoreFiles(): Promise<string[]> {
    const ignoreFileName = (this.options && this.options.ignoreFileName) ?? this.gitIgnoreFileName;
    return fs.existsSync(path.resolve(ignoreFileName)) ? [path.resolve(ignoreFileName)] : [];

    // TODO: Right now just starting by finding a root level `.gitignore`,
    // eventually want to make it possible to find package level `.gitignore`
    // files and merge them with ones found at the root.

    // return await globAsync("./**/{.gitignore}/**/*");
  }

  getIgnorePatternsFromFile(ignoreFile: string) {
    return parseGitignore(fs.readFileSync(ignoreFile));
  }

  getGlobsFromIgnorePatterns(ignorePatterns: string[]) {
    return ignorePatterns.reduce<string[]>((patterns, pattern) => {
      patterns.push(...this.getGlobFromIgnorePattern(pattern));
      return patterns;
    }, []);
  }

  getGlobFromIgnorePattern(ignorePattern: string): string[] {
    const isNegated = ignorePattern.startsWith("!");
    const isRelative = ignorePattern.substring(0, ignorePattern.length - 1).includes("/");
    const isDir = ignorePattern.endsWith("/");
    const endsWithAsterisk = ignorePattern.endsWith("*");
    const pattern = isNegated ? ignorePattern.substring(1).replace("\\", "") : ignorePattern.replace("\\", "");

    // TODO: Need to figure out how to deal with patterns starting with `!`
    if (isNegated) {
      return [];
    }

    if (isRelative && isDir) {
      return pattern.startsWith("/")
        ? [`.${pattern}**/*`]
        : pattern.startsWith("./")
        ? [`${pattern}**/*`]
        : [`./${pattern}**/*`];
    } else if (isRelative && !isDir) {
      if (endsWithAsterisk) {
        return pattern.startsWith("/") ? [`.${pattern}`] : pattern.startsWith("./") ? [`${pattern}`] : [`./${pattern}`];
      } else {
        return pattern.startsWith("/")
          ? [`.${pattern}/**/*`, `.${pattern}`]
          : pattern.startsWith("./")
          ? [`${pattern}/**/*`, `${pattern}`]
          : [`./${pattern}/**/*`, `./${pattern}`];
      }
    } else if (!isRelative && isDir) {
      return [`./**/${pattern}**/*`];
    } else {
      return endsWithAsterisk ? [`./**/${pattern}`] : [`./**/${pattern}/**/*`, `./**/${pattern}`];
    }
  }
}
