import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { defaultAvatar } from "@/lib/constants";
import { convertIPFSHash } from "@/lib/utils";

interface MessageBubbleProps {
  from: "user" | "assistant";
  message: string;
  avatar?: string;
  name?: string;
}

export default function MessageBubble({
  from,
  message,
  avatar,
  name,
}: MessageBubbleProps) {
  const bgColor = from === "assistant" ? "bg-indigo-500/50" : "bg-slate-400/50";
  const side = from === "assistant" ? "self-start" : "self-end";
  const corner = from === "assistant" ? "rounded-bl-xs" : "rounded-br-xs";
  const avatarImage = convertIPFSHash(avatar ?? defaultAvatar);

  return (
    <div className="flex items-end gap-2 max-w-[70vw]">
      <Avatar>
        <AvatarImage src={avatarImage} />
        <AvatarFallback>
          {name ? name.substring(0, 2) : from.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <p className={`${bgColor} ${side} p-2 rounded-xl ${corner}`}>{message}</p>
    </div>
  );
}
