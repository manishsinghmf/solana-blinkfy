# Blinkfy

Blinkfy is a Solana Blink proof of concept with two roles:

- a Solana Actions provider API
- a Blink-aware web client/interstitial

It runs on Solana devnet and lets you generate Blink launch URLs, open them inside Blinkfy, connect a wallet, and execute supported actions in-page.

## Architecture

This repo is a `pnpm` workspace with two apps:

- `apps/api`: Express-based Solana Actions provider
- `apps/web`: Next.js Blink generator and Blink-aware client

Current supported actions:

- `send-sol`
- `donate`
- `tip`
- `split-payment`

## Prerequisites

- Node.js 20+
- pnpm 10+

## Local Setup

Install dependencies from the repo root:

```bash
pnpm install
```

Create a root `.env` file:

```dotenv
PORT=3001
API_ORIGIN=https://blinkfy-api.up.railway.app
WEB_ORIGIN=https://blinkfy-web.vercel.app
NEXT_PUBLIC_API_URL=https://blinkfy-api.up.railway.app
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_RPC_URL=https://api.devnet.solana.com
DONATION_RECIPIENT=HS7M3zgnFVucMMM5k1a2sPBPjRndfYNW7Ep6eMueCvX4
TIP_RECIPIENT=HS7M3zgnFVucMMM5k1a2sPBPjRndfYNW7Ep6eMueCvX4
SPLIT_RECIPIENT_A=HS7M3zgnFVucMMM5k1a2sPBPjRndfYNW7Ep6eMueCvX4
SPLIT_RECIPIENT_B=FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa
SPLIT_RECIPIENT_A_PERCENTAGE=70
SPLIT_RECIPIENT_B_PERCENTAGE=30
```

Environment variables:

- `PORT`: API server port for local development
- `API_ORIGIN`: public origin for the Actions API
- `WEB_ORIGIN`: public origin for the web app and icon host
- `NEXT_PUBLIC_API_URL`: browser-safe API origin for the web app
- `NEXT_PUBLIC_SOLANA_RPC_URL`: browser-safe Solana RPC URL for the wallet client
- `SOLANA_RPC_URL`: Solana RPC URL used by the backend
- `DONATION_RECIPIENT`: fixed recipient for the `donate` action
- `TIP_RECIPIENT`: fixed recipient for the `tip` action
- `SPLIT_RECIPIENT_A`: first `split-payment` recipient
- `SPLIT_RECIPIENT_B`: second `split-payment` recipient
- `SPLIT_RECIPIENT_A_PERCENTAGE`: share for recipient A
- `SPLIT_RECIPIENT_B_PERCENTAGE`: share for recipient B

## Run

Start both apps:

```bash
pnpm dev
```

Start only the API:

```bash
pnpm --filter api dev
```

Start only the web app:

```bash
pnpm --filter web dev
```

Run API tests:

```bash
pnpm test
```

Build the workspace:

```bash
pnpm build
```

## How To Use

1. Open the web app.
2. Generate a Blink from the homepage by entering a recipient and amount, or by choosing a fixed preset.
3. Copy or open the generated Blinkfy interstitial URL.
4. Blinkfy will decode the `?action=...` value, fetch Action metadata, and render the available actions.
5. Connect Phantom or Solflare.
6. Execute the action and approve the wallet prompt.

The homepage generates:

- a raw Action URL
- a raw `solana-action:` URI
- a Blinkfy interstitial URL

The preferred execution path is the Blinkfy interstitial URL.

## Manual Verification

Current deployed URLs:

- Web: `https://blinkfy-web.vercel.app`
- API: `https://blinkfy-api.up.railway.app`

### Provider checks

Open these endpoints and confirm they return valid Action JSON:

- `https://blinkfy-api.up.railway.app/api/actions/send-sol?to=<wallet>&amount=0.01`
- `https://blinkfy-api.up.railway.app/api/actions/donate?amount=0.1`
- `https://blinkfy-api.up.railway.app/api/actions/tip?amount=0.05`
- `https://blinkfy-api.up.railway.app/api/actions/split-payment?amount=0.5`

Also confirm the actions mapping is reachable:

- `https://blinkfy-web.vercel.app/actions.json`

### Generator checks

1. Open `https://blinkfy-web.vercel.app`
2. Enter a recipient address and amount
3. Confirm the page generates:
   - raw Action URL
   - raw `solana-action:` URI
   - Blinkfy interstitial URL
4. Confirm fixed presets are available for:
   - `donate`
   - `tip`
   - `split-payment`

### Interstitial checks

1. Open a generated Blinkfy interstitial URL in the form:
   - `https://blinkfy-web.vercel.app/?action=<encoded-solana-action-uri>`
2. Confirm Blinkfy renders:
   - Action metadata
   - linked actions
   - parameter inputs when required
3. Connect Phantom or Solflare
4. Execute the action and confirm the wallet popup appears

### Fallback inspector tools

If you want an external Blink-aware test surface, use:

- `https://dial.to/developer?cluster=devnet`
- `https://www.blinks.xyz/inspector?url=<encoded-action-url>`

These are fallback validation tools, not Blinkfy's primary user flow.

## Notes

- Blinkfy is devnet-only in its current form.
- The in-app execution path is the Blinkfy interstitial with wallet connection.
- A raw `solana-action:` link on a normal website should not be assumed to open a wallet directly.
- `docs/instructions.md` remains the more detailed internal runbook.
