import {
  address,
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
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

interface TransferLeg {
  recipientAddress: string;
  lamports: bigint;
}

export interface BuildTransferTransactionInput {
  account: string;
  recipientAddress: string;
  lamports: bigint;
}

export interface BuildMultiTransferTransactionInput {
  account: string;
  transfers: TransferLeg[];
}

export interface TransactionService {
  buildTransferTransaction(input: BuildTransferTransactionInput): Promise<string>;
  buildMultiTransferTransaction(input: BuildMultiTransferTransactionInput): Promise<string>;
}

export class SolanaTransactionService implements TransactionService {
  private readonly rpc: ReturnType<typeof createSolanaRpc>;

  public constructor(private readonly rpcUrl: string) {
    this.rpc = createSolanaRpc(this.rpcUrl);
  }

  public async buildTransferTransaction(input: BuildTransferTransactionInput): Promise<string> {
    return this.buildMultiTransferTransaction({
      account: input.account,
      transfers: [
        {
          recipientAddress: input.recipientAddress,
          lamports: input.lamports,
        },
      ],
    });
  }

  public async buildMultiTransferTransaction(input: BuildMultiTransferTransactionInput): Promise<string> {
    const feePayer = address(input.account);
    const sourceSigner = createNoopSigner(feePayer);
    const { value: latestBlockhash } = await this.rpc.getLatestBlockhash().send();
    const instructions = input.transfers.map((transfer) => {
      const recipient = address(transfer.recipientAddress);

      return getTransferSolInstruction({
        source: sourceSigner,
        destination: recipient as Address,
        amount: lamports(transfer.lamports),
      });
    });

    const transaction = pipe(
      createTransactionMessage({ version: 0 }),
      (message) => setTransactionMessageFeePayer(feePayer, message),
      (message) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, message),
      (message) => appendTransactionMessageInstructions(instructions, message),
    );

    return getBase64EncodedWireTransaction(compileTransaction(transaction));
  }
}
