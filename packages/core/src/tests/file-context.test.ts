import baretest from "baretest";
import { execFileSync } from "child_process";

export const test: any = baretest("FileContext");

function runInFreshProcess(script: string) {
  execFileSync(
    process.execPath,
    [
      "-e",
      `
        const assert = require("assert");
        const { createRequire } = require("module");
        const corePath = process.argv[1];
        const compilerPath = createRequire(corePath).resolve("typescript");
        assert.strictEqual(require.cache[compilerPath], undefined);
        const core = require(corePath);
        const filename = core.asBollFile("example.ts");
        const content = "const value: number = 1;";
        const context = new core.FileContext(core.asBollDirectory("."), {}, filename, content);
        ${script}
      `,
      require.resolve("../index")
    ],
    { stdio: "pipe" }
  );
}

test("should not load TypeScript when using non-AST members", () => {
  runInFreshProcess(`
    assert.strictEqual(context.filename, filename);
    assert.strictEqual(context.content, content);
    assert.strictEqual(context.relativeFilename, "example.ts");
    assert.strictEqual(context.packageDependencies, undefined);
    assert.strictEqual(context.packageDevDependencies, undefined);
    assert.deepStrictEqual(context.ignoredChecks, []);
    assert.deepStrictEqual(context.ignoredChecksByLine, new Map());
    assert.strictEqual(require.cache[compilerPath], undefined);
  `);
});

test("should load TypeScript on AST access and cache each context's source", () => {
  runInFreshProcess(`
    const source = context.source;
    assert.ok(require.cache[compilerPath]);
    const compiler = require(compilerPath);
    assert.strictEqual(require("path").normalize(source.fileName), filename);
    assert.strictEqual(source.getFullText(), content);
    assert.strictEqual(source.languageVersion, compiler.ScriptTarget.ES5);
    assert.deepStrictEqual(source.parseDiagnostics, []);
    assert.strictEqual(source.statements.length, 1);
    const statement = source.statements[0];
    assert.ok(compiler.isVariableStatement(statement));
    assert.strictEqual(statement.parent, source);
    const declaration = statement.declarationList.declarations[0];
    assert.strictEqual(declaration.name.getText(), "value");
    assert.strictEqual(declaration.type.kind, compiler.SyntaxKind.NumberKeyword);
    assert.strictEqual(context.source, source);
    const other = new core.FileContext(context.packageRoot, {}, filename, "const other = 2;");
    assert.notStrictEqual(other.source, source);
    assert.strictEqual(other.source.getFullText(), "const other = 2;");
    assert.strictEqual(other.source, other.source);
  `);
});
