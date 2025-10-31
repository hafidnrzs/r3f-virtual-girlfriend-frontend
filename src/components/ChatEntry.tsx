import { cn } from "@/lib/utils";

export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
  // The locale to use for the timestamp
  locale: string;
  // The timestamp of the message
  timestamp: number;
  // The message to display
  message: string;
  // The origin of the message
  messageOrigin: "local" | "remote";
  // The sender's name
  name?: string;
  // Whether the message has been edited
  hasBeenEdited?: boolean;
}

export function ChatEntry({
  name,
  locale,
  timestamp,
  message,
  messageOrigin,
  hasBeenEdited,
  className,
  ...props
}: ChatEntryProps) {
  const time = new Date(timestamp);
  const title = time.toLocaleTimeString(locale, { timeStyle: "full" });

  return (
    <li
      title={title}
      data-lk-message-origin={messageOrigin}
      className={cn("group flex w-full flex-col gap-0.5", className)}
      {...props}
    >
      <header
        className={cn(
          "flex items-center gap-2 text-sm text-gray-500",
          messageOrigin === "local" ? "flex-row-reverse" : "text-left"
        )}
      >
        <span className="opacity-0 group-hover:opacity-100 transition-opacity ease-linear text-xs">
          {time.toLocaleTimeString(locale, { timeStyle: "short" })}
        </span>
      </header>
      <span
        className={cn(
          "max-w-4/5 rounded-[20px]",
          messageOrigin === "local"
            ? "bg-gray-700 ml-auto px-4 py-2"
            : "mr-auto"
        )}
      >
        {message}
      </span>
    </li>
  );
}
