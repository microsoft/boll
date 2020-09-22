import glob from "glob";
import { asBollFile, BollFile } from "./boll-file";
import { FileGlob, FileGlobOptions } from "./types";
import { promisify } from "util";
const globAsync = promisify(glob);

class SourceGlob implements FileGlob {
  constructor(
    private globPattern: string,
    private fileGlobOptions: FileGlobOptions = {},
    private filterString?: string
  ) {}

  async findFiles(): Promise<BollFile[]> {
    let paths = await globAsync(this.globPattern);
    if (this.filterString) paths = paths.filter(path => !path.includes(this.filterString!));

    if (this.fileGlobOptions.exclude) {
      for (const excludeGlob of this.fileGlobOptions.exclude) {
        const exclusions = await globAsync(excludeGlob);
        const filteredPaths = paths.filter(p => !exclusions.includes(p));
        paths = filteredPaths;
      }
    }

    if (this.fileGlobOptions.include) {
      for (const includeGlob of this.fileGlobOptions.include) {
        const inclusions = await globAsync(includeGlob);
        inclusions.forEach(i => {
          if (!paths.includes(i)) {
            paths.push(i);
          }
        });
      }
    }

    return paths.map(asBollFile);
  }

  get include(): string[] {
    return this.fileGlobOptions.include || [];
  }

  get exclude(): string[] {
    return this.fileGlobOptions.exclude || [];
  }
}

export class TypescriptSourceGlob extends SourceGlob {
  constructor(private options: FileGlobOptions = {}) {
    super("./{,!(node_modules)/**}/*.ts?(x)", options, "node_modules");
  }
}

export class PackageManifestGlob extends SourceGlob {
  constructor(private options: FileGlobOptions = {}) {
    super("./{,!(node_modules)/**}/package.json", options, "node_modules");
  }
}
