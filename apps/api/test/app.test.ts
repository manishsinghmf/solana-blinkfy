import { describe, expect, it, vi } from "vitest";

import type { AppEnv } from "../src/config/env.js";
import { createDonateHandlers } from "../src/routes/actions/donate.js";
import { createSendSolHandlers, getSendSolMetadata } from "../src/routes/actions/send-sol.js";
import { createSplitPaymentHandlers } from "../src/routes/actions/split-payment.js";
import { createTipHandlers } from "../src/routes/actions/tip.js";
import type { TransactionService } from "../src/services/solana/transactions.js";

const VALID_ADDRESS = "11111111111111111111111111111111";

const env: AppEnv = {
  port: 3001,
  apiOrigin: "http://localhost:3001",
  webOrigin: "http://localhost:3000",
  solanaRpcUrl: "https://api.devnet.solana.com",
  donationRecipient: VALID_ADDRESS,
  tipRecipient: VALID_ADDRESS,
  splitRecipientA: VALID_ADDRESS,
  splitRecipientB: "FnHyam9w4NZoWR6mKN1CuGBritdsEWZQa4Z4oawLZGxa",
  splitRecipientAPercentage: 70,
  splitRecipientBPercentage: 30,
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

describe("fixed provider action routes", () => {
  it("returns donate metadata with preset links", () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
      buildMultiTransferTransaction: vi.fn(),
    };
    const handlers = createDonateHandlers(env, transactionService);
    const response = createMockResponse();

    handlers.get(
      {
        query: {
          amount: "0.1",
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Donate SOL");
    expect(response.body.links.actions[0].href).toContain("/api/actions/donate");
  });

  it("returns tip metadata with preset links", () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
      buildMultiTransferTransaction: vi.fn(),
    };
    const handlers = createTipHandlers(env, transactionService);
    const response = createMockResponse();

    handlers.get(
      {
        query: {
          amount: "0.05",
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.title).toBe("Tip SOL");
    expect(response.body.links.actions[0].href).toContain("/api/actions/tip");
  });

  it("builds a split-payment transaction response", async () => {
    const transactionService: TransactionService = {
      buildTransferTransaction: vi.fn(),
      buildMultiTransferTransaction: vi.fn().mockResolvedValue("split-base64"),
    };
    const handlers = createSplitPaymentHandlers(env, transactionService);
    const response = createMockResponse();

    await handlers.post(
      {
        query: {
          amount: "0.5",
        },
        body: {
          account: VALID_ADDRESS,
        },
      } as never,
      response as never,
    );

    expect(response.statusCode).toBe(200);
    expect(response.body.transaction).toBe("split-base64");
    expect(response.body.message).toContain("split payment");
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
