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

export function groupByDate(
  data: { timestamp: number }[]
): { date: string; count: number }[] {
  const map = new Map<string, number>();

  data.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0];
    map.set(date, (map.get(date) || 0) + 1);
  });

  return Array.from(map.entries()).map(([date, count]) => ({ date, count }));
}

export function mergeByDate(
  connected: { date: string; count: number }[],
  anonymous: { date: string; count: number }[]
): { date: string; connected: number; anonymous: number }[] {
  const map = new Map<string, { connected: number; anonymous: number }>();

  connected.forEach(({ date, count }) => {
    if (!map.has(date)) {
      map.set(date, { connected: 0, anonymous: 0 });
    }
    map.get(date)!.connected = count;
  });

  anonymous.forEach(({ date, count }) => {
    if (!map.has(date)) {
      map.set(date, { connected: 0, anonymous: 0 });
    }
    map.get(date)!.anonymous = count;
  });

  return Array.from(map.entries())
    .map(([date, value]) => ({ date, ...value }))
    .sort((a, b) => a.date.localeCompare(b.date)); // optional: sort by date
}

export function calculateDataPercentages(data: { name: string }[]) {
  const total = data.length;
  const counts: Record<string, number> = {};

  data.forEach(({ name }) => {
    counts[name] = (counts[name] || 0) + 1;
  });

  return Object.entries(counts).map(([name, count]) => ({
    name,
    percent: parseFloat(((count / total) * 100).toFixed(2)),
  }));
}
