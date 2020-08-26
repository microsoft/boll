import { ConfigDefinition } from "./types";

export class ConfigRegistry {
  public registrations: { [name: string]: ConfigDefinition } = {};

  register(config: ConfigDefinition) {
    const name = config.name;
    if (!name) {
      throw new Error(
        "config must have name to be registered as extensible config, but is missing"
      );
    }
    if (this.registrations[name]) {
      throw new Error(`Already know about config "${name}", cannot redefine.`);
    }
    this.registrations[name] = config;
  }

  get(name: string): ConfigDefinition {
    if (!this.registrations[name]) {
      throw new Error(`Don't know about config "${name}".`);
    }
    return this.registrations[name];
  }
}

export const ConfigRegistryInstance = new ConfigRegistry();
