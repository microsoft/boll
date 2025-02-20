import * as fs from "fs";
import * as path from "path";
import {
  Config,
  configFileName,
  ConfigRegistryInstance,
  DefaultLogger,
  Logger,
  RuleRegistryInstance,
  Suite
} from "@boll/core";

export async function buildSuite(logger: Logger): Promise<Suite> {
  const fullConfigPath = path.resolve(configFileName);
  if (!fs.existsSync(fullConfigPath)) {
    logger.error(`Unable to find ${fullConfigPath}; consider running "init" to create example config.`);
  }
  const config = new Config(ConfigRegistryInstance, RuleRegistryInstance, logger);
  config.load(require(fullConfigPath));
  return await config.buildSuite();
}

/**
 * Entry point for external libraries running boll.
 * @returns true if success, false if any warnings or errors.
 */
export async function runBoll(logger: Logger = DefaultLogger): Promise<boolean> {
  const suite = await buildSuite(logger);
  const result = await suite.run(logger);
  result.errors.forEach(e => {
    logger.error(e.formattedMessage);
  });
  if (result.hasErrors) {
    return false;
  }
  return true;
}
