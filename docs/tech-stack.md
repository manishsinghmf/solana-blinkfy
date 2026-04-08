# Tech Stack

## Workspace
- pnpm workspaces
- Shared root TypeScript config

## Frontend
- Next.js 15
- React 19
- TypeScript

Why:
- minimal app-router setup
- easy static asset hosting for the Action icon
- simple environment-based API URL configuration

## Backend
- Express 5
- TypeScript
- Zod

Why:
- clear REST routing
- lightweight middleware setup
- explicit validation without adding unnecessary infrastructure

## Solana
- `@solana/kit`
- `@solana-program/system`
- Solana devnet RPC

Why:
- Solana Kit handles address parsing, RPC access, transaction message construction, and serialization
- the generated system program client provides the transfer instruction
- devnet keeps the PoC safe and easy to test

## Testing
- Vitest
- Supertest

Why:
- fast unit and route tests
- enough coverage for validation and API contract behavior without overbuilding the test suite
