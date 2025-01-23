Bun.build({
  entrypoints: ["./src/main.ts"],
  format: "esm",
  outdir: "./dist",
  minify: {
    identifiers: true,
    syntax: true,
    whitespace: true,
  },
  target: "bun",
  splitting: true,
  sourcemap: "linked",
  packages: "bundle",
  external: ["@nestjs/microservices"],
  naming: {
    entry: '[dir]/[name].[ext]',
    chunk: 'chunk/[name]-[hash].[ext]',
    asset: 'assets/[name]-[hash].[ext]',
  },
}).then((out) => {
  console.log("\x1b[32m🏗️  Build done\x1b[0m", out.success ? "\x1b[32m✅ Success\x1b[0m" : "\x1b[31m❌\x1b[0m");
});
