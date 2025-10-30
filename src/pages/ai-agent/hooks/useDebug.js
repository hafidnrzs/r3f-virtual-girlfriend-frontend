import * as React from "react";
import { setLogLevel } from "livekit-client";
import { useRoomContext } from "@livekit/components-react";

/**
 * Hook that enables debug mode for LiveKit by setting log level and exposing room globally
 * @param {Object} options - Configuration options
 * @param {string} options.logLevel - Log level to use (default: 'debug')
 * @param {boolean} options.enabled - Whether debug mode is enabled (default: true)
 */
export const useDebugMode = (options = {}) => {
  const room = useRoomContext();
  const logLevel = options.logLevel ?? "debug";
  const enabled = options.enabled ?? true;

  React.useEffect(() => {
    if (!enabled) {
      setLogLevel("silent");
      return;
    }

    setLogLevel(logLevel ?? "debug");

    // Expose room globally for debugging
    window.__lk_room = room;

    return () => {
      window.__lk_room = undefined;
      setLogLevel("silent");
    };
  }, [room, enabled, logLevel]);
};
