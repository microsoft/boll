import { ConfigDefinition, PackageRule } from "./types";
import { RuleRegistry } from "./rule-registry";
import { Suite } from "./suite";
import { ConfigRegistry } from "./config-registry";

export class Config {
  private configuration: ConfigDefinition = {};

  constructor(
    private configRegistry: ConfigRegistry,
    private ruleRegistry: RuleRegistry
  ) {}

  buildSuite(): Suite {
    const suite = new Suite();
    suite.checks = this.loadChecks();
    return suite;
  }

  loadChecks(): PackageRule[] {
    const config = this.resolvedConfiguration();
    return (config.checks || []).map((check) =>
      this.ruleRegistry.get(check.rule)()
    );
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
