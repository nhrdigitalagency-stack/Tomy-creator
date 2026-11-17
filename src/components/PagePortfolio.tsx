import React, { useState } from 'react';
import { SiteData, PortfolioItem } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';
import { LightboxMediaPayload } from './MediaLightboxModal';
import { PageRoute } from './Navbar';
import { RevealSection, TiltGlassCard } from './CinemaMotion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Eye, Camera, Film, ArrowRight, ShieldCheck } from 'lucide-react';

interface PagePortfolioProps {
  data: SiteData;
  onNavigate: (page: PageRoute) => void;
  onOpenLightbox: (payload: LightboxMediaPayload) => void;
}

const CATEGORIES = [
  'Toutes les œuvres',
  'Documentaire & 237 Cinématique',
  'Captation Sportive & Stade',
  'Portrait & Direction Artistique',
  'Coulisses & Mobile Filmmaking'
] as const;

const MEDIA_TYPES = ['Tous', 'Photo', 'Vidéo'] as const;

export const PagePortfolio: React.FC<PagePortfolioProps> = ({
  data,
  onNavigate,
  onOpenLightbox
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Toutes les œuvres');
  const [selectedMediaType, setSelectedMediaType] = useState<'Tous' | 'Photo' | 'Vidéo'>('Tous');
  const { lang, t } = useThemeLanguage();

  const { portfolio, references } = data;

  const filteredItems = portfolio.filter((item) => {
    const matchCategory =
      selectedCategory === 'Toutes les œuvres' || item.category === selectedCategory;
    const matchType =
      selectedMediaType === 'Tous' || item.mediaType === selectedMediaType;
    return matchCategory && matchType;
  });

  const handleOpenItem = (item: PortfolioItem) => {
    onOpenLightbox({
      title: lang === 'en' && item.titleEn ? item.titleEn : item.title,
      category: lang === 'en' && item.categoryEn ? item.categoryEn : item.category,
      mediaType: item.mediaType,
      imageUrl: item.imageUrl,
      videoUrl: item.videoUrl,
      location: item.location,
      dateOrYear: item.year,
      cameraGear: lang === 'en' && item.cameraGearEn ? item.cameraGearEn : item.cameraGear,
      role: lang === 'en' && item.roleEn ? item.roleEn : item.role,
      creditNote: item.creditNote,
      description: lang === 'en' && item.descriptionEn ? item.descriptionEn : item.description
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-24 pt-6 sm:pt-12 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
      {/* 1. HEADER PORTFOLIO */}
      <RevealSection className="space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
          <span>
            {t(
              'PORTFOLIO AUDIOVISUEL & PHOTOGRAPHIQUE',
              'AUDIOVISUAL & PHOTOGRAPHY PORTFOLIO'
            )}
          </span>
          <span aria-hidden="true">·</span>
          <span>THOMAS FOTSO — TOMY CREATOR</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
              {t(
                'L’image en mouvement et l’instant décisif',
                'Moving images and the decisive moment'
              )}
            </h1>
            <p className="text-sm sm:text-base text-[var(--text-secondary)]">
              {t(
                'Explorez les réalisations photographiques, les dispositifs de captation sportive en stade, les coulisses de tournage au stabilisateur et les formats documentaires. Cliquez sur une œuvre pour l’examiner en plein écran.',
                'Explore photography works, stadium sports cinematography rigs, stabilized filmmaking behind the scenes, and documentary formats. Click any work to inspect it in fullscreen.'
              )}
            </p>
          </div>

          {/* Media Type Filter */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-panel self-start">
            {MEDIA_TYPES.map((typeItem) => (
              <button
                key={typeItem}
                type="button"
                onClick={() => setSelectedMediaType(typeItem)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedMediaType === typeItem
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {typeItem === 'Tous'
                  ? t('Photo & Vidéo', 'Photo & Video')
                  : typeItem === 'Vidéo'
                  ? t('Vidéo', 'Video')
                  : 'Photo'}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--text-primary)] shadow-md'
                  : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {cat === 'Toutes les œuvres' ? t('Toutes les œuvres', 'All Works') : cat}
            </motion.button>
          ))}
        </div>
      </RevealSection>

      {/* 2. GALLERY GRID */}
      <section>
        <AnimatePresence mode="popLayout">
          {filteredItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel rounded-3xl p-12 text-center space-y-3"
            >
              <p className="text-xl font-bold text-[var(--text-primary)]">
                {t(
                  'Aucune œuvre ne correspond à ce filtre',
                  'No work matches this filter'
                )}
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('Toutes les œuvres');
                  setSelectedMediaType('Tous');
                }}
                className="px-5 py-2.5 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold"
              >
                {t('Réinitialiser les filtres', 'Reset filters')}
              </button>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <TiltGlassCard
                    intensity={4}
                    onClick={() => handleOpenItem(item)}
                    className="glass-panel card-hover-cinema rounded-3xl overflow-hidden flex flex-col justify-between h-full cursor-pointer"
                  >
                    <div className="flex flex-col h-full justify-between">
                      <div>
                        <div className="cinema-stage-dark relative h-64 sm:h-80 overflow-hidden bg-black">
                          <ResilientImage
                            src={item.imageUrl}
                            alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 scrim-bottom" />

                          <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                            <span className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 flex items-center gap-1.5 font-medium">
                              {item.mediaType === 'Vidéo' ? (
                                <Film className="w-3.5 h-3.5 text-[#E51D2A]" />
                              ) : (
                                <Camera className="w-3.5 h-3.5 text-[#E51D2A]" />
                              )}
                              <span>
                                {item.mediaType === 'Vidéo'
                                  ? t('Vidéo', 'Video')
                                  : 'Photo'}
                              </span>
                            </span>

                            <span className="px-3.5 py-1.5 rounded-full bg-black/65 backdrop-blur-md border border-white/15 flex items-center gap-1.5 text-[#E51D2A] font-semibold group-hover:bg-[#E51D2A] group-hover:text-white transition-colors">
                              {item.mediaType === 'Vidéo' ? (
                                <>
                                  <Play className="w-3.5 h-3.5" />
                                  <span>{t('Aperçu vidéo', 'Video preview')}</span>
                                </>
                              ) : (
                                <>
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>{t('Haute définition', 'High resolution')}</span>
                                </>
                              )}
                            </span>
                          </div>

                          <div className="absolute bottom-4 left-5 right-5">
                            <div className="flex flex-wrap items-center gap-2 text-xs text-[#E51D2A] font-semibold">
                              <span>
                                {lang === 'en' && item.categoryEn
                                  ? item.categoryEn
                                  : item.category}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="text-white">{item.location}</span>
                              <span aria-hidden="true">·</span>
                              <span className="tabular-nums text-white/90">
                                {item.year}
                              </span>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-[#E51D2A] transition-colors">
                              {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                            </h2>
                          </div>
                        </div>

                        <div className="p-5 sm:p-6 space-y-3">
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                            {lang === 'en' && item.descriptionEn
                              ? item.descriptionEn
                              : item.description}
                          </p>
                          <div className="pt-3 border-t border-[var(--glass-border)] text-xs text-[var(--text-secondary)] space-y-1">
                            <div>
                              <strong className="text-[var(--text-primary)]">
                                {t('Équipement & Optique :', 'Gear & Optics:')}
                              </strong>{' '}
                              {lang === 'en' && item.cameraGearEn
                                ? item.cameraGearEn
                                : item.cameraGear}
                            </div>
                            <div>
                              <strong className="text-[var(--text-primary)]">
                                {t('Rôle :', 'Role:')}
                              </strong>{' '}
                              {lang === 'en' && item.roleEn ? item.roleEn : item.role}
                            </div>
                            {item.creditNote && (
                              <div className="text-[var(--accent-primary)] italic">
                                {item.creditNote}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="px-5 sm:px-6 py-3.5 bg-[var(--bg-elevated)]/60 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                        <span className="text-[var(--text-secondary)]">
                          {t('Production officielle Tomy Creator', 'Official Tomy Creator Production')}
                        </span>
                        <span className="text-[var(--accent-primary)] font-semibold">
                          {t('Ouvrir en plein écran', 'Open fullscreen')}
                        </span>
                      </div>
                    </div>
                  </TiltGlassCard>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* 3. RÉFÉRENCES & COLLABORATIONS */}
      <RevealSection className="glass-panel-strong rounded-3xl p-6 sm:p-10 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[var(--glass-border)] pb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>
                {t(
                  'RÉFÉRENCES & CADRE D’INTERVENTION',
                  'REFERENCES & PRODUCTION CONTEXT'
                )}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t(
                'Collaborations entreprises, médias et productions terrain',
                'Corporate collaborations, TV media, and field productions'
              )}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {t(
                'Chaque prise de vue et collaboration est présentée selon son cadre réel d’intervention.',
                'Every shoot and collaboration is presented in its authentic production context.'
              )}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {references.map((ref) => (
            <TiltGlassCard
              key={ref.id}
              intensity={4}
              className="rounded-3xl glass-panel p-6 card-hover-cinema"
            >
              <div className="flex flex-col justify-between h-full space-y-4">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
                    <span>
                      {lang === 'en' && ref.contextTypeEn
                        ? ref.contextTypeEn
                        : ref.contextType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>
                      {lang === 'en' && ref.categoryEn ? ref.categoryEn : ref.category}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    {lang === 'en' && ref.titleEn ? ref.titleEn : ref.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                    {lang === 'en' && ref.factualDescriptionEn
                      ? ref.factualDescriptionEn
                      : ref.factualDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                  <span>
                    <strong className="text-[var(--text-primary)]">
                      {t('Rôle :', 'Role:')}
                    </strong>{' '}
                    {lang === 'en' && ref.rolePlayedEn ? ref.rolePlayedEn : ref.rolePlayed}
                  </span>
                  {ref.creditMention && (
                    <span className="text-[var(--accent-primary)] font-medium">
                      {ref.creditMention}
                    </span>
                  )}
                </div>
              </div>
            </TiltGlassCard>
          ))}
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-[var(--text-secondary)]">
            {t(
              'Vous souhaitez confier la réalisation de votre film d’entreprise ou la couverture de votre événement à Thomas Fotso ?',
              'Would you like to entrust your corporate film or event coverage to Thomas Fotso?'
            )}
          </p>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('tournage')}
            className="btn-cinema-glow px-5 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 self-start transition-colors"
          >
            <span>
              {t('Prendre RDV / Demander un tournage', 'Book a Call / Request a Shoot')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </RevealSection>
    </div>
  );
};
