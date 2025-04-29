"use client";

import { characterContext } from "@/services/character-provider";
import { useContext } from "react";
import StatGauge from "@/components/profile/stat-gauge";
import Link from "next/link";
import { ChartPieIcon, LoaderIcon } from "lucide-react";
import { Separator } from "../ui/separator";

interface CharacterStatsProps {
  className?: string;
}

export default function CharacterStats(props: CharacterStatsProps) {
  const characterData = useContext(characterContext);

  return (
    <div className={`bg-slate-100/50 rounded-xl border ${props.className}`}>
      <div className="mb-3 px-4 pt-4 pb-1">
        <h3 className="flex items-center gap-2 mb-2 font-medium text-sm">
          <ChartPieIcon className="w-4 h-4 text-slate-600" />
          Your Stats
        </h3>
        <p className="text-sm">
          <Link
            href="/dashboard/training"
            className="text-indigo-500 hover:underline"
          >
            Train your assistant
          </Link>{" "}
          to improve your stats.
        </p>
      </div>
      <Separator />
      {characterData?.loading ? (
        <div className="flex justify-center px-4 py-8">
          <LoaderIcon className="text-slate-400 animate-spin" />
        </div>
      ) : (
        <div className="gap-5 grid grid-cols-3 px-4 py-3">
          {/* IDENTITY */}
          <StatGauge
            label="Identity"
            title={characterData?.info?.identity.level.title!}
            percent={characterData?.info?.identity.percentage!}
            min={characterData?.info?.identity.level.min!}
            max={characterData?.info?.identity.level.max!}
            current={characterData?.info?.identity.current!}
            level={characterData?.info?.identity.level.level!}
          />
          {/* CAREER */}
          <StatGauge
            label="Career"
            title={characterData?.info?.career.level.title!}
            percent={characterData?.info?.career.percentage!}
            min={characterData?.info?.career.level.min!}
            max={characterData?.info?.career.level.max!}
            current={characterData?.info?.career.current!}
            level={characterData?.info?.career.level.level!}
          />
          {/* CONNECTION */}
          <StatGauge
            label="Connection"
            title={characterData?.info?.connection.level.title!}
            percent={characterData?.info?.connection.percentage!}
            min={characterData?.info?.connection.level.min!}
            max={characterData?.info?.connection.level.max!}
            current={characterData?.info?.connection.current!}
            level={characterData?.info?.connection.level.level!}
          />
        </div>
      )}
    </div>
  );
}
