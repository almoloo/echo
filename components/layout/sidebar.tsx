import { buttonVariants } from "@/components/ui/button";
import {
  BotMessageSquareIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  MessageCircleQuestionIcon,
  UserRoundPenIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CharacterStats from "@/components/profile/character-stats";
import MessageButton from "@/components/layout/message-button";
import QuestionButton from "@/components/layout/question-button";

interface SidebarItemProps {
  className?: string;
  text?: string;
  icon: React.ReactNode;
  isActive?: boolean;
  url: string;
}
function SidebarItem({
  text,
  icon,
  url,
  isActive,
  className,
}: SidebarItemProps) {
  return (
    <Link
      href={url}
      passHref
      className={`${buttonVariants({
        variant: "ghost",
        size: "lg",
      })} justify-start ${isActive ? "bg-indigo-200/25" : ""} ${className}`}
    >
      {icon}
      {text}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <>
      <CharacterStats className="mb-5" />
      <SidebarItem
        text="Dashboard"
        icon={<LayoutDashboardIcon />}
        isActive={false}
        url="/dashboard"
      />
      <SidebarItem
        text="Training"
        icon={<BotMessageSquareIcon />}
        isActive={false}
        url="/dashboard/training"
      />
      <SidebarItem
        text="My Data"
        icon={<DatabaseIcon />}
        isActive={false}
        url="/dashboard/training/data"
      />
      <SidebarItem
        text="Profile"
        icon={<UserRoundPenIcon />}
        isActive={false}
        url="/dashboard/profile"
      />
      {/* <Separator className="mt-auto mb-3" /> */}
      <div className="flex flex-col gap-1 mt-auto">
        <MessageButton />
        <QuestionButton />
        {/* <SidebarItem
          icon={<MailIcon />}
          isActive={false}
          className="justify-center grow"
          url=""
        /> */}
        {/* <SidebarItem
          icon={<MessageCircleQuestionIcon />}
          isActive={false}
          className="justify-center grow"
          url=""
        /> */}
      </div>
      {/* <SidebarItem text="Sign out" icon={<LogOutIcon />} /> */}
    </>
  );
}
