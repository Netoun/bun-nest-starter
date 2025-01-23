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
  external: ["@nestjs/microservices", "@nestjs/websockets/socket-module"],
  naming: {
    entry: '[dir]/[name].[ext]',
    chunk: 'chunk/[name]-[hash].[ext]',
    asset: 'assets/[name]-[hash].[ext]',
  },
}).then((out) => {
  if (out.success) {
    console.log("\x1b[32m🏗️  Build done\x1b[0m", "\x1b[32m✅ Success\x1b[0m");
  } else {
    console.log("\x1b[31m❌ Build failed\x1b[0m", out);
  }
});
