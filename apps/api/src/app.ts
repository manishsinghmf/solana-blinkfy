import cors from "cors";
import express from "express";

import { getEnv, type AppEnv } from "./config/env.js";
import { createSendSolHandlers } from "./routes/actions/send-sol.js";
import { SolanaTransactionService, type TransactionService } from "./services/solana/transactions.js";

export function createApp(deps?: {
  env?: AppEnv;
  transactionService?: TransactionService;
}) {
  const env = deps?.env ?? getEnv();
  const transactionService = deps?.transactionService ?? new SolanaTransactionService(env.solanaRpcUrl);
  const sendSolHandlers = createSendSolHandlers(env, transactionService);
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/health", (_request, response) => {
    response.status(200).json({ status: "ok" });
  });

  app.options("/api/actions/send-sol", sendSolHandlers.options);
  app.get("/api/actions/send-sol", sendSolHandlers.get);
  app.post("/api/actions/send-sol", sendSolHandlers.post);

  return app;
}
