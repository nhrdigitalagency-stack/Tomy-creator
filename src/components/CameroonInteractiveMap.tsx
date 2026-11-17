import React, { useState } from 'react';
import { EpisodeItem } from '../data/siteContent';
import { MapPin, Play, Compass } from 'lucide-react';
import { ResilientImage } from './ResilientImage';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface CameroonInteractiveMapProps {
  episodes: EpisodeItem[];
  onSelectEpisode: (ep: EpisodeItem) => void;
}

const CAMEROON_LANDMARKS = [
  { name: 'Maroua & Extrême-Nord', x: 58, y: 16, region: 'Extrême-Nord', note: 'Paysages du Sahel & chefferies' },
  { name: 'Garoua & Bénoué', x: 52, y: 31, region: 'Nord', note: 'Fleuve Bénoué & grands espaces' },
  { name: 'Ngaoundéré', x: 56, y: 47, region: 'Adamaoua', note: 'Château d’eau du Cameroun & hauts plateaux' },
  { name: 'Bamenda', x: 34, y: 59, region: 'Nord-Ouest', note: 'Collines verdoyantes & artisanat Grassfields' },
  { name: 'Bafoussam & Foumban', x: 38, y: 66, region: 'Ouest', note: 'Architecture royale, arts & traditions' },
  { name: 'Buea & Mont Cameroun', x: 24, y: 74, region: 'Sud-Ouest', note: 'Terres volcaniques & côte Atlantique' },
  { name: 'Douala', x: 31, y: 76, region: 'Littoral', note: 'Capitale économique, port & énergie urbaine' },
  { name: 'Yaoundé', x: 48, y: 76, region: 'Centre', note: 'Ville aux sept collines, stades & institutions' },
  { name: 'Bertoua', x: 70, y: 73, region: 'Est', note: 'Forêt équatoriale & biodiversité' },
  { name: 'Kribi & Chutes de la Lobé', x: 33, y: 88, region: 'Sud', note: 'Rencontre du fleuve et de l’océan' }
];

