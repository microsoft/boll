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
      let exclude = [...(ruleSetConfig.exclude || []), ...(config.exclude || [])];
      if (
        ruleSetConfig.name &&
        config.configuration &&
        config.configuration.ruleSets &&
        (config.configuration.ruleSets as any)[ruleSetConfig.name]
      ) {
        exclude = [...exclude, ...((config.configuration.ruleSets as any)[ruleSetConfig.name].exclude || [])];
      }
      const glob = ruleSetConfig.fileLocator;
      glob.exclude = exclude;
      glob.include = ruleSetConfig.include || [];
      const checks = (ruleSetConfig.checks || []).map(check => {
        const optionsFromConfig =
          (config.configuration && config.configuration.rules && (config.configuration.rules as any)[check.rule]) || {};
        const options = { ...check.options, ...optionsFromConfig };
        return this.ruleRegistry.get(check.rule)(this.logger, options);
      });
      return new RuleSet(glob, checks);
    });
  }

  load(def: ConfigDefinition) {
    this.configuration = def;
  }

  resolvedConfiguration(): ConfigDefinition {
    const parentConfiguration = this.resolveParentConfiguration(this.configuration.extends);
    const finalResult = this.mergeConfigurations(this.configuration, parentConfiguration);
    return finalResult;
  }

  resolveParentConfiguration(baseConfigName: string | null | undefined): ConfigDefinition {
    if (!baseConfigName) {
      return {};
    }
    const baseConfig = this.configRegistry.get(baseConfigName);
    const parentConfig = this.resolveParentConfiguration(baseConfig.extends);
    return this.mergeConfigurations(parentConfig, baseConfig);
  }

  private mergeConfigurations(
    parentConfiguration: ConfigDefinition,
    childConfiguration: ConfigDefinition
  ): ConfigDefinition {
    const obj: ConfigDefinition = {
      configuration: {
        rules: {},
        ruleSets: {}
      }
    };

    if (childConfiguration.name) {
      obj.name = childConfiguration.name;
    }
    obj.ruleSets = [...(parentConfiguration.ruleSets || []), ...(childConfiguration.ruleSets || [])];
    obj.exclude = [...(parentConfiguration.exclude || []), ...(childConfiguration.exclude || [])];
    if (parentConfiguration.configuration && parentConfiguration.configuration.ruleSets) {
      Object.keys(parentConfiguration.configuration.ruleSets).forEach(k => {
        (obj.configuration!.ruleSets! as any)[k] = (parentConfiguration.configuration!.ruleSets as any)[k];
      });
    }
    if (parentConfiguration.configuration && parentConfiguration.configuration.rules) {
      Object.keys(parentConfiguration.configuration.rules).forEach(k => {
        (obj.configuration!.rules! as any)[k] = (parentConfiguration.configuration!.rules as any)[k];
      });
    }
    if (childConfiguration.configuration && childConfiguration.configuration.ruleSets) {
      Object.keys(childConfiguration.configuration.ruleSets).forEach(k => {
        (obj.configuration!.ruleSets! as any)[k] = (childConfiguration.configuration!.ruleSets as any)[k];
      });
    }
    if (childConfiguration.configuration && childConfiguration.configuration.rules) {
      Object.keys(childConfiguration.configuration.rules).forEach(k => {
        (obj.configuration!.rules! as any)[k] = (childConfiguration.configuration!.rules as any)[k];
      });
    }
    return obj;
  }
}
