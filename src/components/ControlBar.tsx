import { DisconnectButton, TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

interface ControlBarProps {
  micOn: boolean;
  onToggleMic: () => void;
  onDisconnect: () => void;
}

export function ControlBar({
  micOn,
  onToggleMic,
  onDisconnect,
}: ControlBarProps) {
  return (
    <div className="w-full h-16 border-t border-gray-700 flex items-center justify-center px-6">
      <div className="flex items-center gap-3">
        {/* Microphone toggle */}
        <TrackToggle
          source={Track.Source.Microphone}
          showIcon={true}
          aria-label="Toggle microphone"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
        >
          {micOn ? "🎤 Mute" : "🎤 Unmute"}
        </TrackToggle>

        {/* Disconnect button */}
        <DisconnectButton className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900">
          Disconnect
        </DisconnectButton>
      </div>
    </div>
  );
}