export const CameroonInteractiveMap: React.FC<CameroonInteractiveMapProps> = ({
  episodes,
  onSelectEpisode
}) => {
  const [selectedEpisodeId, setSelectedEpisodeId] = useState<string>(
    episodes[0]?.id || ''
  );
  const [hoveredLandmark, setHoveredLandmark] = useState<string | null>(null);
  const { lang, t } = useThemeLanguage();

  const activeEpisode =
    episodes.find((ep) => ep.id === selectedEpisodeId) || episodes[0];

  return (
    <div className="glass-panel rounded-3xl p-6 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Stylized SVG Map of Cameroon (+237) */}
        <div className="cinema-stage-dark lg:col-span-6 relative bg-[#080B10] rounded-3xl p-6 border border-white/15">
          <div className="flex items-center justify-between text-xs text-white/80 mb-4">
            <span className="flex items-center gap-1.5 text-[#E51D2A] font-semibold">
              <Compass className="w-4 h-4" />
              <span>
                {t(
                  'CARTE DES REPÉRAGES · INDICATIF +237',
                  'LOCATION SCOUTING MAP · +237'
                )}
              </span>
            </span>
            <span className="tabular-nums">
              {t('10 RÉGIONS À EXPLORER', '10 REGIONS TO EXPLORE')}
            </span>
          </div>

          <div className="relative w-full aspect-[4/5] max-h-[430px] mx-auto">
            <svg
              viewBox="0 0 100 110"
              className="w-full h-full drop-shadow-[0_12px_30px_rgba(229,29,42,0.18)]"
              role="img"
              aria-label={t(
                'Carte interactive des tournages et repérages au Cameroun',
                'Interactive map of shoots and locations in Cameroon'
              )}
            >
              <g stroke="rgba(255,255,255,0.06)" strokeWidth="0.3">
                <line x1="0" y1="25" x2="100" y2="25" />
                <line x1="0" y1="50" x2="100" y2="50" />
                <line x1="0" y1="75" x2="100" y2="75" />
                <line x1="25" y1="0" x2="25" y2="110" />
                <line x1="50" y1="0" x2="50" y2="110" />
                <line x1="75" y1="0" x2="75" y2="110" />
              </g>

              {/* Silhouette of Cameroon */}
              <path
                d="M 59 6 L 65 11 L 64 21 L 69 27 L 63 36 L 68 45 L 76 58 L 85 71 L 91 86 L 83 92 L 62 92 L 42 93 L 29 92 L 26 84 L 18 78 L 19 67 L 26 57 L 34 48 L 41 41 L 44 29 L 51 19 L 54 9 Z"
                fill="rgba(17, 24, 39, 0.92)"
                stroke="rgba(229, 29, 42, 0.55)"
                strokeWidth="0.9"
              />

              {/* Regional Landmarks */}
              {CAMEROON_LANDMARKS.map((lm) => (
                <g
                  key={lm.name}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredLandmark(`${lm.name} — ${lm.note}`)}
                  onMouseLeave={() => setHoveredLandmark(null)}
                >
                  <circle
                    cx={lm.x}
                    cy={lm.y}
                    r="1.3"
                    fill="rgba(248, 250, 252, 0.4)"
                  />
                  <text
                    x={lm.x + 2.2}
                    y={lm.y + 0.8}
                    fontSize="2.5"
                    fill="rgba(203, 213, 225, 0.75)"
                    className="select-none pointer-events-none"
                  >
                    {lm.region}
                  </text>
                </g>
              ))}

              {/* Active Episode Pins */}
              {episodes.map((ep) => {
                const isSelected = activeEpisode?.id === ep.id;
                return (
                  <g
                    key={ep.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedEpisodeId(ep.id)}
                  >
                    {isSelected && (
                      <circle
                        cx={ep.mapCoords.x}
                        cy={ep.mapCoords.y}
                        r="5.2"
                        fill="rgba(229, 29, 42, 0.28)"
                        stroke="#E51D2A"
                        strokeWidth="0.5"
                      />
                    )}
                    <circle
                      cx={ep.mapCoords.x}
                      cy={ep.mapCoords.y}
                      r={isSelected ? '2.8' : '2.1'}
                      fill={isSelected ? '#E51D2A' : '#F8FAFC'}
                      stroke="#080B10"
                      strokeWidth="0.7"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="mt-3 min-h-[24px] text-xs text-white/80 flex items-center justify-between border-t border-white/15 pt-3">
            <span>
              {hoveredLandmark
                ? hoveredLandmark
                : t(
                    'Sélectionnez un point rouge ou un épisode pour explorer le lieu',
                    'Select a red pin or an episode to explore the location'
                  )}
            </span>
          </div>
        </div>

        {/* Right: Episode & Location Inspector */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <p className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide mb-2">
              {t(
                'EXPLORATION GÉOGRAPHIQUE · 237 CINÉMATIQUE',
                'GEOGRAPHIC EXPLORATION · 237 CINÉMATIQUE'
              )}
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
              {t(
                'L’Afrique en miniature, racontée lieu par lieu',
                'Africa in miniature, told location by location'
              )}
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mt-2">
              {t(
                'Cliquez sur un épisode pour découvrir le lieu exploré, l’intention de réalisation et un aperçu visuel.',
                'Click an episode to discover the explored location, director’s note, and visual preview.'
              )}
            </p>
          </div>

          {/* Episode Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {episodes.map((ep) => {
              const isSelected = activeEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  type="button"
                  onClick={() => setSelectedEpisodeId(ep.id)}
                  className={`px-3 py-2.5 rounded-2xl text-left border transition-colors ${
                    isSelected
                      ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--text-primary)]'
                      : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <div className="text-xs font-semibold text-[var(--accent-primary)] tabular-nums">
                    {lang === 'en' && ep.numberEn ? ep.numberEn : ep.number}
                  </div>
                  <div className="text-xs truncate mt-0.5 font-medium text-[var(--text-primary)]">
                    {ep.city}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Location Card */}
          {activeEpisode && (
            <div className="rounded-3xl glass-panel overflow-hidden">
              <div className="cinema-stage-dark relative h-48 sm:h-56 overflow-hidden">
                <ResilientImage
                  src={activeEpisode.coverImage}
                  alt={
                    lang === 'en' && activeEpisode.titleEn
                      ? activeEpisode.titleEn
                      : activeEpisode.title
                  }
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 scrim-bottom" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[#E51D2A] font-semibold">
                      <span>
                        {lang === 'en' && activeEpisode.numberEn
                          ? activeEpisode.numberEn
                          : activeEpisode.number}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-white">{activeEpisode.city}</span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums text-white/90">
                        {activeEpisode.duration}
                      </span>
                    </div>
                    <h4 className="text-xl font-bold text-white mt-1">
                      {lang === 'en' && activeEpisode.titleEn
                        ? activeEpisode.titleEn
                        : activeEpisode.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectEpisode(activeEpisode)}
                    className="px-4 py-2 rounded-full bg-[#E51D2A] hover:bg-[#F42C39] text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{t('Aperçu', 'Preview')}</span>
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>{activeEpisode.region}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {lang === 'en' && activeEpisode.themeEn
                      ? activeEpisode.themeEn
                      : activeEpisode.theme}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-[var(--accent-primary)] font-semibold">
                    {lang === 'en' && activeEpisode.statusEn
                      ? activeEpisode.statusEn
                      : activeEpisode.status}
                  </span>
                </div>
                <p className="text-sm text-[var(--text-secondary)]">
                  {lang === 'en' && activeEpisode.synopsisEn
                    ? activeEpisode.synopsisEn
                    : activeEpisode.synopsis}
                </p>
                <p className="text-xs text-[var(--text-primary)]/90 pt-2 border-t border-[var(--glass-border)]">
                  <strong className="text-[var(--accent-primary)] font-semibold">
                    {t('Intention caméra : ', 'Camera Note: ')}
                  </strong>
                  {lang === 'en' && activeEpisode.directorNoteEn
                    ? activeEpisode.directorNoteEn
                    : activeEpisode.directorNote}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
