import { SessionProvider } from "./SessionProvider";
import { StartAudio, RoomAudioRenderer } from "@livekit/components-react";
import { ViewController } from "./ViewController";
import { Toaster } from "./livekit/Toaster";

export function App({ appConfig }) {
  return (
    <SessionProvider appConfig={appConfig}>
      <main className="grid h-svh grid-cols-1 place-content-center">
        <ViewController />
      </main>
      <StartAudio label="Start Audio" />
      <RoomAudioRenderer />
      <Toaster />
    </SessionProvider>
  );
}
