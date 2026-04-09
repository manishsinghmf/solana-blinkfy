import { z } from "zod";

import { assertValidSolanaAddress, normalizeAmountString, parseLamportsFromSol } from "./solana.js";

const querySchema = z.object({
  to: z.string().trim().min(1, "to is required."),
  amount: z.string().trim().min(1, "amount is required."),
});

const fixedAmountQuerySchema = z.object({
  amount: z.string().trim().min(1, "amount is required.").optional(),
});

const bodySchema = z.object({
  account: z.string().optional(),
});

export interface SendSolRequest {
  recipientAddress: string;
  amountSol: string;
  lamports: bigint;
  account?: string;
}

export interface FixedAmountRequest {
  amountSol: string;
  lamports: bigint;
  account?: string;
}

export function validateSendSolQuery(input: unknown): SendSolRequest {
  const parsed = querySchema.parse(input);
  const recipientAddress = assertValidSolanaAddress(parsed.to, "to");
  const lamports = parseLamportsFromSol(parsed.amount);

  return {
    recipientAddress,
    amountSol: normalizeAmountString(parsed.amount),
    lamports,
  };
}

export function validateSendSolPost(input: { query: unknown; body: unknown }): Required<SendSolRequest> {
  const query = validateSendSolQuery(input.query);
  const parsedBody = bodySchema.parse(input.body);
  const accountValue = parsedBody.account?.trim();

  if (!accountValue) {
    throw new Error("account is required.");
  }
  const account = assertValidSolanaAddress(accountValue, "account");

  return {
    ...query,
    account,
  };
}

export function validateFixedAmountQuery(input: unknown): FixedAmountRequest | undefined {
  const parsed = fixedAmountQuerySchema.parse(input);

  if (!parsed.amount) {
    return undefined;
  }

  const lamports = parseLamportsFromSol(parsed.amount);

  return {
    amountSol: normalizeAmountString(parsed.amount),
    lamports,
  };
}

export function validateFixedAmountPost(input: { query: unknown; body: unknown }): Required<FixedAmountRequest> {
  const query = validateFixedAmountQuery(input.query);

  if (!query) {
    throw new Error("amount is required.");
  }

  const parsedBody = bodySchema.parse(input.body);
  const accountValue = parsedBody.account?.trim();

  if (!accountValue) {
    throw new Error("account is required.");
  }

  const account = assertValidSolanaAddress(accountValue, "account");

  return {
    ...query,
    account,
  };
}
