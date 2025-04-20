"use client";

import { getCharacterStats } from "@/lib/data/user";
import { useEffect, useState } from "react";

interface CharacterCardProps {
  character: CharacterInfo | null;
  loading: boolean;
}

export default function CharacterCard({
  character,
  loading,
}: CharacterCardProps) {
  return (
    <div>
      <h1>stats</h1>
      <div>
        <pre>
          {!loading ? (
            <code>{JSON.stringify(character)}</code>
          ) : (
            <div>loading...</div>
          )}
        </pre>
      </div>
    </div>
  );
}
