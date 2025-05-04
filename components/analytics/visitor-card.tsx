"use client";

import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { Button } from "@/components/ui/button";
import { ClipboardIcon, LoaderIcon, SquareUserRoundIcon } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { fetchUPInfo } from "@/lib/data/user";
import UpUserInfo from "@/components/profile/up-user-info";

interface VisitorCardProps {
  visitor: VisitData;
}

function UserState({ isConnected }: { isConnected: boolean }): React.ReactNode {
  const dotColor = isConnected ? "bg-emerald-400" : "bg-amber-400";
  const textColor = isConnected ? "text-emerald-500" : "text-amber-500";
  const text = isConnected ? "Connected" : "Anonymous";

  return (
    <div className="flex items-center gap-2">
      <span className={`block rounded-full w-3 h-3 ${dotColor}`}></span>
      <span className={`text-sm ${textColor}`}>{text}</span>
    </div>
  );
}

function InfoItem({
  title,
  value,
}: {
  title: string;
  value: string;
}): React.ReactNode {
  return (
    <div>
      <strong className="text-slate-400 text-sm">{title}: </strong>
      <code className="text-sm">{value}</code>
    </div>
  );
}

export default function VisitorCard({ visitor }: VisitorCardProps) {
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<Awaited<
    ReturnType<typeof fetchUPInfo>
  > | null>(null);

  const flagEmoji = visitor.location?.countryShort
    ? getUnicodeFlagIcon(visitor.location?.countryShort)
    : undefined;

  async function handleCopyUserAgent() {
    try {
      if (!visitor.userAgent) return;
      await navigator.clipboard.writeText(visitor.userAgent);
      toast("✅ User-Agent was copied to the clipboard.");
    } catch (error) {
      toast("An error occured while copying the user-agent!");
    }
  }

  async function loadUserInfo() {
    if (!visitor.wallet) return;
    try {
      setLoadingUserInfo(true);
      const res = await fetchUPInfo(visitor.wallet);
      setUserInfo(res);
    } catch (error) {
      console.error(error);
      toast("Failed to fetch Universal Profile metadata, please try again.");
    } finally {
      setLoadingUserInfo(false);
    }
  }

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-4 border rounded-xl">
      <div className="flex flex-col gap-1 lg:col-span-1 p-5 lg:border-r border-b lg:border-b-0 border-dashed">
        <time
          dateTime={new Date(Number(visitor.date)).toISOString()}
          className="text-slate-500 text-xs"
        >
          {new Date(Number(visitor.date)).toLocaleString()}
        </time>
        {visitor.location?.ip && (
          <div className="text-xs">IP: {visitor.location.ip}</div>
        )}
        <div>
          {flagEmoji && <span className="mr-2 text-sm">{flagEmoji}</span>}
          <small className="text-sm">
            {visitor.location?.country && visitor.location?.country}
            {visitor.location?.city && `, ${visitor.location?.city}`}
          </small>
        </div>
        <UserState isConnected={!!visitor.wallet} />
      </div>
      <div className="lg:col-span-3 p-5">
        <InfoItem title="Referrer" value={visitor.referrer ?? ""} />
        <InfoItem
          title="Languages"
          value={visitor.languages?.join(", ") ?? ""}
        />
        <InfoItem title="Resolution" value={visitor.resolution ?? ""} />
        <InfoItem
          title="Browser"
          value={`${visitor.userAgentData?.browser.name ?? ""}/${
            visitor.userAgentData?.browser.version ?? ""
          }`}
        />
        {visitor.userAgentData?.device.type && (
          <InfoItem title="Device" value={visitor.userAgentData?.device.type} />
        )}
        <InfoItem
          title="Device Vendor"
          value={visitor.userAgentData?.device.vendor ?? ""}
        />
        <InfoItem
          title="Operating System"
          value={`${visitor.userAgentData?.os.name ?? ""}/${
            visitor.userAgentData?.os.version
          }`}
        />
        <div className="flex gap-2 mt-3">
          {visitor.wallet && !userInfo && (
            <Button
              size="sm"
              variant="outline"
              disabled={loadingUserInfo}
              onClick={loadUserInfo}
            >
              {loadingUserInfo ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <SquareUserRoundIcon />
              )}
              View User Info
            </Button>
          )}
          {visitor.userAgent && (
            <Button size="sm" variant="secondary" onClick={handleCopyUserAgent}>
              <ClipboardIcon />
              Copy User-Agent
            </Button>
          )}
        </div>
        {userInfo && <UpUserInfo userInfo={userInfo} wallet={visitor.wallet} />}
      </div>
    </div>
  );
}
