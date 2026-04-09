# Implementation Plan

## Milestones
1. Keep the existing provider backend for `send-sol`.
2. Upgrade the web app into a dual-mode Blink-aware client.
3. Add wallet connection for in-page Action execution.
4. Support generic Action metadata rendering with `send-sol` as the first validated provider flow.
5. Refresh documentation around deployment, testing, requirements, and learnings.

## Execution Steps
### 1. Frontend mode split
- Keep `/` as the entrypoint.
- Use generator mode when no `action` query param is present.
- Use interstitial/client mode when `action` is present.

### 2. Generator experience
- Keep the existing `send-sol` form.
- Generate:
  - raw Action URL
  - raw `solana-action:` URI
  - Blinkfy interstitial URL
- Make the interstitial URL the primary launch path.

### 3. Blink-aware client
- Decode `?action=...`
- Validate `solana-action:` prefix
- Decode and validate HTTPS Action URL
- Fetch Action metadata from `GET`
- Render linked actions and parameter inputs generically from `links.actions`
- Execute linked actions through `POST`

### 4. Wallet execution
- Add wallet adapter support for Phantom and Solflare
- Connect wallet only when client mode needs execution
- Use returned transaction payloads to trigger signing/submission in-page

### 5. Documentation
- Update the existing docs so they match the actual deployment:
  - web on Vercel
  - API on Railway
- Add `requirements.md` for evolving requirements
- Add `learning.md` for project history and discoveries

## Acceptance Criteria
- A user can still generate a `send-sol` Action from the homepage.
- A user can open a Blinkfy interstitial URL and see the rendered Action UI.
- The client can execute the first validated provider flow (`send-sol`) with a connected wallet.
- Invalid or unsupported Action inputs show visible, actionable errors.
- All docs reflect the real URLs, product behavior, and current tech stack.
