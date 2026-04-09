# Blinkfy Specification

## Goal
Blinkfy is a Solana Blink Proof of Concept with two roles:
- an **Action provider** backend that builds devnet SOL transfer transactions
- a **Blink-aware client** frontend that can render and execute Solana Actions through a Blinkfy interstitial

The first validated provider flow is `send-sol`, but the frontend client should be able to consume any Action URL that conforms to the Solana Actions response shape.
Blinkfy currently also exposes additional fixed transfer-style provider actions:
- `donate`
- `tip`
- `split-payment`

## Deployment Topology
- Web: `https://blinkfy-web.vercel.app`
- API: `https://blinkfy-api.up.railway.app`
- Network: Solana devnet

## Product Behavior
### Generator Mode
- Route: `/`
- Inputs:
  - recipient address
  - amount in SOL
- Outputs:
  - raw Action URL
  - raw `solana-action:` URI
  - Blinkfy interstitial URL in the form:
    - `https://blinkfy-web.vercel.app/?action=<encoded-solana-action-uri>`
- Preferred execution path:
  - Blinkfy interstitial URL
- Non-primary/debug outputs:
  - raw Action URL
  - raw `solana-action:` URI
- The homepage may also expose fixed provider presets for:
  - `donate`
  - `tip`
  - `split-payment`

### Blinkfy Interstitial Mode
- Route: `/?action=<encoded-solana-action-uri>`
- The frontend must:
  - detect the `action` query param
  - validate the `solana-action:` scheme
  - decode the embedded Action URL
  - require the decoded Action URL to be absolute HTTPS
  - fetch Action metadata via `GET`
  - render the Action metadata and linked actions
  - collect parameters from `links.actions[].parameters`
  - execute the Action via `POST`
  - use the connected wallet account in the POST body
  - prompt the wallet to sign and submit the returned transaction

### Blink Client Lifecycle
1. Parse the `action` query parameter.
2. Validate the `solana-action:` scheme.
3. Decode the embedded Action URL.
4. Require the Action URL to be absolute HTTPS.
5. Fetch Action metadata via `GET`.
6. Render `links.actions` and any parameters.
7. Execute the selected linked action via `POST`.
8. Submit the returned transaction through the connected wallet.

### Generic Action Support
- The client should render any valid Action that exposes:
  - metadata from `GET`
  - linked actions in `links.actions`
  - transaction responses from `POST`
- The client is generic at the rendering/execution layer, but only `send-sol` is currently validated end-to-end in Blinkfy.
- For malformed or unsupported Actions:
  - show explicit error states
  - keep the decoded Action URL visible for fallback testing in inspector or Dial.to

## Provider API
### GET `/api/actions/send-sol`
- Required query params:
  - `to`
  - `amount`
- Validate both query params before returning metadata.
- Return:
  - `x-blockchain-ids: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
  - `x-action-version: 2.4`
  - `type: "action"`
  - `title`
  - `description`
  - `label`
  - `icon`
  - `links.actions`

### POST `/api/actions/send-sol`
- Required query params:
  - `to`
  - `amount`
- Required JSON body:
  - `account`
- Validate:
  - recipient address
  - wallet account address
  - amount format
  - amount > 0
- Build a devnet SOL transfer transaction.
- Return:
  - `x-blockchain-ids: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
  - `x-action-version: 2.4`
  - `type: "transaction"`
  - `transaction` as base64 serialized bytes
  - `message`

### GET/POST `/api/actions/donate`
- Fixed donation recipient from `DONATION_RECIPIENT`
- Preset amounts exposed through `links.actions`
- POST returns a single-recipient SOL transfer transaction

### GET/POST `/api/actions/tip`
- Fixed tip recipient from `TIP_RECIPIENT`
- Preset amounts exposed through `links.actions`
- POST returns a single-recipient SOL transfer transaction

### GET/POST `/api/actions/split-payment`
- Fixed recipients from:
  - `SPLIT_RECIPIENT_A`
  - `SPLIT_RECIPIENT_B`
- Fixed split percentages from env
- Preset total amounts exposed through `links.actions`
- POST returns a transaction with two transfer instructions

## Transaction Rules
- Instruction: system program SOL transfer
- Amount conversion: deterministic SOL-to-lamports parsing
- Fee payer: requesting wallet account
- Recipient: `to`
- Source account: requesting wallet account
- Recent blockhash: fetched from devnet at request time
- Backend returns unsigned transactions only
- `split-payment` may return multiple transfer instructions in one unsigned transaction

## Error Handling
- Invalid address: `400`
- Invalid amount: `400`
- Missing `account`: `400`
- Malformed interstitial action query: client-side visible error state
- Unsupported or malformed Action response: client-side visible error state
- Unexpected backend failure: `500`

## Non-Functional Expectations
- Keep the architecture small and readable.
- Use strict TypeScript types.
- Document the distinction between provider behavior and client behavior clearly.
- Separate:
  - provider backend logic
  - interstitial/client rendering logic
  - wallet connection logic
  - transaction signing/submission logic
- Do not add auth or persistence for this PoC.
- A raw `solana-action:` link from a normal page is not the primary execution path.
