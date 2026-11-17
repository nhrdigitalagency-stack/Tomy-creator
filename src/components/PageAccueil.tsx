import React, { useState, useEffect } from 'react';
import {
  SiteData,
  DEFAULT_PARTNER_COMPANIES,
  PortfolioItem,
  EpisodeItem
} from '../data/siteContent';
import { PageRoute } from './Navbar';
import { ResilientImage } from './ResilientImage';
import { LightboxMediaPayload } from './MediaLightboxModal';
import { TestimonialsCarousel } from './TestimonialsCarousel';
import { FaqAccordion } from './FaqAccordion';
import {
  RevealSection,
  TiltGlassCard,
  CinematicRibbon
} from './CinemaMotion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  Play,
  ArrowRight,
  Camera,
  Film,
  MessageCircle,
  FileText,
  Eye,
  Calendar,
  Building2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail
} from 'lucide-react';

interface PageAccueilProps {
  data: SiteData;
  onNavigate: (page: PageRoute) => void;
  onOpenLightbox: (payload: LightboxMediaPayload) => void;
  onOpenWhatsApp: (topic?: string) => void;
  onRequestShootWithService: (serviceTitle: string) => void;
}

const HERO_STILLS = [
  {
    src: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
    objectPosition: 'object-[center_22%]',
    labelFr: 'Dispositif Trépied & Stade',
    labelEn: 'Tripod Rig & Stadium Arena',
    captionFr: 'Thomas Fotso — Tomy Creator · Installation caméra sur trépied vidéo dans l’arène du stade',
    captionEn: 'Thomas Fotso — Tomy Creator · Camera rig on fluid-head tripod inside the stadium arena'
  },
  {
    src: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
    objectPosition: 'object-[center_35%]',
    labelFr: 'Cadrage Terrain Stade',
    labelEn: 'Pitch-Level Stadium Framing',
    captionFr: 'Captation au ras du gazon en enceinte sportive · Crédit @ndzasso picture',
    captionEn: 'Grass-level sports cinematography in the stadium · Credit @ndzasso picture'
  },
  {
    src: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
    objectPosition: 'object-[center_25%]',
    labelFr: 'Coulisses & Stabilisation',
    labelEn: 'Behind the Scenes & Gimbals',
    captionFr: 'Direction de prise de vue mobile sur cardans 3 axes en intérieur',
    captionEn: 'Indoor mobile cinematography direction with dual 3-axis gimbals'
  },
  {
    src: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
    objectPosition: 'object-[center_18%]',
    labelFr: 'Portrait Éditorial N&B',
    labelEn: 'B&W Editorial Portrait',
    captionFr: 'Thomas Fotso — Tomy Creator · Direction artistique & optique téléobjectif',
    captionEn: 'Thomas Fotso — Tomy Creator · Art direction & telephoto lens'
  }
];

