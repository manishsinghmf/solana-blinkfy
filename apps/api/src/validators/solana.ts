import { address } from "@solana/kit";

const LAMPORTS_PER_SOL = 1_000_000_000n;
const MAX_DECIMALS = 9;

export function isValidSolanaAddress(value: string): boolean {
  try {
    address(value);
    return true;
  } catch {
    return false;
  }
}

export function assertValidSolanaAddress(value: string, fieldName: string): string {
  if (!isValidSolanaAddress(value)) {
    throw new Error(`${fieldName} must be a valid Solana address.`);
  }

  return value;
}

export function parseLamportsFromSol(value: string): bigint {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    throw new Error("amount is required.");
  }

  if (!/^\d+(\.\d+)?$/.test(trimmedValue)) {
    throw new Error("amount must be a positive decimal string.");
  }

  const [wholePart, fractionalPart = ""] = trimmedValue.split(".");

  if (fractionalPart.length > MAX_DECIMALS) {
    throw new Error("amount cannot have more than 9 decimal places.");
  }

  const wholeLamports = BigInt(wholePart) * LAMPORTS_PER_SOL;
  const paddedFraction = fractionalPart.padEnd(MAX_DECIMALS, "0");
  const fractionalLamports = paddedFraction.length === 0 ? 0n : BigInt(paddedFraction);
  const lamports = wholeLamports + fractionalLamports;

  if (lamports <= 0n) {
    throw new Error("amount must be greater than 0.");
  }

  return lamports;
}

export function normalizeAmountString(value: string): string {
  const trimmedValue = value.trim();
  const [wholePartRaw, fractionalPartRaw = ""] = trimmedValue.split(".");
  const wholePart = wholePartRaw.replace(/^0+(?=\d)/, "") || "0";
  const fractionalPart = fractionalPartRaw.replace(/0+$/, "");

  return fractionalPart.length > 0 ? `${wholePart}.${fractionalPart}` : wholePart;
}
