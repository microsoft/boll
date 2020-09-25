import glob from "glob";
import { asBollFile, BollFile } from "./boll-file";
import { FileGlob, FileGlobOptions } from "./types";
import { promisify } from "util";
const globAsync = promisify(glob);

export class TypescriptSourceGlob implements FileGlob {
  public include: string[] = [];
  public exclude: string[] = [];

  constructor(options: FileGlobOptions = {}) {
    if (options.include) {
      this.include = options.include;
    }
    if (options.exclude) {
      this.exclude = options.exclude;
    }
  }

  async findFiles(): Promise<BollFile[]> {
    let paths = await globAsync("./{,!(node_modules)/**}/*.ts?(x)");
    paths = paths.filter(path => !path.includes("node_modules"));

    for (const excludeGlob of this.exclude) {
      const exclusions = await globAsync(excludeGlob);
      const filteredPaths = paths.filter(p => !exclusions.includes(p));
      paths = filteredPaths;
    }

    for (const includeGlob of this.include) {
      const inclusions = await globAsync(includeGlob);
      inclusions.forEach(i => {
        if (!paths.includes(i)) {
          paths.push(i);
        }
      });
    }

    return paths.map(asBollFile);
  }
}

export class PackageJsonGlob implements FileGlob {
  public include: string[] = [];
  public exclude: string[] = [];

  constructor(options: FileGlobOptions = {}) {
    if (options.include) {
      this.include = options.include;
    }
    if (options.exclude) {
      this.exclude = options.exclude;
    }
  }

  async findFiles(): Promise<BollFile[]> {
    let paths = await globAsync("./package.json");
    paths = paths.filter(path => !path.includes("node_modules"));

    for (const excludeGlob of this.exclude) {
      const exclusions = await globAsync(excludeGlob);
      const filteredPaths = paths.filter(p => !exclusions.includes(p));
      paths = filteredPaths;
    }

    for (const includeGlob of this.include) {
      const inclusions = await globAsync(includeGlob);
      inclusions.forEach(i => {
        if (!paths.includes(i)) {
          paths.push(i);
        }
      });
    }

    return paths.map(asBollFile);
  }
}
