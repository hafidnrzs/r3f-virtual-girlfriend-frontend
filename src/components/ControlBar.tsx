import { cn } from "@/lib/utils";
import {
  BarVisualizer,
  DisconnectButton,
  TrackReferenceOrPlaceholder,
  TrackToggle,
  useLocalParticipant,
  useMaybeRoomContext,
  useTrackToggle,
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { useCallback, useMemo } from "react";

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
  const { micTrackRef, microphoneToggle } = useInputControls();

  return (
    <div className="w-full h-16 border-t border-gray-700 bg-gray-900 flex items-center justify-center px-6">
      <div className="flex items-center gap-3">
        {/* Microphone toggle */}
        <TrackSelector
          kind="audioinput"
          aria-label="Toggle microphone"
          source={Track.Source.Microphone}
          pressed={microphoneToggle.enabled}
          disabled={microphoneToggle.pending}
          audioTrackRef={micTrackRef}
          onPressedChange={() => {}}
          onMediaDeviceError={() => {}}
          onActiveDeviceChange={() => {}}
        />

        {/* Disconnect button */}
        <DisconnectButton className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900">
          Disconnect
        </DisconnectButton>
      </div>
    </div>
  );
}

function useInputControls() {
  const { microphoneTrack, localParticipant } = useLocalParticipant();

  const microphoneToggle = useTrackToggle({
    source: Track.Source.Microphone,
  });

  const handleToggleMicrophone = useCallback(
    async (enabled?: boolean) => {
      await microphoneToggle.toggle(enabled);
      // persist audio enabled preference
    },
    [microphoneToggle]
  );

  const micTrackRef = useMemo(() => {
    return {
      participant: localParticipant,
      source: Track.Source.Microphone,
      publication: microphoneTrack,
    };
  }, [localParticipant, microphoneTrack]);

  return {
    micTrackRef,
    microphoneToggle: {
      ...microphoneToggle,
      toggle: handleToggleMicrophone,
    },
  };
}

interface TrackSelectorProps {
  kind: MediaDeviceKind;
  source: Parameters<typeof useTrackToggle>[0]["source"];
  pressed?: boolean;
  pending?: boolean;
  disabled?: boolean;
  className?: string;
  audioTrackRef?: TrackReferenceOrPlaceholder;
  onPressedChange?: (pressed: boolean) => void;
  onMediaDeviceError?: (error: Error) => void;
  onActiveDeviceChange?: (deviceId: string) => void;
}

function TrackSelector({
  kind,
  source,
  pressed,
  pending,
  disabled,
  className,
  audioTrackRef,
  onPressedChange,
  onMediaDeviceError,
  onActiveDeviceChange,
}: TrackSelectorProps) {
  return (
    <TrackToggle
      source={Track.Source.Microphone}
      showIcon={true}
      aria-label="Toggle microphone"
      className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
    >
      <BarVisualizer
        barCount={5}
        options={{ minHeight: 5 }}
        trackRef={audioTrackRef}
        className={cn(
          "bg-transparent audiovisualizer flex h-6 w-auto items-center",
          "group-data-[state=on]/track:bg-foreground group-data-[state=off]/track:bg-destructive",
          "data-lk-muted:bg-muted"
        )}
      >
        <span className="h-full w-0.5 origin-center rounded-2xl" />
      </BarVisualizer>
    </TrackToggle>
    // TrackDeviceSelect
  );
}
