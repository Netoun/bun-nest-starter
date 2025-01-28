#!/usr/bin/env bun

import { buildPackage, buildApi } from "./build";
import { parseArgs } from "node:util";

type ActionOptions = {
  entrypoint: string;
  watch: boolean;
};

type Command = {
  description: string;
  options: Record<string, {
    type: "string" | "boolean";
    description: string;
    default: string | boolean;
  }>;
  subcommands?: Record<string, Command>;
  action?: (options: ActionOptions) => Promise<void>;
};

const commands: Record<string, Command> = {
  build: {
    description: "Build a target",
    options: {
      entrypoint: {
        type: "string",
        description: "Entry point file",
        default: "./src/index.ts"
      },
      watch: {
        type: "boolean",
        description: "Watch mode",
        default: false
      }
    },
    subcommands: {
      package: {
        description: "Build a package",
        options: {
          entrypoint: {
            type: "string",
            description: "Entry point file",
            default: "./src/index.ts"
          },
          watch: {
            type: "boolean",
            description: "Watch mode",
            default: false
          }
        },
        action: async (options: ActionOptions) => {
          await buildPackage({
            entrypoints: [options.entrypoint],
            root: "./src",
            outdir: "./dist",
            watch: options.watch
          });
        }
      },
      api: {
        description: "Build the API",
        options: {
          entrypoint: {
            type: "string",
            description: "Entry point file",
            default: "./src/main.ts"
          },
          watch: {
            type: "boolean",
            description: "Watch mode",
            default: false
          }
        },
        action: async (options: ActionOptions) => {
          await buildApi({
            entrypoints: [options.entrypoint],
            root: "./src",
            outdir: "./dist"
          });
        }
      }
    }
  }
};

export async function cli() {
  const { values, positionals } = parseArgs({
    args: Bun.argv.slice(2),
    options: {
      entrypoint: {
        type: "string",
      },
      watch: {
        type: "boolean",
      },
      help: {
        type: "boolean",
        short: "h"
      }
    },
    allowPositionals: true,
  });

  if (values.help || positionals.length === 0) {
    console.log("Usage: nbd <command> [subcommand] [options]");
    console.log("\nCommands:");
    for (const [name, cmd] of Object.entries(commands)) {
      console.log(`  ${name}\t${cmd.description}`);
      if (cmd.subcommands) {
        for (const [subName, subCmd] of Object.entries(cmd.subcommands)) {
          console.log(`    ${name} ${subName}\t${subCmd.description}`);
        }
      }
    }
    process.exit(0);
  }

  const command = positionals[0];
  const cmdConfig = commands[command];

  if (!cmdConfig) {
    console.error(`Unknown command: ${command}`);
    process.exit(1);
  }

  const subcommand = positionals[1];
  if (!subcommand && cmdConfig.subcommands) {
    console.error(`Missing subcommand for ${command}. Available subcommands:`);
    for (const [name, cmd] of Object.entries(cmdConfig.subcommands)) {
      console.log(`  ${name}\t${cmd.description}`);
    }
    process.exit(1);
  }

  const targetCommand = subcommand ? cmdConfig.subcommands?.[subcommand] : cmdConfig;
  if (!targetCommand?.action) {
    console.error(`Unknown subcommand: ${subcommand}`);
    process.exit(1);
  }

  await targetCommand.action({
    entrypoint: targetCommand.options.entrypoint.type === "string" 
      ? (values.entrypoint ?? targetCommand.options.entrypoint.default) as string
      : targetCommand.options.entrypoint.default as string,
    watch: targetCommand.options.watch.type === "boolean"
      ? (values.watch ?? targetCommand.options.watch.default) as boolean
      : targetCommand.options.watch.default as boolean
  });
}

if (import.meta.main) {
  cli().catch((error) => {
    console.error(error);
    process.exit(1);
  });
} 