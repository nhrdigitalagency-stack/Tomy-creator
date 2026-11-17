import React, { useState } from 'react';
import {
  SiteData,
  PortfolioItem,
  PartnerCompany,
  EpisodeItem,
  ServiceItem,
  FaqItem,
  NewsItem,
  TestimonialItem
} from '../data/siteContent';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { ResilientImage } from './ResilientImage';
import {
  Save,
  LogOut,
  ArrowLeft,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  Image as ImageIcon,
  Video,
  Building2,
  Film,
  Briefcase,
  HelpCircle,
  Newspaper,
  Inbox,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Star,
  Database,
  MessageCircle,
  Globe
} from 'lucide-react';

interface AdminDashboardProps {
  data: SiteData;
  authToken: string;
  adminUser: { username: string; email: string; role: string };
  sanityMeta: { projectId: string; dataset: string; source: string; updatedAt?: string };
  onUpdateData: (updated: SiteData) => void;
  onSaveToSanity: (dataToSave: SiteData) => Promise<{ ok: boolean; error?: string; updatedAt?: string }>;
  onLogout: () => void;
  onExitToSite: () => void;
}

type AdminTab =
  | 'brand'
  | 'portfolio'
  | 'partners'
  | 'episodes'
  | 'services_faq'
  | 'news'
  | 'inquiries';

const PORTFOLIO_CATEGORIES: PortfolioItem['category'][] = [
  'Documentaire & 237 Cinématique',
  'Captation Sportive & Stade',
  'Portrait & Direction Artistique',
  'Coulisses & Mobile Filmmaking'
];

