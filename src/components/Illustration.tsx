import { motion, AnimatePresence } from "motion/react";
import { useIllustration } from "@/hooks/useIllustration";

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

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      context.hideIllustration();
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: 50, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 50, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.09, 1.04, 0.245, 1.055] }}
          className="fixed top-4 right-4 z-50 illustration-container"
          style={{
            width: "clamp(200px, 20vw, 400px)",
            aspectRatio: "5 / 4",
          }}
          aria-hidden={!visible}
        >
          <div className="relative w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden border-2 border-gray-200">
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110"
              aria-label="Close illustration"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Image container */}
            <div className="w-full h-full p-2 flex items-center justify-center">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Illustration"
                  className="max-w-full max-h-full object-contain"
                  style={{ display: "block" }}
                  onError={(e) => {
                    console.error(
                      "Failed to load illustration image:",
                      imageUrl
                    );
                    // Optionally hide on error or show placeholder
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16"
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Illustration;
