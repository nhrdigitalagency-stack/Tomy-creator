import React, { useRef, useState } from 'react';
import { motion } from 'motion/react';

interface RevealSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'left' | 'right' | 'scale';
  id?: string;
  'aria-labelledby'?: string;
}

export const RevealSection: React.FC<RevealSectionProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  id,
  'aria-labelledby': ariaLabelledBy
}) => {
  const initialMap = {
    up: { opacity: 0, y: 28, scale: 0.985 },
    left: { opacity: 0, x: -28, scale: 0.985 },
    right: { opacity: 0, x: 28, scale: 0.985 },
    scale: { opacity: 0, y: 12, scale: 0.95 }
  };

  return (
    <motion.div
      id={id}
      aria-labelledby={ariaLabelledBy}
      initial={initialMap[direction]}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface TiltGlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  intensity?: number;
}

export const TiltGlassCard: React.FC<TiltGlassCardProps> = ({
  children,
  className = '',
  onClick,
  intensity = 5
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = (x / rect.width) * 100;
    const pctY = (y / rect.height) * 100;

    const rotateY = ((pctX - 50) / 50) * intensity;
    const rotateX = -((pctY - 50) / 50) * intensity;

    setTilt({ rotateX, rotateY });
    setSpotlight({ x: pctX, y: pctY, opacity: 1 });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY
      }}
      whileHover={{ y: -5, scale: 1.008 }}
      whileTap={onClick ? { scale: 0.99 } : undefined}
      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      style={{ transformPerspective: 1100 }}
      className={`relative overflow-hidden group ${className}`}
    >
      {/* Dynamic Cursor-Following Spotlight Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(480px circle at ${spotlight.x}% ${spotlight.y}%, var(--accent-subtle), transparent 65%)`
        }}
      />
      {/* Top Edge Specular Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />
      <div className="relative z-20 h-full">{children}</div>
    </motion.div>
  );
};

interface CinematicRibbonProps {
  items?: string[];
}

export const CinematicRibbon: React.FC<CinematicRibbonProps> = ({
  items = [
    'TOMY CREATOR',
    'THOMAS FOTSO',
    '237 CINÉMATIQUE',
    'RÉALISATION DOCUMENTAIRE',
    'CAPTATION SPORTIVE & STADE',
    'FILMS D’ENTREPRISE',
    'STORYTELLING VISUEL +237'
  ]
}) => {
  const repeated = [...items, ...items, ...items];
  return (
    <div
      aria-hidden="true"
      className="w-full overflow-hidden py-4 border-y border-[var(--glass-border)] bg-[var(--bg-secondary)]/70 select-none"
    >
      <div className="marquee-track flex items-center gap-8 whitespace-nowrap text-xs sm:text-sm font-semibold tracking-widest uppercase text-[var(--text-secondary)]">
        {repeated.map((text, idx) => (
          <React.Fragment key={`${text}-${idx}`}>
            <span className="hover:text-[var(--text-primary)] transition-colors">{text}</span>
            <span className="text-[var(--accent-primary)]">·</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
