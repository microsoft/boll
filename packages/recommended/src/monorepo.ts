import { addRule, ConfigDefinition, ConfigRegistryInstance, WorkspacesGlob } from "@boll/core";
import { EnsureBoll } from "@boll/rules-monorepo";

export const bootstrap = () => {
  addRule(EnsureBoll);

  ConfigRegistryInstance.register(MonorepoConfig);
};

const MonorepoConfig: ConfigDefinition = {
  name: "boll:recommended/monorepo",
  ruleSets: [
    {
      fileLocator: new WorkspacesGlob(),
      checks: {
        meta: [{ rule: "EnsureBoll" }]
      }
    }
  ]
};
