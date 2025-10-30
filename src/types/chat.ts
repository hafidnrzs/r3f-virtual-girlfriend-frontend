export interface Message {
  text?: string;
  audio?: string;
  lipsync?: any;
  facialExpression?: string;
  animation?: string;
}

export interface ChatContextValue {
  chat: (message: string) => Promise<void>;
  message: Message | null;
  onMessagePlayed: () => void;
  loading: boolean;
  cameraZoomed: boolean;
  setCameraZoomed: (zoomed: boolean) => void;
}
