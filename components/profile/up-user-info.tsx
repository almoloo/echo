import { fetchUPInfo } from "@/lib/data/user";
import { convertIPFSHash } from "@/lib/utils";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Link2Icon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface UpUserInfoProps {
  userInfo: Awaited<ReturnType<typeof fetchUPInfo>>;
  wallet?: string;
}

export default function UpUserInfo({ userInfo, wallet }: UpUserInfoProps) {
  return (
    <div className="flex flex-col gap-1 bg-slate-50 mt-3 p-5 rounded-xl">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={convertIPFSHash(userInfo.avatar)} />
          <AvatarFallback>{userInfo.name.substring(0, 2) ?? ""}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <strong>{userInfo.name}</strong>
          <Link
            href={`https://universaleverything.io/${wallet}`}
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
              key={link.url}
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
            <Badge variant="outline" key={tag}>
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
