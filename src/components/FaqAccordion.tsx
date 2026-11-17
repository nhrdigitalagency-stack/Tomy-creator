import React, { useState } from 'react';
import { FaqItem } from '../data/siteContent';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, MessageCircle, ArrowRight } from 'lucide-react';
import { PageRoute } from './Navbar';

interface FaqAccordionProps {
  faqs: FaqItem[];
  onNavigate?: (page: PageRoute) => void;
  onOpenWhatsApp?: (topic?: string) => void;
}

type FaqFilter = 'Toutes' | FaqItem['category'];

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  faqs,
  onNavigate,
  onOpenWhatsApp
}) => {
  const { lang, t } = useThemeLanguage();
  const [selectedCategory, setSelectedCategory] = useState<FaqFilter>('Toutes');
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    faqs.length > 0 ? faqs[0].id : null
  );

  const categories: { id: FaqFilter; label: string }[] = [
    { id: 'Toutes', label: t('Toutes les questions', 'All Questions') },
    { id: 'Tarifs & Devis', label: t('Tarifs & Devis', 'Rates & Quotes') },
    { id: 'Disponibilités & Délais', label: t('Disponibilités & Délais', 'Availability & Lead Times') },
    { id: 'Processus de tournage', label: t('Processus de tournage', 'Production Process') }
  ];

  const categoryLabels: Record<FaqItem['category'], string> = {
    'Tarifs & Devis': t('Tarifs & Devis', 'Rates & Quotes'),
    'Disponibilités & Délais': t('Disponibilités & Délais', 'Availability & Lead Times'),
    'Processus de tournage': t('Processus de tournage', 'Production Process')
  };

  const filteredFaqs =
    selectedCategory === 'Toutes'
      ? faqs
      : faqs.filter((faq) => faq.category === selectedCategory);

  const toggleItem = (id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      aria-labelledby="faq-home-heading"
      className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide uppercase">
            <HelpCircle className="w-4 h-4" />
            <span>{t('QUESTIONS FRÉQUENTES · FAQ', 'FREQUENTLY ASKED QUESTIONS · FAQ')}</span>
          </div>
          <h2
            id="faq-home-heading"
            className="text-2xl sm:text-4xl font-semibold text-[var(--text-primary)] leading-tight"
          >
            {t(
              'Tout savoir avant de lancer votre tournage',
              'Everything to know before starting your shoot'
            )}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {t(
              'Tarifs sur mesure, délais de réservation à Douala et dans tout le Cameroun (+237), et étapes concrètes de réalisation.',
              'Custom pricing, booking lead times across Douala and Cameroon (+237), and concrete production steps.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onNavigate && (
            <button
              type="button"
              onClick={() => {
                onNavigate('prestations');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
            >
              <span>{t('Détails des prestations', 'Full Services & Rates')}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            </button>
          )}
          {onOpenWhatsApp && (
            <button
              type="button"
              onClick={() =>
                onOpenWhatsApp(
                  t('Question concernant un devis ou un tournage', 'Question about a quote or shoot')
                )
              }
              className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{t('Poser une question', 'Ask a Question')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        role="tablist"
        aria-label={t('Filtrer les questions fréquentes', 'Filter FAQs by topic')}
        className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1"
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => {
                setSelectedCategory(cat.id);
                const firstMatch =
                  cat.id === 'Toutes'
                    ? faqs[0]
                    : faqs.find((f) => f.category === cat.id);
                if (firstMatch) setOpenFaqId(firstMatch.id);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
                isSelected
                  ? 'bg-[var(--accent-primary)] text-white shadow-md'
                  : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-primary)]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Interactive Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, index) => {
          const isOpen = openFaqId === faq.id;
          const questionText = lang === 'en' && faq.questionEn ? faq.questionEn : faq.question;
          const answerText = lang === 'en' && faq.answerEn ? faq.answerEn : faq.answer;

          return (
            <div
              key={faq.id}
              className={`glass-panel rounded-3xl overflow-hidden transition-colors duration-300 ${
                isOpen
                  ? 'border-[var(--glass-border-accent)]'
                  : 'hover:border-[var(--accent-primary)]/40'
              }`}
            >
              <button
                type="button"
                id={`faq-trigger-${faq.id}`}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${faq.id}`}
                onClick={() => toggleItem(faq.id)}
                className="w-full text-left px-5 sm:px-7 py-5 flex items-center justify-between gap-4 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--accent-primary)]"
              >
                <div className="flex items-start sm:items-center gap-3.5 sm:gap-4 min-w-0">
                  <span className="tabular-nums text-xs font-bold text-[var(--accent-primary)] bg-[var(--accent-subtle)] px-2.5 py-1 rounded-full shrink-0 mt-0.5 sm:mt-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div className="space-y-1 min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                      {categoryLabels[faq.category] || faq.category}
                    </span>
                    <span className="block text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-snug">
                      {questionText}
                    </span>
                  </div>
                </div>

                <span
                  aria-hidden="true"
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                    isOpen
                      ? 'bg-[var(--accent-primary)] text-white rotate-180'
                      : 'bg-[var(--card-inner-bg)] text-[var(--text-primary)] border border-[var(--glass-border)]'
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={`faq-panel-${faq.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 sm:px-7 pb-6 pt-1 sm:pl-[4.5rem] border-t border-[var(--glass-border)]/70">
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed pt-3">
                        {answerText}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};
