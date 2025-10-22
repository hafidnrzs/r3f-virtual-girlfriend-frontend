import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Leva } from "leva";
import { Experience } from "./components/Experience";
import { UI } from "./components/UI";
import { IllustrationPanel } from "./components/IllustrationPanel";

import { RoomContext, useVoiceAssistant } from "@livekit/components-react";
import { Room, RoomEvent } from "livekit-client";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

function App() {
  const [room] = useState(new Room());

  const onConnectButtonClicked = useCallback(async () => {
    try {
      const apiUrl = import.meta.env?.VITE_API_URL;
      const url = new URL(
        apiUrl ?? "/api/connection-details",
        window.location.origin
      );

      const response = await fetch(url.toString());
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
      // Microphone disabled for text-only input
      await room.localParticipant.setMicrophoneEnabled(false);
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
    <RoomContext.Provider value={room}>
      <div className="relative w-full h-full">
        <AgentCanvas />
        <SimpleAssistant onConnectButtonClicked={onConnectButtonClicked} />
      </div>
    </RoomContext.Provider>
  );
}

function ConnectButton({ onConnectButtonClicked, agentState }) {
  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {agentState === "disconnected" && (
          <motion.div
            key="connect-overlay"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
            className="absolute inset-0 z-20 grid place-items-center"
          >
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="uppercase px-4 py-2 bg-white text-black rounded-md disabled:opacity-60"
              disabled={agentState === "connecting"}
              onClick={onConnectButtonClicked}
            >
              {agentState === "connecting"
                ? "Connecting..."
                : "Start a conversation"}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function AgentCanvas() {
  const { state: agentState } = useVoiceAssistant();

  return (
    <Canvas
      className="absolute inset-0 z-0"
      shadows
      camera={{ position: [0, 0, 1], fov: 30 }}
    >
      {agentState !== "disconnected" && <Experience />}
    </Canvas>
  );
}

function SimpleAssistant({ onConnectButtonClicked }) {
  const { state: agentState } = useVoiceAssistant();

  return (
    <>
      {agentState !== "disconnected" ? (
        <>
          <Loader />
          <Leva hidden />
          <IllustrationPanel />
          <UI />
        </>
      ) : null}

      <ConnectButton
        onConnectButtonClicked={onConnectButtonClicked}
        agentState={agentState}
      />
    </>
  );
}

function onDeviceFailure(error) {
  console.error(error);
  alert(
    "Error acquiring camera or microphone permissions. Please make sure you grant the necessary permissions in your browser and reload the tab"
  );
}

export default App;
