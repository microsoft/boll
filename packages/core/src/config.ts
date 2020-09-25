import { ConfigDefinition, FileGlob, PackageRule } from "./types";
import { ConfigRegistry } from "./config-registry";
import { Logger } from "./logger";
import { RuleRegistry } from "./rule-registry";
import { RuleSet } from "./rule-set";
import { Suite } from "./suite";

export class Config {
  private configuration: ConfigDefinition = {};

  constructor(private configRegistry: ConfigRegistry, private ruleRegistry: RuleRegistry, private logger: Logger) {}

  buildSuite(): Suite {
    const suite = new Suite();
    suite.ruleSets = this.loadRuleSets();
    return suite;
  }

  loadRuleSets(): RuleSet[] {
    const config = this.resolvedConfiguration();
    return (config.ruleSets || []).map(ruleSetConfig => {
      const exclude = [...(ruleSetConfig.exclude || []), ...(config.exclude || [])];
      const glob = ruleSetConfig.fileLocator;
      glob.exclude = exclude;
      glob.include = ruleSetConfig.include || [];
      const checks = (ruleSetConfig.checks || []).map(check => this.ruleRegistry.get(check.rule)(this.logger));
      return new RuleSet(glob, checks);
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
