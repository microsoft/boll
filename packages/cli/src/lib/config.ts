import { ConfigDefinition, Rule, FileGlob } from "./types";
import { RuleRegistry } from "./rule-registry";
import { Suite } from "./suite";
import { ConfigRegistry } from "./config-registry";
import { TypescriptSourceGlob } from "./glob";

export class Config {
  private configuration: ConfigDefinition = {};

  constructor(private configRegistry: ConfigRegistry, private ruleRegistry: RuleRegistry) {}

  buildSuite(): Suite {
    const suite = new Suite();
    suite.checks = this.loadChecks();
    suite.fileGlob = this.buildFileGlob();
    return suite;
  }

  loadChecks(): Rule[] {
    const config = this.resolvedConfiguration();
    return (config.checks || []).map((check) => this.ruleRegistry.get(check.rule)());
  }

  buildFileGlob(): FileGlob {
    return new TypescriptSourceGlob({
      include: this.configuration.include || [],
      exclude: this.configuration.exclude || [],
    });
  }

  load(def: ConfigDefinition) {
    this.configuration = def;
  }

  resolvedConfiguration(): ConfigDefinition {
    if (this.configuration.extends) {
      return this.configRegistry.get(this.configuration.extends);
    }
    return this.configuration;
  }
}
