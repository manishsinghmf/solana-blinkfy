import cors from "cors";
import express from "express";

import { getEnv, type AppEnv } from "./config/env.js";
import { createDonateHandlers } from "./routes/actions/donate.js";
import { createSendSolHandlers } from "./routes/actions/send-sol.js";
import { createSplitPaymentHandlers } from "./routes/actions/split-payment.js";
import { createTipHandlers } from "./routes/actions/tip.js";
import { SolanaTransactionService, type TransactionService } from "./services/solana/transactions.js";

export function createApp(deps?: {
  env?: AppEnv;
  transactionService?: TransactionService;
}) {
  const env = deps?.env ?? getEnv();
  const transactionService = deps?.transactionService ?? new SolanaTransactionService(env.solanaRpcUrl);
  const sendSolHandlers = createSendSolHandlers(env, transactionService);
  const donateHandlers = createDonateHandlers(env, transactionService);
  const tipHandlers = createTipHandlers(env, transactionService);
  const splitPaymentHandlers = createSplitPaymentHandlers(env, transactionService);
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.options("/api/actions/send-sol", sendSolHandlers.options);
  app.get("/api/actions/send-sol", sendSolHandlers.get);
  app.post("/api/actions/send-sol", sendSolHandlers.post);

  app.options("/api/actions/donate", donateHandlers.options);
  app.get("/api/actions/donate", donateHandlers.get);
  app.post("/api/actions/donate", donateHandlers.post);

  app.options("/api/actions/tip", tipHandlers.options);
  app.get("/api/actions/tip", tipHandlers.get);
  app.post("/api/actions/tip", tipHandlers.post);

  app.options("/api/actions/split-payment", splitPaymentHandlers.options);
  app.get("/api/actions/split-payment", splitPaymentHandlers.get);
  app.post("/api/actions/split-payment", splitPaymentHandlers.post);

  return app;
}
