import type { Request, Response } from "express";

import type { AppEnv } from "../../config/env.js";
import type { ActionPostResponse } from "../../types/actions.js";
import type { TransactionService } from "../../services/solana/transactions.js";
import { validateFixedAmountPost, validateFixedAmountQuery } from "../../validators/request.js";
import {
  applyActionHeaders,
  buildFixedAmountLinks,
  createActionMetadata,
  createOptionsHandler,
  handleValidationError,
} from "./shared.js";

const TIP_AMOUNTS = ["0.01", "0.05", "0.1"] as const;

export function createTipHandlers(env: AppEnv, transactionService: TransactionService) {
  return {
    options: createOptionsHandler(),

    get: (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedQuery = validateFixedAmountQuery(request.query);
        const selectedAmount = validatedQuery?.amountSol ?? "0.01";

        const payload = createActionMetadata({
          env,
          title: "Tip SOL",
          description: `Send a quick devnet tip. Current preset: ${selectedAmount} SOL.`,
          label: "Tip SOL",
          actions: buildFixedAmountLinks("/api/actions/tip", TIP_AMOUNTS, "Tip"),
        });

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build tip metadata." });
      }
    },

    post: async (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedRequest = validateFixedAmountPost({
          query: request.query,
          body: request.body,
        });

        const transaction = await transactionService.buildTransferTransaction({
          account: validatedRequest.account,
          recipientAddress: env.tipRecipient,
          lamports: validatedRequest.lamports,
        });

        const payload: ActionPostResponse = {
          type: "transaction",
          transaction,
          message: `Review and sign your ${validatedRequest.amountSol} SOL tip.`,
        };

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build tip transaction." });
      }
    },
  };
}
