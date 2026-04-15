# Blink Generation Sequence Diagram

This diagram shows how a user generates shareable Blink URLs.

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant Web App

    User->>Web App: Enter recipient & amount
    User->>Web App: Click "Generate"
    Web App->>Web App: Build Action URL
    Web App->>Web App: Encode to solana-action: scheme
    Web App->>User: Display shareable URLs
    User->>User: Copy & share
```</content>
<parameter name="filePath">/home/manish/projects/blinkfy/docs/sequence-blink-generation.md