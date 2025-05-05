import {
  createClientUPProvider,
  type UPClientProvider,
} from "@lukso/up-provider";
import { useCallback, useEffect, useState } from "react";

let provider: UPClientProvider;

export function useUniversalProfile() {
  const [accounts, setAccounts] = useState<Array<`0x${string}`>>([]);
  const [contextAccounts, setContextAccounts] = useState<Array<`0x${string}`>>(
    []
  );
  const [profileConnected, setProfileConnected] = useState(false);

  const updateConnected = useCallback(
    (
      _accounts: Array<`0x${string}`>,
      _contextAccounts: Array<`0x${string}`>
    ) => {
      setProfileConnected(_accounts.length > 0 && _contextAccounts.length > 0);
    },
    []
  );

  useEffect(() => {
    provider = createClientUPProvider();
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const _accounts = provider.accounts as Array<`0x${string}`>;
        const _contextAccounts = provider.contextAccounts;

        setAccounts(_accounts);
        setContextAccounts(_contextAccounts);
        updateConnected(_accounts, _contextAccounts);
      } catch (error) {
        console.error("Failed to initialize provider: ", error);
      }
    };

    const accountsChanged = (_accounts: Array<`0x${string}`>) => {
      setAccounts(_accounts);
      updateConnected(_accounts, contextAccounts);
    };

    const contextAccountsChanged = (_accounts: Array<`0x${string}`>) => {
      setContextAccounts(_accounts);
      updateConnected(accounts, _accounts);
    };

    init();

    provider.on("accountsChanged", accountsChanged);
    provider.on("contextAccountsChanged", contextAccountsChanged);

    return () => {
      provider.removeListener("accountsChanged", accountsChanged);
      provider.removeListener("contextAccountsChanged", contextAccountsChanged);
    };
  }, [accounts[0], contextAccounts[0], updateConnected]);

  return {
    accounts,
    contextAccounts,
    profileConnected,
    provider,
  };
}
