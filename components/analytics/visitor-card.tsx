"use client";

import getUnicodeFlagIcon from "country-flag-icons/unicode";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ClipboardIcon,
  Link2Icon,
  LoaderIcon,
  SquareUserRoundIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { fetchUPInfo } from "@/lib/data/user";
import { convertIPFSHash } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
        <div>
          {flagEmoji && <span className="mr-2 text-sm">{flagEmoji}</span>}
          <small className="text-sm">
            {visitor.location?.country}, {visitor.location?.city}
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
        {userInfo && (
          <div className="flex flex-col gap-1 bg-slate-50 mt-3 p-5 rounded-xl">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={convertIPFSHash(userInfo.avatar)} />
                <AvatarFallback>
                  {userInfo.name.substring(0, 2) ?? ""}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <strong>{userInfo.name}</strong>
                <Link
                  href={`https://universaleverything.io/${visitor.wallet}`}
                  className="text-indigo-400 text-xs hover:underline"
                  target="_blank"
                >
                  View on Universal Everything
                </Link>
              </div>
            </div>
            {userInfo.bio && userInfo.bio !== "" && (
              <blockquote className="my-2 py-2 pl-3 border-slate-300 border-l-4">
                {userInfo.bio}
              </blockquote>
            )}
            {userInfo.links.length > 0 && (
              <div className="flex items-center gap-1">
                {userInfo.links.map((link: { title: string; url: string }) => (
                  <Link
                    href={link.url}
                    target="_blank"
                    className={`${buttonVariants({
                      variant: "outline",
                      size: "sm",
                    })}`}
                  >
                    <Link2Icon />
                    {link.title}
                  </Link>
                ))}
              </div>
            )}
            {userInfo.tags.length > 0 && (
              <div className="flex items-center gap-1">
                {userInfo.tags.map((tag) => (
                  <Badge variant="outline">{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
