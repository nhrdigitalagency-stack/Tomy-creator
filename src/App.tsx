/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  INITIAL_SITE_DATA,
  SiteData,
  ShootingRequest,
  AppointmentBooking
} from './data/siteContent';
import { Navbar, PageRoute } from './components/Navbar';
import { Footer } from './components/Footer';
import { PageAccueil } from './components/PageAccueil';
import { Page237Cinematique } from './components/Page237Cinematique';
import { PagePortfolio } from './components/PagePortfolio';
import { PagePrestationsTournage } from './components/PagePrestationsTournage';
import { PageActualites } from './components/PageActualites';
import {
  MediaLightboxModal,
  LightboxMediaPayload
} from './components/MediaLightboxModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { FloatingContactButton } from './components/FloatingContactButton';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { AdminAuthModal } from './components/AdminAuthModal';
import { AdminDashboard } from './components/AdminDashboard';
import { SeoHeadManager } from './components/SeoHeadManager';
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AnimatePresence, motion } from 'motion/react';

const ROUTE_TO_PATH: Record<PageRoute, string> = {
  accueil: '/',
  '237-cinematique': '/237-cinematique',
  portfolio: '/portfolio',
  prestations: '/prestations',
  tournage: '/tournage',
  actualites: '/actualites'
};

function getPageFromPathname(pathname: string): PageRoute {
  const clean = pathname.replace(/\/+$/, '') || '/';
  const match = (Object.entries(ROUTE_TO_PATH) as [PageRoute, string][]).find(
    ([, pathVal]) => pathVal === clean
  );
  return match ? match[0] : 'accueil';
}

const STORAGE_KEY = 'tomy_creator_237_sanity_cache_v4';
const ADMIN_TOKEN_KEY = 'tomy_creator_admin_token_v1';

