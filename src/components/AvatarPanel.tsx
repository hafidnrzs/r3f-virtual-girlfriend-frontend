import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { useVoiceAssistant } from "@livekit/components-react";

export function AvatarPanel() {
  const { state: agentState } = useVoiceAssistant();

  return (
    <div className="col-span-1 md:col-span-2 flex flex-col overflow-hidden">
      <div className="flex-1 w-full relative min-h-0">
        {agentState !== "disconnected" ? (
          <Canvas
            shadows
            camera={{ position: [0, 0, 1], fov: 30 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Experience />
          </Canvas>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-center">
            <div>
              <p className="text-lg font-semibold">3D Avatar</p>
              <p className="text-sm mt-2">
                Avatar will appear here when connected
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
