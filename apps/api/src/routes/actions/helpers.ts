export interface TransferLeg {
  recipientAddress: string;
  lamports: bigint;
}

export function splitLamports(totalLamports: bigint, percentageA: number, percentageB: number): [bigint, bigint] {
  if (percentageA + percentageB !== 100) {
    throw new Error("Split percentages must add up to 100.");
  }

  const lamportsA = (totalLamports * BigInt(percentageA)) / 100n;
  const lamportsB = totalLamports - lamportsA;

  if (lamportsA <= 0n || lamportsB <= 0n) {
    throw new Error("Split amount is too small for the configured percentage split.");
  }

  return [lamportsA, lamportsB];
}
