import { useEffect, useRef } from 'react';

/**
 * ChatPanel - Displays scrollable message list with auto-scroll to bottom
 * Includes accessibility attributes and supports voice playback indication
 */
export function ChatPanel({ messages, isAgentTyping }) {
  const messagesEndRef = useRef(null);
  const scrollContainerRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isAgentTyping]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50 dark:bg-gray-900"
      role="log"
      aria-live="polite"
      aria-label="Chat messages"
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isAgentTyping && (
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
            AI
          </div>
          <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

/**
 * MessageBubble - Individual message with speaker, text, timestamp
 */
function MessageBubble({ message }) {
  const isAgent = message.speaker === 'agent';
  const timestamp = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`flex items-start space-x-3 ${!isAgent ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
          isAgent ? 'bg-blue-500' : 'bg-green-500'
        }`}
      >
        {isAgent ? 'AI' : 'U'}
      </div>

      {/* Message content */}
      <div className="flex-1 max-w-[75%]">
        <div
          className={`rounded-lg px-4 py-3 shadow-sm ${
            isAgent
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
              : 'bg-green-500 text-white'
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
            {message.text}
          </p>
        </div>

        {/* Timestamp and audio indicator */}
        <div className={`flex items-center mt-1 space-x-2 text-xs text-gray-500 dark:text-gray-400 ${!isAgent ? 'justify-end' : ''}`}>
          <span>{timestamp}</span>
          {message.hasAudio && (
            <span className="flex items-center space-x-1" title="Voice response available">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z" />
                <path d="M3.5 9.5a.5.5 0 01.5.5v1a6 6 0 0012 0v-1a.5.5 0 011 0v1a7 7 0 01-6.5 6.984V19h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-1.516A7 7 0 013 11v-1a.5.5 0 01.5-.5z" />
              </svg>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
