import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertIPFSHash(hash: string) {
  return `https://api.universalprofile.cloud/ipfs/${hash.replace(
    "ipfs://",
    ""
  )}`;
}
