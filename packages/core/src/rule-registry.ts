import { Logger } from "./logger";
import { Rule } from "./types";

export type RuleDefinition<T extends Rule> = (logger: Logger, options?: {}) => T;

export class RuleRegistry {
  public registrations: { [name: string]: RuleDefinition<Rule> | Rule } = {};

  register<T extends Rule>(name: string, factory: RuleDefinition<T> | T) {
    if (this.registrations[name]) {
      throw new Error(`Already know about rule "${name}", cannot redefine.`);
    }
    this.registrations[name] = factory;
  }

  get<T extends Rule>(name: string): RuleDefinition<T> | T {
    if (!this.registrations[name]) {
      throw new Error(`Don't know about rule "${name}".`);
    }
    return this.registrations[name] as RuleDefinition<T>;
  }
}

/*
addRule("name", (logger, options) => {
  return (files) => {};
});

addRule("name", (logger, options) => {
  return ({ filename, content }) => {};
});
*/

export const addRule = <T extends Rule>(rule: T, instance: RuleRegistry = RuleRegistryInstance) => {
  instance.register<T>(rule.name, rule);
};

export const RuleRegistryInstance = new RuleRegistry();
