import { useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLUListElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages]);

  return (
    <AnimatePresence>
      <motion.div {...props}>
        <ul ref={scrollRef} className="space-y-3">
          {messages.map(
            ({
              id,
              timestamp,
              from,
              editTimestamp,
              message,
            }: ReceivedChatMessage) => {
              // Support both ReceivedChatMessage and SimpleChatMessage
              const locale = navigator?.language ?? "id-ID";
              const messageOrigin = from?.isLocal ? "local" : "remote";
              const hasBeenEdited = !!editTimestamp;

              return (
                <ChatEntry
                  key={id}
                  locale={locale}
                  timestamp={timestamp}
                  message={message}
                  messageOrigin={messageOrigin}
                  hasBeenEdited={hasBeenEdited}
                />
              );
            }
          )}
        </ul>
      </motion.div>
    </AnimatePresence>
  );
}
