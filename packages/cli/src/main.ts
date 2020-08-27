import * as fs from "fs";
import { bootstrapConfigurations } from "./config/bootstrap";
import { Config } from "./lib/config";
import { configFileName } from "./lib/constants";
import { ConfigRegistryInstance } from "./lib/config-registry";
import { DefaultLogger, Logger } from "./lib/logger";
import { RuleRegistryInstance } from "./lib/rule-registry";
import { Suite } from "./lib/suite";
import { promisify } from "util";
import { resolve } from "path";
const fileExistsAsync = promisify(fs.exists);

async function buildSuite(logger: Logger): Promise<Suite> {
  const fullConfigPath = resolve(configFileName);
  const exists = await fileExistsAsync(fullConfigPath);
  if (!exists) {
    logger.error(`Unable to find ${fullConfigPath}; consider running "init" to create example config.`);
  }
  bootstrapConfigurations();
  const config = new Config(ConfigRegistryInstance, RuleRegistryInstance);
  config.load(require(fullConfigPath));
  return config.buildSuite();
}

/**
 * Entry point for external libraries running boll.
 * @returns {boolean} true if success, false if any warnings or errors.
 */
export async function runBoll(logger: Logger = DefaultLogger): Promise<boolean> {
  const suite = await buildSuite(logger);
  const result = await suite.run(logger);
  result.errors.forEach((e) => {
    logger.error(e.formattedMessage);
  });
  if (result.hasErrors) {
    return false;
  }
  return true;
}
