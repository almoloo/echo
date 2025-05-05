import Heading from "@/components/layout/heading";
import MessageItem from "@/components/profile/message-item";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchDeliveredMessages } from "@/lib/data/chat-bot";
import { MailIcon, MailXIcon } from "lucide-react";

export default async function page() {
  const messages = await fetchDeliveredMessages();

  return (
    <div>
      <Heading
        title="Messages"
        subtitle="These are the messages visitors asked your assistant to deliver to you — discover what they’re curious about and want you to know."
        icon={<MailIcon />}
      />
      <div className="flex flex-col gap-2">
        {messages.length > 0 ? (
          <>
            {messages.reverse().map((message) => (
              <MessageItem message={message} key={message.id} />
            ))}
          </>
        ) : (
          <Alert className="bg-slate-50">
            <MailXIcon className="w-4 h-4" />
            <AlertTitle>Nothing new</AlertTitle>
            <AlertDescription>
              Your message box is currently empty, check box later for new
              messages.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
