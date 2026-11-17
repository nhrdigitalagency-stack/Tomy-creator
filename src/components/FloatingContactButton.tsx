import React from 'react';
import { MessageCircle, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface FloatingContactButtonProps {
  onClick: () => void;
}

export const FloatingContactButton: React.FC<FloatingContactButtonProps> = ({
  onClick
}) => {
  const { t } = useThemeLanguage();

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ opacity: 0, y: 24, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        whileHover={{ scale: 1.07, y: -3 }}
        whileTap={{ scale: 0.94 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        aria-label={t(
          'Contacter Tomy Creator (+237 6 94 92 58 51) ou prendre rendez-vous',
          'Contact Tomy Creator (+237 6 94 92 58 51) or book an appointment'
        )}
        className="group relative flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm shadow-[0_14px_38px_rgba(229,29,42,0.5)] border border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white overflow-hidden"
      >
        {/* Specular Hover Sweep */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
        <MessageCircle className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
        <span className="whitespace-nowrap">{t('Contacter', 'Contact')}</span>
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0 opacity-80 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </motion.button>
    </div>
  );
};
