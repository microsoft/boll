import { test as CliTest } from "./cli.test";

async function suite() {
  await CliTest.run();
}

suite();
