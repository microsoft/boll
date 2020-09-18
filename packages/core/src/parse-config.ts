import { readFileSync } from "fs";
import YAML from "yaml";
import { BollFile } from "./boll-file";

export enum ConfigFileType {
  Js,
  Yaml,
  Json
}

/**
 * This function returns a parsed config file providedit is in one of the following
 * formats:
 *   - *.js
 *   - *.yaml
 *   - *.yml
 *   - *.json
 */
export function parseConfig(file: BollFile): any {
  const fileType = getConfigFileType(file);
  switch (fileType) {
    case ConfigFileType.Js:
      return parseJsConfig(file);
    case ConfigFileType.Yaml:
      return parseYamlConfig(file);
    case ConfigFileType.Json:
      return parseJsonConfig(file);
    default:
      throw new Error(`Cannot parse unsupported config type: ${ConfigFileType[fileType]}`);
  }
}

function getConfigFileType(file: BollFile): ConfigFileType {
  const extension = file.split(".").pop();
  switch (extension) {
    case "js":
      return ConfigFileType.Js;
    case "yaml":
      return ConfigFileType.Yaml;
    case "yml":
      return ConfigFileType.Yaml;
    case "json":
      return ConfigFileType.Json;
    default:
      throw new Error(`Config file is of unsupported type ${extension}`);
  }
}

function parseJsConfig(file: BollFile) {
  try {
    return require(file);
  } catch (err) {
    throw new Error(`Could not parse JS file at ${file}`);
  }
}

function parseYamlConfig(file: BollFile) {
  const fileContent = readFile(file);
  try {
    return YAML.parse(fileContent);
  } catch (err) {
    throw new Error(`Could not parse YAML file at ${file}`);
  }
}

function parseJsonConfig(file: BollFile) {
  const fileContent = readFile(file);
  try {
    return JSON.parse(fileContent);
  } catch (err) {
    throw new Error(`Could not parse JSON file at ${file}`);
  }
}

function readFile(file: BollFile): string {
  try {
    const content = readFileSync(file);
    return content.toString("utf-8");
  } catch (err) {
    throw new Error(`Failed to read file at ${file}`);
  }
}