export default function App() {
  const [siteData, setSiteData] = useState<SiteData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as SiteData;
        return {
          ...INITIAL_SITE_DATA,
          ...parsed,
          brand: {
            ...INITIAL_SITE_DATA.brand,
            ...(parsed.brand || {})
          }
        };
      }
    } catch {
      // Fallback to initial data
    }
    return INITIAL_SITE_DATA;
  });

  const [sanityMeta, setSanityMeta] = useState<{
    projectId: string;
    dataset: string;
    source: string;
    updatedAt?: string;
  }>({
    projectId: 'c5o9hb8v',
    dataset: 'production',
    source: 'loading'
  });

  const [activePage, setActivePage] = useState<PageRoute>(() =>
    typeof window !== 'undefined' ? getPageFromPathname(window.location.pathname) : 'accueil'
  );

  const navigateToPage = useCallback((page: PageRoute) => {
    setActivePage(page);
    if (typeof window !== 'undefined') {
      const targetPath = ROUTE_TO_PATH[page] || '/';
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ page }, '', targetPath);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      setActivePage(getPageFromPathname(window.location.pathname));
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [selectedServiceForForm, setSelectedServiceForForm] = useState<
    string | undefined
  >(undefined);
  const [lightboxMedia, setLightboxMedia] =
    useState<LightboxMediaPayload | null>(null);
  const [whatsAppModalOpen, setWhatsAppModalOpen] = useState(false);
  const [whatsAppTopic, setWhatsAppTopic] = useState<string | undefined>(
    undefined
  );

  // Admin Authentication & Dashboard State
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminViewActive, setAdminViewActive] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(ADMIN_TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [adminUser, setAdminUser] = useState<{
    username: string;
    email: string;
    role: string;
  } | null>(null);

  // Load live data from Sanity backend
  useEffect(() => {
    let active = true;
    fetch('/api/sanity/site-data')
      .then((res) => res.json())
      .then(
        (payload: {
          source?: string;
          projectId?: string;
          dataset?: string;
          updatedAt?: string;
          data?: SiteData;
        }) => {
          if (!active || !payload?.data) return;
          setSiteData({
            ...INITIAL_SITE_DATA,
            ...payload.data,
            brand: {
              ...INITIAL_SITE_DATA.brand,
              ...(payload.data.brand || {})
            }
          });
          setSanityMeta({
            projectId: payload.projectId || 'c5o9hb8v',
            dataset: payload.dataset || 'production',
            source: payload.source || 'sanity',
            updatedAt: payload.updatedAt
          });
        }
      )
      .catch(() => {
        // Keep local cached fallback silently
      });

    return () => {
      active = false;
    };
  }, []);

  // Verify stored admin session if present
  useEffect(() => {
    if (!adminToken) return;
    let active = true;
    fetch('/api/admin/session', {
      headers: { Authorization: `Bearer ${adminToken}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid session');
        return res.json();
      })
      .then((json: { authenticated?: boolean; user?: { username: string; email: string; role: string } }) => {
        if (!active) return;
        if (json.authenticated && json.user) {
          setAdminUser(json.user);
        } else {
          setAdminToken(null);
          setAdminUser(null);
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        }
      })
      .catch(() => {
        if (!active) return;
        setAdminToken(null);
        setAdminUser(null);
        try {
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
        } catch {
          // ignore
        }
      });

    return () => {
      active = false;
    };
  }, [adminToken]);

  // Keep localStorage cache synchronized with live siteData
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteData));
    } catch {
      // Ignore storage quota errors
    }
  }, [siteData]);

  // Sync OpenGraph & Twitter preview image with brand logo
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fullLogoUrl = siteData.brand.logoUrl.startsWith('http')
      ? siteData.brand.logoUrl
      : `${window.location.origin}${siteData.brand.logoUrl}`;
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', fullLogoUrl);
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', fullLogoUrl);
  }, [siteData.brand.logoUrl]);

  const handleOpenWhatsApp = (topic?: string) => {
    setWhatsAppTopic(topic);
    setWhatsAppModalOpen(true);
  };

  const handleRequestShootWithService = (serviceTitle: string) => {
    setSelectedServiceForForm(serviceTitle);
    navigateToPage('tournage');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitShootingRequest = (
    req: Omit<ShootingRequest, 'id' | 'createdAt' | 'status'>
  ) => {
    const newRequest: ShootingRequest = {
      ...req,
      id: `req-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'Nouveau'
    };

    setSiteData((prev) => ({
      ...prev,
      shootingRequests: [newRequest, ...(prev.shootingRequests || [])]
    }));

    fetch('/api/public/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'shootingRequest', entry: newRequest })
    }).catch(() => {
      // Non-blocking fallback
    });
  };

  const handleBookAppointment = (
    apt: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>
  ) => {
    const newApt: AppointmentBooking = {
      ...apt,
      id: `apt-${Date.now()}`,
      createdAt: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      status: 'En attente'
    };

    setSiteData((prev) => ({
      ...prev,
      appointments: [newApt, ...(prev.appointments || [])]
    }));

    fetch('/api/public/inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'appointment', entry: newApt })
    }).catch(() => {
      // Non-blocking fallback
    });
  };

  const handleOpenAdmin = () => {
    if (adminToken && adminUser) {
      setAdminViewActive(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAdminLoginOpen(true);
    }
  };

  const handleAuthenticated = (
    token: string,
    user: { username: string; email: string; role: string }
  ) => {
    setAdminToken(token);
    setAdminUser(user);
    try {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } catch {
      // ignore
    }
    setAdminLoginOpen(false);
    setAdminViewActive(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoutAdmin = () => {
    setAdminToken(null);
    setAdminUser(null);
    setAdminViewActive(false);
    try {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    } catch {
      // ignore
    }
  };

  const handleSaveToSanity = useCallback(
    async (dataToSave: SiteData) => {
      if (!adminToken) {
        return { ok: false, error: 'Session administrateur requise.' };
      }
      try {
        const res = await fetch('/api/sanity/site-data', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ data: dataToSave })
        });
        const json = (await res.json()) as {
          ok?: boolean;
          error?: string;
          updatedAt?: string;
        };
        if (!res.ok || !json.ok) {
          if (res.status === 401) {
            handleLogoutAdmin();
          }
          return { ok: false, error: json.error || 'Échec de sauvegarde Sanity' };
        }
        setSanityMeta((prev) => ({
          ...prev,
          source: 'sanity',
          updatedAt: json.updatedAt
        }));
        return { ok: true, updatedAt: json.updatedAt };
      } catch {
        return { ok: false, error: 'Erreur réseau lors de la sauvegarde vers Sanity.' };
      }
    },
    [adminToken]
  );

  return (
    <ThemeLanguageProvider>
      {/* Dynamic Route-Aware SEO Metadata, Canonical & Schema.org Graph */}
      <SeoHeadManager activePage={activePage} data={siteData} />

      {/* Subtle Fixed Reading Progress Bar at Top of Screen */}
      <ReadingProgressBar />

      {adminViewActive && adminToken && adminUser ? (
        <AdminDashboard
          data={siteData}
          authToken={adminToken}
          adminUser={adminUser}
          sanityMeta={sanityMeta}
          onUpdateData={setSiteData}
          onSaveToSanity={handleSaveToSanity}
          onLogout={handleLogoutAdmin}
          onExitToSite={() => {
            setAdminViewActive(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : (
        <div className="min-h-screen flex flex-col bg-[var(--bg-cinema)] text-[var(--text-primary)] transition-colors duration-300">
          {/* Top Bar Navigation with Powered by NHR DIGITAL AGENCY, Dark/Light & FR/EN Toggles */}
          <Navbar
            activePage={activePage}
            onNavigate={(page) => {
              if (page !== 'tournage') {
                setSelectedServiceForForm(undefined);
              }
              navigateToPage(page);
            }}
            brandName={siteData.brand.mainBrand}
            logoUrl={siteData.brand.logoUrl}
          />

          {/* Main Content View with Smooth Page Transitions */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                {activePage === 'accueil' && (
                  <PageAccueil
                    data={siteData}
                    onNavigate={navigateToPage}
                    onOpenLightbox={setLightboxMedia}
                    onOpenWhatsApp={handleOpenWhatsApp}
                    onRequestShootWithService={handleRequestShootWithService}
                  />
                )}

                {activePage === '237-cinematique' && (
                  <Page237Cinematique
                    data={siteData}
                    onNavigate={navigateToPage}
                    onOpenLightbox={setLightboxMedia}
                    onOpenWhatsApp={handleOpenWhatsApp}
                  />
                )}

                {activePage === 'portfolio' && (
                  <PagePortfolio
                    data={siteData}
                    onNavigate={navigateToPage}
                    onOpenLightbox={setLightboxMedia}
                  />
                )}

                {(activePage === 'prestations' || activePage === 'tournage') && (
                  <PagePrestationsTournage
                    data={siteData}
                    initialSelectedService={selectedServiceForForm}
                    onSubmitShootingRequest={handleSubmitShootingRequest}
                    onBookAppointment={handleBookAppointment}
                    onOpenWhatsApp={handleOpenWhatsApp}
                  />
                )}

                {activePage === 'actualites' && (
                  <PageActualites data={siteData} onNavigate={navigateToPage} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer with Subtle Gear Admin Trigger */}
          <Footer
            brand={siteData.brand}
            activePage={activePage}
            onNavigate={navigateToPage}
            onOpenWhatsApp={handleOpenWhatsApp}
            onOpenAdmin={handleOpenAdmin}
            isAdminAuthenticated={Boolean(adminToken && adminUser)}
          />

          {/* Floating Bottom-Right Button Named "Contacter" / "Contact" */}
          <FloatingContactButton onClick={() => handleOpenWhatsApp()} />

          {/* High-Resolution Lightbox & Storyboard Teaser Modal */}
          <MediaLightboxModal
            media={lightboxMedia}
            onClose={() => setLightboxMedia(null)}
            onRequestSimilarShoot={(title) =>
              handleRequestShootWithService(`Projet inspiré de : ${title}`)
            }
          />

          {/* Functional WhatsApp Composer, Site Card Preview & Quick Appointment Modal */}
          <WhatsAppModal
            isOpen={whatsAppModalOpen}
            onClose={() => setWhatsAppModalOpen(false)}
            brand={siteData.brand}
            initialTopic={whatsAppTopic}
            onBookAppointment={handleBookAppointment}
          />

          {/* Owner Admin Authentication Modal (Triggered by Footer Gear Icon) */}
          <AdminAuthModal
            isOpen={adminLoginOpen}
            onClose={() => setAdminLoginOpen(false)}
            onAuthenticated={handleAuthenticated}
            logoUrl={siteData.brand.logoUrl}
          />
        </div>
      )}
    </ThemeLanguageProvider>
  );
}
