import React, { useState } from 'react';
import { SiteData, EpisodeItem } from '../data/siteContent';
import { CameroonInteractiveMap } from './CameroonInteractiveMap';
import { ResilientImage } from './ResilientImage';
import { LightboxMediaPayload } from './MediaLightboxModal';
import { PageRoute } from './Navbar';
import { RevealSection, TiltGlassCard } from './CinemaMotion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  FileText,
  MapPin,
  Film,
  Compass,
  ArrowRight,
  MessageCircle
} from 'lucide-react';

interface Page237CinematiqueProps {
  data: SiteData;
  onNavigate: (page: PageRoute) => void;
  onOpenLightbox: (payload: LightboxMediaPayload) => void;
  onOpenWhatsApp: (topic?: string) => void;
}

const EPISODE_THEMES = [
  'Tous les épisodes',
  'Ville & Quartier',
  'Artisan & Entreprise',
  'Patrimoine & Nature',
  'Culture & Tradition'
] as const;

const OFFICIAL_VALUES_FR = [
  'Excellence',
  'Authenticité',
  'Créativité',
  'Innovation',
  'Passion',
  'Respect des cultures',
  'Professionnalisme',
  'Transmission',
  'Fierté du patrimoine camerounais'
];

const OFFICIAL_VALUES_EN = [
  'Excellence',
  'Authenticity',
  'Creativity',
  'Innovation',
  'Passion',
  'Cultural Respect',
  'Professionalism',
  'Transmission',
  'Cameroonian Heritage Pride'
];

