import { describe, expect, it, vi } from "vitest";

import type { AppEnv } from "../src/config/env.js";
import { createSendSolHandlers, getSendSolMetadata } from "../src/routes/actions/send-sol.js";
import type { TransactionService } from "../src/services/solana/transactions.js";

const VALID_ADDRESS = "11111111111111111111111111111111";

const env: AppEnv = {
  port: 3001,
  apiOrigin: "http://localhost:3001",
  webOrigin: "http://localhost:3000",
  solanaRpcUrl: "https://api.devnet.solana.com",
};

describe("send-sol action routes", () => {
  it("returns action metadata for a valid GET request", async () => {
    const payload = getSendSolMetadata(env, {
      to: VALID_ADDRESS,
      amount: "0.5",
    });

    expect(payload.type).toBe("action");
    expect(payload.label).toBe("Send SOL");
    expect(payload.icon).toBe("http://localhost:3000/blink-icon.svg");
    expect(payload.links?.actions[0]).toMatchObject({
      type: "transaction",
      href: `/api/actions/send-sol?to=${VALID_ADDRESS}&amount=0.5`,
    });
  });

  it("returns a serialized transaction for a valid POST request", async () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn().mockResolvedValue("base64-transaction"),
    };
    const handlers = createSendSolHandlers(env, transactionService);
    const response = createMockResponse();

    await handlers.post(
      {
        query: {
          to: VALID_ADDRESS,
          amount: "1.5",
        },
        body: {
          account: VALID_ADDRESS,
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.type).toBe("transaction");
    expect(response.body.transaction).toBe("base64-transaction");
    expect(response.body.message).toContain("1.5 SOL");
    expect(response.headers["Access-Control-Allow-Origin"]).toBe("*");
    expect(response.headers["x-blockchain-ids"]).toBe("solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1");
    expect(response.headers["x-action-version"]).toBe("2.4");
  });

  it("rejects invalid addresses", async () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
    };
    const handlers = createSendSolHandlers(env, transactionService);
    const response = createMockResponse();

    handlers.get(
      {
        query: {
          to: "bad-address",
          amount: "0.5",
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("valid Solana address");
  });

  it("rejects invalid amounts", async () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
    };
    const handlers = createSendSolHandlers(env, transactionService);
    const response = createMockResponse();

    handlers.get(
      {
        query: {
          to: VALID_ADDRESS,
          amount: "-1",
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("positive decimal");
  });

  it("rejects missing account on POST", async () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
    };
    const handlers = createSendSolHandlers(env, transactionService);
    const response = createMockResponse();

    await handlers.post(
      {
        query: {
          to: VALID_ADDRESS,
          amount: "0.5",
        },
        body: {},
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain("account is required");
  });
});

function createMockResponse() {
  return {
    body: undefined as unknown,
    headers: {} as Record<string, string>,
    statusCode: 200,
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
  };
}
