import { Logger } from "./logger";
import { Rule } from "./types";

export type RuleDefinition<T extends Rule> = (logger: Logger, options?: {}) => T;

export class RuleRegistry {
  public registrations: { [name: string]: RuleDefinition<Rule> } = {};

  register<T extends Rule>(name: string, factory: RuleDefinition<T>) {
    if (this.registrations[name]) {
      throw new Error(`Already know about rule "${name}", cannot redefine.`);
    }
    this.registrations[name] = factory;
  }

  get<T extends Rule>(name: string): RuleDefinition<T> {
    if (!this.registrations[name]) {
      throw new Error(`Don't know about rule "${name}".`);
    }
    return this.registrations[name] as RuleDefinition<T>;
  }
}

export const RuleRegistryInstance = new RuleRegistry();
