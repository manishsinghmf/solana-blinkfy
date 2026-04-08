# Solana Blink PoC Specification

## Goal
Build a Proof of Concept for Solana Blinks (Actions) that lets a user:
- enter a recipient Solana address
- enter an amount in SOL
- generate a `solana-action:` link
- open that link in a compatible wallet or client
- receive an unsigned devnet SOL transfer transaction from the backend
- sign and send the transaction with their wallet

## Product Scope
- Network: Solana devnet only
- Authentication: not included
- Database: not included
- Frontend: minimal single-page form
- Backend: REST API that follows Solana Actions conventions

## Functional Behavior
### Frontend
- Render a minimal form with:
  - `recipient address`
  - `amount in SOL`
- On submit, generate a Blink URI in the format:
  - `solana-action:<encoded_action_url>`
- The encoded URL must point to:
  - `GET/POST /api/actions/send-sol?to=<address>&amount=<value>`
- Display the generated Blink link as a clickable anchor.

### Backend GET
- Endpoint: `GET /api/actions/send-sol`
- Required query params:
  - `to`
  - `amount`
- Validate both query params before returning metadata.
- Return Action metadata with:
  - `x-blockchain-ids: solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1`
  - `x-action-version: 2.4`
  - `type: "action"`
  - `title`
  - `description`
  - `label`
  - `icon`
  - `links.actions`

### Backend POST
- Endpoint: `POST /api/actions/send-sol`
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
  - `message` describing the action

## Transaction Rules
- Transfer instruction: system program SOL transfer
- Amount conversion: SOL to lamports using deterministic string parsing
- Fee payer: requesting wallet account
- Recipient: `to` query param
- Source account: requesting wallet account
- Recent blockhash: fetched from devnet at request time
- Transaction signatures: none added by backend

## Error Handling
- Invalid address: `400`
- Invalid amount: `400`
- Missing `account`: `400`
- Unexpected backend failure: `500`
- Error body shape:
  - `{ "message": "<human readable text>" }`

## Non-Functional Expectations
- Keep the architecture small and readable.
- Use strict TypeScript types.
- Separate UI, validation, route handling, and Solana transaction creation.
- Do not add persistence or user auth.
