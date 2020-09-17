import { test as E2ETest } from "./e2e.test";

async function suite() {
  await E2ETest.run();
}

suite();
