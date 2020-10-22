import { Logger } from "./logger";
import { PackageRule } from "./types";

export type RuleDefinition = (logger: Logger, options?: {}) => PackageRule;

export class RuleRegistry {
  public registrations: { [name: string]: RuleDefinition } = {};

  register(name: string, factory: RuleDefinition) {
    if (this.registrations[name]) {
      throw new Error(`Already know about rule "${name}", cannot redefine.`);
    }
    this.registrations[name] = factory;
  }

  get(name: string): RuleDefinition {
    if (!this.registrations[name]) {
      throw new Error(`Don't know about rule "${name}".`);
    }
    return this.registrations[name];
  }
}

export const RuleRegistryInstance = new RuleRegistry();
