interface TestImplementation {
  run: () => Promise<boolean>;
}

export const suite = async (...implementations: TestImplementation[]): Promise<boolean> => {
  for (let i = 0; i < implementations.length; i++) {
    const impl = implementations[i];
    const result = await impl.run();
    if (!result) {
      process.exit(1);
    }
  }
  return true;
};
