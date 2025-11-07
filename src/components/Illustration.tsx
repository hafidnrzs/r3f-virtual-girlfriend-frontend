import { motion, AnimatePresence } from "motion/react";
import { useIllustration } from "@/hooks/useIllustration";
import { useState } from "react";

interface IllustrationProps {
  visible?: boolean;
  imageUrl?: string;
  onClose?: () => void;
}

export function Illustration({
  visible: visibleProp,
  imageUrl: imageUrlProp,
  onClose,
}: IllustrationProps = {}) {
  // Use context if no props provided (for RPC control)
  const context = useIllustration();

  const visible = visibleProp ?? context.visible;
  const imageUrl = imageUrlProp ?? context.imageUrl;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      context.hideIllustration();
    }
  };

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.6,
            ease: "easeInOut",
          }}
          className="absolute inset-0 z-[1]"
          aria-label="Contextual illustration background"
          role="img"
        >
          {/* Close button - positioned in top-right corner */}
          <button
            onClick={handleClose}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleClose();
              }
            }}
            className="absolute top-4 right-4 z-[3] bg-black/50 hover:bg-black/70 backdrop-blur-sm text-white rounded-full w-11 h-11 flex items-center justify-center transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black/20"
            aria-label="Close illustration"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Screen reader announcement */}
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            Illustration displayed. Avatar repositioned to corner. Press Tab
            and Enter to close illustration, or press Escape.
          </div>

          {/* Image container - with padding for spacing */}
          <div className="w-full h-full relative p-6 md:p-8">
            {/* Loading placeholder */}
            {!imageLoaded && !imageError && imageUrl && (
              <div className="absolute inset-6 md:inset-8 bg-gradient-to-br from-gray-100 to-gray-200 animate-pulse rounded-lg" />
            )}

            {/* Actual image */}
            {imageUrl && !imageError ? (
              <img
                src={imageUrl}
                alt="Contextual illustration"
                className={`w-full h-full object-contain transition-opacity duration-300 rounded-lg ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
                style={{
                  filter: "brightness(0.9)",
                }}
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.error("Failed to load illustration:", imageUrl);
                  setImageError(true);
                }}
              />
            ) : (
              // Fallback placeholder when no image or error
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-16 h-16 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Illustration;
