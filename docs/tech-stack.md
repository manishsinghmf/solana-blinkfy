# Tech Stack

## Workspace
- pnpm workspaces
- shared root TypeScript config

Why:
- simple monorepo management across web and API apps

## Frontend
- Next.js 15
- React 19
- TypeScript
- `@solana/wallet-adapter-react`
- `@solana/wallet-adapter-react-ui`
- `@solana/wallet-adapter-wallets`
- `@solana/web3.js`

Why:
- Next.js provides the app shell and routing
- wallet adapter handles Phantom and Solflare connection
- `@solana/web3.js` is used in the browser to deserialize, sign, and submit returned transactions
- the frontend now acts as a Blink-aware client and interstitial renderer

## Backend
- Express 5
- TypeScript
- Zod
- `@solana/kit`
- `@solana-program/system`

Why:
- Express keeps the REST Action provider small and readable
- Zod handles validation cleanly
- `@solana/kit` is currently used on the backend for:
  - address parsing
  - devnet RPC access
  - transaction message construction
  - transaction serialization
- `@solana-program/system` provides the transfer instruction builder

## Solana Library Usage
- Backend:
  - uses `@solana/kit`
  - uses `@solana-program/system`
- Frontend:
  - uses `@solana/web3.js`
  - uses Solana wallet adapter packages

Important:
- `@solana/web3.js` is **not** currently used by the backend
- `@solana/kit` is **not** currently used by the frontend

## Runtime Topology
- Web app deployed on Vercel:
  - `https://blinkfy-web.vercel.app`
- API deployed on Railway:
  - `https://blinkfy-api.up.railway.app`

Why:
- Vercel is a convenient fit for the Next.js frontend
- Railway is a convenient fit for the Express provider backend

## Testing
- Vitest
- Supertest

Why:
- fast API-level validation
- enough coverage for backend request validation and route behavior without overbuilding the suite
