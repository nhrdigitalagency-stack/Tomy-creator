import React, { useState, useEffect, useCallback } from 'react';
import { TestimonialItem } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';
import { ChevronLeft, ChevronRight, Quote, Star, Pause, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TiltGlassCard } from './CinemaMotion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface TestimonialsCarouselProps {
  testimonials: TestimonialItem[];
}

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({
  testimonials
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const { lang, t } = useThemeLanguage();

  const total = testimonials.length;

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setDirection(1);
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    if (total <= 1) return;
    setDirection(-1);
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  useEffect(() => {
    if (isPaused || total <= 1) return;
    const timer = window.setInterval(handleNext, 6500);
    return () => window.clearInterval(timer);
  }, [isPaused, total, handleNext]);

  if (total === 0) return null;

  const current = testimonials[activeIndex] || testimonials[0];

  return (
    <section
      id="temoignages-clients"
      aria-labelledby="temoignages-clients-heading"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="space-y-8">
        {/* Header & Carousel Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide uppercase">
              <span>
                {t(
                  'TÉMOIGNAGES CLIENTS · RÉALISATION AUDIOVISUELLE',
                  'CLIENT TESTIMONIALS · AUDIOVISUAL FILMMAKING'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span>TOMY CREATOR</span>
            </div>
            <h2
              id="temoignages-clients-heading"
              className="text-2xl sm:text-4xl font-semibold text-[var(--text-primary)]"
            >
              {t(
                'Témoignages clients sur nos réalisations',
                'Client testimonials on our productions'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl">
              {t(
                'Retours authentiques d’entreprises, de marques et de partenaires de plateau ayant collaboré avec Thomas Fotso.',
                'Authentic feedback from companies, brands, and field partners who collaborated with Thomas Fotso.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-end">
            <button
              type="button"
              onClick={() => setIsPaused((prev) => !prev)}
              aria-label={
                isPaused
                  ? t('Reprendre le défilement automatique', 'Resume auto-play')
                  : t('Mettre le carrousel en pause', 'Pause carousel')
              }
              title={
                isPaused
                  ? t('Lecture automatique', 'Auto-play')
                  : t('Pause', 'Pause')
              }
              className="w-10 h-10 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center justify-center transition-colors"
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handlePrev}
              aria-label={t('Témoignage précédent', 'Previous testimonial')}
              className="w-11 h-11 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>
            <span className="text-xs text-[var(--text-secondary)] tabular-nums px-2 font-medium">
              {String(activeIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
            <motion.button
              type="button"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={handleNext}
              aria-label={t('Témoignage suivant', 'Next testimonial')}
              className="w-11 h-11 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {/* Main Glass Testimonial Card */}
        <TiltGlassCard
          intensity={3}
          className="glass-panel-strong rounded-3xl p-5 sm:p-10 lg:p-12"
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current.id}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 36 : -36, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -36 : 36, scale: 0.98 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center"
            >
              {/* Avatar / Project Visual */}
              <div className="lg:col-span-4">
                <div className="cinema-stage-dark relative rounded-3xl overflow-hidden border border-[var(--glass-border)] aspect-[16/10] sm:aspect-square max-h-[280px] mx-auto group/img">
                  <ResilientImage
                    src={current.avatarUrl}
                    alt={`${current.authorName} — ${current.organization}`}
                    sizes="(max-width: 1024px) 100vw, 380px"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-110"
                  />
                  <div className="absolute inset-0 scrim-bottom" />
                  <div className="absolute bottom-4 left-4 right-4 text-xs text-white/95">
                    <span className="font-semibold text-[#E51D2A] block">
                      {lang === 'en' && current.projectContextEn
                        ? current.projectContextEn
                        : current.projectContext}
                    </span>
                    <span>{current.location}</span>
                  </div>
                </div>
              </div>

              {/* Quote & Author Details */}
              <div className="lg:col-span-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <Quote className="w-8 h-8 sm:w-10 sm:h-10 text-[var(--accent-primary)] opacity-85" />
                    <div
                      aria-label={t('Avis client vérifié', 'Verified client review')}
                      className="inline-flex items-center gap-1 text-[var(--accent-primary)]"
                    >
                      {[0, 1, 2, 3, 4].map((starIdx) => (
                        <Star
                          key={starIdx}
                          className="w-3.5 h-3.5 fill-current"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                  </div>

                  <blockquote className="text-base sm:text-xl lg:text-2xl text-[var(--text-primary)] font-normal leading-relaxed">
                    « {lang === 'en' && current.quoteEn ? current.quoteEn : current.quote} »
                  </blockquote>
                </div>

                <div className="pt-5 border-t border-[var(--glass-border)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                      {current.authorName}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                      <span className="text-[var(--accent-primary)] font-medium">
                        {lang === 'en' && current.authorRoleEn
                          ? current.authorRoleEn
                          : current.authorRole}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{current.organization}</span>
                      <span aria-hidden="true">·</span>
                      <span>{current.location}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Carousel Pagination Selector Cards */}
          <div
            role="tablist"
            aria-label={t('Sélectionner un témoignage client', 'Select a client testimonial')}
            className="mt-8 pt-6 border-t border-[var(--glass-border)] grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {testimonials.map((item, idx) => {
              const isSelected = idx === activeIndex;
              return (
                <motion.button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  whileHover={{ y: -3, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setDirection(idx > activeIndex ? 1 : -1);
                    setActiveIndex(idx);
                  }}
                  className={`text-left p-3.5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--text-primary)] shadow-md'
                      : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="text-xs font-semibold truncate text-[var(--text-primary)]">
                    {item.authorName}
                  </div>
                  <div className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                    {item.organization}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </TiltGlassCard>
      </div>
    </section>
  );
};
