import { useRoomContext, useVoiceAssistant } from "@livekit/components-react";
import { RpcInvocationData } from "livekit-client";
import { useEffect, useState } from "react";

export interface CompData {
  id: string;
  content: string;
  isShowed?: boolean;
}

export default function ComponentContainer() {
  const [comp, setComp] = useState<CompData[]>([]);
  const room = useRoomContext();
  const { agent } = useVoiceAssistant();

  useEffect(() => {
    if (!room) return;

    // Register RPC method to receive component
    const handleShowComp = async (data: RpcInvocationData): Promise<string> => {
      try {
        console.log("Received component RPC data:", data);

        // Check for the correct property in the RPC data
        if (!data || data.payload === undefined) {
          return "Error: Invalid RPC data format";
        }

        console.log("Parsing payload:", data.payload);

        // Parse the payload string into JSON object
        const payload =
          typeof data.payload === "string"
            ? JSON.parse(data.payload)
            : data.payload;

        if (payload.action === "toggle") {
          const newComp: CompData = {
            id: payload.id,
            content: payload.content,
            isShowed: true,
          };

          setComp((prev) => {
            // Check if comp with same ID already exists
            const exists = prev.some((comp) => comp.id === newComp.id);
            if (exists) {
              return prev.map((comp) =>
                comp.id === newComp.id ? newComp : comp
              );
            } else {
              return [...prev, newComp];
            }
          });
        }
        return "Success";
      } catch (error) {
        console.error("Error processing component data:", error);
        return (
          "Error " + (error instanceof Error ? error.message : String(error))
        );
      }
    };

    room.registerRpcMethod("client.", handleShowComp);

    return () => {
      // Clean up RPC method when component unmounts
      room.unregisterRpcMethod("client.component");
    };
  }, [room, comp.length]);
  room.registerRpcMethod("greet", async (data: RpcInvocationData) => {
    console.log(
      `Received greeting from ${data.callerIdentity}: ${data.payload}`
    );
    return `Hello, ${data.callerIdentity}`;
  });

  return (
    <div className="text-xl absolute inset-0 translate-x-[40%] translate-y-[50%]">
      {/* <SampleComponent comp={comp} onToggle={handleShow} /> */}
    </div>
  );
}

interface ComponentProps {
  comp: CompData;
  onToggle?: (id: string) => void;
}

function SampleComponent({ comp, onToggle }): ComponentProps {
  const [isToggled, setIsToggled] = useState(comp.isShowed || false);

  // Update local state when comp prop changes
  useEffect(() => {
    setIsToggled(comp.isShowed || false);
  }, [comp.isShowed]);

  return (
    <div className="flex flex-col">
      <span>{comp.content}</span>
      <button>Hide</button>
    </div>
  );
}
