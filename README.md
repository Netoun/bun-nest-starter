# NestJS + Bun + Drizzle Starter

A modern starter project using NestJS as the framework, Bun as the JavaScript/TypeScript runtime, and Drizzle as the SQL ORM.

## 🚀 Technologies

- **[NestJS](https://nestjs.com/)** - Progressive Node.js framework
- **[Bun](https://bun.sh/)** - Ultra-fast JavaScript/TypeScript runtime
- **[Drizzle](https://orm.drizzle.team/)** - Modern TypeScript ORM
- **[ts-rest](https://ts-rest.com/)** - End-to-end type-safe REST API contracts
- **[Vitest](https://vitest.dev/)** - Unit testing framework
- **[Biome](https://biomejs.dev/)** - Fast formatter, linter, and more

## 📦 Prerequisites

- Bun (latest version)

## 🛠 Installation

```bash
# Install dependencies
bun install

# Database configuration
# Create a .env file from the .env.example template
cp .env.example .env

# Generate migrations
bun run db:generate

# Apply migrations
bun run db:push

# Seed the database (optional)
bun run db:seed
```

## 🚀 Getting Started

```bash
# Development mode
bun run start:dev

# Production mode
bun run build
bun run start
```

## 🧪 Testing

```bash
# Run tests
bun run test

# Watch mode
bun run test:watch

# With coverage
bun run test:coverage

# Test UI interface
bun run test:ui
```

## 📁 Project Structure

```
src/
├── modules/
│   ├── db/           # Drizzle configuration and migrations
│   ├── user/         # User module
│   └── todo/         # Todo module
├── app.module.ts     # Main module
└── main.ts          # Entry point
```

## 🛠 Available Scripts

- `bun run start:dev` - Start the application in development mode with hot-reload
- `bun run build` - Build the application
- `bun run start` - Start the application in production mode
- `bun run test` - Run tests
- `bun run db:generate` - Generate Drizzle migrations
- `bun run db:push` - Apply migrations
- `bun run db:studio` - Launch Drizzle Studio to explore the database
- `bun run db:seed` - Populate the database with test data
- `bun run fmt` - Format code with Biome
- `bun run lint` - Lint code with Biome
- `bun run check` - Run all Biome checks and auto-fix issues

## 🏗 Architecture

The application follows Clean Architecture principles with a clear separation of concerns:

- **Modules**: Self-contained modules with their own services, controllers, and schemas
- **Controllers**: Handle HTTP requests
- **Services**: Business logic
- **Schemas**: Data model definitions with Drizzle
- **Spec**: Unit tests

Each module is self-contained and follows SOLID principles.

## 📝 Code Conventions

The project uses:
- [Biome](https://biomejs.dev/) for formatting, linting, and import sorting

## 🔄 API Contracts

The project uses [ts-rest](https://ts-rest.com/) to define type-safe API contracts:

- **Contract-First Development**: API contracts are defined in `.contract.ts` files
- **Type Safety**: End-to-end type safety between client and server
- **Automatic Validation**: Request/response validation based on contract definitions
- **OpenAPI Generation**: Automatic OpenAPI/Swagger documentation generation

Contracts are located in their respective module folders and the root `app.contract.ts` file combines all module contracts.