export const Page237Cinematique: React.FC<Page237CinematiqueProps> = ({
  data,
  onNavigate,
  onOpenLightbox,
  onOpenWhatsApp
}) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('Tous les épisodes');
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const { lang, t } = useThemeLanguage();

  const { brand, episodes } = data;

  const filteredEpisodes =
    selectedTheme === 'Tous les épisodes'
      ? episodes
      : episodes.filter((ep) => ep.theme === selectedTheme);

  const valuesList = lang === 'en' ? OFFICIAL_VALUES_EN : OFFICIAL_VALUES_FR;

  const handleInspectEpisode = (ep: EpisodeItem) => {
    onOpenLightbox({
      title: `${lang === 'en' && ep.numberEn ? ep.numberEn : ep.number} — ${
        lang === 'en' && ep.titleEn ? ep.titleEn : ep.title
      }`,
      subtitle: lang === 'en' && ep.subtitleEn ? ep.subtitleEn : ep.subtitle,
      category: `237 Cinématique · ${lang === 'en' && ep.themeEn ? ep.themeEn : ep.theme}`,
      mediaType: 'Épisode 237 Cinématique',
      imageUrl: ep.coverImage,
      videoUrl: ep.videoUrl,
      location: `${ep.city} (${ep.region})`,
      dateOrYear: `${ep.releaseDate} · ${ep.duration}`,
      description: lang === 'en' && ep.synopsisEn ? ep.synopsisEn : ep.synopsis,
      directorNote: lang === 'en' && ep.directorNoteEn ? ep.directorNoteEn : ep.directorNote
    });
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 pt-6 sm:pt-12 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
      {/* 1. HERO ÉDITORIAL 237 CINÉMATIQUE */}
      <RevealSection className="glass-panel-strong rounded-3xl p-5 sm:p-12 relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              <span>
                {t(
                  'PROJET ÉDITORIAL PHARE DE TOMY CREATOR',
                  'FLAGSHIP EDITORIAL PROJECT BY TOMY CREATOR'
                )}
              </span>
              <span aria-hidden="true">·</span>
              <span>+237</span>
              <span aria-hidden="true">·</span>
              <span>
                {t('DOCUMENTAIRE CINÉMATOGRAPHIQUE', 'CINEMATIC DOCUMENTARY')}
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-6xl font-bold text-[var(--text-primary)] tracking-tight">
                237 Cinématique
              </h1>
              <p className="text-xl sm:text-3xl font-semibold text-[var(--accent-primary)]">
                « {lang === 'en' ? brand.flagshipSloganEn : brand.flagshipSlogan} »
              </p>
            </div>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {t(
                'Le nom 237 Cinématique fait référence à l’indicatif téléphonique du Cameroun (+237) et au style cinématographique de toutes les productions. Sa devise : ',
                'The name 237 Cinématique refers to Cameroon’s telephone code (+237) and the cinematic craft of all productions. Its motto: '
              )}
              <em className="text-[var(--text-primary)] font-medium">
                {lang === 'en' ? brand.flagshipDeviseEn : brand.flagshipDevise}
              </em>
            </p>

            {/* Unboxed Values Line */}
            <div className="pt-2 border-t border-[var(--glass-border)]">
              <div className="text-xs text-[var(--accent-primary)] font-semibold mb-2">
                {t('VALEURS FONDATRICES', 'FOUNDING VALUES')}
              </div>
              <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-[var(--text-secondary)]">
                {valuesList.map((val, idx) => (
                  <React.Fragment key={val}>
                    <span className="text-[var(--text-primary)] hover:text-[var(--accent-primary)] transition-colors">
                      {val}
                    </span>
                    {idx < valuesList.length - 1 && (
                      <span aria-hidden="true" className="text-[var(--accent-primary)]">
                        ·
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (episodes[0]) handleInspectEpisode(episodes[0]);
                }}
                className="btn-cinema-glow px-5 py-3.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
              >
                <Play className="w-4 h-4" />
                <span>
                  {t(
                    'Lancer l’aperçu de l’Épisode 01',
                    'Watch Episode 01 Preview'
                  )}
                </span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowPdfPreview((prev) => !prev)}
                className="px-4 py-3.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>
                  {showPdfPreview
                    ? t('Masquer le document PDF', 'Hide PDF document')
                    : t('Consulter le PDF Historique officiel', 'Read Official History PDF')}
                </span>
              </motion.button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <TiltGlassCard
              intensity={5}
              className="cinema-stage-dark rounded-3xl overflow-hidden border border-[var(--glass-border)] bg-black relative aspect-[4/5] max-h-[440px] mx-auto"
            >
              <ResilientImage
                src="/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg"
                alt="237 Cinématique — Thomas Fotso"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 scrim-bottom" />
              <div className="absolute bottom-5 left-5 right-5 space-y-1.5 z-20">
                <div className="text-xs text-[#E51D2A] font-semibold">
                  {t('SIGNATURE OFFICIELLE', 'OFFICIAL SIGNATURE')}
                </div>
                <p className="text-lg sm:text-xl font-bold text-white">
                  {lang === 'en' ? brand.flagshipSignatureEn : brand.flagshipSignature}
                </p>
                <p className="text-xs text-white/80">
                  {t('Direction & Réalisation :', 'Directed by:')} {brand.directorName} ({brand.mainBrand})
                </p>
              </div>
            </TiltGlassCard>
          </div>
        </div>

        {/* Embedded PDF Viewer if toggled */}
        <AnimatePresence>
          {showPdfPreview && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-8 pt-8 border-t border-[var(--glass-border)] space-y-4 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)]">
                    {t(
                      'Document officiel : Historique de 237 Cinématique',
                      'Official Document: History of 237 Cinématique'
                    )}
                  </h3>
                </div>
                <a
                  href={brand.pdfHistoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent-primary)] hover:underline font-semibold"
                >
                  {t(
                    'Ouvrir le PDF dans un nouvel onglet',
                    'Open PDF in a new tab'
                  )}
                </a>
              </div>
              <div className="w-full h-[460px] rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black">
                <iframe
                  src={brand.pdfHistoryUrl}
                  title="Historique de 237 Cinématique PDF"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </RevealSection>

      {/* 2. HISTORIQUE, MISSION & VISION */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <RevealSection
          direction="left"
          className="lg:col-span-7 glass-panel card-hover-cinema rounded-3xl p-6 sm:p-8 space-y-6"
        >
          <div className="space-y-2">
            <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              {t('GENÈSE & AMBITION', 'GENESIS & AMBITION')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t('Les origines de 237 Cinématique', 'The origins of 237 Cinématique')}
            </h2>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            <p>
              {t(
                'Pendant des années, les contenus publiés sur les réseaux sociaux ont souvent montré le Cameroun de manière rapide, sans véritable narration ni recherche cinématographique. Pourtant, derrière chaque quartier, chaque village, chaque entreprise, chaque artisan et chaque personne se cache une histoire unique.',
                'For years, social media content often showed Cameroon quickly, without true storytelling or cinematic research. Yet behind every neighborhood, village, company, artisan, and person lies a unique story.'
              )}
            </p>
            <p className="text-[var(--text-primary)] font-medium">
              {lang === 'en' ? brand.directorLedNarrativeEn : brand.directorLedNarrative}
            </p>
          </div>
        </RevealSection>

        <RevealSection direction="right" delay={0.1} className="lg:col-span-5 space-y-4">
          {[
            {
              tag: '01 · MISSION',
              title: t('Valoriser le patrimoine vivant', 'Showcase living heritage'),
              desc: t(
                'Valoriser le Cameroun à travers des documentaires cinématographiques mettant en lumière les villes, villages, quartiers, entreprises, artisans, entrepreneurs, artistes, événements, traditions et paysages.',
                'Showcase Cameroon through cinematic documentaries highlighting its cities, villages, neighborhoods, businesses, artisans, entrepreneurs, artists, events, traditions, and landscapes.'
              )
            },
            {
              tag: '02 · VISION',
              title: t('Une référence documentaire africaine', 'An African documentary benchmark'),
              desc: t(
                'Devenir la référence du documentaire cinématographique au Cameroun et en Afrique.',
                'Become the benchmark for cinematic documentary filmmaking in Cameroon and across Africa.'
              )
            },
            {
              tag: '03 · PHILOSOPHIE',
              title: t('Chaque parcours mérite un film', 'Every journey deserves a film'),
              desc: t(
                'Chaque lieu a une âme. Chaque personne a une histoire. Chaque entreprise a un parcours. Chaque événement mérite d’être raconté comme un film.',
                'Every place has a soul. Every person has a story. Every company has a journey. Every event deserves to be told like a film.'
              )
            }
          ].map((card) => (
            <TiltGlassCard
              key={card.tag}
              intensity={4}
              className="glass-panel card-hover-cinema rounded-3xl p-6 space-y-2"
            >
              <div className="text-xs text-[var(--accent-primary)] font-semibold">
                {card.tag}
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">
                {card.title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {card.desc}
              </p>
            </TiltGlassCard>
          ))}
        </RevealSection>
      </section>

      {/* 3. CARTE INTERACTIVE DES LIEUX EXPLORÉS AU CAMEROUN */}
      <RevealSection className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
            <Compass className="w-4 h-4" />
            <span>{t('CARTOGRAPHIE DOCUMENTAIRE · +237', 'DOCUMENTARY MAP · +237')}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
            {t('Les lieux et régions explorés', 'Explored locations and regions')}
          </h2>
        </div>

        <CameroonInteractiveMap
          episodes={episodes}
          onSelectEpisode={handleInspectEpisode}
        />
      </RevealSection>

      {/* 4. CATALOGUE COMPLET DES ÉPISODES */}
      <section className="space-y-8">
        <RevealSection className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
              <Film className="w-4 h-4" />
              <span>{t('COLLECTION 237 CINÉMATIQUE', '237 CINÉMATIQUE COLLECTION')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t('Épisodes & Carnets de tournage', 'Episodes & Field Notes')}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-panel overflow-x-auto no-scrollbar max-w-full">
            {EPISODE_THEMES.map((theme) => (
              <button
                key={theme}
                type="button"
                onClick={() => setSelectedTheme(theme)}
                className={`px-3.5 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedTheme === theme
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {theme === 'Tous les épisodes'
                  ? t('Tous les épisodes', 'All Episodes')
                  : theme}
              </button>
            ))}
          </div>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEpisodes.map((ep, idx) => (
            <RevealSection key={ep.id} delay={idx * 0.08}>
              <TiltGlassCard
                intensity={4}
                onClick={() => handleInspectEpisode(ep)}
                className="glass-panel card-hover-cinema rounded-3xl overflow-hidden flex flex-col justify-between h-full cursor-pointer"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="cinema-stage-dark relative h-56 sm:h-64 overflow-hidden">
                      <ResilientImage
                        src={ep.coverImage}
                        alt={lang === 'en' && ep.titleEn ? ep.titleEn : ep.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 scrim-bottom" />
                      <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 text-xs text-[#E51D2A] font-semibold">
                            <span>
                              {lang === 'en' && ep.numberEn ? ep.numberEn : ep.number}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-white">
                              {lang === 'en' && ep.themeEn ? ep.themeEn : ep.theme}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="tabular-nums text-white/90">
                              {ep.duration}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-bold text-white mt-1 group-hover:text-[#E51D2A] transition-colors">
                            {lang === 'en' && ep.titleEn ? ep.titleEn : ep.title}
                          </h3>
                        </div>
                        <span className="px-4 py-2.5 rounded-full bg-[#E51D2A] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 shadow-lg">
                          <Play className="w-3.5 h-3.5" />
                          <span>{t('Visionner', 'Watch')}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-5 sm:p-6 space-y-3">
                      <p className="text-sm font-medium text-[var(--text-primary)]">
                        {lang === 'en' && ep.subtitleEn ? ep.subtitleEn : ep.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {lang === 'en' && ep.synopsisEn ? ep.synopsisEn : ep.synopsis}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] pt-2 border-t border-[var(--glass-border)]">
                        <strong className="text-[var(--accent-primary)]">
                          {t('Note de réalisation :', 'Director’s Note:')}
                        </strong>{' '}
                        {lang === 'en' && ep.directorNoteEn
                          ? ep.directorNoteEn
                          : ep.directorNote}
                      </p>
                    </div>
                  </div>

                  <div className="px-5 sm:px-6 py-4 bg-[var(--bg-elevated)]/60 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                      <span>
                        {ep.city} · {ep.region}
                      </span>
                    </span>
                    <span>
                      {t('Statut :', 'Status:')}{' '}
                      <strong className="text-[var(--text-primary)]">
                        {lang === 'en' && ep.statusEn ? ep.statusEn : ep.status}
                      </strong>
                    </span>
                  </div>
                </div>
              </TiltGlassCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* 5. APPEL À SUJETS */}
      <RevealSection className="glass-panel-strong card-hover-cinema rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs text-[var(--accent-primary)] font-semibold">
            {t(
              'PARTICIPER À L’AVENTURE 237 CINÉMATIQUE',
              'JOIN THE 237 CINÉMATIQUE JOURNEY'
            )}
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {t(
              'Votre ville, votre entreprise ou votre atelier a une histoire à raconter ?',
              'Does your city, company, or workshop have a story to tell?'
            )}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {t(
              'Proposez un lieu de tournage, un portrait d’artisan ou commandez un épisode documentaire dédié à votre organisation.',
              'Propose a shooting location, an artisan portrait, or commission a dedicated documentary episode for your organization.'
            )}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onNavigate('tournage')}
            className="btn-cinema-glow px-5 py-3 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <span>{t('Planifier un tournage', 'Schedule a shoot')}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() =>
              onOpenWhatsApp(
                t(
                  'Proposer un sujet ou un lieu pour 237 Cinématique',
                  'Propose a subject or location for 237 Cinématique'
                )
              )
            }
            className="px-5 py-3 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-[var(--accent-primary)]" />
            <span>{t('Écrire sur WhatsApp', 'Message on WhatsApp')}</span>
          </motion.button>
        </div>
      </RevealSection>
    </div>
  );
};
