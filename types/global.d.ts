interface Window {
  ethereum: {
    isMetaMask?: boolean;
    selectedAddress?: string;
    isConnected?: () => boolean;
    request?: (request: {
      method: string;
      params?: Array<any>;
    }) => Promise<any>;
    on?: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener?: (
      eventName: string,
      callback: (...args: any[]) => void
    ) => void;
  };
  lukso: {
    chainId: string;
    deprecationNotified: boolean;
    handleAccountsChanged: () => void;
    handleChainChanged: () => void;
    isUniversalProfileExtension: boolean;
  };
}
