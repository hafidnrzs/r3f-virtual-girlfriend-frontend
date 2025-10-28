import { useState, useEffect } from 'react';
import { ChatPanel } from './components/ChatPanel';
import { Composer } from './components/Composer';
import { useAiAgentMock } from './hooks/useAiAgentMock';

/**
 * AI Agent Chat/Voice Page
 * Standalone page with dark mode support, chat UI, and voice controls
 */
export function AiAgentPage() {
  const [darkMode, setDarkMode] = useState(false);
  const { messages, isAgentTyping, voiceEnabled, onSendMessage, onSendAudio, toggleVoice } = useAiAgentMock();

  // Initialize dark mode from system preference
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  // Apply dark mode class to root element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="flex-shrink-0 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Agent Chat
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Chat with your AI assistant via text or voice
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Voice toggle */}
            <button
              onClick={toggleVoice}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         ${
                           voiceEnabled
                             ? 'bg-blue-500 text-white hover:bg-blue-600'
                             : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                         }`}
              aria-label={voiceEnabled ? 'Disable voice responses' : 'Enable voice responses'}
              title={voiceEnabled ? 'Voice responses enabled' : 'Voice responses disabled'}
            >
              <span className="flex items-center space-x-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {voiceEnabled ? (
                    <>
                      <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z" />
                      <path d="M3.5 9.5a.5.5 0 01.5.5v1a6 6 0 0012 0v-1a.5.5 0 011 0v1a7 7 0 01-6.5 6.984V19h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-1.516A7 7 0 013 11v-1a.5.5 0 01.5-.5z" />
                    </>
                  ) : (
                    <>
                      <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z" />
                      <path d="M3.5 9.5a.5.5 0 01.5.5v1a6 6 0 0012 0v-1a.5.5 0 011 0v1a7 7 0 01-6.5 6.984V19h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-1.516A7 7 0 013 11v-1a.5.5 0 01.5-.5z" />
                      <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}
                </svg>
                <span>{voiceEnabled ? 'Voice On' : 'Voice Off'}</span>
              </span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300
                         hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Chat panel */}
      <ChatPanel messages={messages} isAgentTyping={isAgentTyping} />

      {/* Composer */}
      <Composer
        onSendMessage={onSendMessage}
        onSendAudio={onSendAudio}
        disabled={false}
      />
    </div>
  );
}

export default AiAgentPage;
