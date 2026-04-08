# Local Instructions

## Prerequisites
- Node.js 20+
- pnpm 10+

## Environment Variables
Create a root `.env` file:

```dotenv
PORT=3001
API_ORIGIN=https://blinkfy-api.vercel.app
WEB_ORIGIN=https://blinkfy-web.vercel.app
NEXT_PUBLIC_API_URL=https://blinkfy-api.vercel.app
SOLANA_RPC_URL=https://api.devnet.solana.com
```

Values:
- `PORT`
  - API server port
- `API_ORIGIN`
  - public HTTPS origin for the Actions API
- `WEB_ORIGIN`
  - public HTTPS origin for the web app and icon host
- `NEXT_PUBLIC_API_URL`
  - API origin used by the frontend Blink URL builder
- `SOLANA_RPC_URL`
  - Solana devnet RPC endpoint

Important:
- `blinkfy-api.vercel.app` and `blinkfy-web.vercel.app` are placeholder examples. Replace them with your actual Vercel deployment URLs after deploy.
- For wallet testing, these values must point to real reachable HTTPS endpoints, such as a deployed app or a public tunnel.

## Vercel Deployment
This repo is easiest to deploy as two separate Vercel projects from the same monorepo:

1. Push the repo to GitHub.
2. In Vercel, import the repo twice.
3. Create the web project with root directory `apps/web`.
4. Create the API project with root directory `apps/api`.
5. Deploy both projects once to get real `*.vercel.app` URLs.
6. Set API project env vars:
   - `PORT=3001`
   - `API_ORIGIN=https://<your-api-project>.vercel.app`
   - `WEB_ORIGIN=https://<your-web-project>.vercel.app`
   - `SOLANA_RPC_URL=https://api.devnet.solana.com`
7. Set web project env vars:
   - `NEXT_PUBLIC_API_URL=https://<your-api-project>.vercel.app`
8. Redeploy both projects after setting env vars.

After deploy, test these URLs directly in the browser:
- `https://<your-api-project>.vercel.app/api/actions/send-sol?to=<wallet>&amount=0.01`
- `https://<your-web-project>.vercel.app/actions.json`

Then test the action in a Blink-aware client such as:
- `https://www.blinks.xyz/inspector?url=<encoded-action-url>`
- `https://dial.to/developer?cluster=devnet`

## Install
```bash
pnpm install
```

## Run
Start both apps:

```bash
pnpm dev
```

Run only the API:

```bash
pnpm --filter api dev
```

Run only the web app:

```bash
pnpm --filter web dev
```

## Test
Run API tests:

```bash
pnpm test
```

Build both apps:

```bash
pnpm build
```

## Manual Verification Flow
1. Open `http://localhost:3000`.
2. Enter a devnet recipient address and amount.
3. Generate the Blink URL.
4. Inspect the generated link to confirm it points at `/api/actions/send-sol`.
5. Open the link in a compatible Solana Action client or wallet.
6. Confirm the wallet requests a signature for a devnet SOL transfer.

## Notes
- The backend returns unsigned transactions only.
- The wallet/client is expected to finalize fee payer behavior and submit the transaction.
- `actions.json` is exposed from the web app for Action discovery support.
