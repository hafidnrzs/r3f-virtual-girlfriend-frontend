import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "@/components/Experience";
import { UI } from "@/components/UI";
import { IllustrationPanel } from "@/components/IllustrationPanel";

import {
  Chat,
  ChatCloseIcon,
  ChatEntry,
  ControlBar,
  DisconnectButton,
  LayoutContext,
  LayoutContextProvider,
  RoomAudioRenderer,
  RoomContext,
  useVoiceAssistant,
  VoiceAssistantControlBar,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Room, RoomEvent } from "livekit-client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import TranscriptionView from "./components/TranscriptionView";

function App() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    try {
      const url = new URL(
        import.meta.env?.VITE_API_URL ?? "/api/connection-details",
        window.location.origin
      );

      const response = await fetch(url.toString(), {
        method: "POST",
        body: JSON.stringify({}),
      });
      if (!response.ok) {
        throw new Error(
          `Failed to fetch connection details: ${response.status}`
        );
      }
      const connectionDetailsData = await response.json();

      await room.connect(
        connectionDetailsData.serverUrl,
        connectionDetailsData.participantToken
      );

      await room.localParticipant.setMicrophoneEnabled(true);
    } catch (err) {
      console.error("Connection failed:", err);
      alert(
        "Failed to start conversation. Please check your API URL and LiveKit server, then try again."
      );
    }
  }, [room]);

  useEffect(() => {
    room.on(RoomEvent.MediaDevicesError, onDeviceFailure);

    return () => {
      room.off(RoomEvent.MediaDevicesError, onDeviceFailure);
    };
  }, [room]);

  return (
    <main data-lk-theme="default" className="h-full bg-[var(--lk-bg)]">
      <RoomContext.Provider value={room}>
        <div className="relative w-full h-full">
          <SimpleAssistant onConnectButtonClicked={onConnectButtonClicked} />
        </div>
      </RoomContext.Provider>
    </main>
  );
}

function AgentCanvas() {
  const { state: agentState } = useVoiceAssistant();

  return (
    <Canvas
      className="absolute inset-0 z-0 h-full"
      shadows
      camera={{ position: [0, 0, 1], fov: 30 }}
    >
      {agentState !== "disconnected" && <Experience />}
    </Canvas>
  );
}

function SimpleAssistant(props: { onConnectButtonClicked: () => void }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <>
      {agentState === "disconnected" ? (
        <motion.div
          key="disconnected"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
          className="grid items-center justify-center h-full"
        >
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="uppercase px-4 py-2 bg-white text-black rounded-md"
            onClick={() => props.onConnectButtonClicked()}
          >
            Start a conversation
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="connected"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
          className="flex flex-col items-center gap-4 h-full"
        >
          {/* <AgentCanvas /> */}
          <Leva hidden />
          {/* <IllustrationPanel /> */}
          {/* <UI /> */}
          <LayoutContextProvider>
            <div className="flex-1 w-full">
              <TranscriptionView />
              <Chat />
            </div>
            <div className="w-full space-y-4">
              <div className="flex w-full justify-center items-center">
                <ControlBar
                  variation="minimal"
                  controls={{ camera: false, screenShare: false, chat: true }}
                />
              </div>
            </div>
          </LayoutContextProvider>
          <RoomAudioRenderer />
        </motion.div>
      )}
    </>
  );
}

function onDeviceFailure(error?: Error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

export default App;
