import { readFileSync } from "fs";
import { BollFile } from "./boll-file";

export type DependencyMap = { [depdencyName: string]: string };
export class Package {
  constructor(public dependencies: DependencyMap, public devDependencies: DependencyMap) {}

  public static parse(file: BollFile): Package {
    try {
      const fileContents = readFileSync(file).toString();
      const json = JSON.parse(fileContents);
      return new Package(json["dependencies"] || {}, json["devDependencies"] || {});
    } catch (e) {
      return new Package({}, {});
    }
  }
}
