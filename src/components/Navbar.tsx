import React, { useState, useEffect } from 'react';
import { Menu, X, Calendar, ArrowRight, Sun, Moon, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ResilientImage } from './ResilientImage';

export type PageRoute =
  | 'accueil'
  | '237-cinematique'
  | 'portfolio'
  | 'prestations'
  | 'actualites'
  | 'tournage';

interface NavbarProps {
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  brandName: string;
  logoUrl?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onNavigate,
  brandName,
  logoUrl = '/assets/aistudio/WhatsApp_Image_2026-11-16_at_10.25.07_b5ed22ad.jpeg'
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme, lang, toggleLang, t } = useThemeLanguage();

  const navLinks: { id: PageRoute; label: string; desc: string }[] = [
    {
      id: 'accueil',
      label: t('Accueil', 'Home'),
      desc: t('Univers Thomas Fotso & Entreprises', 'Thomas Fotso Universe & Partners')
    },
    {
      id: '237-cinematique',
      label: '237 Cinématique',
      desc: t('Projet phare, Épisodes & Carte +237', 'Flagship Project, Episodes & +237 Map')
    },
    {
      id: 'portfolio',
      label: 'Portfolio',
      desc: t('Réalisations Vidéo, Photo & Stade', 'Video, Photo & Stadium Works')
    },
    {
      id: 'prestations',
      label: t('Prestations & FAQ', 'Services & FAQ'),
      desc: t('Services sur mesure, Tarifs & Questions', 'Custom Services, Rates & FAQ')
    },
    {
      id: 'actualites',
      label: t('Actualités', 'News'),
      desc: t('Journal de production & PDF officiel', 'Production Journal & Official PDF')
    }
  ];

  const handleSelect = (page: PageRoute) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel-strong !rounded-none border-b border-[var(--glass-border)]">
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 px-3.5 sm:px-6 lg:px-10 py-3">
        {/* Zone 1: Brand Lockup + Powered by NHR DIGITAL AGENCY */}
        <button
          type="button"
          onClick={() => handleSelect('accueil')}
          className="flex items-center gap-2.5 sm:gap-3 text-left group min-w-0 shrink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)]"
        >
          <ResilientImage
            src={logoUrl}
            alt={brandName}
            priority
            sizes="48px"
            pictureClassName="w-9 h-9 sm:w-10 sm:h-10 shrink-0 block"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-[var(--glass-border)] transition-transform duration-300 group-hover:scale-105"
          />
          <div className="min-w-0">
            <span className="block text-sm sm:text-lg lg:text-xl font-bold tracking-wider uppercase text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors truncate leading-tight">
              {brandName}
            </span>
            <span className="block text-[9px] sm:text-[10px] font-medium tracking-widest uppercase text-[var(--text-muted)] truncate">
              Powered by <span className="text-[var(--accent-primary)] font-semibold">NHR DIGITAL AGENCY</span>
            </span>
          </div>
        </button>

        {/* Zone 2: Desktop Navigation Links (lg >= 1024px) */}
        <nav
          aria-label={t('Navigation principale', 'Main navigation')}
          className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium shrink-0"
        >
          {navLinks.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1.5 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-primary)] ${
                  isActive
                    ? 'text-[var(--text-primary)] font-semibold after:content-[""] after:absolute after:left-0 after:right-0 after:-bottom-0.5 after:h-[2px] after:rounded-full after:bg-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Language Switcher (FR/EN), Theme Toggle (Dark/Light), CTA & Mobile Drawer Trigger */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* FR / EN Language Toggle */}
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t('Passer le site en anglais', 'Switch website to French')}
            title={t('FR / EN — Changer de langue', 'FR / EN — Switch language')}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] transition-colors shrink-0"
          >
            <Globe className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
            <span className="uppercase">{lang === 'fr' ? 'FR' : 'EN'}</span>
          </button>

          {/* Dark / Light Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === 'dark'
                ? t('Activer le thème clair', 'Switch to light theme')
                : t('Activer le thème sombre', 'Switch to dark theme')
            }
            title={
              theme === 'dark'
                ? t('Mode Clair (Blanc)', 'Light Mode')
                : t('Mode Sombre (Noir)', 'Dark Mode')
            }
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] transition-colors shrink-0"
          >
            {theme === 'dark' ? (
              <>
                <Sun className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                <span className="hidden xl:inline">{t('Clair', 'Light')}</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                <span className="hidden xl:inline">{t('Sombre', 'Dark')}</span>
              </>
            )}
          </button>

          {/* Primary Action Button: Tablet & Desktop */}
          <button
            type="button"
            onClick={() => handleSelect('tournage')}
            className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] rounded-full transition-transform active:scale-95 whitespace-nowrap shrink-0 shadow-md"
          >
            <Calendar className="w-3.5 h-3.5 shrink-0" />
            <span>{t('Prendre RDV', 'Book a Call')}</span>
          </button>

          {/* Hamburger / Drawer Toggle Button for Mobile & Tablet (< 1024px) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? t('Fermer le menu', 'Close menu')
                : t('Ouvrir le menu', 'Open menu')
            }
            className="lg:hidden inline-flex items-center justify-center gap-1.5 min-w-[40px] min-h-[40px] px-2.5 py-2 rounded-full glass-panel text-[var(--text-primary)] transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5 text-[var(--accent-primary)]" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Drawer (< 1024px) */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 top-[61px] bg-black/60 backdrop-blur-xs z-30"
              aria-hidden="true"
            />

            <motion.nav
              aria-label={t('Navigation mobile et tablette', 'Mobile and tablet navigation')}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden relative z-40 border-t border-[var(--glass-border)] bg-[var(--bg-surface)] px-4 sm:px-6 py-5 shadow-2xl max-h-[calc(100vh-65px)] overflow-y-auto"
            >
              <div className="max-w-[1440px] mx-auto space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {navLinks.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item.id)}
                        className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--text-primary)] shadow-md'
                            : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        <div className="min-w-0">
                          <div
                            className={`text-sm font-semibold truncate ${
                              isActive
                                ? 'text-[var(--accent-primary)]'
                                : 'text-[var(--text-primary)]'
                            }`}
                          >
                            {item.label}
                          </div>
                          <div className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">
                            {item.desc}
                          </div>
                        </div>
                        <ArrowRight
                          className={`w-4 h-4 shrink-0 ${
                            isActive
                              ? 'text-[var(--accent-primary)]'
                              : 'text-[var(--text-secondary)]/60'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                {/* Theme & Language Quick Controls + Primary Booking Button */}
                <div className="pt-3 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={toggleLang}
                      className="py-2.5 px-4 rounded-full glass-panel text-xs font-semibold text-[var(--text-primary)] flex items-center justify-center gap-2"
                    >
                      <Globe className="w-4 h-4 text-[var(--accent-primary)]" />
                      <span>{lang === 'fr' ? 'Langue : Français (FR)' : 'Language: English (EN)'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={toggleTheme}
                      className="py-2.5 px-4 rounded-full glass-panel text-xs font-semibold text-[var(--text-primary)] flex items-center justify-center gap-2"
                    >
                      {theme === 'dark' ? (
                        <>
                          <Sun className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>{t('Mode Clair', 'Light Mode')}</span>
                        </>
                      ) : (
                        <>
                          <Moon className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>{t('Mode Sombre', 'Dark Mode')}</span>
                        </>
                      )}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect('tournage')}
                    className="flex-1 py-3 px-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg transition-colors"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {t(
                        'Prendre rendez-vous / Demander un tournage',
                        'Book an Appointment / Request a Shoot'
                      )}
                    </span>
                  </button>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
