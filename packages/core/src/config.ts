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
    return (config.checks || []).map(check => this.ruleRegistry.get(check.rule)());
  }

  buildFileGlob(): FileGlob {
    const config = this.resolvedConfiguration();
    return new TypescriptSourceGlob({
      include: config.include || [],
      exclude: config.exclude || []
    });
  }

  load(def: ConfigDefinition) {
    this.configuration = def;
  }

  // TODO this will need a hand-crafted "deep merge" at some point
  resolvedConfiguration(): ConfigDefinition {
    return {
      ...this.resolveParentConfiguration(this.configuration.extends),
      ...this.configuration
    };
  }

  resolveParentConfiguration(baseConfigName: string | null | undefined): ConfigDefinition {
    if (!baseConfigName) {
      return {};
    }
    const baseConfig = this.configRegistry.get(baseConfigName);
    return {
      ...this.resolveParentConfiguration(baseConfig.extends),
      ...baseConfig
    };
  }
}
