/**
 * Mock chat messages for testing ChatEntry and ChatTranscript components
 * 
 * Note: This uses a simplified structure since ReceivedChatMessage requires
 * full Participant objects. For actual implementation, use real LiveKit messages.
 */

export interface SimpleChatMessage {
  id: string;
  timestamp: number;
  message: string;
  senderName: string;
  senderId: string;
  messageOrigin: "local" | "remote";
  editTimestamp?: number;
}

export const mockChatMessages: SimpleChatMessage[] = [
  {
    id: "msg-1",
    timestamp: Date.now() - 300000, // 5 minutes ago
    senderName: "Alice Johnson",
    senderId: "user-123",
    messageOrigin: "local",
    message: "Hello! Can you help me with my math homework?",
  },
  {
    id: "msg-2",
    timestamp: Date.now() - 280000, // 4 min 40s ago
    senderName: "Vyna AI",
    senderId: "agent-ai",
    messageOrigin: "remote",
    message: "Of course! I'd be happy to help you with math. What topic are you working on?",
  },
  {
    id: "msg-3",
    timestamp: Date.now() - 260000, // 4 min 20s ago
    senderName: "Alice Johnson",
    senderId: "user-123",
    messageOrigin: "local",
    message: "I'm trying to solve quadratic equations but I'm stuck on this one: x² + 5x + 6 = 0",
  },
  {
    id: "msg-4",
    timestamp: Date.now() - 240000, // 4 minutes ago
    senderName: "Vyna AI",
    senderId: "agent-ai",
    messageOrigin: "remote",
    message: "Great question! Let's solve x² + 5x + 6 = 0 together. We can factor this equation. Can you think of two numbers that multiply to 6 and add up to 5?",
  },
  {
    id: "msg-5",
    timestamp: Date.now() - 220000, // 3 min 40s ago
    senderName: "Alice Johnson",
    senderId: "user-123",
    messageOrigin: "local",
    message: "Hmm... 2 and 3?",
  },
  {
    id: "msg-6",
    timestamp: Date.now() - 200000, // 3 min 20s ago
    senderName: "Vyna AI",
    senderId: "agent-ai",
    messageOrigin: "remote",
    message: "Excellent! 2 × 3 = 6 and 2 + 3 = 5. So we can factor it as (x + 2)(x + 3) = 0. This means x = -2 or x = -3. Well done!",
  },
  {
    id: "msg-7",
    timestamp: Date.now() - 180000, // 3 minutes ago
    senderName: "Alice Johnson",
    senderId: "user-123",
    messageOrigin: "local",
    message: "Oh I see! That makes sense now. Thank you!",
  },
  {
    id: "msg-8",
    timestamp: Date.now() - 160000, // 2 min 40s ago
    senderName: "Vyna AI",
    senderId: "agent-ai",
    messageOrigin: "remote",
    message: "You're welcome! Would you like to try another problem, or do you have questions about other math topics?",
  },
  {
    id: "msg-9",
    timestamp: Date.now() - 140000, // 2 min 20s ago
    senderName: "Alice Johnson",
    senderId: "user-123",
    messageOrigin: "local",
    message: "Can we do one more? What about x² - 4x + 4 = 0?",
    editTimestamp: Date.now() - 130000, // edited 10 seconds after sending
  },
  {
    id: "msg-10",
    timestamp: Date.now() - 120000, // 2 minutes ago
    senderName: "Vyna AI",
    senderId: "agent-ai",
    messageOrigin: "remote",
    message: "Perfect! This is a special case called a perfect square trinomial. Notice that this factors as (x - 2)(x - 2) or (x - 2)². So x = 2 is a repeated root. Try factoring more examples to get comfortable with the pattern!",
  },
];

/**
 * Helper to create a single mock message
 */
export function createMockMessage(
  message: string,
  from: "user" | "agent" = "user",
  minutesAgo: number = 0
): SimpleChatMessage {
  const isAgent = from === "agent";
  return {
    id: `msg-${Date.now()}-${Math.random()}`,
    timestamp: Date.now() - minutesAgo * 60000,
    senderName: isAgent ? "Vyna AI" : "Student",
    senderId: isAgent ? "agent-ai" : "user-123",
    messageOrigin: isAgent ? "remote" : "local",
    message,
  };
}

/**
 * Short conversation for quick testing
 */
export const mockShortConversation: SimpleChatMessage[] = [
  createMockMessage("Hi! I need help with science.", "user", 5),
  createMockMessage("Hello! I'd love to help you with science. What topic?", "agent", 4),
  createMockMessage("Can you explain photosynthesis?", "user", 3),
  createMockMessage("Sure! Photosynthesis is how plants make food using sunlight, water, and carbon dioxide.", "agent", 2),
];

/**
 * Single message examples for component testing
 */
export const singleUserMessage: SimpleChatMessage = createMockMessage(
  "Hello, can you help me?",
  "user",
  1
);

export const singleAgentMessage: SimpleChatMessage = createMockMessage(
  "Of course! I'm here to help. What do you need?",
  "agent",
  0
);

/**
 * Long message for testing text wrapping
 */
export const longMessage: SimpleChatMessage = createMockMessage(
  "This is a very long message to test how the chat entry component handles text wrapping and overflow. It should wrap nicely across multiple lines without breaking the layout. We want to make sure that even with lots of text, the UI remains clean and readable. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
  "agent",
  2
);
