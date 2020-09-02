import fs from "fs";
import { promisify } from "util";
import YAML from "yaml";
const readFileAsync = promisify(fs.readFile);

export enum ConfigFileType {
  Js,
  Yaml,
  Json,
}

// interface ConfigOptions {
//   packageDirectories?: string[];
//   filename?: string;
//   path: string;
// }

export interface ConfigFiles {
  [path: string]: { fileType: ConfigFileType; rawData: any };
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
  _configs: ConfigFiles;

  constructor(paths: Promise<string[]>) {
    this._configs = {};
    paths.then((paths) =>
      paths.forEach(
        (path) => (this._configs[path] = { fileType: this.getConfigFileType(path), rawData: this.parseConfig(path) })
      )
    );
    // const parsedOptions = this.parseConfigRuleOptions(options);
    // this._path = parsedOptions.path;
    // this._fileType = this.getConfigFileType();
    // this._rawData = this.parseConfig();
  }

  // parseConfigRuleOptions(options: any): ConfigOptions {
  //   if (options["path"]) {
  //     return { path: options["path"] };
  //   }
  //   throw new Error("Config rule options missing path to config file");
  // }

  getConfigFileType(path: string): ConfigFileType {
    const extension = path.split(".").pop();

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

  parseConfig(path: string) {
    const fileType = this.getConfigFileType(path);
    switch (fileType) {
      case ConfigFileType.Js:
        return this.parseJsConfig(path);
      case ConfigFileType.Yaml:
        return this.parseYamlConfig(path);
      case ConfigFileType.Json:
        return this.parseJsonConfig(path);
      default:
        throw new Error(`Cannot parse unsupported config type: ${ConfigFileType[fileType]}`);
    }
  }

  async parseJsConfig(path: string) {
    const fileContent = await this.readFile(path);
    try {
      return require(path);
    } catch (err) {
      throw new Error(`Could not parse JS file at ${path}`);
    }
  }

  async parseYamlConfig(path: string) {
    const fileContent = await this.readFile(path);
    try {
      return YAML.parse(fileContent);
    } catch (err) {
      console.log(err);
      throw new Error(`Could not parse YAML file at ${path}`);
    }
  }

  async parseJsonConfig(path: string) {
    const fileContent = await this.readFile(path);
    try {
      return JSON.parse(fileContent);
    } catch (err) {
      throw new Error(`Could not parse JSON file at ${path}`);
    }
  }

  async readFile(path: string): Promise<string> {
    try {
      const content = await readFileAsync(path);
      return content.toString("utf-8");
    } catch (err) {
      throw new Error(`Failed to read file at ${path}`);
    }
  }
}
