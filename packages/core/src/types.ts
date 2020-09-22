import { BollFile } from "./boll-file";
import { FileContext } from "./file-context";
import { PackageManifestContext } from "./package-manifest-context";
import { Result } from "./result-set";

export interface CheckConfiguration {
  rule: string;
  options?: {};
}

export interface ConfigDefinition {
  name?: string;
  checks?: CheckConfiguration[];
  extends?: string;
  exclude?: string[];
  include?: string[];
}

export interface Rule {
  name: string;
}
export interface SourceFileRule extends Rule {
  check(file: FileContext): Promise<Result[]>;
}

export interface PackageManifestRule extends Rule {
  check(packageManifestContext: PackageManifestContext): Promise<Result[]>;
}

export enum ResultStatus {
  success,
  failure
}

export interface FileGlob {
  findFiles(): Promise<BollFile[]>;
  exclude: string[];
  include: string[];
}

export interface FileGlobOptions {
  exclude?: string[];
  include?: string[];
}

export interface ImportPathAndLineNumber {
  path: string;
  lineNumber: number;
}
