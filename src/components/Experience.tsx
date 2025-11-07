import {
  CameraControls,
  ContactShadows,
  Environment,
  Text,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useChat } from "@/hooks/useChat";
import { Avatar } from "./Avatar";

const Dots = (props: JSX.IntrinsicElements['group']) => {
  const { loading } = useChat();
  const [loadingText, setLoadingText] = useState("");
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingText((loadingText) => {
          if (loadingText.length > 2) {
            return ".";
          }
          return loadingText + ".";
        });
      }, 800);
      return () => clearInterval(interval);
    } else {
      setLoadingText("");
    }
  }, [loading]);
  if (!loading) return null;
  return (
    <group {...props}>
      <Text fontSize={0.14} anchorX={"left"} anchorY={"bottom"}>
        {loadingText}
        <meshBasicMaterial attach="material" color="black" />
      </Text>
    </group>
  );
};

export const Experience = ({ isPIPMode = false }: { isPIPMode?: boolean }) => {
  const cameraControls = useRef<CameraControls>(null);
  const { cameraZoomed } = useChat();
  const [isInitialized, setIsInitialized] = useState(false);
  const { camera } = useThree();

  // Force camera position in PIP mode immediately
  useEffect(() => {
    if (isPIPMode) {
      // Directly set camera position and lookAt for PIP mode (zoomed to upper body)
      camera.position.set(0, 1.5, 1);
      camera.lookAt(0.05, 1.55, 0);
      camera.updateProjectionMatrix();
      setIsInitialized(true);
      return;
    }
  }, [isPIPMode, camera]);

  // Initialize camera position once (skip in PIP mode - handled above)
  useEffect(() => {
    if (isPIPMode) return;
    if (cameraControls.current && !isInitialized) {
      cameraControls.current.setLookAt(0, 2, 5, 0, 1.5, 0, false);
      setIsInitialized(true);
    }
  }, [isInitialized, isPIPMode]);

  // Handle camera zoom changes (skip in PIP mode)
  useEffect(() => {
    if (isPIPMode) return;
    if (!isInitialized || !cameraControls.current) return;

    if (cameraZoomed) {
      cameraControls.current.setLookAt(0, 1.5, 1.5, 0, 1.5, 0, true);
    } else {
      cameraControls.current.setLookAt(0, 2.2, 5, 0, 1.0, 0, true);
    }
  }, [cameraZoomed, isInitialized, isPIPMode]);

  return (
    <>
      {!isPIPMode && <CameraControls ref={cameraControls} />}
      <Environment preset="sunset" />
      {/* Wrapping Dots into Suspense to prevent Blink when Troika/Font is loaded */}
      <Suspense>
        <Dots position-y={1.75} position-x={-0.02} />
      </Suspense>
      <Avatar isPIPMode={isPIPMode} />
      <ContactShadows opacity={0.7} />
    </>
  );
};
