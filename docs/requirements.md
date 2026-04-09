# Blinkfy Requirements

## Product Goal
Build a Solana Blink PoC where Blinkfy is both:
- an Action provider for devnet SOL transfer
- a Blink-aware web client that can render and execute Actions through a Blinkfy interstitial

## Supported Roles
- Provider backend:
  - exposes Solana Action endpoints
  - returns Action metadata and unsigned transactions
- Blink-aware client frontend:
  - accepts interstitial URLs
  - fetches and renders Action metadata
  - executes supported Actions with wallet signing

## Current Product Direction
- Support any valid Solana Action URL at the client layer
- Use `send-sol` as the first end-to-end validated provider flow
- Keep the homepage generator flow for quick Blink creation and testing
- Treat future actions such as `donate` as provider extensions, not current implemented behavior

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
- Documentation should remain the source of truth for the current architecture and deployment topology

## Success Criteria
- `send-sol` provider works end-to-end
- Blinkfy interstitial can render Action metadata from a valid Action URL
- Blinkfy interstitial can trigger wallet popup for supported wallets
- Raw `solana-action:` link generation is preserved for debugging/testing
- Future provider flows such as `donate` can be added without changing the Blink client model

## Evolving Requirement Notes
- Early assumption:
  - raw `solana-action:` click from the page would open wallets directly
- Updated requirement:
  - Blinkfy itself should become a Blink-aware client/interstitial
- Locked position:
  - Dial.to and inspector are fallback validation tools, not Blinkfy's primary product UX
