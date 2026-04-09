# Blinkfy Requirements

## Product Goal
Build a Solana Blink PoC where Blinkfy is both:
- an Action provider for devnet SOL transfer
- a Blink-aware web client that can render and execute Actions through a Blinkfy interstitial

## Current Product Direction
- Support any valid Solana Action URL at the client layer
- Use `send-sol` as the first end-to-end validated provider flow
- Keep the homepage generator flow for quick Blink creation and testing

## Functional Requirements
- Generator mode must:
  - accept recipient address
  - accept amount in SOL
  - generate Action URL
  - generate `solana-action:` URI
  - generate Blinkfy interstitial URL
- Interstitial mode must:
  - detect `?action=...`
  - validate `solana-action:` scheme
  - decode HTTPS Action URL
  - fetch and render Action metadata
  - render linked actions and parameter inputs
  - execute Action POST requests
  - trigger wallet signing and submission

## Constraints
- Solana devnet only
- No authentication
- No database for the `send-sol` PoC
- Keep the backend small and correct
- Keep the frontend understandable while adding Blink client behavior

## Success Criteria
- `send-sol` provider works end-to-end
- Blinkfy interstitial can render Action metadata from a valid Action URL
- Blinkfy interstitial can trigger wallet popup for supported wallets
- Raw `solana-action:` link generation is preserved for debugging/testing

## Evolving Requirement Notes
- Early assumption:
  - raw `solana-action:` click from the page would open wallets directly
- Updated requirement:
  - Blinkfy itself should become a Blink-aware client/interstitial
