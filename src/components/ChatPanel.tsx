import { useMemo } from "react";
import { ChatInput } from "./ChatInput";
import { ChatTranscript } from "./ChatTranscript";
import {
  ReceivedChatMessage,
  TextStreamData,
  useChat,
  useRemoteParticipant,
  useRemoteParticipants,
  useRoomContext,
  useTranscriptions,
} from "@livekit/components-react";
import { Room } from "livekit-client";

export function ChatPanel() {
  const { send } = useChat();
  const participants = useRemoteParticipants();
  const messages = useChatMessages();

  const handleSendMessage = async (message: string) => {
    await send(message);
  };

  const isAgentAvailable = participants.some((p) => p.isAgent);

  return (
    <div className="flex flex-col h-full border-l border-gray-700 p-3">
      {/* Scrollable transcript area */}
      <div className="flex-1 overflow-auto p-4 min-h-0">
        <ChatTranscript messages={messages} />
      </div>

      {/* Chat input - fixed at bottom */}
      <div className="h-14 flex items-center bg-background border-gray-700 flex-col rounded-xl border p-3 drop-shadow-md/3">
        <ChatInput
          chatOpen={true}
          isAgentAvailable={isAgentAvailable}
          onSend={handleSendMessage}
        />
      </div>
    </div>
  );
}

function transcriptionToChatMessage(
  textStream: TextStreamData,
  room: Room
): ReceivedChatMessage {
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

function useChatMessages() {
  const chat = useChat();
  const room = useRoomContext();
  const transcriptions: TextStreamData[] = useTranscriptions();

  const mergedTranscriptions = useMemo(() => {
    const merged: Array<ReceivedChatMessage> = [
      ...transcriptions.map((transcription) =>
        transcriptionToChatMessage(transcription, room)
      ),
      ...chat.chatMessages,
    ];
    return merged.sort((a, b) => a.timestamp - b.timestamp);
  }, [transcriptions, chat.chatMessages, room]);

  return mergedTranscriptions;
}
