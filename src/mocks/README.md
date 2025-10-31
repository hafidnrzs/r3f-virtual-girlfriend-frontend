# Chat Mock Data

Mock data for testing the ChatEntry and ChatTranscript components.

## Usage

### Basic Import

```tsx
import { 
  mockChatMessages, 
  mockShortConversation,
  singleUserMessage,
  singleAgentMessage,
  longMessage,
  createMockMessage 
} from '@/mocks/chatMessages';
```

### Using with ChatTranscript

```tsx
import { ChatTranscript } from '@/components/ChatTranscript';
import { mockChatMessages } from '@/mocks/chatMessages';

function TestChatView() {
  return <ChatTranscript messages={mockChatMessages} />;
}
```

### Using with ChatEntry

```tsx
import { ChatEntry } from '@/components/ChatEntry';
import { singleUserMessage } from '@/mocks/chatMessages';

function TestSingleMessage() {
  return (
    <ChatEntry
      timestamp={singleUserMessage.timestamp}
      message={singleUserMessage.message}
      messageOrigin={singleUserMessage.messageOrigin}
      name={singleUserMessage.senderName}
    />
  );
}
```

### Creating Custom Messages

```tsx
import { createMockMessage } from '@/mocks/chatMessages';

// Create a user message from 3 minutes ago
const userMsg = createMockMessage("I need help with algebra", "user", 3);

// Create an agent message from now
const agentMsg = createMockMessage("I can help you with that!", "agent", 0);
```

## Available Mock Data

### `mockChatMessages`
A full conversation (10 messages) between a student and AI tutor about math homework.
- Includes both user and agent messages
- Timestamps spread over 5 minutes
- One message with edit timestamp

### `mockShortConversation`
A brief 4-message conversation about science.
- Quick testing without clutter
- User and agent alternating

### `singleUserMessage`
Single message from user.
- Good for testing individual message rendering

### `singleAgentMessage`
Single message from agent.
- Test agent-specific styling

### `longMessage`
A very long message to test text wrapping.
- Contains Lorem ipsum text
- Tests overflow and multi-line handling

## Type: SimpleChatMessage

```typescript
interface SimpleChatMessage {
  id: string;
  timestamp: number;
  message: string;
  senderName: string;
  senderId: string;
  messageOrigin: "local" | "remote";
  editTimestamp?: number;
}
```

### Mapping to ChatEntry Props

```tsx
<ChatEntry
  timestamp={msg.timestamp}
  message={msg.message}
  messageOrigin={msg.messageOrigin}
  name={msg.senderName}
  hasBeenEdited={!!msg.editTimestamp}
/>
```

## Example: Full Chat Panel with Mock Data

```tsx
import { ChatPanel } from '@/components/ChatPanel';
import { mockChatMessages } from '@/mocks/chatMessages';

function App() {
  return (
    <div className="h-screen">
      <ChatPanel messages={mockChatMessages} />
    </div>
  );
}
```

## Notes

- Timestamps are relative to `Date.now()` so messages always appear recent
- Messages use `messageOrigin: "local"` for user and `"remote"` for agent
- The mock data uses a simplified structure compared to LiveKit's `ReceivedChatMessage` type
- For production, replace with real LiveKit chat messages from `useChatMessages()` hook
