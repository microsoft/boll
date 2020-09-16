import { findConfiguration } from "tslint/lib/configuration";
import { BollFile } from "./boll-file";

export class TSLintRules {
  public getSourceFileConfig(file: BollFile) {
    return findConfiguration(null, file);
  }
}
