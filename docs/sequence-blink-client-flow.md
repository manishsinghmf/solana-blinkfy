# Blink Aware Client Flow Sequence Diagram

This diagram shows how a Blink-aware client executes a payment action.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Web App
    participant Wallet as Wallet<br/>(Phantom/Solflare)
    participant API Server
    participant Solana RPC

    User->>Web App: Click Blink link
    Web App->>API Server: GET action metadata
    API Server-->>Web App: Action details
    Web App->>User: Display action UI

    User->>Wallet: Connect wallet
    Wallet-->>Web App: Wallet connected

    User->>Web App: Confirm action
    Web App->>API Server: POST to execute action
    API Server->>Solana RPC: Build transaction
    Solana RPC-->>API Server: Transaction data
    API Server-->>Web App: Unsigned transaction

    Web App->>Wallet: Sign transaction
    Wallet-->>Web App: Signed transaction
    Web App->>Solana RPC: Submit transaction
    Solana RPC-->>Web App: Transaction confirmed
    Web App->>User: Show success
```</content>
<parameter name="filePath">/home/manish/projects/blinkfy/docs/sequence-blink-client-flow.md