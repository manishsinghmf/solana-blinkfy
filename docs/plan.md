# Implementation Plan

## Milestones
1. Scaffold a split monorepo with `apps/web` and `apps/api`.
2. Add shared TypeScript config and workspace scripts.
3. Implement API validation and Action route handlers.
4. Implement Solana devnet transaction construction.
5. Add the minimal Next.js Blink generator page.
6. Add tests for validators and API behavior.
7. Document setup, architecture, and usage in `/docs`.

## Execution Steps
### 1. Workspace setup
- Use a workspace package manager for shared install and scripts.
- Keep the root small: package manager config, TypeScript base config, and root scripts only.

### 2. API implementation
- Create an Express app with JSON parsing and CORS support.
- Add:
  - environment config
  - request validators
  - Action response types
  - transaction service
  - send-sol route handlers
- Support:
  - `OPTIONS /api/actions/send-sol`
  - `GET /api/actions/send-sol`
  - `POST /api/actions/send-sol`

### 3. Solana integration
- Use Solana Kit for:
  - address parsing
  - devnet RPC client
  - transaction message creation
  - unsigned transaction serialization
- Use `@solana-program/system` to build the SOL transfer instruction.
- Use a noop signer for the user account when constructing the unsigned message.

### 4. Frontend implementation
- Create a single page with two inputs and one submit button.
- Generate the Blink link from the configured API origin.
- Display the generated `solana-action:` URI directly.
- Expose an `actions.json` route for wallet/client discovery.

### 5. Verification
- Add API tests for valid and invalid request paths.
- Add validator tests for address and lamport conversion logic.
- Verify builds for both apps.
- Verify the API can fetch a devnet blockhash during runtime.

## Acceptance Criteria
- A user can generate a Blink from the UI.
- `GET /api/actions/send-sol` returns valid metadata for valid input.
- `POST /api/actions/send-sol` returns a base64 unsigned transaction for valid input.
- Invalid input produces clear `400` responses.
- All planned docs exist and describe the implemented system.
