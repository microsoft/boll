import { ConfigDefinition, FileGlob, SourceFileRule } from "./types";
import { ConfigRegistry } from "./config-registry";
import { Logger } from "./logger";
import { RuleRegistry } from "./rule-registry";
import { Suite } from "./suite";
import { TypescriptSourceGlob } from "./glob";

export class Config {
  private configuration: ConfigDefinition = {};

  constructor(private configRegistry: ConfigRegistry, private ruleRegistry: RuleRegistry, private logger: Logger) {}

  buildSuite(): Suite {
    const suite = new Suite(this.resolvedConfiguration());
    suite.checks = this.loadChecks();
    suite.fileGlob = this.buildFileGlob();
    return suite;
  }

  loadChecks(): SourceFileRule[] {
    const config = this.resolvedConfiguration();
    return (config.checks || []).map(check => this.ruleRegistry.get(check.rule)(this.logger));
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
