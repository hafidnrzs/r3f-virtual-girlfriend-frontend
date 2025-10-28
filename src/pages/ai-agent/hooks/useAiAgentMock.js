import { useState, useCallback } from 'react';

/**
 * Mock AI agent hook that simulates sending messages and receiving responses.
 * Exposes onSendMessage(text) and onSendAudio(blob) for future real-service integration.
 */
export function useAiAgentMock() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      speaker: 'agent',
      text: 'Hello! I\'m your AI assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [isAgentTyping, setIsAgentTyping] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);

  const onSendMessage = useCallback((text) => {
    if (!text.trim()) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      speaker: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate agent typing delay
    setIsAgentTyping(true);
    const delay = 600 + Math.random() * 300;

    setTimeout(() => {
      const agentMessage = {
        id: `agent-${Date.now()}`,
        speaker: 'agent',
        text: getMockResponse(text),
        timestamp: new Date().toISOString(),
        hasAudio: voiceEnabled,
      };

      setMessages((prev) => [...prev, agentMessage]);
      setIsAgentTyping(false);

      // If voice enabled, simulate TTS playback
      if (voiceEnabled && window.speechSynthesis) {
        const utterance = new SpeechSynthesisUtterance(agentMessage.text);
        window.speechSynthesis.speak(utterance);
      }
    }, delay);
  }, [voiceEnabled]);

  const onSendAudio = useCallback((audioBlob) => {
    // Mock: simulate transcription and send as text
    const mockTranscription = 'This is a mock transcription of your audio.';
    onSendMessage(mockTranscription);
  }, [onSendMessage]);

  const toggleVoice = useCallback(() => {
    setVoiceEnabled((prev) => !prev);
  }, []);

  return {
    messages,
    isAgentTyping,
    voiceEnabled,
    onSendMessage,
    onSendAudio,
    toggleVoice,
  };
}

/**
 * Generate a simple mock response based on user input
 */
function getMockResponse(userText) {
  const lower = userText.toLowerCase();

  if (lower.includes('hello') || lower.includes('hi')) {
    return 'Hello! Nice to meet you. What would you like to talk about?';
  }
  if (lower.includes('help')) {
    return 'I can help you with various tasks. Try asking me about the weather, telling me a joke, or any general question!';
  }
  if (lower.includes('weather')) {
    return 'I don\'t have real weather data, but it\'s probably a lovely day wherever you are! ☀️';
  }
  if (lower.includes('joke')) {
    return 'Why don\'t scientists trust atoms? Because they make up everything! 😄';
  }
  if (lower.includes('bye') || lower.includes('goodbye')) {
    return 'Goodbye! It was nice chatting with you. Have a great day!';
  }

  // Default responses
  const responses = [
    `That's interesting! Tell me more about "${userText}".`,
    `I understand. Can you elaborate on that?`,
    `Thanks for sharing! How does that make you feel?`,
    `Interesting perspective! What else would you like to discuss?`,
    `I see what you mean. Let me think about that...`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}
