import { buttonVariants } from "@/components/ui/button";
import {
  BotMessageSquareIcon,
  DatabaseIcon,
  LayoutDashboardIcon,
  MailIcon,
  MessageCircleQuestionIcon,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import CharacterStats from "@/components/profile/character-stats";

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
      })} justify-start cursor-pointer  ${
        isActive ? "bg-indigo-200/25" : ""
      } ${className}`}
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
      {/* <Separator className="mt-auto mb-3" /> */}
      <div className="flex flex-col gap-1 mt-auto">
        <Link
          href="/"
          className={`${buttonVariants({
            variant: "outline",
            size: "lg",
          })} grow justify-start`}
        >
          <MailIcon />
          Messages
          <Badge variant="secondary" className="ml-auto">
            0
          </Badge>
        </Link>
        <Link
          href="/"
          className={`${buttonVariants({
            variant: "outline",
            size: "lg",
          })} grow justify-start`}
        >
          <MessageCircleQuestionIcon />
          Questions
          <Badge variant="secondary" className="ml-auto">
            0
          </Badge>
        </Link>
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
