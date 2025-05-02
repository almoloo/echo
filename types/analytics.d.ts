interface VisitData {
  id?: string;
  sessionId?: string;
  referrer?: string;
  location?: IPInfo;
  date?: number;
  userAgent?: string;
  userAgentData?: UserAgentData;
  languages?: string[];
  resolution?: string;
  wallet?: string;
  contextWallet?: string;
}

interface IPInfo {
  ip: string;
  city: string;
  country: string;
  countryShort: string;
}

interface UserAgentData {
  browser: {
    name?: string;
    version?: string;
  };
  device: {
    mobile?: boolean;
    type?:
      | "mobile"
      | "tablet"
      | "console"
      | "smarttv"
      | "wearable"
      | "xr"
      | "embedded";
    vendor?: string;
  };
  os: {
    name?: string;
    version?: string;
  };
}
