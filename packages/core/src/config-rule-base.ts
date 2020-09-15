import fs from "fs";
import { promisify } from "util";
import YAML from "yaml";
const readFileAsync = promisify(fs.readFile);

export enum ConfigFileType {
  Js,
  Yaml,
  Json
}

interface ConfigOptions {
  path: string;
}

/**
 * Base class from which config rules should inherit. This class is responsible for
 * parsing the options provided in the rule and parsing the config file. Currently
 * only supports configs ending in the following file extensions:
 *
 *   - *.js
 *   - *.yaml
 *   - *.yml
 *   - *.json
 */
export class ConfigRuleBase {
  _path: string;
  _fileType: ConfigFileType;
  _rawData: any;

  constructor(options: any) {
    const parsedOptions = this.parseOptions(options);
    this._path = parsedOptions.path;
    this._fileType = this.getConfigFileType();
    this._rawData = this.parseConfig();
  }

  parseOptions(options: any): ConfigOptions {
    if (options["path"]) {
      return { path: options["path"] };
    }
    throw new Error("Config rule options missing path to config file");
  }

  getConfigFileType(): ConfigFileType {
    const extension = this._path.split(".").pop();

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
        throw new Error(`Config  file is of unsupported type ${extension}`);
    }
  }

  parseConfig() {
    switch (this._fileType) {
      case ConfigFileType.Js:
        return this.parseJsConfig();
      case ConfigFileType.Yaml:
        return this.parseYamlConfig();
      case ConfigFileType.Json:
        return this.parseJsonConfig();
      default:
        throw new Error(`Cannot parse unsupported config type: ${ConfigFileType[this._fileType]}`);
    }
  }

  async parseJsConfig() {
    const fileContent = await this.readFile();
    try {
      return require(this._path);
    } catch (err) {
      throw new Error(`Could not parse JS file at ${this._path}`);
    }
  }

  async parseYamlConfig() {
    const fileContent = await this.readFile();
    try {
      return YAML.parse(fileContent);
    } catch (err) {
      console.log(err);
      throw new Error(`Could not parse YAML file at ${this._path}`);
    }
  }

  async parseJsonConfig() {
    const fileContent = await this.readFile();
    try {
      return JSON.parse(fileContent);
    } catch (err) {
      throw new Error(`Could not parse JSON file at ${this._path}`);
    }
  }

  async readFile(): Promise<string> {
    try {
      const content = await readFileAsync(this._path);
      return content.toString("utf-8");
    } catch (err) {
      throw new Error(`Failed to read file at ${this._path}`);
    }
  }
}
