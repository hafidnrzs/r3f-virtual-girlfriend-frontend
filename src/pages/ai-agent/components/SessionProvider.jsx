import { RoomContext } from "@livekit/components-react";
import { createContext, useContext, useMemo } from "react";
import { useRoom } from "../hooks/useRoom";
import { startSession } from "@react-three/xr";

// TODO: refactor this to the other files
const APP_CONFIG_DEFAULTS = {
  companyName: "LiveKit",
  pageTitle: "LiveKit Voice Agent",
  pageDescription: "A voice agent built with LiveKit",

  supportsChatInput: true,
  supportsVideoInput: true,
  supportsScreenShare: true,
  isPreConnectBufferEnabled: true,

  logo: "/lk-logo.svg",
  accent: "#002cf2",
  logoDark: "/lk-logo-dark.svg",
  accentDark: "#1fd5f9",
  startButtonText: "Start call",

  // for LiveKit Cloud Sandbox
  sandboxId: undefined,
  agentName: undefined,
};

const SessionContext =
  createContext <
  { appConfig, isSessionActive, startSession, endSession } >
  {
    appConfig: APP_CONFIG_DEFAULTS,
    isSessionActive: false,
    startSession: () => {},
    endSession: () => {},
  };

export function SessionProvider({ appConfig, children }) {
  const { room, isSessionActive, startSession, endSession } =
    useRoom(appConfig);
  const contextValue = useMemo(
    () => ({ appConfig }),
    [appConfig, isSessionActive, startSession, endSession]
  );
  return (
    <RoomContext.Provider value={room}>
      <SessionContext.Provider value={contextValue}>
        {children}
      </SessionContext.Provider>
    </RoomContext.Provider>
  );
}
s;
export function useSession() {
  return useContext(SessionContext);
}
