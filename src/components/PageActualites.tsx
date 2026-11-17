import React, { useState } from 'react';
import { SiteData } from '../data/siteContent';
import { ResilientImage } from './ResilientImage';
import { PageRoute } from './Navbar';
import { FileText, ArrowRight, BookOpen } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface PageActualitesProps {
  data: SiteData;
  onNavigate: (page: PageRoute) => void;
}

export const PageActualites: React.FC<PageActualitesProps> = ({
  data,
  onNavigate
}) => {
  const { news, brand } = data;
  const [activeNewsId, setActiveNewsId] = useState<string>(news[0]?.id || '');
  const { lang, t } = useThemeLanguage();

  const activeArticle = news.find((n) => n.id === activeNewsId) || news[0];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 pt-8 sm:pt-12 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
      {/* Header */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
            <span>
              {t(
                'ACTUALITÉS & CARNET DE PRODUCTION',
                'NEWS & PRODUCTION JOURNAL'
              )}
            </span>
            <span aria-hidden="true">·</span>
            <span>TOMY CREATOR & 237 CINÉMATIQUE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
            {t(
              'Coulisses, annonces et réflexions sur l’image',
              'Behind the scenes, announcements, and visual insights'
            )}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)]">
            {t(
              'Suivez l’évolution du projet 237 Cinématique, les carnets de terrain de Thomas Fotso et les actualités de production à Douala et au Cameroun.',
              'Follow the evolution of 237 Cinématique, Thomas Fotso’s field notes, and production news in Douala and Cameroon.'
            )}
          </p>
        </div>

        <a
          href={brand.pdfHistoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-3 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center gap-2 self-start transition-colors"
        >
          <FileText className="w-4 h-4 text-[var(--accent-primary)]" />
          <span>
            {t(
              'Télécharger le dossier Historique 237 Cinématique (PDF)',
              'Download 237 Cinématique History (PDF)'
            )}
          </span>
        </a>
      </section>

      {/* Main Reader Split */}
      {activeArticle && (
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Article Viewer */}
          <article className="lg:col-span-8 glass-panel-strong rounded-3xl overflow-hidden">
            <div className="cinema-stage-dark relative h-72 sm:h-96 overflow-hidden">
              <ResilientImage
                src={activeArticle.imageUrl}
                alt={
                  lang === 'en' && activeArticle.titleEn
                    ? activeArticle.titleEn
                    : activeArticle.title
                }
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 scrim-bottom" />
              <div className="absolute bottom-6 left-6 right-6 space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#E51D2A] font-semibold">
                  <span>
                    {lang === 'en' && activeArticle.categoryEn
                      ? activeArticle.categoryEn
                      : activeArticle.category}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white">
                    {lang === 'en' && activeArticle.dateEn
                      ? activeArticle.dateEn
                      : activeArticle.date}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/90">
                    {lang === 'en' && activeArticle.readTimeEn
                      ? activeArticle.readTimeEn
                      : activeArticle.readTime}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-white leading-tight">
                  {lang === 'en' && activeArticle.titleEn
                    ? activeArticle.titleEn
                    : activeArticle.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-10 space-y-5">
              <p className="text-base sm:text-lg text-[var(--text-primary)] font-medium leading-relaxed">
                {lang === 'en' && activeArticle.excerptEn
                  ? activeArticle.excerptEn
                  : activeArticle.excerpt}
              </p>

              <div className="space-y-4 pt-4 border-t border-[var(--glass-border)] text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
                {(lang === 'en' && activeArticle.contentEn
                  ? activeArticle.contentEn
                  : activeArticle.content
                ).map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <div className="pt-6 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-[var(--text-secondary)]">
                  {t('Rédaction :', 'Written by:')}{' '}
                  <strong className="text-[var(--text-primary)]">
                    {brand.directorName} ({brand.mainBrand})
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('tournage')}
                  className="px-5 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
                >
                  <span>{t('Discuter d’un projet', 'Discuss a project')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>

          {/* Article List Sidebar */}
          <aside className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold px-1">
              <BookOpen className="w-4 h-4" />
              <span>
                {t('TOUS LES ARTICLES', 'ALL ARTICLES')} ({news.length})
              </span>
            </div>

            {news.map((item) => {
              const isSelected = item.id === activeArticle.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveNewsId(item.id)}
                  className={`w-full text-left p-5 rounded-3xl border transition-all space-y-2 ${
                    isSelected
                      ? 'glass-panel-strong border-[var(--accent-primary)] ring-1 ring-[var(--accent-primary)]'
                      : 'glass-panel hover:border-[var(--accent-primary)]/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-[var(--accent-primary)] font-semibold">
                    <span>
                      {lang === 'en' && item.categoryEn ? item.categoryEn : item.category}
                    </span>
                    <span>
                      {lang === 'en' && item.readTimeEn ? item.readTimeEn : item.readTime}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                    {lang === 'en' && item.titleEn ? item.titleEn : item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                    {lang === 'en' && item.excerptEn ? item.excerptEn : item.excerpt}
                  </p>
                </button>
              );
            })}
          </aside>
        </section>
      )}
    </div>
  );
};
