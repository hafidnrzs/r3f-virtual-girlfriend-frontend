import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";

interface IllustrationPanelProps {
  hidden?: boolean;
}

export function IllustrationPanel({ hidden }: IllustrationPanelProps) {
  const [isVisible, setIsVisible] = useState(!hidden);

  useEffect(() => {
    setIsVisible(!hidden);
  }, [hidden]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed py-4 px-6 bg-white left-6 top-1/4 rounded-md max-w-md z-10"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl text-gray-800 font-bold">Ilustrasi</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-800 hover:text-gray-400 cursor-pointer text-xl"
            >
              ×
            </button>
          </div>
          <div className="f">
            <img
              src="/images/Teorema-Pythagoras.jpg"
              alt="Teorema Pythagoras"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
