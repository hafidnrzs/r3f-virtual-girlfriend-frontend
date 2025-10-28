import { useState, useRef, useEffect } from 'react';

/**
 * Composer - Text input area with send button and voice recording
 * Handles keyboard shortcuts (Enter to send, Esc to clear)
 */
export function Composer({ onSendMessage, onSendAudio, disabled }) {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [micPermission, setMicPermission] = useState('prompt'); // 'prompt' | 'granted' | 'denied'
  const inputRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Check microphone permission on mount
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'microphone' }).then((result) => {
        setMicPermission(result.state);
        result.addEventListener('change', () => {
          setMicPermission(result.state);
        });
      });
    }
  }, []);

  const handleSend = () => {
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue);
      setInputValue('');
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape') {
      setInputValue('');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        onSendAudio(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setMicPermission('granted');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setMicPermission('denied');
      alert('Microphone access denied. Please enable microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const isMicDisabled = disabled || micPermission === 'denied';

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-4">
      <div className="flex items-end space-x-3">
        {/* Text input */}
        <div className="flex-1">
          <label htmlFor="message-input" className="sr-only">
            Type your message
          </label>
          <textarea
            ref={inputRef}
            id="message-input"
            rows={1}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                       disabled:opacity-50 disabled:cursor-not-allowed
                       resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
            aria-label="Message input"
          />
        </div>

        {/* Mic button */}
        <button
          type="button"
          onClick={toggleRecording}
          disabled={isMicDisabled}
          className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
                     transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2
                     ${
                       isRecording
                         ? 'bg-red-500 hover:bg-red-600 focus:ring-red-500'
                         : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-blue-500'
                     }
                     disabled:opacity-50 disabled:cursor-not-allowed`}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
          title={
            micPermission === 'denied'
              ? 'Microphone access denied'
              : isRecording
              ? 'Stop recording'
              : 'Start voice recording'
          }
        >
          {isRecording ? (
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <rect x="6" y="6" width="8" height="8" rx="1" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 3a3 3 0 00-3 3v4a3 3 0 006 0V6a3 3 0 00-3-3z" />
              <path d="M3.5 9.5a.5.5 0 01.5.5v1a6 6 0 0012 0v-1a.5.5 0 011 0v1a7 7 0 01-6.5 6.984V19h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-1.516A7 7 0 013 11v-1a.5.5 0 01.5-.5z" />
            </svg>
          )}
        </button>

        {/* Send button */}
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !inputValue.trim()}
          className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500 hover:bg-blue-600 
                     text-white flex items-center justify-center transition-colors
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>

      {/* Keyboard hints */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        Press <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Enter</kbd> to send,{' '}
        <kbd className="px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">Esc</kbd> to clear
      </div>
    </div>
  );
}
