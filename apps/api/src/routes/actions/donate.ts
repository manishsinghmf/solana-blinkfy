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

const DONATION_AMOUNTS = ["0.1", "0.05", "0.5"] as const;

export function createDonateHandlers(env: AppEnv, transactionService: TransactionService) {
  return {
    options: createOptionsHandler(),

    get: (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedQuery = validateFixedAmountQuery(request.query);
        const selectedAmount = validatedQuery?.amountSol ?? "0.1";

        const payload = createActionMetadata({
          env,
          title: "Donate SOL",
          description: `Support the Blinkfy creator with a devnet donation. Current preset: ${selectedAmount} SOL.`,
          label: "Donate SOL",
          actions: buildFixedAmountLinks("/api/actions/donate", DONATION_AMOUNTS, "Donate"),
        });

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build donate metadata." });
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
          recipientAddress: env.donationRecipient,
          lamports: validatedRequest.lamports,
        });

        const payload: ActionPostResponse = {
          type: "transaction",
          transaction,
          message: `Review and sign your ${validatedRequest.amountSol} SOL donation.`,
        };

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build donate transaction." });
      }
    },
  };
}
