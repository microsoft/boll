import { promisify } from "util";
import path from "path";
import { copyFile } from "fs";
const copyFileAsync = promisify(copyFile);

export class ConfigGenerator {
  static async run(): Promise<void> {
    await copyFileAsync(
      path.join(__dirname, "sample.config.js"),
      path.join(process.cwd(), ".boll.config.js")
    );
  }
}
