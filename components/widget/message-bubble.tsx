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
  const bgColor = from === "assistant" ? "bg-indigo-500/25" : "bg-slate-400/15";
  const side = from === "assistant" ? "self-start" : "self-end";
  const corner = from === "assistant" ? "rounded-bl-xs" : "rounded-br-xs";
  const direction = from === "assistant" ? "flex-row" : "flex-row-reverse";
  const fontSize = from === "assistant" ? "text-base" : "text-xs";
  const textColor = from === "assistant" ? "text-black" : "text-slate-700";
  const avatarImage = convertIPFSHash(avatar ?? defaultAvatar);

  return (
    <div className={`flex items-end gap-2 max-w-[70vw] ${side} ${direction}`}>
      <Avatar>
        <AvatarImage src={avatarImage} />
        <AvatarFallback>
          {name ? name.substring(0, 2) : from.substring(0, 2)}
        </AvatarFallback>
      </Avatar>
      <p
        className={`${bgColor} px-3 py-2 rounded-xl ${corner} ${fontSize} ${textColor}`}
      >
        {message}
      </p>
    </div>
  );
}
