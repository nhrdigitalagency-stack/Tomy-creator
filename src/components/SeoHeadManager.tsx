import React, { useEffect } from 'react';
import { PageRoute } from './Navbar';
import { SiteData } from '../data/siteContent';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface SeoHeadManagerProps {
  activePage: PageRoute;
  data: SiteData;
}

const ROUTE_PATHS: Record<PageRoute, string> = {
  accueil: '/',
  '237-cinematique': '/237-cinematique',
  portfolio: '/portfolio',
  prestations: '/prestations',
  tournage: '/tournage',
  actualites: '/actualites'
};

export const SeoHeadManager: React.FC<SeoHeadManagerProps> = ({ activePage, data }) => {
  const { lang } = useThemeLanguage();

  useEffect(() => {
    if (typeof document === 'undefined' || typeof window === 'undefined') return;

    const origin = window.location.origin;
    const routePath = ROUTE_PATHS[activePage] || '/';
    const canonicalUrl = `${origin}${routePath}`;
    const fullLogoUrl = data.brand.logoUrl.startsWith('http')
      ? data.brand.logoUrl
      : `${origin}${data.brand.logoUrl}`;

    // Optimal SEO titles (35-60 chars) & meta descriptions (120-160 chars) per route and language
    const seoMap: Record<
      PageRoute,
      {
        titleFr: string;
        titleEn: string;
        descFr: string;
        descEn: string;
        breadcrumbFr: string;
        breadcrumbEn: string;
      }
    > = {
      accueil: {
        titleFr: 'Tomy Creator — Réalisateur & 237 Cinématique | Douala',
        titleEn: 'Tomy Creator — Film Director & 237 Cinématique | Douala',
        descFr:
          "Thomas Fotso (Tomy Creator), réalisateur audiovisuel à Douala, Cameroun. Documentaires 237 Cinématique, films d'entreprise et sport. Demandez votre devis.",
        descEn:
          'Thomas Fotso (Tomy Creator), film director in Douala, Cameroon. 237 Cinématique documentaries, corporate films & sports coverage. Request your quote.',
        breadcrumbFr: 'Accueil',
        breadcrumbEn: 'Home'
      },
      '237-cinematique': {
        titleFr: '237 Cinématique — Documentaires Cameroun | Tomy Creator',
        titleEn: '237 Cinématique — Cameroon Documentaries | Tomy Creator',
        descFr:
          'Et si on redécouvrait le Cameroun comme un film ? Explorez les épisodes, la carte interactive +237 et les lieux filmés par Thomas Fotso.',
        descEn:
          'What if we rediscovered Cameroon like a movie? Explore episodes, the interactive +237 map, and filming locations directed by Thomas Fotso.',
        breadcrumbFr: '237 Cinématique',
        breadcrumbEn: '237 Cinématique'
      },
      portfolio: {
        titleFr: 'Portfolio Vidéo & Photo — Tomy Creator Douala (+237)',
        titleEn: 'Video & Photo Portfolio — Tomy Creator Douala (+237)',
        descFr:
          'Découvrez le portfolio photo et vidéo de Thomas Fotso : captation sportive en stade, portraits éditoriaux, films corporate et mobile filmmaking.',
        descEn:
          'Explore Thomas Fotso’s photo and video portfolio: stadium sports cinematography, editorial portraits, corporate films, and mobile filmmaking.',
        breadcrumbFr: 'Portfolio',
        breadcrumbEn: 'Portfolio'
      },
      prestations: {
        titleFr: 'Prestations Audiovisuelles & FAQ — Tomy Creator Douala',
        titleEn: 'Audiovisual Services & FAQ — Tomy Creator Douala',
        descFr:
          "Documentaires, films d'entreprise, captation sportive et formats courts à Douala & Cameroun. Consultez nos prestations, FAQ et prenez rendez-vous.",
        descEn:
          'Documentaries, corporate films, sports coverage, and short-form video in Douala & Cameroon. View services, FAQs, and book a consultation.',
        breadcrumbFr: 'Prestations & FAQ',
        breadcrumbEn: 'Services & FAQ'
      },
      tournage: {
        titleFr: 'Prendre RDV & Devis Tournage — Tomy Creator Cameroun',
        titleEn: 'Book a Shoot & Request Quote — Tomy Creator Cameroon',
        descFr:
          'Réservez un créneau de rendez-vous ou soumettez votre brief de tournage vidéo/photo à Douala et au Cameroun. Réponse sous 24h sur WhatsApp ou e-mail.',
        descEn:
          'Book an appointment slot or submit your video/photo production brief in Douala and Cameroon. Fast response within 24h via WhatsApp or email.',
        breadcrumbFr: 'Prise de RDV & Tournage',
        breadcrumbEn: 'Book a Call & Shoot'
      },
      actualites: {
        titleFr: 'Actualités & Carnets de Tournage — 237 Cinématique',
        titleEn: 'News & Production Notes — 237 Cinématique',
        descFr:
          'Suivez les actualités de Tomy Creator, les coulisses des tournages au Cameroun, les collaborations marques et le manifeste officiel 237 Cinématique.',
        descEn:
          'Follow Tomy Creator news, behind-the-scenes stories across Cameroon, brand collaborations, and the official 237 Cinématique manifesto.',
        breadcrumbFr: 'Actualités',
        breadcrumbEn: 'News'
      }
    };

    const activeSeo = seoMap[activePage] || seoMap.accueil;
    const title = lang === 'en' ? activeSeo.titleEn : activeSeo.titleFr;
    const description = lang === 'en' ? activeSeo.descEn : activeSeo.descFr;
    const breadcrumbLabel = lang === 'en' ? activeSeo.breadcrumbEn : activeSeo.breadcrumbFr;

    document.title = title;

    const setMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
    setMeta('meta[property="og:image"]', 'property', 'og:image', fullLogoUrl);
    setMeta('meta[property="og:image:secure_url"]', 'property', 'og:image:secure_url', fullLogoUrl);
    setMeta('meta[property="og:locale"]', 'property', 'og:locale', lang === 'en' ? 'en_US' : 'fr_CM');
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', fullLogoUrl);

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Dynamic JSON-LD for BreadcrumbList & live Sanity FAQs
    const dynamicScriptId = 'tomy-dynamic-seo-jsonld';
    let jsonLdEl = document.getElementById(dynamicScriptId) as HTMLScriptElement | null;
    if (!jsonLdEl) {
      jsonLdEl = document.createElement('script');
      jsonLdEl.id = dynamicScriptId;
      jsonLdEl.type = 'application/ld+json';
      document.head.appendChild(jsonLdEl);
    }

    const breadcrumbItems = [
      {
        '@type': 'ListItem',
        position: 1,
        name: lang === 'en' ? 'Home' : 'Accueil',
        item: `${origin}/`
      }
    ];
    if (activePage !== 'accueil') {
      breadcrumbItems.push({
        '@type': 'ListItem',
        position: 2,
        name: breadcrumbLabel,
        item: canonicalUrl
      });
    }

    const dynamicSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: breadcrumbItems
        },
        {
          '@type': 'FAQPage',
          mainEntity: (data.faqs || []).map((faq) => ({
            '@type': 'Question',
            name: lang === 'en' && faq.questionEn ? faq.questionEn : faq.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: lang === 'en' && faq.answerEn ? faq.answerEn : faq.answer
            }
          }))
        }
      ]
    };

    jsonLdEl.textContent = JSON.stringify(dynamicSchema);
  }, [activePage, lang, data.brand.logoUrl, data.faqs]);

  return null;
};
