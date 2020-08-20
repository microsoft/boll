import { test as SrcDetectorTest } from "./src-detector.test";
import { test as CliTest } from "./cli.test";

async function suite() {
  await SrcDetectorTest.run();
  await CliTest.run();
}

suite();
