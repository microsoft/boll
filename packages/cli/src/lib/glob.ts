import glob from "glob";
import { asBollFile, BollFile } from "./boll-file";
import { FileGlob } from "./types";
import { promisify } from "util";
const globAsync = promisify(glob);

export class TypescriptSourceGlob implements FileGlob {
  async findFiles(): Promise<BollFile[]> {
    const paths = await globAsync("./{,!(node_modules)/**}/*.ts?(x)");
    return paths.map(asBollFile);
  }
}
