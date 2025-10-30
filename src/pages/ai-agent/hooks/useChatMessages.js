import { useMemo } from "react";
import {
  useChat,
  useRoomContext,
  useTranscriptions,
} from "@livekit/components-react";

/**
 * Converts a text stream transcription to a chat message format
 * @param {Object} textStream - The transcription text stream data
 * @param {Object} room - The LiveKit room instance
 * @returns {Object} Chat message with id, timestamp, message, and from properties
 */
function transcriptionToChatMessage(textStream, room) {
  return {
    id: textStream.streamInfo.id,
    timestamp: textStream.streamInfo.timestamp,
    message: textStream.text,
    from:
      textStream.participantInfo.identity === room.localParticipant.identity
        ? room.localParticipant
        : Array.from(room.remoteParticipants.values()).find(
            (p) => p.identity === textStream.participantInfo.identity
          ),
  };
}

/**
 * Hook that merges chat messages and transcriptions into a single sorted array
 * @returns {Array} Array of merged chat messages sorted by timestamp
 */
export function useChatMessages() {
  const chat = useChat();
  const room = useRoomContext();
  const transcriptions = useTranscriptions();

  const mergedTranscriptions = useMemo(() => {
    const merged = [
      ...transcriptions.map((transcription) =>
        transcriptionToChatMessage(transcription, room)
      ),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return mergedTranscriptions;
}
