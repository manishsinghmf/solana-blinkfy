# Blinkfy Learning Log

## Early Phase
- Started as a split PoC:
  - web in Next.js
  - API in Express
- Built a `send-sol` Action provider first.

## Key Discovery: Raw Blink Links Are Not Enough
- Initial assumption:
  - generating a raw `solana-action:` URI on the page would open Phantom or Solflare directly
- Reality:
  - a normal website is not automatically a Blink-aware client
  - raw `solana-action:` links are not a reliable direct execution path from a regular browser page

## What The Docs Clarified
- Official Solana Actions/Blinks docs indicate Blink clients can use an interstitial pattern:
  - `?action=<action_url>`
- This means Blinkfy can behave as its own Blink-aware client by decoding the query param, fetching the Action, rendering it, and executing it.
- This also clarified that raw `solana-action:` links on normal pages are not the product's primary execution path.

## Reference Repo Learnings
- `getblink.fun`
  - uses `dial.to` as a Blink-aware launch surface
  - useful reference for Blink sharing and launch UX
- `blinks-example`
  - useful provider-side reference
  - uses `@solana/actions`
  - demonstrates minimal Action GET/POST structure clearly

## Deployment Learnings
- Web is deployed on Vercel:
  - `https://blinkfy-web.vercel.app`
- API is deployed on Railway:
  - `https://blinkfy-api.up.railway.app`
- Earlier docs and env examples drifted toward fake or stale Vercel API domains
- Documentation now needs to stay aligned with the real deployment topology

## Stack Learnings
- Backend currently uses:
  - `@solana/kit`
  - `@solana-program/system`
- Frontend now needs:
  - wallet adapter
  - `@solana/web3.js`
- The backend and frontend do not need to use the same Solana client library

## Product Direction Update
- Blinkfy is no longer just a Blink generator
- Blinkfy is now evolving into:
  - an Action provider
  - a Blink-aware web client
- The client layer is intended to support any valid Solana Action, while `send-sol` remains the first fully validated provider flow.
- Future actions such as `donate` should fit the same Action-provider pattern rather than introduce a separate client model.

## Provider Expansion Learnings
- The existing `send-sol` route structure is reusable for other transfer-style Actions.
- Fixed provider actions can be added with env-backed recipients and preset amounts without changing the generic Blink client.
- Multi-recipient transfer Actions such as `split-payment` require backend support for multiple transfer instructions in one transaction, but still fit the same Action lifecycle.
