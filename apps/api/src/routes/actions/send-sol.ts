import type { Request, Response } from "express";
import { ZodError } from "zod";

import type { AppEnv } from "../../config/env.js";
import type { ActionGetResponse, ActionPostResponse } from "../../types/actions.js";
import { validateSendSolPost, validateSendSolQuery } from "../../validators/request.js";
import type { TransactionService } from "../../services/solana/transactions.js";

const BLOCKCHAIN_ID_DEVNET = "solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1";
const ACTION_VERSION = "2.4";

function applyActionHeaders(response: Response): void {
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

function getIconUrl(env: AppEnv): string {
  return `${env.webOrigin}/blink-icon.svg`;
}

function formatTitle(amountSol: string): string {
  return `Send ${amountSol} SOL`;
}

function formatDescription(recipientAddress: string, amountSol: string): string {
  return `Transfer ${amountSol} SOL on Solana devnet to ${recipientAddress}.`;
}

function formatMessage(recipientAddress: string, amountSol: string): string {
  return `Review and sign a devnet transfer of ${amountSol} SOL to ${recipientAddress}.`;
}

function buildActionHref(recipientAddress: string, amountSol: string): string {
  const params = new URLSearchParams({
    to: recipientAddress,
    amount: amountSol,
  });

  return `/api/actions/send-sol?${params.toString()}`;
}

function handleValidationError(response: Response, error: unknown): Response | undefined {
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

export function getSendSolMetadata(env: AppEnv, query: Request["query"]): ActionGetResponse {
  const validatedQuery = validateSendSolQuery(query);

  return {
    type: "action",
    icon: getIconUrl(env),
    title: formatTitle(validatedQuery.amountSol),
    description: formatDescription(validatedQuery.recipientAddress, validatedQuery.amountSol),
    label: "Send SOL",
    links: {
      actions: [
        {
          type: "transaction",
          label: `Send ${validatedQuery.amountSol} SOL`,
          href: buildActionHref(validatedQuery.recipientAddress, validatedQuery.amountSol),
        },
      ],
    },
  };
}

export function createSendSolHandlers(env: AppEnv, transactionService: TransactionService) {
  return {
    options: (_request: Request, response: Response) => {
      applyActionHeaders(response);
      response.status(200).send();
    },

    get: (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const payload = getSendSolMetadata(env, request.query);
        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);

        if (handledResponse) {
          return handledResponse;
        }

        response.status(500).json({ message: "Failed to build action metadata." });
      }
    },

    post: async (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedRequest = validateSendSolPost({
          query: request.query,
          body: request.body,
        });

        const transaction = await transactionService.buildTransferTransaction({
          account: validatedRequest.account,
          recipientAddress: validatedRequest.recipientAddress,
          lamports: validatedRequest.lamports,
        });

        const payload: ActionPostResponse = {
          type: "transaction",
          transaction,
          message: formatMessage(validatedRequest.recipientAddress, validatedRequest.amountSol),
        };

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);

        if (handledResponse) {
          return handledResponse;
        }

        response.status(500).json({ message: "Failed to build transaction." });
      }
    },
  };
}
