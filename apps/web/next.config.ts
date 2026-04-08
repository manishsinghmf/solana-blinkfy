import type { NextConfig } from "next";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(currentDir, "../../.env"),
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(currentDir, "../.."),
};

export default nextConfig;
