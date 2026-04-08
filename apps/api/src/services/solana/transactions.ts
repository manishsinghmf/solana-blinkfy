import {
  address,
  appendTransactionMessageInstruction,
  compileTransaction,
  createNoopSigner,
  createSolanaRpc,
  createTransactionMessage,
  getBase64EncodedWireTransaction,
  lamports,
  pipe,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  type Address,
} from "@solana/kit";
import { getTransferSolInstruction } from "@solana-program/system";

export interface BuildTransferTransactionInput {
  account: string;
  recipientAddress: string;
  lamports: bigint;
}

export interface TransactionService {
  buildTransferTransaction(input: BuildTransferTransactionInput): Promise<string>;
}

export class SolanaTransactionService implements TransactionService {
  private readonly rpc: ReturnType<typeof createSolanaRpc>;

  public constructor(private readonly rpcUrl: string) {
    this.rpc = createSolanaRpc(this.rpcUrl);
  }

  public async buildTransferTransaction(input: BuildTransferTransactionInput): Promise<string> {
    const feePayer = address(input.account);
    const sourceSigner = createNoopSigner(feePayer);
    const recipient = address(input.recipientAddress);
    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();

    const transaction = pipe(
      createTransactionMessage({ version: 0 }),
      (message) => setTransactionMessageFeePayer(feePayer, message),
      (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
      (message) =>
        appendTransactionMessageInstruction(
          getTransferSolInstruction({
            source: sourceSigner,
            destination: recipient as Address,
            amount: lamports(input.lamports),
          }),
          message,
        ),
    );

    return getBase64EncodedWireTransaction(compileTransaction(transaction));
  }
}
