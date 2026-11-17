import React, { useEffect, useState } from 'react';
import {
  X,
  Play,
  Pause,
  Camera,
  MapPin,
  Film,
  ArrowUpRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export interface LightboxMediaPayload {
  title: string;
  subtitle?: string;
  category: string;
  mediaType: 'Photo' | 'Vidéo' | 'Épisode 237 Cinématique';
  imageUrl: string;
  videoUrl?: string;
  location: string;
  dateOrYear: string;
  cameraGear?: string;
  role?: string;
  creditNote?: string;
  description: string;
  directorNote?: string;
  isProvisional?: boolean;
}

interface MediaLightboxModalProps {
  media: LightboxMediaPayload | null;
  onClose: () => void;
  onRequestSimilarShoot: (referenceTitle: string) => void;
}

const STORYBOARD_FRAMES = [
  {
    src: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
    captionFr: 'Plan 01 — Regard & Géométrie : L’affirmation du cadre éditorial',
    captionEn: 'Shot 01 — Gaze & Geometry: Editorial framing precision'
  },
  {
    src: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
    captionFr: 'Plan 02 — Immersion Terrain : Contre-plongée au ras de la pelouse',
    captionEn: 'Shot 02 — Field Immersion: Low-angle pitch-level framing'
  },
  {
    src: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
    captionFr: 'Plan 03 — Mouvement Stabilisé : Chorégraphie à deux caméras',
    captionEn: 'Shot 03 — Stabilized Motion: Dual-gimbal camera choreography'
  },
  {
    src: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
    captionFr: 'Plan 04 — Perspective Monumentale : L’échelle des infrastructures',
    captionEn: 'Shot 04 — Monumental Perspective: The scale of stadiums'
  }
];

function getYoutubeEmbedUrl(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0`;
  }
  return null;
}

export const MediaLightboxModal: React.FC<MediaLightboxModalProps> = ({
  media,
  onClose,
  onRequestSimilarShoot
}) => {
  const [zoomed, setZoomed] = useState(false);
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);
  const [frameIndex, setFrameIndex] = useState(0);
  const { lang, t } = useThemeLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    setZoomed(false);
    setIsPlayingTeaser(false);
    setFrameIndex(0);
  }, [media]);

  useEffect(() => {
    if (!isPlayingTeaser) return;
    const interval = window.setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % STORYBOARD_FRAMES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, [isPlayingTeaser]);

  if (!media) return null;

  const isVideoMode =
    media.mediaType === 'Vidéo' || media.mediaType === 'Épisode 237 Cinématique';
  const youtubeEmbed = media.videoUrl ? getYoutubeEmbedUrl(media.videoUrl) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
    >
      <div className="relative w-full max-w-5xl glass-panel-strong rounded-3xl overflow-hidden max-h-[92vh] flex flex-col lg:flex-row">
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label={t('Fermer la visionneuse', 'Close viewer')}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/80 text-white hover:text-[var(--accent-primary)] border border-white/15 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left / Top: Visual Stage */}
        <div className="cinema-stage-dark lg:w-3/5 bg-[#05070A] relative flex flex-col justify-center min-h-[300px] sm:min-h-[440px] overflow-hidden">
          {isVideoMode && media.videoUrl ? (
            youtubeEmbed ? (
              <iframe
                src={youtubeEmbed}
                title={media.title}
                className="w-full h-full min-h-[360px] aspect-video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={media.videoUrl}
                controls
                autoPlay
                className="w-full h-full max-h-[75vh] object-contain"
              />
            )
          ) : isVideoMode ? (
            /* Interactive Cinematic Storyboard / Teaser */
            <div className="relative w-full h-full min-h-[360px] sm:min-h-[460px] flex flex-col justify-between">
              <div className="absolute inset-0 overflow-hidden">
                <ResilientImage
                  src={
                    isPlayingTeaser
                      ? STORYBOARD_FRAMES[frameIndex].src
                      : media.imageUrl
                  }
                  alt={media.title}
                  className={`w-full h-full object-cover transition-transform duration-700 ${
                    isPlayingTeaser ? 'scale-105' : 'scale-100'
                  }`}
                />
                <div className="absolute inset-0 scrim-bottom" />
              </div>

              {/* Top Letterbox Info */}
              <div className="relative z-10 p-5 flex items-center justify-between text-xs text-white/85">
                <span>
                  237 CINÉMATIQUE · {t('SÉQUENÇAGE VISUEL', 'VISUAL STORYBOARD')}
                </span>
                <span className="tabular-nums">
                  {isPlayingTeaser
                    ? `0${frameIndex + 1} / 04`
                    : t('APERÇU INTERACTIF', 'INTERACTIVE PREVIEW')}
                </span>
              </div>

              {/* Center Play Control */}
              <div className="relative z-10 flex flex-col items-center justify-center px-6 text-center my-auto">
                <button
                  type="button"
                  onClick={() => setIsPlayingTeaser((prev) => !prev)}
                  className="w-16 h-16 rounded-full bg-[var(--accent-primary)] text-white hover:bg-[var(--accent-hover)] flex items-center justify-center transition-transform hover:scale-105 shadow-xl"
                  aria-label={
                    isPlayingTeaser
                      ? t('Mettre en pause', 'Pause')
                      : t('Lancer l’aperçu', 'Play preview')
                  }
                >
                  {isPlayingTeaser ? (
                    <Pause className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6 ml-0.5" />
                  )}
                </button>
                <p className="mt-3 text-xs sm:text-sm text-white font-medium max-w-md">
                  {isPlayingTeaser
                    ? lang === 'en'
                      ? STORYBOARD_FRAMES[frameIndex].captionEn
                      : STORYBOARD_FRAMES[frameIndex].captionFr
                    : t(
                        'Lancer la séquence visuelle commentée',
                        'Play narrated visual sequence'
                      )}
                </p>
              </div>

              {/* Bottom Storyboard Strip */}
              <div className="relative z-10 p-4 bg-black/80 border-t border-white/10">
                <div className="grid grid-cols-4 gap-2">
                  {STORYBOARD_FRAMES.map((frame, idx) => (
                    <button
                      key={frame.src}
                      type="button"
                      onClick={() => {
                        setFrameIndex(idx);
                        setIsPlayingTeaser(true);
                      }}
                      className={`relative h-12 rounded-xl overflow-hidden border transition-all ${
                        frameIndex === idx && isPlayingTeaser
                          ? 'border-[var(--accent-primary)] opacity-100'
                          : 'border-white/15 opacity-60 hover:opacity-90'
                      }`}
                    >
                      <ResilientImage
                        src={frame.src}
                        alt={lang === 'en' ? frame.captionEn : frame.captionFr}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* High-Resolution Photography Viewer */
            <div className="relative w-full h-full flex items-center justify-center overflow-auto p-2 sm:p-4">
              <ResilientImage
                src={media.imageUrl}
                alt={media.title}
                className={`transition-transform duration-300 rounded-2xl ${
                  zoomed
                    ? 'scale-125 cursor-zoom-out max-h-none'
                    : 'max-h-[75vh] w-auto object-contain cursor-zoom-in'
                }`}
              />
              <button
                type="button"
                onClick={() => setZoomed((prev) => !prev)}
                className="absolute bottom-4 left-4 z-10 px-3.5 py-2 rounded-full bg-black/80 text-xs text-white hover:text-[var(--accent-primary)] border border-white/15 flex items-center gap-2 transition-colors"
              >
                {zoomed ? (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    <span>{t('Ajuster à l’écran', 'Fit to screen')}</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    <span>{t('Agrandir le cliché', 'Zoom photo')}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right / Bottom: Editorial & Technical Details */}
        <div className="lg:w-2/5 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6 bg-[var(--bg-surface)]">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold">
              <span>{media.category}</span>
              <span aria-hidden="true">·</span>
              <span>{media.mediaType}</span>
            </div>

            <h3
              id="lightbox-title"
              className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] leading-snug"
            >
              {media.title}
            </h3>

            {media.subtitle && (
              <p className="text-sm text-[var(--text-primary)]/90 font-medium">
                {media.subtitle}
              </p>
            )}

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {media.description}
            </p>

            {media.directorNote && (
              <div className="p-4 rounded-2xl glass-panel space-y-1">
                <p className="text-xs font-semibold text-[var(--accent-primary)]">
                  {t('Note d’intention & Cadrage', 'Director’s Note & Framing')}
                </p>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {media.directorNote}
                </p>
              </div>
            )}

            {/* Technical Metadata List */}
            <dl className="pt-4 border-t border-[var(--glass-border)] space-y-2.5 text-xs sm:text-sm">
              <div className="flex items-start justify-between gap-4">
                <dt className="text-[var(--text-secondary)] flex items-center gap-1.5 shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>{t('Lieu & Période', 'Location & Date')}</span>
                </dt>
                <dd className="text-[var(--text-primary)] text-right tabular-nums font-medium">
                  {media.location} · {media.dateOrYear}
                </dd>
              </div>

              {media.cameraGear && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[var(--text-secondary)] flex items-center gap-1.5 shrink-0">
                    <Camera className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>{t('Dispositif', 'Camera Gear')}</span>
                  </dt>
                  <dd className="text-[var(--text-primary)] text-right">
                    {media.cameraGear}
                  </dd>
                </div>
              )}

              {media.role && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-[var(--text-secondary)] flex items-center gap-1.5 shrink-0">
                    <Film className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>{t('Rôle', 'Role')}</span>
                  </dt>
                  <dd className="text-[var(--text-primary)] text-right">
                    {media.role}
                  </dd>
                </div>
              )}

              {media.creditNote && (
                <div className="pt-1 text-xs text-[var(--text-secondary)] italic">
                  {media.creditNote}
                </div>
              )}
            </dl>
          </div>

          <div className="pt-4 border-t border-[var(--glass-border)]">
            <button
              type="button"
              onClick={() => {
                onClose();
                onRequestSimilarShoot(media.title);
              }}
              className="w-full py-3.5 px-4 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>
                {t('Demander un tournage similaire', 'Request a similar shoot')}
              </span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
