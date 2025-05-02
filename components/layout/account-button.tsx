"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BotMessageSquareIcon,
  ChevronDownIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { convertIPFSHash } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { signOut, useSession } from "next-auth/react";

export default function AccountButton() {
  const { data: session } = useSession();

  const handleLuksoSignOut = async () => {
    await signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 py-2 h-[unset]"
        >
          <Avatar className="shrink-0">
            <AvatarImage src={convertIPFSHash(session!.user.image!)} />
            <AvatarFallback>
              {session!.user.name?.substring(0, 2).toUpperCase() || "UU"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-left">
            Welcome home,
            <strong className="block">{session!.user.name}</strong>
          </span>
          <ChevronDownIcon className="w-3 h-3 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-52">
        {/* <DropdownMenuLabel>label</DropdownMenuLabel> */}
        <DropdownMenuItem asChild>
          <Link href="/dashboard">
            <LayoutDashboardIcon />
            Dashboard
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training">
            <BotMessageSquareIcon />
            Training
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <DatabaseIcon />
            My Data
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <MailIcon />
            Messages
            <DropdownMenuShortcut>
              <Badge variant="secondary">0</Badge>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/dashboard/training/data">
            <MessageCircleQuestionIcon />
            Questions
            <DropdownMenuShortcut>
              <Badge variant="secondary">0</Badge>
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLuksoSignOut}>
          <LogOutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
