import { join, dirname } from "path";
import fs from "fs";
import { FileContext, RuleOptions } from "@boll/core";
import chalk from "chalk";

const exists = (path: string) => {
  return new Promise<boolean>((resolve, reject) => {
    fs.stat(path, err => {
      if (err) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

/**
 * Check to see if packages have a boll config, and a lint verb
 * @param {*} logger
 * @param {*} options
 * @returns
 */
export const EnsureBoll = {
  name: "EnsureBoll",
  check: async (files: FileContext[], options: RuleOptions) => {
    const errors: { formattedMessage: string; status: number }[] = [];

    await Promise.all(
      files.map(async ({ filename, content }) => {
        const pkg = JSON.parse(content);

        let hasBoll = false;
        let hasIgnore = false;
        let bollConfig = join(dirname(filename), ".boll.config.js");

        hasBoll = await exists(bollConfig);

        let bollIgnore = join(dirname(filename), ".bollignore");

        hasIgnore = await exists(bollIgnore);

        const hasLintScript = pkg.scripts && pkg.scripts.lint;

        if (!hasBoll && !hasIgnore) {
          errors.push({
            formattedMessage: `[${chalk.red("EnsureBoll")}] ${chalk.whiteBright(
              `No boll config found in ${chalk.grey(pkg.name)}`
            )}`,
            status: 1
          });
        }

        if (!hasLintScript) {
          errors.push({
            formattedMessage: `[${chalk.red("EnsureBoll")}] ${chalk.whiteBright(
              `No "lint" script found in ${chalk.grey(pkg.name)}`
            )}`,
            status: 1
          });
        }
      })
    );

    return errors;
  }
};