function moveItem<T>(arr: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= arr.length) return arr;
  const copy = [...arr];
  const [removed] = copy.splice(index, 1);
  copy.splice(target, 0, removed);
  return copy;
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'));
    reader.readAsDataURL(file);
  });
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  authToken,
  adminUser,
  sanityMeta,
  onUpdateData,
  onSaveToSanity,
  onLogout,
  onExitToSite
}) => {
  const { t } = useThemeLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('portfolio');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [statusBanner, setStatusBanner] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [portfolioFilterType, setPortfolioFilterType] = useState<'Tous' | 'Photo' | 'Vidéo'>('Tous');
  const [portfolioFilterCat, setPortfolioFilterCat] = useState<string>('Toutes');

  const applyChange = (nextData: SiteData) => {
    onUpdateData(nextData);
    setHasUnsavedChanges(true);
    setStatusBanner(null);
  };

  const handleSaveNow = async () => {
    setIsSaving(true);
    setStatusBanner(null);
    const res = await onSaveToSanity(data);
    setIsSaving(false);
    if (res.ok) {
      setHasUnsavedChanges(false);
      setStatusBanner({
        type: 'success',
        message: t(
          'Toutes les modifications ont été enregistrées et publiées dans Sanity.',
          'All changes have been saved and published to Sanity.'
        )
      });
    } else {
      setStatusBanner({
        type: 'error',
        message:
          res.error ||
          t('Erreur lors de l’enregistrement sur Sanity.', 'Failed to save changes to Sanity.')
      });
    }
  };

  const handleUploadMediaToSanity = async (
    file: File,
    mediaKind: 'image' | 'file',
    uploadKey: string,
    onUrlReady: (url: string) => void
  ) => {
    setUploadingKey(uploadKey);
    setStatusBanner(null);
    try {
      const base64Data = await fileToBase64(file);
      const res = await fetch('/api/sanity/upload-media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          filename: file.name,
          mimeType: file.type,
          base64Data,
          mediaKind
        })
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.error || 'Échec du téléversement vers Sanity');
      }
      onUrlReady(json.url);
      setStatusBanner({
        type: 'success',
        message: t(
          `Média téléversé sur Sanity CDN (${file.name}). Cliquez sur « Enregistrer sur Sanity » pour publier.`,
          `Media uploaded to Sanity CDN (${file.name}). Click "Save to Sanity" to publish.`
        )
      });
    } catch (err) {
      setStatusBanner({
        type: 'error',
        message: err instanceof Error ? err.message : 'Erreur upload Sanity'
      });
    } finally {
      setUploadingKey(null);
    }
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode; count?: number }[] = [
    {
      id: 'portfolio',
      label: t('Images & Vidéos', 'Images & Videos'),
      icon: <ImageIcon className="w-4 h-4" />,
      count: data.portfolio.length
    },
    {
      id: 'partners',
      label: t('Entreprises', 'Partner Companies'),
      icon: <Building2 className="w-4 h-4" />,
      count: data.partnerCompanies.length
    },
    {
      id: 'brand',
      label: t('Infos du site', 'Site Info & Brand'),
      icon: <Globe className="w-4 h-4" />
    },
    {
      id: 'episodes',
      label: '237 Cinématique',
      icon: <Film className="w-4 h-4" />,
      count: data.episodes.length
    },
    {
      id: 'services_faq',
      label: t('Prestations, FAQ & Avis', 'Services, FAQ & Reviews'),
      icon: <Briefcase className="w-4 h-4" />,
      count: data.services.length + data.faqs.length
    },
    {
      id: 'news',
      label: t('Actualités', 'News'),
      icon: <Newspaper className="w-4 h-4" />,
      count: data.news.length
    },
    {
      id: 'inquiries',
      label: t('Demandes & RDV', 'Requests & Bookings'),
      icon: <Inbox className="w-4 h-4" />,
      count: (data.shootingRequests?.length || 0) + (data.appointments?.length || 0)
    }
  ];

  // Add Handlers
  const addPortfolioItem = (mediaType: 'Photo' | 'Vidéo') => {
    const newItem: PortfolioItem = {
      id: `pf-${Date.now()}`,
      title:
        mediaType === 'Photo'
          ? 'Nouvelle photographie Tomy Creator'
          : 'Nouvelle réalisation vidéo Tomy Creator',
      titleEn:
        mediaType === 'Photo'
          ? 'New Tomy Creator Photography'
          : 'New Tomy Creator Video Production',
      category: 'Documentaire & 237 Cinématique',
      categoryEn: 'Documentary & 237 Cinématique',
      mediaType,
      imageUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      videoUrl: mediaType === 'Vidéo' ? '' : undefined,
      location: 'Douala, Cameroun',
      year: String(new Date().getFullYear()),
      cameraGear: 'Canon EOS · Stabilisation 3 axes',
      role: 'Réalisation — Thomas Fotso',
      description: 'Description de la prise de vue ou du film.',
      descriptionEn: 'Description of the shoot or film.',
      isProvisional: false,
      featured: true
    };
    applyChange({
      ...data,
      portfolio: [newItem, ...data.portfolio]
    });
  };

  const addPartner = () => {
    const newPartner: PartnerCompany = {
      id: `partner-${Date.now()}`,
      name: 'Nouvelle Entreprise Partenaire',
      sector: 'Secteur d’activité',
      sectorEn: 'Industry Sector',
      collaborationNote: 'Réalisation audiovisuelle & image de marque'
    };
    applyChange({
      ...data,
      partnerCompanies: [...data.partnerCompanies, newPartner]
    });
  };

  const addEpisode = () => {
    const num = String(data.episodes.length + 1).padStart(2, '0');
    const newEp: EpisodeItem = {
      id: `ep-${Date.now()}`,
      number: `Épisode ${num}`,
      numberEn: `Episode ${num}`,
      title: 'Nouveau titre d’épisode 237 Cinématique',
      titleEn: 'New 237 Cinématique Episode Title',
      subtitle: 'Sous-titre éditorial du documentaire',
      city: 'Douala',
      region: 'Littoral',
      mapCoords: { x: 35, y: 74 },
      theme: 'Ville & Quartier',
      duration: '07 min 30',
      releaseDate: 'Saison 1',
      status: 'En préparation',
      isProvisional: false,
      synopsis: 'Synopsis de l’épisode...',
      directorNote: 'Note de réalisation de Thomas Fotso...',
      coverImage: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      videoUrl: ''
    };
    applyChange({
      ...data,
      episodes: [...data.episodes, newEp]
    });
  };

  const addFaq = () => {
    const newFaq: FaqItem = {
      id: `faq-${Date.now()}`,
      category: 'Processus de tournage',
      question: 'Nouvelle question fréquente ?',
      questionEn: 'New frequently asked question?',
      answer: 'Réponse détaillée de Tomy Creator.',
      answerEn: 'Detailed answer by Tomy Creator.'
    };
    applyChange({
      ...data,
      faqs: [...data.faqs, newFaq]
    });
  };

  const addTestimonial = () => {
    const newTesti: TestimonialItem = {
      id: `testi-${Date.now()}`,
      authorName: 'Nom du client / Dirigeant',
      authorRole: 'Fonction',
      organization: 'Entreprise',
      projectContext: 'Film d’entreprise / Captation',
      quote: 'Témoignage client sur la collaboration avec Tomy Creator.',
      location: 'Douala · Cameroun',
      avatarUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      isProvisional: false
    };
    applyChange({
      ...data,
      testimonials: [...data.testimonials, newTesti]
    });
  };

  const addService = () => {
    const idxStr = String(data.services.length + 1).padStart(2, '0');
    const newSrv: ServiceItem = {
      id: `srv-${Date.now()}`,
      index: idxStr,
      title: 'Nouvelle Prestation Audiovisuelle',
      subtitle: 'Sous-titre de la prestation',
      description: 'Description complète de l’accompagnement.',
      deliverables: ['Préparation et repérage', 'Tournage haute définition', 'Montage & étalonnage'],
      targetAudience: 'Entreprises, marques et institutions',
      pricingNote: 'Sur devis personnalisé'
    };
    applyChange({
      ...data,
      services: [...data.services, newSrv]
    });
  };

  const addNews = () => {
    const newArticle: NewsItem = {
      id: `news-${Date.now()}`,
      title: 'Nouvelle actualité / note de tournage',
      date: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
      category: 'Productions Tomy Creator',
      readTime: '2 min de lecture',
      excerpt: 'Résumé court de l’article.',
      content: ['Premier paragraphe de l’actualité.'],
      imageUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      isProvisional: false
    };
    applyChange({
      ...data,
      news: [newArticle, ...data.news]
    });
  };

  const filteredPortfolio = data.portfolio.filter((item) => {
    if (portfolioFilterType !== 'Tous' && item.mediaType !== portfolioFilterType) return false;
    if (portfolioFilterCat !== 'Toutes' && item.category !== portfolioFilterCat) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-cinema)] text-[var(--text-primary)] pb-24">
      {/* Sticky Top Admin Bar */}
      <div className="sticky top-0 z-40 glass-panel-strong !rounded-none border-b border-[var(--glass-border)]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={onExitToSite}
              className="px-3.5 py-2 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('Retour au site', 'Back to Website')}</span>
            </button>

            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-primary)]">
                <Database className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Sanity CMS · {sanityMeta.projectId} / {sanityMeta.dataset}
                </span>
              </div>
              <div className="text-[11px] text-[var(--text-secondary)] truncate">
                {t('Connecté :', 'Signed in as')} {adminUser.email}
                {hasUnsavedChanges && (
                  <span className="ml-2 text-amber-400 font-semibold">
                    · {t('Modifications non enregistrées', 'Unsaved changes')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleSaveNow}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg transition-colors"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t('Sauvegarde Sanity...', 'Saving to Sanity...')}</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{t('Enregistrer sur Sanity', 'Save to Sanity')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onLogout}
              className="px-3.5 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] flex items-center gap-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('Déconnexion', 'Sign Out')}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pb-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 whitespace-nowrap shrink-0 transition-all ${
                  isActive
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] tabular-nums ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[var(--accent-subtle)] text-[var(--accent-primary)]'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {statusBanner && (
          <div
            role="status"
            className={`p-4 rounded-2xl border flex items-center gap-3 text-xs sm:text-sm font-medium ${
              statusBanner.type === 'success'
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                : 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)]/50 text-[var(--accent-primary)]'
            }`}
          >
            {statusBanner.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 shrink-0" />
            )}
            <span>{statusBanner.message}</span>
          </div>
        )}

        {/* TAB 1: PORTFOLIO IMAGES & VIDEOS (UPLOAD + CLASSIFICATION + ORDERING) */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {t(
                    'Gestion & Classement des Images et Vidéos',
                    'Manage & Classify Images and Videos'
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {t(
                    'Ajoutez vos photos et vidéos (upload direct sur Sanity CDN ou lien URL), classez-les par catégorie et modifiez leur ordre d’affichage.',
                    'Add photos and videos (direct upload to Sanity CDN or URL), classify by category, and reorder display priority.'
                  )}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => addPortfolioItem('Photo')}
                  className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('Ajouter une Photo', 'Add Photo')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => addPortfolioItem('Vidéo')}
                  className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-semibold flex items-center gap-1.5"
                >
                  <Video className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>{t('Ajouter une Vidéo', 'Add Video')}</span>
                </button>
              </div>
            </div>

            {/* Filter Strip inside Admin */}
            <div className="flex flex-wrap items-center gap-2">
              {(['Tous', 'Photo', 'Vidéo'] as const).map((typeOpt) => (
                <button
                  key={typeOpt}
                  type="button"
                  onClick={() => setPortfolioFilterType(typeOpt)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                    portfolioFilterType === typeOpt
                      ? 'bg-[var(--accent-primary)] text-white'
                      : 'glass-panel text-[var(--text-secondary)]'
                  }`}
                >
                  {typeOpt}
                </button>
              ))}
              <select
                value={portfolioFilterCat}
                onChange={(e) => setPortfolioFilterCat(e.target.value)}
                className="px-3.5 py-1.5 rounded-full theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-medium text-[var(--text-primary)]"
              >
                <option value="Toutes">
                  {t('Toutes les catégories', 'All Categories')}
                </option>
                {PORTFOLIO_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              {filteredPortfolio.map((item) => {
                const realIdx = data.portfolio.findIndex((p) => p.id === item.id);
                const updateItem = (patch: Partial<PortfolioItem>) => {
                  const next = data.portfolio.map((p) =>
                    p.id === item.id ? { ...p, ...patch } : p
                  );
                  applyChange({ ...data, portfolio: next });
                };

                return (
                  <div
                    key={item.id}
                    className="glass-panel rounded-3xl p-5 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
                  >
                    {/* Preview & Upload Column */}
                    <div className="lg:col-span-4 space-y-3">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--glass-border)] bg-black">
                        <ResilientImage
                          src={item.imageUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full bg-black/75 text-white text-[10px] font-semibold">
                          #{realIdx + 1} · {item.mediaType}
                        </span>
                      </div>

                      {/* Image Upload to Sanity */}
                      <div className="flex flex-wrap gap-2">
                        <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold flex items-center justify-center gap-1.5">
                          {uploadingKey === `pf-img-${item.id}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--accent-primary)]" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          )}
                          <span>
                            {item.mediaType === 'Vidéo'
                              ? t('Uploader Miniature', 'Upload Thumbnail')
                              : t('Uploader Image Sanity', 'Upload Image to Sanity')}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMediaToSanity(
                                  file,
                                  'image',
                                  `pf-img-${item.id}`,
                                  (url) => updateItem({ imageUrl: url })
                                );
                              }
                            }}
                          />
                        </label>

                        {item.mediaType === 'Vidéo' && (
                          <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl bg-[var(--accent-subtle)] border border-[var(--accent-primary)]/40 text-xs font-semibold text-[var(--accent-primary)] flex items-center justify-center gap-1.5">
                            {uploadingKey === `pf-vid-${item.id}` ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Video className="w-3.5 h-3.5" />
                            )}
                            <span>{t('Uploader Vidéo Sanity', 'Upload Video')}</span>
                            <input
                              type="file"
                              accept="video/mp4,video/webm,video/quicktime"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  handleUploadMediaToSanity(
                                    file,
                                    'file',
                                    `pf-vid-${item.id}`,
                                    (url) => updateItem({ videoUrl: url })
                                  );
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Metadata & Classification Column */}
                    <div className="lg:col-span-8 space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[var(--glass-border)]">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({
                                ...data,
                                portfolio: moveItem(data.portfolio, realIdx, -1)
                              })
                            }
                            disabled={realIdx === 0}
                            title={t('Monter dans le classement', 'Move up')}
                            className="p-2 rounded-xl glass-panel disabled:opacity-35 hover:border-[var(--accent-primary)]"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({
                                ...data,
                                portfolio: moveItem(data.portfolio, realIdx, 1)
                              })
                            }
                            disabled={realIdx === data.portfolio.length - 1}
                            title={t('Descendre dans le classement', 'Move down')}
                            className="p-2 rounded-xl glass-panel disabled:opacity-35 hover:border-[var(--accent-primary)]"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => updateItem({ featured: !item.featured })}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${
                              item.featured
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                : 'glass-panel text-[var(--text-secondary)]'
                            }`}
                          >
                            <Star className="w-3.5 h-3.5" />
                            <span>{t('À la une', 'Featured')}</span>
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              portfolio: data.portfolio.filter((p) => p.id !== item.id)
                            })
                          }
                          className="px-3 py-1.5 rounded-full bg-red-500/15 hover:bg-red-500/25 text-red-400 text-xs font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{t('Supprimer', 'Delete')}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Titre (FR)', 'Title (FR)')}
                          </label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => updateItem({ title: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Titre (EN)', 'Title (EN)')}
                          </label>
                          <input
                            type="text"
                            value={item.titleEn || ''}
                            onChange={(e) => updateItem({ titleEn: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Type de média', 'Media Type')}
                          </label>
                          <select
                            value={item.mediaType}
                            onChange={(e) =>
                              updateItem({ mediaType: e.target.value as 'Photo' | 'Vidéo' })
                            }
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          >
                            <option value="Photo">Photo</option>
                            <option value="Vidéo">Vidéo</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Catégorie de classement', 'Classification Category')}
                          </label>
                          <select
                            value={item.category}
                            onChange={(e) =>
                              updateItem({
                                category: e.target.value as PortfolioItem['category']
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          >
                            {PORTFOLIO_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('URL Image / Miniature', 'Image / Thumbnail URL')}
                          </label>
                          <input
                            type="text"
                            value={item.imageUrl}
                            onChange={(e) => updateItem({ imageUrl: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          />
                        </div>

                        {item.mediaType === 'Vidéo' && (
                          <div>
                            <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                              {t('URL Vidéo (Sanity CDN, MP4, YouTube, Vimeo)', 'Video URL')}
                            </label>
                            <input
                              type="text"
                              value={item.videoUrl || ''}
                              onChange={(e) => updateItem({ videoUrl: e.target.value })}
                              placeholder="https://cdn.sanity.io/... ou https://youtube.com/..."
                              className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                            />
                          </div>
                        )}

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Lieu', 'Location')}
                          </label>
                          <input
                            type="text"
                            value={item.location}
                            onChange={(e) => updateItem({ location: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                            {t('Année & Matériel', 'Year & Camera Gear')}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={item.year}
                              onChange={(e) => updateItem({ year: e.target.value })}
                              className="w-20 px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                            />
                            <input
                              type="text"
                              value={item.cameraGear}
                              onChange={(e) => updateItem({ cameraGear: e.target.value })}
                              className="flex-1 px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[var(--text-muted)] mb-1">
                          {t('Description (FR)', 'Description (FR)')}
                        </label>
                        <textarea
                          rows={2}
                          value={item.description}
                          onChange={(e) => updateItem({ description: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: PARTNER COMPANIES */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  {t(
                    'Entreprises avec lesquelles vous travaillez',
                    'Partner Companies & Brands'
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  {t(
                    'Ajoutez, modifiez ou réordonnez les entreprises affichées dans le bandeau défilant.',
                    'Add, edit, or reorder companies displayed in the homepage marquee.'
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={addPartner}
                className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Ajouter une entreprise', 'Add Company')}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.partnerCompanies.map((company, idx) => {
                const updatePartner = (patch: Partial<PartnerCompany>) => {
                  const next = data.partnerCompanies.map((c) =>
                    c.id === company.id ? { ...c, ...patch } : c
                  );
                  applyChange({ ...data, partnerCompanies: next });
                };

                return (
                  <div key={company.id} className="glass-panel rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--accent-primary)]">
                        #{idx + 1} · {company.name}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              partnerCompanies: moveItem(data.partnerCompanies, idx, -1)
                            })
                          }
                          disabled={idx === 0}
                          className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              partnerCompanies: moveItem(data.partnerCompanies, idx, 1)
                            })
                          }
                          disabled={idx === data.partnerCompanies.length - 1}
                          className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              partnerCompanies: data.partnerCompanies.filter(
                                (c) => c.id !== company.id
                              )
                            })
                          }
                          className="p-1.5 rounded-lg bg-red-500/15 text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5">
                      <input
                        type="text"
                        value={company.name}
                        onChange={(e) => updatePartner({ name: e.target.value })}
                        placeholder="Nom de l'entreprise"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={company.sector}
                          onChange={(e) => updatePartner({ sector: e.target.value })}
                          placeholder="Secteur (FR)"
                          className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        />
                        <input
                          type="text"
                          value={company.sectorEn}
                          onChange={(e) => updatePartner({ sectorEn: e.target.value })}
                          placeholder="Sector (EN)"
                          className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        />
                      </div>
                      <input
                        type="text"
                        value={company.collaborationNote}
                        onChange={(e) => updatePartner({ collaborationNote: e.target.value })}
                        placeholder="Note de collaboration"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: BRAND & GENERAL SITE INFORMATION */}
        {activeTab === 'brand' && (
          <div className="glass-panel rounded-3xl p-5 sm:p-8 space-y-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {t('Informations Générales du Site', 'General Website & Brand Information')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom de marque</label>
                <input
                  type="text"
                  value={data.brand.mainBrand}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, mainBrand: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Nom du réalisateur</label>
                <input
                  type="text"
                  value={data.brand.directorName}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, directorName: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Titre du rôle (FR)</label>
                <input
                  type="text"
                  value={data.brand.roleTitle}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, roleTitle: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Role Title (EN)</label>
                <input
                  type="text"
                  value={data.brand.roleTitleEn}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, roleTitleEn: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Téléphone / WhatsApp affiché
                </label>
                <input
                  type="text"
                  value={data.brand.whatsappDisplay}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: {
                        ...data.brand,
                        whatsappDisplay: e.target.value,
                        whatsappNumber: e.target.value.replace(/\D/g, '')
                      }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Email de contact</label>
                <input
                  type="email"
                  value={data.brand.contactEmail}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, contactEmail: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Slogan 237 Cinématique (FR)
                </label>
                <input
                  type="text"
                  value={data.brand.flagshipSlogan}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, flagshipSlogan: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Slogan 237 Cinématique (EN)
                </label>
                <input
                  type="text"
                  value={data.brand.flagshipSloganEn}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, flagshipSloganEn: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-sm"
                />
              </div>

              <div className="md:col-span-2 flex flex-wrap items-center gap-4 pt-2">
                <img
                  src={data.brand.logoUrl}
                  alt="Logo"
                  className="w-16 h-16 rounded-2xl object-cover border border-[var(--glass-border)]"
                />
                <label className="cursor-pointer px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-xs font-semibold flex items-center gap-2">
                  {uploadingKey === 'brand-logo' ? (
                    <Loader2 className="w-4 h-4 animate-spin text-[var(--accent-primary)]" />
                  ) : (
                    <Upload className="w-4 h-4 text-[var(--accent-primary)]" />
                  )}
                  <span>{t('Changer le logo (Sanity CDN)', 'Upload New Logo to Sanity')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleUploadMediaToSanity(file, 'image', 'brand-logo', (url) =>
                          applyChange({ ...data, brand: { ...data.brand, logoUrl: url } })
                        );
                      }
                    }}
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Biographie courte (FR)</label>
                <textarea
                  rows={3}
                  value={data.brand.directorBioShort}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, directorBioShort: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Short Bio (EN)</label>
                <textarea
                  rows={3}
                  value={data.brand.directorBioShortEn}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, directorBioShortEn: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Biographie complète (FR)</label>
                <textarea
                  rows={4}
                  value={data.brand.directorBioLong}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, directorBioLong: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Full Biography (EN)</label>
                <textarea
                  rows={4}
                  value={data.brand.directorBioLongEn}
                  onChange={(e) =>
                    applyChange({
                      ...data,
                      brand: { ...data.brand, directorBioLongEn: e.target.value }
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: EPISODES 237 CINEMATIQUE */}
        {activeTab === 'episodes' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                  Épisodes 237 Cinématique
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                  Ajoutez, modifiez, classez et publiez vos épisodes documentaires.
                </p>
              </div>
              <button
                type="button"
                onClick={addEpisode}
                className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>{t('Ajouter un épisode', 'Add Episode')}</span>
              </button>
            </div>

            <div className="space-y-4">
              {data.episodes.map((ep, idx) => {
                const updateEp = (patch: Partial<EpisodeItem>) => {
                  const next = data.episodes.map((e) => (e.id === ep.id ? { ...e, ...patch } : e));
                  applyChange({ ...data, episodes: next });
                };

                return (
                  <div
                    key={ep.id}
                    className="glass-panel rounded-3xl p-5 grid grid-cols-1 lg:grid-cols-12 gap-5"
                  >
                    <div className="lg:col-span-4 space-y-2.5">
                      <div className="aspect-video rounded-2xl overflow-hidden border border-[var(--glass-border)]">
                        <ResilientImage
                          src={ep.coverImage}
                          alt={ep.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex gap-2">
                        <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl glass-panel text-xs font-semibold flex items-center justify-center gap-1.5">
                          <Upload className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          <span>Couverture</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMediaToSanity(file, 'image', `ep-img-${ep.id}`, (url) =>
                                  updateEp({ coverImage: url })
                                );
                              }
                            }}
                          />
                        </label>
                        <label className="flex-1 cursor-pointer px-3 py-2 rounded-xl bg-[var(--accent-subtle)] text-[var(--accent-primary)] text-xs font-semibold flex items-center justify-center gap-1.5">
                          <Video className="w-3.5 h-3.5" />
                          <span>Vidéo</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMediaToSanity(file, 'file', `ep-vid-${ep.id}`, (url) =>
                                  updateEp({ videoUrl: url })
                                );
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="lg:col-span-8 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({ ...data, episodes: moveItem(data.episodes, idx, -1) })
                            }
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({ ...data, episodes: moveItem(data.episodes, idx, 1) })
                            }
                            disabled={idx === data.episodes.length - 1}
                            className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-xs font-bold text-[var(--accent-primary)] ml-2">
                            {ep.number}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              episodes: data.episodes.filter((e) => e.id !== ep.id)
                            })
                          }
                          className="px-2.5 py-1 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                          Supprimer
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <input
                          type="text"
                          value={ep.number}
                          onChange={(e) => updateEp({ number: e.target.value })}
                          placeholder="Numéro"
                          className="px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        />
                        <input
                          type="text"
                          value={ep.city}
                          onChange={(e) => updateEp({ city: e.target.value })}
                          placeholder="Ville"
                          className="px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        />
                        <select
                          value={ep.status}
                          onChange={(e) =>
                            updateEp({ status: e.target.value as EpisodeItem['status'] })
                          }
                          className="px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        >
                          <option value="Publié">Publié</option>
                          <option value="En montage">En montage</option>
                          <option value="En préparation">En préparation</option>
                        </select>
                      </div>

                      <input
                        type="text"
                        value={ep.title}
                        onChange={(e) => updateEp({ title: e.target.value })}
                        placeholder="Titre de l'épisode"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={ep.videoUrl}
                        onChange={(e) => updateEp({ videoUrl: e.target.value })}
                        placeholder="URL vidéo de l'épisode (Sanity CDN / YouTube / MP4)"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                      <textarea
                        rows={2}
                        value={ep.synopsis}
                        onChange={(e) => updateEp({ synopsis: e.target.value })}
                        placeholder="Synopsis"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: SERVICES, FAQ & TESTIMONIALS */}
        {activeTab === 'services_faq' && (
          <div className="space-y-8">
            {/* Services */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Prestations Audiovisuelles ({data.services.length})
                </h2>
                <button
                  type="button"
                  onClick={addService}
                  className="px-3.5 py-2 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.services.map((srv) => {
                  const updateSrv = (patch: Partial<ServiceItem>) =>
                    applyChange({
                      ...data,
                      services: data.services.map((s) => (s.id === srv.id ? { ...s, ...patch } : s))
                    });
                  return (
                    <div key={srv.id} className="p-4 rounded-2xl border border-[var(--glass-border)] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--accent-primary)]">
                          #{srv.index}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              services: data.services.filter((s) => s.id !== srv.id)
                            })
                          }
                          className="text-red-400 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={srv.title}
                        onChange={(e) => updateSrv({ title: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        value={srv.description}
                        onChange={(e) => updateSrv({ description: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                      <input
                        type="text"
                        value={srv.pricingNote}
                        onChange={(e) => updateSrv({ pricingNote: e.target.value })}
                        placeholder="Note tarifaire"
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* FAQ */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[var(--accent-primary)]" />
                  <span>Questions Fréquentes ({data.faqs.length})</span>
                </h2>
                <button
                  type="button"
                  onClick={addFaq}
                  className="px-3.5 py-2 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une FAQ</span>
                </button>
              </div>
              <div className="space-y-3">
                {data.faqs.map((faq, idx) => {
                  const updateFaq = (patch: Partial<FaqItem>) =>
                    applyChange({
                      ...data,
                      faqs: data.faqs.map((f) => (f.id === faq.id ? { ...f, ...patch } : f))
                    });
                  return (
                    <div key={faq.id} className="p-4 rounded-2xl border border-[var(--glass-border)] space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <select
                          value={faq.category}
                          onChange={(e) =>
                            updateFaq({ category: e.target.value as FaqItem['category'] })
                          }
                          className="px-3 py-1.5 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                        >
                          <option value="Tarifs & Devis">Tarifs & Devis</option>
                          <option value="Disponibilités & Délais">Disponibilités & Délais</option>
                          <option value="Processus de tournage">Processus de tournage</option>
                        </select>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({ ...data, faqs: moveItem(data.faqs, idx, -1) })
                            }
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({ ...data, faqs: moveItem(data.faqs, idx, 1) })
                            }
                            disabled={idx === data.faqs.length - 1}
                            className="p-1.5 rounded-lg glass-panel disabled:opacity-35"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              applyChange({
                                ...data,
                                faqs: data.faqs.filter((f) => f.id !== faq.id)
                              })
                            }
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq({ question: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                      />
                      <textarea
                        rows={2}
                        value={faq.answer}
                        onChange={(e) => updateFaq({ answer: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Testimonials */}
            <div className="glass-panel rounded-3xl p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Témoignages ({data.testimonials.length})
                </h2>
                <button
                  type="button"
                  onClick={addTestimonial}
                  className="px-3.5 py-2 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter</span>
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.testimonials.map((tItem) => {
                  const updateTesti = (patch: Partial<TestimonialItem>) =>
                    applyChange({
                      ...data,
                      testimonials: data.testimonials.map((item) =>
                        item.id === tItem.id ? { ...item, ...patch } : item
                      )
                    });
                  return (
                    <div key={tItem.id} className="p-4 rounded-2xl border border-[var(--glass-border)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--accent-primary)]">
                          {tItem.organization}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              testimonials: data.testimonials.filter((i) => i.id !== tItem.id)
                            })
                          }
                          className="text-red-400 text-xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={tItem.authorName}
                        onChange={(e) => updateTesti({ authorName: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                      />
                      <input
                        type="text"
                        value={tItem.organization}
                        onChange={(e) => updateTesti({ organization: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                      <textarea
                        rows={2}
                        value={tItem.quote}
                        onChange={(e) => updateTesti({ quote: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: NEWS */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 sm:p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Actualités & Journal de Production
              </h2>
              <button
                type="button"
                onClick={addNews}
                className="px-4 py-2.5 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un article</span>
              </button>
            </div>
            <div className="space-y-4">
              {data.news.map((article, idx) => {
                const updateNews = (patch: Partial<NewsItem>) =>
                  applyChange({
                    ...data,
                    news: data.news.map((n) => (n.id === article.id ? { ...n, ...patch } : n))
                  });
                return (
                  <div key={article.id} className="glass-panel rounded-3xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--accent-primary)]">
                        #{idx + 1} · {article.date}
                      </span>
                      <div className="flex items-center gap-2">
                        <label className="cursor-pointer px-3 py-1.5 rounded-full glass-panel text-xs font-semibold flex items-center gap-1">
                          <Upload className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          <span>Image Sanity</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleUploadMediaToSanity(
                                  file,
                                  'image',
                                  `news-${article.id}`,
                                  (url) => updateNews({ imageUrl: url })
                                );
                              }
                            }}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              news: data.news.filter((n) => n.id !== article.id)
                            })
                          }
                          className="px-2.5 py-1.5 rounded-full bg-red-500/15 text-red-400 text-xs font-semibold"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      value={article.title}
                      onChange={(e) => updateNews({ title: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs font-semibold"
                    />
                    <textarea
                      rows={2}
                      value={article.excerpt}
                      onChange={(e) => updateNews({ excerpt: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl theme-adaptive-input bg-[var(--input-bg)] border border-[var(--glass-border)] text-xs"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 7: SHOOTING REQUESTS & APPOINTMENTS FROM SANITY */}
        {activeTab === 'inquiries' && (
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-5 sm:p-6">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                Demandes de Tournage ({data.shootingRequests.length}) & Rendez-vous (
                {data.appointments.length})
              </h2>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                Les formulaires soumis par vos visiteurs sont enregistrés dans Sanity.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-panel rounded-3xl p-5 space-y-3">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Rendez-vous programmés
                </h3>
                {data.appointments.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">
                    Aucun rendez-vous enregistré pour le moment.
                  </p>
                ) : (
                  data.appointments.map((apt) => (
                    <div
                      key={apt.id}
                      className="p-4 rounded-2xl border border-[var(--glass-border)] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                        <span>
                          {apt.clientName} ({apt.organization || 'Particulier'})
                        </span>
                        <span className="text-[var(--accent-primary)]">{apt.status}</span>
                      </div>
                      <p className="text-[var(--text-secondary)]">
                        {apt.preferredDate} · {apt.preferredTimeSlot} · {apt.city}
                      </p>
                      <p className="text-[var(--text-secondary)]">{apt.topic}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={`https://wa.me/${apt.phoneWhatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              appointments: data.appointments.filter((a) => a.id !== apt.id)
                            })
                          }
                          className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-400 font-semibold"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="glass-panel rounded-3xl p-5 space-y-3">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Demandes de tournage détaillées
                </h3>
                {data.shootingRequests.length === 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">
                    Aucune demande de tournage enregistrée pour le moment.
                  </p>
                ) : (
                  data.shootingRequests.map((req) => (
                    <div
                      key={req.id}
                      className="p-4 rounded-2xl border border-[var(--glass-border)] space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                        <span>
                          {req.clientName} ({req.organization || 'Projet perso'})
                        </span>
                        <span className="text-[var(--accent-primary)]">{req.status}</span>
                      </div>
                      <p className="text-[var(--text-secondary)]">
                        {req.projectType} · {req.location} · {req.desiredDate}
                      </p>
                      <p className="text-[var(--text-secondary)]">{req.narrativeBrief}</p>
                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={`https://wa.me/${req.phoneWhatsapp.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold flex items-center gap-1"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          type="button"
                          onClick={() =>
                            applyChange({
                              ...data,
                              shootingRequests: data.shootingRequests.filter((r) => r.id !== req.id)
                            })
                          }
                          className="px-3 py-1.5 rounded-full bg-red-500/15 text-red-400 font-semibold"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
