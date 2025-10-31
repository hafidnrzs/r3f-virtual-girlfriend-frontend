import { type ReceivedChatMessage } from "@livekit/components-react";
import { AnimatePresence, HTMLMotionProps, motion } from "motion/react";
import { ChatEntry } from "./ChatEntry";
import {
  mockShortConversation,
  type SimpleChatMessage,
} from "@/mocks/chatMessages";

interface ChatTranscriptProps {
  messages?: ReceivedChatMessage[] | SimpleChatMessage[];
}

export function ChatTranscript({
  messages = mockShortConversation,
  ...props
}: ChatTranscriptProps & Omit<HTMLMotionProps<"div">, "ref">) {
  return (
    <AnimatePresence>
      <motion.div {...props}>
        <ul className="space-y-3">
          {messages.map((msg: any) => {
            // Support both ReceivedChatMessage and SimpleChatMessage
            const timestamp = msg.timestamp;
            const message = msg.message;
            const messageOrigin =
              msg.messageOrigin || (msg.from ? "remote" : "local");
            const name = msg.senderName || msg.from?.name;
            const hasBeenEdited = !!msg.editTimestamp;
            const id = msg.id;

            return (
              <ChatEntry
                key={id}
                timestamp={timestamp}
                message={message}
                messageOrigin={messageOrigin}
                name={name}
                hasBeenEdited={hasBeenEdited}
              />
            );
          })}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
