import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface IllustrationState {
  visible: boolean;
  imageUrl: string | null;
}

interface IllustrationContextValue {
  visible: boolean;
  imageUrl: string | null;
  showIllustration: (imageUrl: string) => void;
  hideIllustration: () => void;
  updateIllustration: (state: 'show' | 'hidden', imageUrl?: string | null) => void;
}

const IllustrationContext = createContext<IllustrationContextValue | undefined>(undefined);

interface IllustrationProviderProps {
  children: ReactNode;
}

export const IllustrationProvider = ({ children }: IllustrationProviderProps) => {
  const [state, setState] = useState<IllustrationState>({
    visible: false,
    imageUrl: null,
  });

  const showIllustration = useCallback((imageUrl: string) => {
    setState({ visible: true, imageUrl });
  }, []);

  const hideIllustration = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  const updateIllustration = useCallback((stateType: 'show' | 'hidden', imageUrl?: string | null) => {
    if (stateType === 'show') {
      setState({ visible: true, imageUrl: imageUrl ?? null });
    } else {
      setState((prev) => ({ ...prev, visible: false }));
    }
  }, []);

  return (
    <IllustrationContext.Provider
      value={{
        visible: state.visible,
        imageUrl: state.imageUrl,
        showIllustration,
        hideIllustration,
        updateIllustration,
      }}
    >
      {children}
    </IllustrationContext.Provider>
  );
};

export const useIllustration = (): IllustrationContextValue => {
  const context = useContext(IllustrationContext);
  if (!context) {
    throw new Error("useIllustration must be used within an IllustrationProvider");
  }
  return context;
};
