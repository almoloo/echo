"use client";

import { fetchUPInfo } from "@/lib/data/user";
import { useState } from "react";
import { toast } from "sonner";
import UpUserInfo from "@/components/profile/up-user-info";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { walletAbr } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { LoaderIcon, SquareUserRoundIcon } from "lucide-react";

interface MessageItemProps {
  message: DeliveredMessage;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [userInfo, setUserInfo] = useState<Awaited<
    ReturnType<typeof fetchUPInfo>
  > | null>(null);
  const [loading, setLoading] = useState(false);

  async function fetchUserInfo() {
    try {
      setLoading(true);
      const info = await fetchUPInfo(message.from);
      setUserInfo(info);
    } catch (error) {
      console.error(error);
      toast("Failed to fetch Universal Profile metadata, please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card
      className={`gap-3  pt-3 ${
        !message.read && "bg-rose-300/5 border-rose-200"
      } `}
    >
      <CardHeader className="pb-3 border-sb">
        <CardTitle className="flex justify-between items-center">
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-slate-600 text-sm">
              <span>From:</span>
              <Link
                href={`https://universaleverything.io/${message.from}`}
                target="_blank"
                className="hover:underline"
              >
                {walletAbr(message.from)}
              </Link>
            </div>
            <div>
              <time
                className="font-normal text-slate-500 text-xs"
                dateTime={new Date(Number(message.created_at)).toISOString()}
              >
                {new Date(Number(message.created_at)).toLocaleString()}
              </time>
            </div>
          </div>
          <Button variant="outline" disabled={loading} onClick={fetchUserInfo}>
            {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <SquareUserRoundIcon />
            )}
            View User Info
          </Button>
        </CardTitle>
        {userInfo && <UpUserInfo userInfo={userInfo} wallet={message.from} />}
      </CardHeader>
      <CardContent>
        <p className="font-serif font-medium text-lg">{message.text}</p>
      </CardContent>
    </Card>
  );
}
