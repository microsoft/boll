import { LoadedConfigDefinition, ConfigDefinition, FileGlob, PackageMetaRule, PackageRule } from "./types";
import { ConfigRegistry } from "./config-registry";
import { Logger } from "./logger";
import { RuleRegistry } from "./rule-registry";
import { InstantiatedPackageMetaRule, InstantiatedPackageRule, RuleSet } from "./rule-set";
import { Suite } from "./suite";
import { IgnoredFiles } from "./ignore";
import { getRepoRoot } from "./git-utils";

export class Config {
  private configuration: LoadedConfigDefinition = {};
  private ignoredFiles: IgnoredFiles = new IgnoredFiles({ root: getRepoRoot() });

  constructor(private configRegistry: ConfigRegistry, private ruleRegistry: RuleRegistry, private logger: Logger) {}

  async buildSuite(): Promise<Suite> {
    const suite = new Suite();
    suite.ruleSets = await this.loadRuleSets();

    return suite;
  }

  async loadRuleSets(): Promise<RuleSet[]> {
    const config = this.resolvedConfiguration();
    const gitIgnoredFiles = config.excludeGitControlledFiles ? await this.ignoredFiles.getIgnoredFiles() : [];
    return (config.ruleSets || []).map(ruleSetConfig => {
      let exclude = [...(ruleSetConfig.exclude || []), ...(config.exclude || []), ...gitIgnoredFiles];
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
      const fileChecks = ((ruleSetConfig.checks && ruleSetConfig.checks.file) || []).map(check => {
        const optionsFromConfig =
          (config.configuration && config.configuration.rules && (config.configuration.rules as any)[check.rule]) || {};
        const options = { ...check.options, ...optionsFromConfig };
        const fn = this.ruleRegistry.get<PackageRule>(check.rule);

        if (typeof fn === "function") {
          const rule = fn(this.logger, options);
          return new InstantiatedPackageRule(rule.name, check.severity || "error", rule, check.rule);
        }

        return new InstantiatedPackageRule(fn.name, check.severity || "error", fn, check.rule, options);
      });
      const metaChecks = ((ruleSetConfig.checks && ruleSetConfig.checks.meta) || []).map(check => {
        const optionsFromConfig =
          (config.configuration && config.configuration.rules && (config.configuration.rules as any)[check.rule]) || {};
        const options = { ...check.options, ...optionsFromConfig };
        const fn = this.ruleRegistry.get<PackageMetaRule>(check.rule);

        if (typeof fn === "function") {
          const rule = fn(this.logger, options);
          return new InstantiatedPackageMetaRule(rule.name, check.severity || "error", rule, check.rule);
        }

        return new InstantiatedPackageMetaRule(fn.name, check.severity || "error", fn, check.rule, options);
      });

      return new RuleSet(glob, fileChecks, metaChecks);
    });
  }

  load(def: ConfigDefinition) {
    if (this.configuration.extends && !Array.isArray(this.configuration.extends)) {
      this.configuration.extends = [this.configuration.extends];
    }
    this.configuration = def as LoadedConfigDefinition;
  }

  resolvedConfiguration(): LoadedConfigDefinition {
    ConfigRegistry.bootstrapPlugins(this.configuration);
    const resolvedExtendsConfig = this.resolveParentConfiguration(this.configuration.extends);
    const config = this.mergeConfigurations(this.configuration, resolvedExtendsConfig);
    return config;
  }

  resolveExtendsConfiguration(allExtends: LoadedConfigDefinition[]): LoadedConfigDefinition {
    let parentConfiguration: LoadedConfigDefinition = {};
    for (let i = allExtends.length - 1; i >= 0; i--) {
      parentConfiguration = this.mergeConfigurations(parentConfiguration, allExtends[i]);
    }
    return parentConfiguration;
  }

  resolveParentConfiguration(baseConfigName: string | string[] | undefined): LoadedConfigDefinition {
    if (!baseConfigName) {
      return {};
    }

    if (!Array.isArray(baseConfigName)) {
      baseConfigName = [baseConfigName];
    }

    let allExtendsConfigs: LoadedConfigDefinition[] = [];
    for (let i = baseConfigName.length - 1; i >= 0; i--) {
      const baseConfig = this.configRegistry.get(baseConfigName[i]);
      allExtendsConfigs.push(this.mergeConfigurations(this.resolveParentConfiguration(baseConfig.extends), baseConfig));
    }

    return this.resolveExtendsConfiguration(allExtendsConfigs);
  }

  private mergeConfigurations(
    parentConfiguration: ConfigDefinition,
    childConfiguration: ConfigDefinition
  ): LoadedConfigDefinition {
    const obj: LoadedConfigDefinition = {
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
