interface VisitData {
  sessionId?: string;
  referrer?: string;
  location?: IPInfo;
  date?: number;
  userAgent?: string;
  languages?: string[];
  resolution?: string;
  wallet?: string;
  contextWallet?: string;
}

interface IPInfo {
  ip: string;
  city: string;
  country: string;
}
