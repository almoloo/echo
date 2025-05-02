"use client";

import { getCharacterStats } from "@/lib/data/user";
import { useSession } from "next-auth/react";
import { createContext, ReactNode, useEffect, useState } from "react";
import { toast } from "sonner";

interface CharacterContextValue {
  info: CharacterInfo | null;
  loading: boolean;
  updateInfo: () => Promise<void>;
}

export const characterContext = createContext<CharacterContextValue | null>(
  null
);

export default function CharacterProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { data: session } = useSession();
  const [characterInfo, setCharacterInfo] = useState<CharacterInfo | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  async function updateCharacter() {
    if (!session?.user) return;
    try {
      setLoading(true);
      const charInfo = await getCharacterStats();
      setCharacterInfo(charInfo);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "An error has occured while trying to update the character info!"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    updateCharacter();
  }, []);

  return (
    <characterContext.Provider
      value={{ info: characterInfo, loading, updateInfo: updateCharacter }}
    >
      {children}
    </characterContext.Provider>
  );
}
