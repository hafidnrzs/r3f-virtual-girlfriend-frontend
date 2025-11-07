import { Canvas } from "@react-three/fiber";
import { Experience } from "@/components/Experience";
import { Illustration } from "@/components/Illustration";
import { useVoiceAssistant } from "@livekit/components-react";
import { useIllustration } from "@/hooks/useIllustration";
import { motion, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";

type FrameSize = "small" | "medium" | "large";

export function AvatarPanel() {
  const { state: agentState } = useVoiceAssistant();
  const { visible: illustrationVisible } = useIllustration();
  const containerRef = useRef<HTMLDivElement>(null);

  // PIP controls state
  const [isSwitched, setIsSwitched] = useState(false);
  const [frameSize, setFrameSize] = useState<FrameSize>("medium");
  const [isFrameVisible, setIsFrameVisible] = useState(true);

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Frame size mapping
  const frameSizes = {
    small: "md:w-48 md:h-48 w-32 h-32",
    medium: "md:w-72 md:h-72 w-48 h-48",
    large: "md:w-96 md:h-96 w-64 h-64",
  };

  const cycleSizes = () => {
    const sizes: FrameSize[] = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(frameSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setFrameSize(sizes[nextIndex]);
  };

  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div ref={containerRef} className="flex-1 w-full relative min-h-0">
        {illustrationVisible ? (
          // Mode B: Illustration + Floating Avatar (can be switched)
          <>
            {/* Background - either Illustration or Avatar based on switch state */}
            {!isSwitched ? (
              // Normal: Illustration in background
              <Illustration />
            ) : (
              // Switched: Avatar in background
              agentState !== "disconnected" && (
                <Canvas
                  shadows
                  camera={{ position: [0, 0, 1], fov: 30 }}
                  style={{ width: "100%", height: "100%" }}
                  className="relative z-0"
                  gl={{ alpha: true }}
                  key="switched-bg-canvas"
                >
                  <Experience key="switched-bg-experience" isPIPMode={false} />
                </Canvas>
              )
            )}

            {/* Show Frame Button (when frame is hidden) */}
            {!isFrameVisible && agentState !== "disconnected" && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setIsFrameVisible(true)}
                className="absolute bottom-4 left-4 z-10 bg-black/70 hover:bg-black/90 text-white rounded-lg px-3 py-2 text-sm font-medium transition-all backdrop-blur-sm shadow-xl"
                title="Show floating frame"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </motion.button>
            )}

            {/* Floating PIP Frame with Controls */}
            <AnimatePresence>
              {agentState !== "disconnected" && isFrameVisible && (
                <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0.1}
                  dragConstraints={containerRef}
                  initial={{
                    scale: prefersReducedMotion ? 1 : 0.8,
                    opacity: 0,
                  }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                  }}
                  exit={{
                    scale: prefersReducedMotion ? 1 : 0.8,
                    opacity: 0,
                  }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.4,
                    type: prefersReducedMotion ? "tween" : "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                  style={{
                    left: 16,
                    bottom: 16,
                  }}
                  className="absolute z-10"
                  aria-label="Floating view - drag to move"
                >
                  {/* Control Bar */}
                  <div className="flex gap-1 mb-1 justify-end" onPointerDown={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setIsSwitched(!isSwitched)}
                      className="bg-black/60 hover:bg-black/80 text-white rounded px-2 py-1 text-xs font-medium transition-colors backdrop-blur-sm"
                      title={isSwitched ? "Show Avatar in frame" : "Show Illustration in frame"}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={cycleSizes}
                      className="bg-black/60 hover:bg-black/80 text-white rounded px-2 py-1 text-xs font-medium transition-colors backdrop-blur-sm"
                      title={`Size: ${frameSize}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => setIsFrameVisible(false)}
                      className="bg-black/60 hover:bg-black/80 text-white rounded px-2 py-1 text-xs font-medium transition-colors backdrop-blur-sm"
                      title="Close"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-3 h-3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Frame Content */}
                  <div
                    className={`${frameSizes[frameSize]} rounded-lg overflow-hidden shadow-2xl border border-white/30 hover:border-white/50 transition-all cursor-grab active:cursor-grabbing`}
                  >
                    {!isSwitched ? (
                      // Avatar in frame
                      <Canvas
                        shadows
                        camera={{ position: [0, 1.5, 1.2], fov: 28 }}
                        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
                        gl={{ alpha: true }}
                        key="pip-canvas-avatar"
                      >
                        <Experience key="pip-experience" isPIPMode={true} />
                      </Canvas>
                    ) : (
                      // Illustration in frame
                      <div className="w-full h-full relative bg-gradient-to-br from-gray-100 to-gray-200">
                        <Illustration />
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          // Mode A: Full Avatar (No Illustration)
          <>
            {agentState !== "disconnected" ? (
              <Canvas
                shadows
                camera={{ position: [0, 0, 1], fov: 30 }}
                style={{ width: "100%", height: "100%" }}
                className="relative z-10"
                gl={{ alpha: true }}
                key="normal-canvas"
              >
                <Experience key="normal-experience" isPIPMode={false} />
              </Canvas>
            ) : (
              <div className="absolute inset-0 z-10 flex items-center justify-center text-gray-400 text-center">
                <div>
                  <p className="text-lg font-semibold">3D Avatar</p>
                  <p className="text-sm mt-2">
                    Avatar will appear here when connected
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
