import type { BuildConfig } from "bun";

export interface BuildPackageConfig extends BuildConfig {
  watch?: boolean;
}

interface WatchConfig extends BuildConfig {
  watch: {
    onRebuild(error: Error | null, result: { success: boolean; logs: string[] } | null): void;
  };
}

export async function buildPackage(config: BuildPackageConfig) {
  const defaultConfig: BuildConfig = {
    ...config,
    minify: true,
    splitting: true,
    plugins: [...(config.plugins || [])],
    naming: {
      entry: '[dir]/[name].[ext]',
      chunk: 'chunk/[name]-[hash].[ext]',
      asset: 'assets/[name]-[hash].[ext]',
    },
    sourcemap: config.sourcemap ?? "linked",
    packages: config.packages ?? "bundle",
    external: [...(config.external ?? []), "zod"],
    target: config.target ?? "bun",
    format: config.format ?? "esm",
    outdir: config.outdir ?? "./dist",
    entrypoints: config.entrypoints ?? ["./src/index.ts"],
    root: config.root ?? "./src",
  };

  await Bun.$`rm -rf ${defaultConfig.outdir}`;
  
  if (config.watch) {
    const watcher = Bun.build({
      ...defaultConfig,
      watch: {
        onRebuild(error, result) {
          if (error) {
            console.error("Build failed:", error);
          } else if (result) {
            console.log("Build succeeded");
            if (!result.success) {
              for (const log of result.logs) {
                console.error(log);
              }
            }
          }
        },
      },
    } as WatchConfig);
    return watcher;
  }

  const result = await Bun.build(defaultConfig);
  
  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  return result;
}

interface ShellError extends Error {
  stdout: Buffer;
  stderr: Buffer;
  exitCode: number;
}

export interface BuildApiConfig extends BuildConfig {
  watch?: boolean;
}

export async function buildApi(config: Partial<BuildApiConfig> = {}) {
  const defaultConfig: BuildConfig = {
    minify: true,
    splitting: true,
    sourcemap: "linked",
    naming: {
      entry: '[dir]/[name].[ext]',
      chunk: 'chunk/[name]-[hash].[ext]',
      asset: 'assets/[name]-[hash].[ext]',
    },
    target: "bun",
    format: "esm",
    outdir: "./dist",
    entrypoints: ["./src/main.ts"],
    external: ["@nestjs/microservices", "@nestjs/websockets/socket-module", "zod"],
    root: "./src",
    ...config
  };

  await Bun.$`rm -rf ${defaultConfig.outdir}`;
  
  // Run tsc --noEmit before build
  try {
    const tscProcess = Bun.$`bunx tsc --noEmit --pretty`;
    if (config.watch) {
      // Start tsc --noEmit --watch in parallel with pretty formatting
      Bun.$`bunx tsc --noEmit --watch --pretty`;
    } else {
      await tscProcess;
    }
  } catch (error) {
    // Show TypeScript errors but continue with build
    if (error instanceof Error && 'stdout' in error) {
      const shellError = error as ShellError;
      console.error(shellError.stdout.toString());
    }
  }
  
  const result = await Bun.build(defaultConfig);
  
  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    process.exit(1);
  }

  return result;
} 

