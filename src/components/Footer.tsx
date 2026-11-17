import React from 'react';
import { BrandConfig } from '../data/siteContent';
import { PageRoute } from './Navbar';
import { MessageCircle, FileText, Share2, Phone, Mail, MapPin, Settings } from 'lucide-react';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ResilientImage } from './ResilientImage';

interface FooterProps {
  brand: BrandConfig;
  activePage: PageRoute;
  onNavigate: (page: PageRoute) => void;
  onOpenWhatsApp: (topic?: string) => void;
  onOpenAdmin: () => void;
  isAdminAuthenticated?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  brand,
  activePage,
  onNavigate,
  onOpenWhatsApp,
  onOpenAdmin,
  isAdminAuthenticated = false
}) => {
  const { lang, t } = useThemeLanguage();

  const handleNav = (page: PageRoute) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-[var(--glass-border)] bg-[var(--bg-surface)] text-[var(--text-secondary)]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 py-14 sm:py-16 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Identity Column with Official TC Logo */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3.5">
              <ResilientImage
                src={brand.logoUrl}
                alt={`Logo ${brand.mainBrand}`}
                sizes="64px"
                pictureClassName="w-14 h-14 shrink-0 block"
                className="w-14 h-14 rounded-2xl object-cover border border-[var(--glass-border)]"
              />
              <div>
                <div className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] tracking-wider uppercase">
                  {brand.mainBrand}
                </div>
                <div className="text-xs text-[var(--text-secondary)]">
                  {brand.directorName} ·{' '}
                  {lang === 'en' ? brand.roleTitleEn : brand.roleTitle}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-medium">
              <span>
                {t('Créateur du projet', 'Creator of')} {brand.flagshipProject}
              </span>
              <span aria-hidden="true">·</span>
              <span>Douala & Cameroun (+237)</span>
            </div>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-md leading-relaxed">
              « {lang === 'en' ? brand.flagshipSloganEn : brand.flagshipSlogan} » —{' '}
              {lang === 'en' ? brand.flagshipSignatureEn : brand.flagshipSignature}
            </p>

            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenWhatsApp()}
                className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-2 transition-colors shadow-md"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>
                  {t(
                    'Contacter & Partager sur WhatsApp',
                    'Contact & Share on WhatsApp'
                  )}
                </span>
              </button>
              <a
                href={brand.pdfHistoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>
                  {t(
                    'Historique 237 Cinématique (PDF)',
                    '237 Cinématique History (PDF)'
                  )}
                </span>
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {t('Navigation du site', 'Site Navigation')}
            </div>
            <ul className="space-y-2 text-xs sm:text-sm">
              {(
                [
                  { id: 'accueil', label: t('Accueil & Partenaires', 'Home & Partners') },
                  { id: '237-cinematique', label: t('Projet 237 Cinématique', '237 Cinématique Project') },
                  { id: 'portfolio', label: t('Portfolio Vidéo & Photo', 'Video & Photo Portfolio') },
                  { id: 'prestations', label: t('Prestations, Tarifs & FAQ', 'Services, Rates & FAQ') },
                  { id: 'tournage', label: t('Prise de RDV & Tournage', 'Book a Call & Shoot') },
                  { id: 'actualites', label: t('Actualités & Journal', 'News & Journal') }
                ] as { id: PageRoute; label: string }[]
              ).map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => handleNav(link.id)}
                    className={`hover:text-[var(--accent-primary)] transition-colors ${
                      activePage === link.id
                        ? 'text-[var(--accent-primary)] font-semibold'
                        : 'text-[var(--text-secondary)]'
                    }`}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & WhatsApp Share Column */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-[var(--text-primary)]">
              {t('Coordonnées Officielles', 'Official Contact Details')}
            </div>
            <div className="space-y-2 text-xs sm:text-sm text-[var(--text-secondary)]">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                <span>
                  {lang === 'en' ? brand.locationLabelEn : brand.locationLabel}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <a
                  href={`https://wa.me/${brand.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[var(--accent-primary)] font-medium transition-colors"
                >
                  WhatsApp / Tél : {brand.whatsappDisplay}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[var(--accent-primary)] shrink-0" />
                <a
                  href={`mailto:${brand.contactEmail}`}
                  className="hover:text-[var(--accent-primary)] font-medium transition-colors"
                >
                  {brand.contactEmail}
                </a>
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--glass-border)] flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  onOpenWhatsApp(
                    t(
                      'Partager la carte du site Tomy Creator',
                      'Share Tomy Creator website card'
                    )
                  )
                }
                className="px-4 py-2.5 rounded-2xl glass-panel hover:border-[var(--accent-primary)] text-xs text-[var(--text-primary)] font-medium flex items-center gap-2 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                <span>
                  {t(
                    'Partager la fiche du site sur WhatsApp',
                    'Share website card on WhatsApp'
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--glass-border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-[var(--text-secondary)]/80">
          <div>
            © {new Date().getFullYear()} {brand.mainBrand} ({brand.directorName}) ·{' '}
            {brand.flagshipProject}.{' '}
            {t('Tous droits réservés.', 'All rights reserved.')}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span>
              Douala, Cameroun (+237) · {brand.whatsappDisplay} · {brand.contactEmail}
            </span>
            <button
              type="button"
              onClick={onOpenAdmin}
              aria-label={t('Administration du site', 'Website Administration')}
              title={
                isAdminAuthenticated
                  ? t('Ouvrir le tableau de bord administrateur', 'Open Admin Dashboard')
                  : t('Connexion Administration (Sanity CMS)', 'Admin Login (Sanity CMS)')
              }
              className="relative w-8 h-8 rounded-full glass-panel hover:border-[var(--accent-primary)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-all group"
            >
              <Settings className="w-4 h-4 transition-transform duration-500 group-hover:rotate-90" />
              {isAdminAuthenticated && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[var(--bg-surface)]"
                />
              )}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