export const PageAccueil: React.FC<PageAccueilProps> = ({
  data,
  onNavigate,
  onOpenLightbox,
  onOpenWhatsApp,
  onRequestShootWithService
}) => {
  const [activeHeroStill, setActiveHeroStill] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const { lang, t } = useThemeLanguage();

  const { brand, episodes, portfolio, services, references, news, testimonials, faqs } = data;
  const partnerCompanies =
    data.partnerCompanies && data.partnerCompanies.length > 0
      ? data.partnerCompanies
      : DEFAULT_PARTNER_COMPANIES;

  // Automatic Background Slideshow with Ken Burns Zoom Effect
  useEffect(() => {
    if (isHeroPaused) return;
    const timer = window.setInterval(() => {
      setActiveHeroStill((prev) => (prev + 1) % HERO_STILLS.length);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [isHeroPaused]);

  const handleOpenPortfolioLightbox = (item: PortfolioItem) => {
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

  const handleOpenEpisodeLightbox = (ep: EpisodeItem) => {
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

  const repeatedPartners = [
    ...partnerCompanies,
    ...partnerCompanies,
    ...partnerCompanies
  ];

  const currentStill = HERO_STILLS[activeHeroStill];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24">
      {/* 1. FULL-BLEED IMMERSIVE HERO SECTION — Clear Zooming Background Slideshow + Red-Black Gradient Layer + Writings Above */}
      <section className="relative w-full">
        <div
          onMouseEnter={() => setIsHeroPaused(true)}
          onMouseLeave={() => setIsHeroPaused(false)}
          className="cinema-stage-dark relative w-full min-h-[86vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-[#06070A] border-b border-white/15"
        >
          {/* BACKGROUND SLIDESHOW WITH CONTINUOUS KEN BURNS ZOOM EFFECT & HIGH CLARITY */}
          <div className="absolute inset-0 overflow-hidden bg-[#06070A]">
            <AnimatePresence mode="sync">
              <motion.div
                key={currentStill.src}
                initial={{ opacity: 0, scale: 1.01 }}
                animate={{ opacity: 1, scale: 1.13 }}
                exit={{ opacity: 0, scale: 1.16 }}
                transition={{
                  opacity: { duration: 1.0, ease: 'easeInOut' },
                  scale: { duration: 6.0, ease: 'easeOut' }
                }}
                className="absolute inset-0 w-full h-full"
              >
                <ResilientImage
                  src={currentStill.src}
                  alt={lang === 'en' ? currentStill.captionEn : currentStill.captionFr}
                  className={`w-full h-full object-cover ${currentStill.objectPosition} brightness-[1.06] contrast-[1.04]`}
                />
              </motion.div>
            </AnimatePresence>

            {/* CALQUE DÉGRADÉ ROUGE NOIR CALIBRÉ (Laisse l'image parfaitement visible tout en détachant les écritures) */}
            <div
              aria-hidden="true"
              className="absolute inset-0 hero-red-black-overlay pointer-events-none"
            />
          </div>

          {/* TOP BAR OVERLAY INSIDE FULL-BLEED HERO */}
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 pt-5 sm:pt-7 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 bg-black/45 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15">
              <motion.img
                whileHover={{ scale: 1.08, rotate: -2 }}
                transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                src={brand.logoUrl}
                alt={`Logo ${brand.mainBrand}`}
                referrerPolicy="no-referrer"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-white/25 shadow-lg shrink-0"
              />
              <div className="space-y-0.5 min-w-0">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs sm:text-sm font-semibold tracking-wide">
                  <span className="text-white font-bold">
                    {brand.directorName} — {brand.mainBrand}
                  </span>
                  <span aria-hidden="true" className="text-[#E51D2A]">
                    ·
                  </span>
                  <span className="text-white/90">
                    {lang === 'en' ? brand.roleTitleEn : brand.roleTitle}
                  </span>
                </div>
                <div className="text-xs text-white/80 truncate">
                  {t('Créateur du projet éditorial phare', 'Creator of the flagship project')}{' '}
                  <strong className="text-white">{brand.flagshipProject}</strong> (+237)
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  const manifestVideo = portfolio.find((p) => p.mediaType === 'Vidéo');
                  if (manifestVideo) handleOpenPortfolioLightbox(manifestVideo);
                }}
                className="px-4 py-2.5 rounded-full bg-[#E51D2A] hover:bg-[#F42C39] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Showreel</span>
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() =>
                  onOpenLightbox({
                    title: lang === 'en' ? currentStill.labelEn : currentStill.labelFr,
                    category: 'Thomas Fotso — Tomy Creator',
                    mediaType: 'Photo',
                    imageUrl: currentStill.src,
                    location: 'Douala / Cameroun (+237)',
                    dateOrYear: '2025',
                    description:
                      lang === 'en' ? currentStill.captionEn : currentStill.captionFr
                  })
                }
                className="px-4 py-2.5 rounded-full bg-black/55 hover:bg-black/80 backdrop-blur-md border border-white/20 text-xs text-white hover:border-[#E51D2A] flex items-center gap-1.5 transition-colors"
              >
                <Eye className="w-3.5 h-3.5 text-[#E51D2A]" />
                <span>{t('Voir la photo entière', 'View Full Photo')}</span>
              </motion.button>
            </div>
          </div>

          {/* CENTER WRITINGS OVER THE RED-BLACK GRADIENT OVERLAY */}
          <div className="relative z-20 w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-10 sm:py-14 my-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-widest uppercase text-white">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E51D2A] animate-pulse" />
                  <span>
                    {t(
                      'RÉALISATION CINÉMATOGRAPHIQUE · DOUALA & CAMEROUN (+237)',
                      'CINEMATIC FILMMAKING · DOUALA & CAMEROON (+237)'
                    )}
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-[3.6rem] font-bold text-white leading-[1.1] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]">
                  {t(
                    'Façonner l’image comme un récit de cinéma, révéler l’âme du Cameroun.',
                    'Crafting images like a cinematic story, revealing the soul of Cameroon.'
                  )}
                </h1>

                <p className="text-sm sm:text-lg text-white/95 max-w-2xl leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
                  {lang === 'en' ? brand.directorBioShortEn : brand.directorBioShort}{' '}
                  {t('De la réalisation documentaire avec', 'From documentary filmmaking with')}{' '}
                  <strong className="text-white font-semibold underline decoration-[#E51D2A] underline-offset-4">
                    {brand.flagshipProject}
                  </strong>{' '}
                  {t(
                    'aux captations sportives, émissions médias et films d’entreprise, chaque cadre est pensé pour durer.',
                    'to sports coverage, TV shows, and corporate films, every frame is built to last.'
                  )}
                </p>

                {/* Primary & Secondary Actions */}
                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate('tournage')}
                    className="btn-cinema-glow px-6 py-4 rounded-full bg-[#E51D2A] hover:bg-[#F42C39] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0 shadow-xl group"
                  >
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span>
                      {t(
                        'Prendre RDV / Demander un tournage',
                        'Book an Appointment / Request a Shoot'
                      )}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onNavigate('237-cinematique')}
                    className="px-5 py-4 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-md border border-white/25 hover:border-[#E51D2A] text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-colors whitespace-nowrap shrink-0"
                  >
                    <Film className="w-4 h-4 text-[#E51D2A] shrink-0" />
                    <span>{t('Explorer 237 Cinématique', 'Explore 237 Cinématique')}</span>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ x: 4 }}
                    onClick={() =>
                      onOpenWhatsApp(
                        t(
                          'Prise de contact générale avec Thomas Fotso',
                          'General inquiry with Thomas Fotso'
                        )
                      )
                    }
                    className="px-4 py-3.5 rounded-full bg-black/45 hover:bg-black/70 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-white flex items-center justify-center gap-2 transition-colors whitespace-nowrap shrink-0"
                  >
                    <MessageCircle className="w-4 h-4 text-[#E51D2A] shrink-0" />
                    <span>{brand.whatsappDisplay}</span>
                  </motion.button>
                </div>
              </div>

              {/* Right Column inside Hero: Translucent 237 Cinématique Card (Compact so background photo shines) */}
              <div className="lg:col-span-5 flex flex-col items-end">
                <TiltGlassCard
                  intensity={5}
                  onClick={() => onNavigate('237-cinematique')}
                  className="w-full max-w-md rounded-3xl p-5 sm:p-6 bg-black/60 backdrop-blur-xl border border-white/20 cursor-pointer shadow-2xl"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-[#E51D2A] font-semibold">
                      <span>
                        {t('PROJET ÉDITORIAL PHARE', 'FLAGSHIP EDITORIAL PROJECT')} ·{' '}
                        {brand.flagshipProject.toUpperCase()}
                      </span>
                      <span className="tabular-nums text-white">+237</span>
                    </div>
                    <p className="text-lg sm:text-2xl font-bold text-white leading-snug">
                      « {lang === 'en' ? brand.flagshipSloganEn : brand.flagshipSlogan} »
                    </p>
                    <p className="text-xs sm:text-sm text-white/85 leading-relaxed">
                      {lang === 'en' ? brand.flagshipDeviseEn : brand.flagshipDevise} —{' '}
                      {lang === 'en' ? brand.flagshipSignatureEn : brand.flagshipSignature}
                    </p>
                    <div className="pt-2 border-t border-white/15 flex items-center justify-between text-xs font-semibold text-[#E51D2A]">
                      <span>
                        {t(
                          'Découvrir les épisodes & la carte +237',
                          'Discover episodes & +237 map'
                        )}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </TiltGlassCard>
              </div>
            </div>
          </div>

          {/* BOTTOM SLIDESHOW CONTROLS & THUMBNAIL STRIP */}
          <div className="relative z-20 w-full bg-black/60 backdrop-blur-md border-t border-white/15">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHeroStill(
                        (prev) => (prev - 1 + HERO_STILLS.length) % HERO_STILLS.length
                      )
                    }
                    aria-label={t('Image précédente', 'Previous image')}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#E51D2A] text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveHeroStill((prev) => (prev + 1) % HERO_STILLS.length)
                    }
                    aria-label={t('Image suivante', 'Next image')}
                    className="w-9 h-9 rounded-full bg-white/15 hover:bg-[#E51D2A] text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#E51D2A] tabular-nums">
                    0{activeHeroStill + 1} / 0{HERO_STILLS.length} ·{' '}
                    {lang === 'en' ? currentStill.labelEn : currentStill.labelFr}
                  </div>
                  <p className="text-xs text-white/90 truncate">
                    {lang === 'en' ? currentStill.captionEn : currentStill.captionFr}
                  </p>
                </div>
              </div>

              {/* 4 Stills Thumbnail Selector */}
              <div className="grid grid-cols-4 gap-2 sm:w-72 shrink-0">
                {HERO_STILLS.map((still, idx) => (
                  <motion.button
                    key={still.src}
                    type="button"
                    whileHover={{ y: -2, scale: 1.05 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setActiveHeroStill(idx)}
                    aria-label={lang === 'en' ? still.labelEn : still.labelFr}
                    className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                      activeHeroStill === idx
                        ? 'border-[#E51D2A] ring-2 ring-[#E51D2A] opacity-100 scale-105'
                        : 'border-white/25 opacity-65 hover:opacity-100'
                    }`}
                  >
                    <ResilientImage
                      src={still.src}
                      alt={lang === 'en' ? still.labelEn : still.labelFr}
                      className="w-full h-full object-cover"
                    />
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width Key Pillars Row Below Hero */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              tag: t('01 · SIGNATURE PRINCIPALE', '01 · MAIN SIGNATURE'),
              title: 'Tomy Creator',
              desc: t(
                'Direction artistique, cadrage et réalisation par Thomas Fotso à Douala & au Cameroun.',
                'Art direction, framing, and filmmaking by Thomas Fotso in Douala & Cameroon.'
              )
            },
            {
              tag: t('02 · PROJET ÉDITORIAL', '02 · EDITORIAL PROJECT'),
              title: '237 Cinématique',
              desc: t(
                'Documentaires dédiés aux villes, artisans, entreprises et paysages du Cameroun (+237).',
                'Documentaries dedicated to the cities, artisans, businesses, and landscapes of Cameroon (+237).'
              )
            },
            {
              tag: t('03 · DISPOSITIF HYBRIDE', '03 · HYBRID CAMERA RIG'),
              title: t('Optique & Stabilisation', 'Optics & Stabilization'),
              desc: t(
                'Boîtiers reflex Canon EOS, téléobjectifs terrain, trépieds fluides et cardans 3 axes.',
                'Canon EOS DSLR bodies, field telephoto lenses, fluid tripods, and 3-axis gimbals.'
              )
            },
            {
              tag: t('04 · CONTACT DIRECT', '04 · DIRECT CONTACT'),
              title: brand.whatsappDisplay,
              desc: t(
                `Réservation de créneaux RDV, repérages sur site et devis rapide (${brand.contactEmail}).`,
                `Appointment booking, on-site scouting, and fast quotes (${brand.contactEmail}).`
              )
            }
          ].map((pillar, idx) => (
            <RevealSection key={pillar.tag} delay={idx * 0.08}>
              <TiltGlassCard
                intensity={6}
                className="glass-panel card-hover-cinema rounded-3xl p-5 h-full"
              >
                <div className="text-xs text-[var(--accent-primary)] font-semibold mb-1">
                  {pillar.tag}
                </div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">
                  {pillar.title}
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  {pillar.desc}
                </p>
              </TiltGlassCard>
            </RevealSection>
          ))}
        </div>
      </section>

      {/* SECTION DÉFILANTE : ENTREPRISES AVEC LESQUELLES JE TRAVAILLE */}
      <RevealSection className="space-y-6">
        <div className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide uppercase">
              <Building2 className="w-4 h-4" />
              <span>{t('COLLABORATIONS & CONFIANCE', 'COLLABORATIONS & TRUST')}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              {t(
                'Entreprises avec lesquelles je travaille',
                'Companies & Brands I Work With'
              )}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md">
            {t(
              'Entreprises, maisons de création, marques beauté, acteurs du numérique et médias accompagnés en réalisation et production visuelle.',
              'Companies, fashion houses, beauty brands, digital leaders, and TV media supported in filmmaking and visual production.'
            )}
          </p>
        </div>

        {/* Continuous Scrolling Track of Partner Companies */}
        <div className="w-full overflow-hidden py-6 border-y border-[var(--glass-border)] bg-[var(--bg-elevated)]/70">
          <div className="marquee-partners-track flex items-center gap-5 px-4">
            {repeatedPartners.map((company, idx) => (
              <div
                key={`${company.id}-${idx}`}
                onClick={() =>
                  onOpenWhatsApp(
                    t(
                      `Demande d'information — Collaboration similaire à ${company.name}`,
                      `Inquiry — Collaboration similar to ${company.name}`
                    )
                  )
                }
                className="glass-panel card-hover-cinema rounded-3xl px-6 py-4 hover:border-[var(--accent-primary)] flex items-center gap-4 shrink-0 cursor-pointer group"
              >
                <div className="w-11 h-11 rounded-2xl bg-[var(--accent-primary)]/15 border border-[var(--accent-primary)]/40 flex items-center justify-center text-[var(--accent-primary)] font-bold text-sm shrink-0 group-hover:bg-[var(--accent-primary)] group-hover:text-white transition-colors">
                  TC
                </div>
                <div className="space-y-0.5">
                  <div className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                    {company.name}
                  </div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    {lang === 'en' ? company.sectorEn : company.sector}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* ANIMATED CINEMATIC MARQUEE RIBBON */}
      <CinematicRibbon
        items={
          lang === 'en'
            ? [
                'TOMY CREATOR',
                'THOMAS FOTSO',
                '237 CINÉMATIQUE',
                'DOCUMENTARY FILMMAKING',
                'SPORTS & STADIUM COVERAGE',
                'CORPORATE & BRAND FILMS',
                'DOUALA · CAMEROON (+237)'
              ]
            : undefined
        }
      />

      {/* 2. THOMAS FOTSO & SON UNIVERS */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <RevealSection
            direction="left"
            className="lg:col-span-5 grid grid-cols-2 gap-3.5 sm:gap-4"
          >
            <div className="space-y-3.5 sm:space-y-4">
              <div className="rounded-3xl overflow-hidden border border-[var(--glass-border)] aspect-[3/4] group">
                <ResilientImage
                  src="/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg"
                  alt="Thomas Fotso — Portrait noir et blanc"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              <div className="glass-panel card-hover-cinema rounded-2xl p-4 text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)] font-semibold block mb-1">
                  {t('Rigueur du cadre', 'Framing Precision')}
                </span>
                {t(
                  'Dialogue entre composition géométrique et sensibilité humaine.',
                  'Dialogue between geometric composition and human sensitivity.'
                )}
              </div>
            </div>
            <div className="space-y-3.5 sm:space-y-4 pt-6">
              <div className="glass-panel card-hover-cinema rounded-2xl p-4 text-xs text-[var(--text-secondary)]">
                <span className="text-[var(--accent-primary)] font-semibold block mb-1">
                  {t('Présence terrain', 'Field Presence')}
                </span>
                {t(
                  'Du ras de la pelouse aux plateaux intérieurs stabilisés.',
                  'From stadium pitch level to stabilized indoor sets.'
                )}
              </div>
              <div className="rounded-3xl overflow-hidden border border-[var(--glass-border)] aspect-[3/4] group">
                <ResilientImage
                  src="/assets/aistudio/IMG_8868.JPG_42386957.jpeg"
                  alt="Thomas Fotso en captation sportive au stade"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            </div>
          </RevealSection>

          <RevealSection
            direction="right"
            delay={0.1}
            className="lg:col-span-7 space-y-6"
          >
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              <Camera className="w-4 h-4" />
              <span>
                {t(
                  'L’UNIVERS DU RÉALISATEUR · THOMAS FOTSO',
                  'THE DIRECTOR’S UNIVERSE · THOMAS FOTSO'
                )}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--text-primary)] leading-tight">
              {t(
                'Donner à chaque sujet la noblesse d’une mise en scène cinématographique',
                'Giving every subject the nobility of cinematic staging'
              )}
            </h2>

            <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
              {lang === 'en' ? brand.directorBioLongEn : brand.directorBioLong}
            </p>

            <TiltGlassCard
              intensity={4}
              className="glass-panel card-hover-cinema rounded-3xl p-6"
            >
              <div className="space-y-3">
                <div className="text-xs text-[var(--accent-primary)] font-semibold">
                  {t('PHILOSOPHIE DE RÉALISATION', 'DIRECTING PHILOSOPHY')}
                </div>
                <blockquote className="text-base sm:text-xl font-medium text-[var(--text-primary)]">
                  « {lang === 'en' ? brand.directorVisionQuoteEn : brand.directorVisionQuote} »
                </blockquote>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] pt-2 border-t border-[var(--glass-border)]">
                  {lang === 'en' ? brand.directorLedNarrativeEn : brand.directorLedNarrative}
                </p>
              </div>
            </TiltGlassCard>

            {/* Direct Contact Strip */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href={`https://wa.me/${brand.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{brand.whatsappDisplay}</span>
              </a>
              <a
                href={`mailto:${brand.contactEmail}`}
                className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-primary)] flex items-center gap-2 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>{brand.contactEmail}</span>
              </a>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 3. FOCUS 237 CINÉMATIQUE */}
      <RevealSection className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
        <div className="glass-panel-strong rounded-3xl p-5 sm:p-10 lg:p-12 space-y-10 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[var(--glass-border)] pb-8">
            <div className="space-y-3 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
                <span>{t('PROJET ÉDITORIAL PHARE', 'FLAGSHIP EDITORIAL PROJECT')}</span>
                <span aria-hidden="true">·</span>
                <span>{t('DOCUMENTAIRE & PATRIMOINE', 'DOCUMENTARY & HERITAGE')}</span>
                <span aria-hidden="true">·</span>
                <span>+237</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
                237 Cinématique
              </h2>
              <p className="text-lg sm:text-xl font-medium text-[var(--accent-primary)]">
                « {lang === 'en' ? brand.flagshipSloganEn : brand.flagshipSlogan} »
              </p>
              <p className="text-sm sm:text-base text-[var(--text-secondary)]">
                {t(
                  'Valoriser le Cameroun à travers des documentaires cinématographiques mettant en lumière les villes, villages, quartiers, entreprises, artisans, entrepreneurs, artistes, événements, traditions et paysages.',
                  'Showcasing Cameroon through cinematic documentaries highlighting its cities, villages, neighborhoods, businesses, artisans, entrepreneurs, artists, events, traditions, and landscapes.'
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href={brand.pdfHistoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
                <span>{t('Document historique (PDF)', 'Historical Document (PDF)')}</span>
              </a>
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => onNavigate('237-cinematique')}
                className="btn-cinema-glow px-5 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors group"
              >
                <span>
                  {t('Page dédiée & Carte des lieux', 'Dedicated Page & Locations Map')}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </div>

          {/* Episodes Preview Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {episodes.map((ep, idx) => (
              <RevealSection key={ep.id} delay={idx * 0.08}>
                <TiltGlassCard
                  intensity={6}
                  onClick={() => handleOpenEpisodeLightbox(ep)}
                  className="glass-panel rounded-3xl overflow-hidden flex flex-col justify-between h-full cursor-pointer card-hover-cinema"
                >
                  <div className="flex flex-col h-full justify-between">
                    <div>
                      <div className="cinema-stage-dark relative h-44 overflow-hidden">
                        <ResilientImage
                          src={ep.coverImage}
                          alt={lang === 'en' && ep.titleEn ? ep.titleEn : ep.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 scrim-bottom" />
                        <span className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[var(--accent-primary)] text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                          <Play className="w-4 h-4 ml-0.5" />
                        </span>
                        <div className="absolute bottom-3 left-3 text-xs text-white font-semibold">
                          {lang === 'en' && ep.numberEn ? ep.numberEn : ep.number} · {ep.city}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                          <span>{lang === 'en' && ep.themeEn ? ep.themeEn : ep.theme}</span>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{ep.duration}</span>
                        </div>
                        <h3 className="text-base font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                          {lang === 'en' && ep.titleEn ? ep.titleEn : ep.title}
                        </h3>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-3">
                          {lang === 'en' && ep.synopsisEn ? ep.synopsisEn : ep.synopsis}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 pb-4 pt-2 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                      <span className="text-[var(--accent-primary)] font-semibold">
                        {lang === 'en' && ep.statusEn ? ep.statusEn : ep.status}
                      </span>
                      <span className="text-[var(--text-secondary)]">{ep.region}</span>
                    </div>
                  </div>
                </TiltGlassCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </RevealSection>

      {/* 4. PORTFOLIO VIDÉO & PHOTO (BENTO SHOWCASE WITH 3D HOVER) */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-8">
        <RevealSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              {t(
                'PORTFOLIO SÉLECTIF · PHOTO & VIDÉO',
                'SELECTED PORTFOLIO · PHOTO & VIDEO'
              )}
            </div>
            <h2 className="text-2xl sm:text-4xl font-semibold text-[var(--text-primary)]">
              {t(
                'L’exigence du terrain, du portrait à l’arène sportive',
                'Field excellence, from editorial portraits to the stadium arena'
              )}
            </h2>
          </div>
          <motion.button
            type="button"
            whileHover={{ x: 4 }}
            onClick={() => onNavigate('portfolio')}
            className="text-sm font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-2 shrink-0"
          >
            <span>
              {t('Voir tout le portfolio & filtrer', 'View full portfolio & filter')}
            </span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {portfolio.slice(0, 4).map((item, index) => {
            const spanClass =
              index === 0 || index === 3 ? 'md:col-span-7' : 'md:col-span-5';
            return (
              <RevealSection
                key={item.id}
                delay={index * 0.08}
                className={spanClass}
              >
                <TiltGlassCard
                  intensity={4}
                  onClick={() => handleOpenPortfolioLightbox(item)}
                  className="cinema-stage-dark rounded-3xl overflow-hidden border border-[var(--glass-border)] bg-[#06070A] min-h-[320px] sm:min-h-[400px] flex flex-col justify-end cursor-pointer card-hover-cinema"
                >
                  <div className="absolute inset-0">
                    <ResilientImage
                      src={item.imageUrl}
                      alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 scrim-bottom" />
                  </div>

                  <div className="relative z-10 p-5 sm:p-6 mt-auto pt-36 space-y-2">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#E51D2A] font-semibold">
                      <span>
                        {lang === 'en' && item.categoryEn ? item.categoryEn : item.category}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white">{item.mediaType}</span>
                      {item.creditNote && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-white/80">{item.creditNote}</span>
                        </>
                      )}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white group-hover:text-[#E51D2A] transition-colors">
                      {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-white/85 line-clamp-2 max-w-xl">
                      {lang === 'en' && item.descriptionEn
                        ? item.descriptionEn
                        : item.description}
                    </p>
                  </div>
                </TiltGlassCard>
              </RevealSection>
            );
          })}
        </div>
      </section>

      {/* 5. CARROUSEL GLASS DES TÉMOIGNAGES CLIENTS & PARTENAIRES */}
      <RevealSection>
        <TestimonialsCarousel testimonials={testimonials} />
      </RevealSection>

      {/* 6. PRESTATIONS & RÉFÉRENCES CONTEXTUALISÉES */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Prestations Column */}
          <RevealSection direction="left" className="lg:col-span-7 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div className="space-y-2">
                <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
                  {t('PRESTATIONS SUR MESURE', 'BESPOKE SERVICES')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                  {t(
                    'Accompagner votre image avec une écriture de réalisateur',
                    'Elevating your image with a director’s storytelling'
                  )}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('prestations')}
                className="text-xs font-semibold text-[var(--accent-primary)] hover:underline shrink-0 self-start sm:self-end"
              >
                {t('Voir la FAQ & Tarifs', 'View FAQ & Rates')}
              </button>
            </div>

            <div className="space-y-4">
              {services.map((srv) => (
                <TiltGlassCard
                  key={srv.id}
                  intensity={3}
                  className="glass-panel card-hover-cinema rounded-3xl p-5 sm:p-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="text-xs text-[var(--accent-primary)] tabular-nums font-semibold">
                        {srv.index}.{' '}
                        {lang === 'en' && srv.targetAudienceEn
                          ? srv.targetAudienceEn
                          : srv.targetAudience}
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]">
                        {lang === 'en' && srv.titleEn ? srv.titleEn : srv.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                        {lang === 'en' && srv.subtitleEn ? srv.subtitleEn : srv.subtitle}
                      </p>
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() =>
                        onRequestShootWithService(
                          lang === 'en' && srv.titleEn ? srv.titleEn : srv.title
                        )
                      }
                      className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-xs font-semibold text-white transition-colors shrink-0 self-start sm:self-center shadow-md"
                    >
                      {t('Prendre RDV / Devis', 'Book Call / Quote')}
                    </motion.button>
                  </div>
                </TiltGlassCard>
              ))}
            </div>
          </RevealSection>

          {/* Contextualized References Column */}
          <RevealSection
            direction="right"
            delay={0.1}
            className="lg:col-span-5 space-y-6"
          >
            <div className="space-y-2">
              <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
                {t('RÉFÉRENCES & COLLABORATIONS', 'REFERENCES & COLLABORATIONS')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
                {t('Expérience terrain & partenaires', 'Field experience & partners')}
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                {t(
                  'Chaque prise de vue et collaboration est présentée dans son cadre réel d’intervention.',
                  'Every shoot and collaboration is presented in its authentic production context.'
                )}
              </p>
            </div>

            <div className="space-y-4">
              {references.map((ref) => (
                <div
                  key={ref.id}
                  className="p-5 rounded-3xl glass-panel card-hover-cinema space-y-2"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-medium">
                    <span>
                      {lang === 'en' && ref.contextTypeEn
                        ? ref.contextTypeEn
                        : ref.contextType}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{ref.locationAndYear}</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                    {lang === 'en' && ref.titleEn ? ref.titleEn : ref.title}
                  </h3>
                  <p className="text-xs text-[var(--text-primary)]/90 font-medium">
                    {t('Rôle :', 'Role:')}{' '}
                    {lang === 'en' && ref.rolePlayedEn ? ref.rolePlayedEn : ref.rolePlayed}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    {lang === 'en' && ref.factualDescriptionEn
                      ? ref.factualDescriptionEn
                      : ref.factualDescription}
                  </p>
                  {ref.creditMention && (
                    <p className="text-xs text-[var(--text-secondary)]/80 italic">
                      {ref.creditMention}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </RevealSection>
        </div>
      </section>

      {/* 7. FAQ INTERACTIVE EN ACCORDÉON */}
      <RevealSection>
        <FaqAccordion
          faqs={faqs}
          onNavigate={onNavigate}
          onOpenWhatsApp={onOpenWhatsApp}
        />
      </RevealSection>

      {/* 8. ACTUALITÉS RÉCENTES */}
      <section className="px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto space-y-8">
        <RevealSection className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              {t('JOURNAL DE PRODUCTION & ACTUALITÉS', 'PRODUCTION JOURNAL & NEWS')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">
              {t('Les dernières notes de tournage', 'Latest production notes')}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('actualites')}
            className="text-sm font-semibold text-[var(--accent-primary)] hover:underline flex items-center gap-2"
          >
            <span>{t('Lire toutes les actualités', 'Read all news')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item, idx) => (
            <RevealSection key={item.id} delay={idx * 0.08}>
              <TiltGlassCard
                intensity={5}
                onClick={() => onNavigate('actualites')}
                className="glass-panel card-hover-cinema rounded-3xl overflow-hidden flex flex-col justify-between h-full cursor-pointer"
              >
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="h-48 overflow-hidden relative">
                      <ResilientImage
                        src={item.imageUrl}
                        alt={lang === 'en' && item.titleEn ? item.titleEn : item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 scrim-bottom" />
                    </div>
                    <div className="p-5 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-medium">
                        <span>
                          {lang === 'en' && item.categoryEn ? item.categoryEn : item.category}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          {lang === 'en' && item.readTimeEn ? item.readTimeEn : item.readTime}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                        {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] line-clamp-3">
                        {lang === 'en' && item.excerptEn ? item.excerptEn : item.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs">
                    <span className="text-[var(--text-secondary)]">
                      {lang === 'en' && item.dateEn ? item.dateEn : item.date}
                    </span>
                    <span className="text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                      <span>{t('Lire l’article', 'Read article')}</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </TiltGlassCard>
            </RevealSection>
          ))}
        </div>
      </section>
    </div>
  );
};
