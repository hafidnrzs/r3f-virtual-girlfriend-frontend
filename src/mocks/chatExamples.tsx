/**
 * Example usage of ChatEntry with mock data
 * This file demonstrates how to use the mock chat messages
 */

import { ChatEntry } from '@/components/ChatEntry';
import { 
  mockChatMessages, 
  mockShortConversation,
  singleUserMessage,
  singleAgentMessage,
  longMessage 
} from '@/mocks/chatMessages';

/**
 * Example 1: Render a single message
 */
export function SingleMessageExample() {
  return (
    <ul className="space-y-2">
      <ChatEntry
        timestamp={singleUserMessage.timestamp}
        message={singleUserMessage.message}
        messageOrigin={singleUserMessage.messageOrigin}
        name={singleUserMessage.senderName}
      />
    </ul>
  );
}

/**
 * Example 2: Render multiple messages in a conversation
 */
export function ConversationExample() {
  return (
    <ul className="space-y-3 p-4">
      {mockShortConversation.map((msg) => (
        <ChatEntry
          key={msg.id}
          timestamp={msg.timestamp}
          message={msg.message}
          messageOrigin={msg.messageOrigin}
          name={msg.senderName}
          hasBeenEdited={!!msg.editTimestamp}
        />
      ))}
    </ul>
  );
}

/**
 * Example 3: Full chat history
 */
export function FullChatExample() {
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 overflow-auto p-4">
        <ul className="space-y-3">
          {mockChatMessages.map((msg) => (
            <ChatEntry
              key={msg.id}
              timestamp={msg.timestamp}
              message={msg.message}
              messageOrigin={msg.messageOrigin}
              name={msg.senderName}
              hasBeenEdited={!!msg.editTimestamp}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Example 4: Test long message wrapping
 */
export function LongMessageExample() {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <ul className="space-y-2">
        <ChatEntry
          timestamp={longMessage.timestamp}
          message={longMessage.message}
          messageOrigin={longMessage.messageOrigin}
          name={longMessage.senderName}
        />
      </ul>
    </div>
  );
}

/**
 * Example 5: Compare user vs agent messages
 */
export function CompareMessagesExample() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div>
        <h3 className="font-semibold mb-2">User Message (Local)</h3>
        <ul>
          <ChatEntry
            timestamp={singleUserMessage.timestamp}
            message={singleUserMessage.message}
            messageOrigin={singleUserMessage.messageOrigin}
            name={singleUserMessage.senderName}
          />
        </ul>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Agent Message (Remote)</h3>
        <ul>
          <ChatEntry
            timestamp={singleAgentMessage.timestamp}
            message={singleAgentMessage.message}
            messageOrigin={singleAgentMessage.messageOrigin}
            name={singleAgentMessage.senderName}
          />
        </ul>
      </div>
    </div>
  );
}
