# Local Instructions

## Prerequisites
- Node.js 20+
- pnpm 10+

## Environment Variables
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

Values:
- `PORT`
  - API server port
- `API_ORIGIN`
  - public HTTPS origin for the Railway Actions API
- `WEB_ORIGIN`
  - public HTTPS origin for the Vercel web app and icon host
- `NEXT_PUBLIC_API_URL`
  - API origin used by the frontend Action generator and interstitial client
- `NEXT_PUBLIC_SOLANA_RPC_URL`
  - RPC endpoint used by the browser wallet client
- `SOLANA_RPC_URL`
  - RPC endpoint used by the backend Action provider
- `DONATION_RECIPIENT`
  - fixed wallet for the donate action
- `TIP_RECIPIENT`
  - fixed wallet for the tip action
- `SPLIT_RECIPIENT_A`
  - first split-payment recipient
- `SPLIT_RECIPIENT_B`
  - second split-payment recipient
- `SPLIT_RECIPIENT_A_PERCENTAGE`
  - percentage share for recipient A
- `SPLIT_RECIPIENT_B_PERCENTAGE`
  - percentage share for recipient B

Canonical product URLs:
- `WEB_ORIGIN`
- `API_ORIGIN`
- `SOLANA_RPC_URL`

Runtime-specific or duplicated values:
- `PORT`
  - local/server runtime only
- `NEXT_PUBLIC_API_URL`
  - browser-safe exposure of the API origin for the frontend
- `NEXT_PUBLIC_SOLANA_RPC_URL`
  - browser-safe exposure of the RPC endpoint for the wallet client

## Current Deployment
- Web: `https://blinkfy-web.vercel.app`
- API: `https://blinkfy-api.up.railway.app`

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

## Manual Verification
### Provider checks
1. Open:
   - `https://blinkfy-api.up.railway.app/api/actions/send-sol?to=<wallet>&amount=0.01`
2. Confirm the response returns valid Action JSON.
3. Open:
   - `https://blinkfy-api.up.railway.app/api/actions/donate?amount=0.1`
   - `https://blinkfy-api.up.railway.app/api/actions/tip?amount=0.05`
   - `https://blinkfy-api.up.railway.app/api/actions/split-payment?amount=0.5`
4. Confirm each response returns valid Action JSON with linked actions.
5. Open:
   - `https://blinkfy-web.vercel.app/actions.json`
6. Confirm the actions mapping is reachable.

### Generator checks
1. Open `https://blinkfy-web.vercel.app`
2. Enter a recipient address and amount.
3. Confirm the page generates:
   - raw Action URL
   - raw `solana-action:` URI
   - Blinkfy interstitial URL
4. Confirm fixed action presets are available for:
   - donate
   - tip
   - split-payment

### Blinkfy interstitial checks
1. Open the generated Blinkfy interstitial URL:
   - `https://blinkfy-web.vercel.app/?action=<encoded-solana-action-uri>`
2. Confirm Blinkfy renders:
   - Action metadata
   - linked actions
   - parameter inputs when required
3. Connect Phantom or Solflare.
4. Execute the action and confirm the wallet popup appears.

### Inspector fallback checks
Use a Blink-aware testing surface if needed:
- `https://dial.to/developer?cluster=devnet`
- `https://www.blinks.xyz/inspector?url=<encoded-action-url>`

These tools are fallback validation surfaces, not Blinkfy's main intended UX.

## Notes
- Blinkfy is now both:
  - an Action provider backend
  - a Blink-aware web client/interstitial
- The provider currently includes:
  - `send-sol`
  - `donate`
  - `tip`
  - `split-payment`
- A raw `solana-action:` link on a normal website should not be assumed to open a wallet directly.
- The supported in-app execution path is the Blinkfy interstitial URL with wallet connection.
