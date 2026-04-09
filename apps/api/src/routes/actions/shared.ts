import type { Request, Response } from "express";
import { ZodError } from "zod";

import type { AppEnv } from "../../config/env.js";
import type { ActionGetResponse, LinkedAction } from "../../types/actions.js";

const BLOCKCHAIN_ID_DEVNET = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
const ACTION_VERSION = "2.4";

export function applyActionHeaders(response: Response): void {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, Content-Encoding, Accept-Encoding, x-blockchain-ids, x-action-version",
  );
  response.setHeader("x-blockchain-ids", BLOCKCHAIN_ID_DEVNET);
  response.setHeader("x-action-version", ACTION_VERSION);
  response.setHeader("Content-Type", "application/json; charset=utf-8");
}

export function getIconUrl(env: AppEnv): string {
  return `${env.webOrigin}/blink-icon.svg`;
}

export function handleValidationError(response: Response, error: unknown): Response | undefined {
  if (error instanceof ZodError) {
    return response.status(400).json({
      message: error.issues[0]?.message ?? "Invalid request.",
    });
  }

  if (error instanceof Error) {
    return response.status(400).json({ message: error.message });
  }

  return undefined;
}

export function buildFixedAmountHref(basePath: string, amountSol: string): string {
  const params = new URLSearchParams({ amount: amountSol });
  return `${basePath}?${params.toString()}`;
}

export function buildFixedAmountLinks(
  basePath: string,
  amounts: readonly string[],
  labelPrefix: string,
): LinkedAction[] {
  return amounts.map((amountSol) => ({
    type: "transaction",
    label: `${labelPrefix} ${amountSol} SOL`,
    href: buildFixedAmountHref(basePath, amountSol),
  }));
}

export function createActionMetadata(input: {
  env: AppEnv;
  title: string;
  description: string;
  label: string;
  actions: LinkedAction[];
}): ActionGetResponse {
  return {
    type: "action",
    icon: getIconUrl(input.env),
    title: input.title,
    description: input.description,
    label: input.label,
    links: {
      actions: input.actions,
    },
  };
}

export function createOptionsHandler() {
  return (_request: Request, response: Response) => {
    applyActionHeaders(response);
    response.status(200).send();
  };
}
