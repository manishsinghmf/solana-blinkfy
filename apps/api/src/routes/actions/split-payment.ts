import type { Request, Response } from "express";

import type { AppEnv } from "../../config/env.js";
import type { ActionPostResponse } from "../../types/actions.js";
import type { TransactionService } from "../../services/solana/transactions.js";
import { validateFixedAmountPost, validateFixedAmountQuery } from "../../validators/request.js";
import { splitLamports } from "./helpers.js";
import {
  applyActionHeaders,
  buildFixedAmountLinks,
  createActionMetadata,
  createOptionsHandler,
  handleValidationError,
} from "./shared.js";

const SPLIT_PAYMENT_AMOUNTS = ["0.1", "0.5", "1"] as const;

export function createSplitPaymentHandlers(env: AppEnv, transactionService: TransactionService) {
  return {
    options: createOptionsHandler(),

    get: (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedQuery = validateFixedAmountQuery(request.query);
        const selectedAmount = validatedQuery?.amountSol ?? "0.1";

        const payload = createActionMetadata({
          env,
          title: "Split Payment",
          description: `Send ${selectedAmount} SOL split ${env.splitRecipientAPercentage}/${env.splitRecipientBPercentage} between two recipients on devnet.`,
          label: "Split Payment",
          actions: buildFixedAmountLinks("/api/actions/split-payment", SPLIT_PAYMENT_AMOUNTS, "Pay"),
        });

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build split-payment metadata." });
      }
    },

    post: async (request: Request, response: Response) => {
      applyActionHeaders(response);

      try {
        const validatedRequest = validateFixedAmountPost({
          query: request.query,
          body: request.body,
        });
        const [lamportsA, lamportsB] = splitLamports(
          validatedRequest.lamports,
          env.splitRecipientAPercentage,
          env.splitRecipientBPercentage,
        );

        const transaction = await transactionService.buildMultiTransferTransaction({
          account: validatedRequest.account,
          transfers: [
            {
              recipientAddress: env.splitRecipientA,
              lamports: lamportsA,
            },
            {
              recipientAddress: env.splitRecipientB,
              lamports: lamportsB,
            },
          ],
        });

        const payload: ActionPostResponse = {
          type: "transaction",
          transaction,
          message: `Review and sign your ${validatedRequest.amountSol} SOL split payment.`,
        };

        response.status(200).json(payload);
      } catch (error) {
        const handledResponse = handleValidationError(response, error);
        if (handledResponse) {
          return handledResponse;
        }
        response.status(500).json({ message: "Failed to build split-payment transaction." });
      }
    },
  };
}
