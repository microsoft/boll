import * as fs from "fs";
import {
  Config,
  configFileName,
  ConfigRegistryInstance,
  DefaultLogger,
  Logger,
  RuleRegistryInstance,
  Suite
} from "@boll/core";
import { promisify } from "util";
import { resolve } from "path";
const fileExistsAsync = promisify(fs.exists);

export async function buildSuite(logger: Logger): Promise<Suite> {
  const fullConfigPath = resolve(configFileName);
  const exists = await fileExistsAsync(fullConfigPath);
  if (!exists) {
    logger.error(`Unable to find ${fullConfigPath}; consider running "init" to create example config.`);
  }
  const config = new Config(ConfigRegistryInstance, RuleRegistryInstance, logger);
  config.load(require(fullConfigPath));
  return await config.buildSuite();
}

/**
 * Entry point for external libraries running boll.
 * @returns {boolean} true if success, false if any warnings or errors.
 */
export async function runBoll(logger: Logger = DefaultLogger): Promise<boolean> {
  const suite = await buildSuite(logger);
  const result = await suite.run(logger);
  result.errors.forEach(e => {
    logger.error(`Rule '${e.ruleName}' failed with the error message: ${e.formattedMessage}`);
  });
  if (result.hasErrors) {
    return false;
  }
  return true;
}
