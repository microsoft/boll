import { ConfigDefinition } from "./types";

export class ConfigRegistry {
  public registrations: { [name: string]: ConfigDefinition } = {};

  register(config: ConfigDefinition) {
    const name = config.name;
    if (!name) {
      throw new Error("config must have name to be registered as extensible config, but is missing");
    }
    if (this.registrations[name]) {
      throw new Error(`Already know about config "${name}", cannot redefine.`);
    }
    this.registrations[name] = config;
    // bootstrap all plugins when they are registered
    ConfigRegistry.bootstrapPlugins(config)
  }

  get(name: string): ConfigDefinition {
    if (!this.registrations[name]) {
      throw new Error(`Don't know about config "${name}".`);
    }
    return this.registrations[name];
  }

  static bootstrapPlugins(config: ConfigDefinition) {
    if(config.extends) {
      if (!Array.isArray(config.extends)) {
        config.extends = [config.extends];
      }
      config.extends.forEach(extensionName => {
        let plugin;
        const [prefix, pkg] = extensionName.split(":");
        if (prefix === "boll") {
          plugin = this.loadBollPlugin(pkg);
        } else if (prefix === "plugin") {
          plugin = this.loadExternalPlugin(pkg);
        }
        plugin?.bootstrap();
      });
    }
    }
  
    static loadExternalPlugin(fullPkgName: string) {
      return this.requirePlugin(fullPkgName);
    }
  
    static loadBollPlugin(plugin: string) {
      const [base, ...rest] = plugin?.split("/");
      let fullPkgName = `@boll/${plugin}`;
      if (rest && rest.length >= 1) {
        fullPkgName = `@boll/${base}/dist/${[...rest].join("/")}`;
      }
      return this.requirePlugin(fullPkgName);
    }
  
    static requirePlugin(fullPkgName: string) {
      try {
        const pkg = require(fullPkgName);
        return pkg;
      } catch (e) {
        throw new Error(`Could not load plugin ${fullPkgName}.`);
      }
    }
}

export const ConfigRegistryInstance = new ConfigRegistry();
