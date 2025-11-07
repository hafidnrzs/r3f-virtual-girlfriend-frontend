import { useEffect } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RpcInvocationData } from "livekit-client";
import { useIllustration } from "@/hooks/useIllustration";

/**
 * Component that registers the RPC method for controlling the illustration component.
 * Must be rendered inside RoomContext and IllustrationProvider.
 */
export function IllustrationRpcHandler() {
  const room = useRoomContext();
  const { updateIllustration } = useIllustration();

  useEffect(() => {
    if (!room) return;

    const handleShowIllustration = async (
      data: RpcInvocationData
    ): Promise<string> => {
      try {
        console.log(
          "[RPC] Received client.showIllustration from:",
          data.callerIdentity
        );

        // Parse and validate payload
        const payload = JSON.parse(data.payload) as {
          state: string;
          image_url?: string | null;
        };

        // Validate state field
        if (payload.state !== "show" && payload.state !== "hidden") {
          const errorMsg = `Invalid state: "${payload.state}". Must be "show" or "hidden".`;
          console.error("[RPC]", errorMsg);
          return JSON.stringify({ ok: false, error: errorMsg });
        }

        // Update illustration state
        updateIllustration(payload.state, payload.image_url);

        console.log("[RPC] Illustration updated:", {
          state: payload.state,
          imageUrl: payload.image_url,
        });

        return JSON.stringify({ ok: true });
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        console.error("[RPC] Error handling showIllustration:", errorMsg);
        return JSON.stringify({ ok: false, error: errorMsg });
      }
    };

    // Register the RPC method
    console.log("[RPC] Registering client.showIllustration method");
    room.registerRpcMethod("client.showIllustration", handleShowIllustration);

    return () => {
      console.log("[RPC] Unregistering client.showIllustration method");
      room.unregisterRpcMethod("client.showIllustration");
    };
  }, [room, updateIllustration]);

  return null;
}
