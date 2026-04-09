# Blinkfy Specification

## Goal
Blinkfy is a Solana Blink Proof of Concept with two roles:
- an **Action provider** backend that builds devnet SOL transfer transactions
- a **Blink-aware client** frontend that can render and execute Solana Actions through a Blinkfy interstitial

The first validated provider flow is `send-sol`, but the frontend client should be able to consume any Action URL that conforms to the Solana Actions response shape.

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

### Generic Action Support
- The client should render any valid Action that exposes:
  - metadata from `GET`
  - linked actions in `links.actions`
  - transaction responses from `POST`
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

## Transaction Rules
- Instruction: system program SOL transfer
- Amount conversion: deterministic SOL-to-lamports parsing
- Fee payer: requesting wallet account
- Recipient: `to`
- Source account: requesting wallet account
- Recent blockhash: fetched from devnet at request time
- Backend returns unsigned transactions only

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
- Separate:
  - provider backend logic
  - interstitial/client rendering logic
  - wallet connection logic
  - transaction signing/submission logic
- Do not add auth or persistence for this PoC.
