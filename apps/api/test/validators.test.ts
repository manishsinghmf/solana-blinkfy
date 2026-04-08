import { describe, expect, it } from "vitest";

import { validateSendSolPost, validateSendSolQuery } from "../src/validators/request.js";
import { isValidSolanaAddress, parseLamportsFromSol } from "../src/validators/solana.js";

const VALID_ADDRESS = "11111111111111111111111111111111";

describe("Solana validators", () => {
  it("accepts a valid Solana address", () => {
    expect(isValidSolanaAddress(VALID_ADDRESS)).toBe(true);
  });

  it("rejects an invalid Solana address", () => {
    expect(isValidSolanaAddress("not-a-wallet")).toBe(false);
  });

  it("converts SOL strings to lamports without floating point math", () => {
    expect(parseLamportsFromSol("1.25")).toBe(1_250_000_000n);
    expect(parseLamportsFromSol("0.000000001")).toBe(1n);
  });

  it("rejects zero or overly precise amounts", () => {
    expect(() => parseLamportsFromSol("0")).toThrow("greater than 0");
    expect(() => parseLamportsFromSol("0.0000000001")).toThrow("more than 9 decimal places");
  });

  it("validates GET query params", () => {
    const parsed = validateSendSolQuery({
      to: VALID_ADDRESS,
      amount: "2.5",
    });

    expect(parsed.recipientAddress).toBe(VALID_ADDRESS);
    expect(parsed.amountSol).toBe("2.5");
    expect(parsed.lamports).toBe(2_500_000_000n);
  });

  it("validates POST body params", () => {
    const parsed = validateSendSolPost({
      query: {
        to: VALID_ADDRESS,
        amount: "1",
      },
      body: {
        account: VALID_ADDRESS,
      },
    });

    expect(parsed.account).toBe(VALID_ADDRESS);
    expect(parsed.lamports).toBe(1_000_000_000n);
  });
});
