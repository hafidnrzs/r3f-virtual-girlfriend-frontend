import { useEffect } from "react";
import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import { toastAlert } from "@/components/livekit/alert-toast";

/**
 * Checks if the agent is in an available state
 * @param {string} agentState - Current state of the agent
 * @returns {boolean} True if agent is listening, thinking, or speaking
 */
function isAgentAvailable(agentState) {
  return (
    agentState == "listening" ||
    agentState == "thinking" ||
    agentState == "speaking"
  );
}

/**
 * Hook that monitors agent connection and shows timeout alert if agent doesn't initialize
 * @param {number} timout - Timeout duration in milliseconds (default: 20000)
 */
export function useConnectionTimeout(timout = 20_000) {
  const room = useRoomContext();
  const { state: agentState } = useVoiceAssistant();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!isAgentAvailable(agentState)) {
        const reason =
          agentState === "connecting"
            ? "Agent did not join the room. "
            : "Agent connected but did not complete initializing. ";

        toastAlert({
          title: "Session ended",
          description: (
            <p className="w-full">
              {reason}
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.livekit.io/agents/start/voice-ai/"
                className="whitespace-nowrap underline"
              >
                See quickstart guide
              </a>
              .
            </p>
          ),
        });

        room.disconnect();
      }
    }, timout);

    return () => clearTimeout(timeout);
  }, [agentState, room, timout]);
}
