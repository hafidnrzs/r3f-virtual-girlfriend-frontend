import { cn } from "@/lib/utils";



export interface ChatEntryProps extends React.HTMLAttributes<HTMLLIElement> {
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
  timestamp,
  message,
  messageOrigin,
  name,
  hasBeenEdited,
  className,
  ...props
}: ChatEntryProps) {
  const time = new Date(timestamp);
  const title = time.toTimeString();

  return (
    <li
      title={title}
      data-lk-message-origin={messageOrigin}
      className={cn(className)}
      {...props}
    >
      <header>{name && <strong>{name}</strong>}</header>
      <span>{message}</span>
    </li>
  );
}
