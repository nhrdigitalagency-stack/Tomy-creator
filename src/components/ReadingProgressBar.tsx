import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';

export const ReadingProgressBar: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 32,
    restDelta: 0.001
  });

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none bg-transparent"
    >
      <motion.div
        style={{ scaleX, transformOrigin: '0% 50%' }}
        className="h-full w-full bg-gradient-to-r from-[#E51D2A] via-[#F42C39] to-[#FF6B74] shadow-[0_0_10px_rgba(229,29,42,0.55)]"
      />
    </div>
  );
};
