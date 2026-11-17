import React, { useState, useEffect } from 'react';
import {
  SiteData,
  ShootingRequest,
  AppointmentBooking,
  FaqItem
} from '../data/siteContent';
import { buildWhatsAppUrl } from './WhatsAppModal';
import { RevealSection, TiltGlassCard } from './CinemaMotion';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  Send,
  Film,
  Camera,
  Sliders,
  Sparkles,
  ExternalLink,
  Calendar,
  ChevronDown,
  HelpCircle,
  Clock,
  Phone,
  Mail
} from 'lucide-react';

interface PagePrestationsTournageProps {
  data: SiteData;
  initialSelectedService?: string;
  onSubmitShootingRequest: (
    req: Omit<ShootingRequest, 'id' | 'createdAt' | 'status'>
  ) => void;
  onBookAppointment: (
    apt: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>
  ) => void;
  onOpenWhatsApp: (topic?: string) => void;
}

const DELIVERABLE_OPTIONS = [
  'Film documentaire / Format 237 Cinématique (5 à 15 min)',
  'Film manifeste entreprise / marque (2 à 4 min)',
  'Aftermovie événementiel, média ou captation sportive',
  'Série de capsules verticales haute rétention (Reels / TikTok / Shorts)',
  'Reportage photographique haute résolution en parallèle'
];

const FAQ_CATEGORIES: ('Toutes les questions' | FaqItem['category'])[] = [
  'Toutes les questions',
  'Tarifs & Devis',
  'Disponibilités & Délais',
  'Processus de tournage'
];

export const PagePrestationsTournage: React.FC<PagePrestationsTournageProps> = ({
  data,
  initialSelectedService,
  onSubmitShootingRequest,
  onBookAppointment,
  onOpenWhatsApp
}) => {
  const { brand, services, faqs } = data;
  const { lang, t } = useThemeLanguage();

  const timeSlots = [
    t('Matin · 09h00 – 12h00', 'Morning · 09:00 AM – 12:00 PM'),
    t('Après-midi · 14h00 – 17h00', 'Afternoon · 02:00 PM – 05:00 PM'),
    t('Fin de journée · 17h30 – 19h30', 'Evening · 05:30 PM – 07:30 PM')
  ];

  const [activeFormTab, setActiveFormTab] = useState<'rdv' | 'tournage'>('rdv');

  // Appointment Form State
  const [aptName, setAptName] = useState('');
  const [aptOrg, setAptOrg] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptEmail, setAptEmail] = useState('');
  const [aptType, setAptType] = useState<AppointmentBooking['meetingType']>(
    'Appel découverte (WhatsApp / Téléphone)'
  );
  const [aptDate, setAptDate] = useState('');
  const [aptSlot, setAptSlot] = useState(timeSlots[0]);
  const [aptCity, setAptCity] = useState('Yaoundé, Cameroun');
  const [aptTopic, setAptTopic] = useState(initialSelectedService || '');
  const [aptState, setAptState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [aptError, setAptError] = useState('');
  const [aptSummary, setAptSummary] = useState('');

  // Shooting Request Form State
  const [clientName, setClientName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [phoneWhatsapp, setPhoneWhatsapp] = useState('');
  const [projectType, setProjectType] = useState(
    initialSelectedService || services[0]?.title || 'Documentaires Cinématographiques'
  );
  const [location, setLocation] = useState('Yaoundé, Cameroun');
  const [desiredDate, setDesiredDate] = useState('');
  const [selectedDeliverables, setSelectedDeliverables] = useState<string[]>([
    DELIVERABLE_OPTIONS[0]
  ]);
  const [narrativeBrief, setNarrativeBrief] = useState('');
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [lastSubmittedSummary, setLastSubmittedSummary] = useState('');

  // FAQ State
  const [selectedFaqCat, setSelectedFaqCat] = useState<
    'Toutes les questions' | FaqItem['category']
  >('Toutes les questions');
  const [openFaqIds, setOpenFaqIds] = useState<string[]>([
    faqs[0]?.id || 'faq-01',
    faqs[2]?.id || 'faq-03'
  ]);

  useEffect(() => {
    if (initialSelectedService) {
      setProjectType(initialSelectedService);
      setAptTopic(initialSelectedService);
      const formEl = document.getElementById('espace-reservation');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [initialSelectedService]);

  const toggleDeliverable = (option: string) => {
    setSelectedDeliverables((prev) =>
      prev.includes(option) ? prev.filter((d) => d !== option) : [...prev, option]
    );
  };

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFaqs =
    selectedFaqCat === 'Toutes les questions'
      ? faqs
      : faqs.filter((f) => f.category === selectedFaqCat);

  const handleAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAptError('');

    if (!aptName.trim() || !aptPhone.trim() || !aptDate) {
      setAptState('error');
      setAptError(
        t(
          'Veuillez renseigner votre nom, votre numéro WhatsApp/téléphone et la date souhaitée pour le rendez-vous.',
          'Please enter your name, WhatsApp/phone number, and preferred date for the appointment.'
        )
      );
      return;
    }

    setAptState('submitting');

    window.setTimeout(() => {
      onBookAppointment({
        clientName: aptName.trim(),
        organization: aptOrg.trim() || 'Indépendant / Particulier',
        phoneWhatsapp: aptPhone.trim(),
        email: aptEmail.trim() || 'Non précisé',
        meetingType: aptType,
        preferredDate: aptDate,
        preferredTimeSlot: aptSlot,
        city: aptCity.trim() || 'Yaoundé / Cameroun (+237)',
        topic: aptTopic.trim() || 'Cadrage de projet audiovisuel'
      });

      const summary = [
        `*PRISE DE RENDEZ-VOUS — ${brand.mainBrand.toUpperCase()}*`,
        `Bonjour ${brand.directorName},`,
        `Je souhaite planifier un rendez-vous :`,
        `• Nom : ${aptName.trim()} (${aptOrg.trim() || 'Indépendant'})`,
        `• Téléphone : ${aptPhone.trim()}`,
        `• Format : ${aptType}`,
        `• Date souhaitée : ${aptDate}`,
        `• Créneau : ${aptSlot}`,
        `• Ville : ${aptCity.trim()}`,
        `• Objet : ${aptTopic.trim() || 'Projet audiovisuel'}`
      ].join('\n');

      setAptSummary(summary);
      setAptState('success');
    }, 300);
  };

  const handleShootingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!clientName.trim() || !phoneWhatsapp.trim() || !narrativeBrief.trim()) {
      setFormState('error');
      setErrorMessage(
        t(
          'Veuillez renseigner au minimum votre nom, votre numéro WhatsApp/téléphone et le résumé de votre projet.',
          'Please enter at least your name, WhatsApp/phone number, and your project summary.'
        )
      );
      return;
    }

    setFormState('submitting');

    window.setTimeout(() => {
      const deliverablesStr =
        selectedDeliverables.length > 0
          ? selectedDeliverables.join(' + ')
          : 'À définir ensemble';

      onSubmitShootingRequest({
        clientName: clientName.trim(),
        organization: organization.trim() || 'Particulier / Indépendant',
        email: email.trim() || 'Non précisé',
        phoneWhatsapp: phoneWhatsapp.trim(),
        projectType,
        location: location.trim() || 'Yaoundé / Cameroun (+237)',
        desiredDate: desiredDate.trim() || 'Dates flexibles',
        deliverables: deliverablesStr,
        narrativeBrief: narrativeBrief.trim()
      });

      const waSummary = [
        `*DEMANDE DE TOURNAGE — ${brand.mainBrand.toUpperCase()}*`,
        `Bonjour ${brand.directorName},`,
        `Je viens de soumettre un brief de tournage :`,
        `• Nom : ${clientName.trim()} (${organization.trim() || 'Indépendant'})`,
        `• Contact : ${phoneWhatsapp.trim()}`,
        `• Prestation : ${projectType}`,
        `• Lieu : ${location.trim()}`,
        `• Période : ${desiredDate.trim() || 'À définir'}`,
        `• Livrables : ${deliverablesStr}`,
        `• Brief : ${narrativeBrief.trim()}`
      ].join('\n');

      setLastSubmittedSummary(waSummary);
      setFormState('success');
    }, 300);
  };

  const handleSelectService = (serviceTitle: string, mode: 'rdv' | 'tournage') => {
    setProjectType(serviceTitle);
    setAptTopic(serviceTitle);
    setActiveFormTab(mode);
    const formEl = document.getElementById('espace-reservation');
    if (formEl) {
      formEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 pt-6 sm:pt-12 px-4 sm:px-8 lg:px-12 max-w-[1440px] mx-auto">
      {/* 1. PRESTATIONS DÉTAILLÉES */}
      <section className="space-y-10">
        <RevealSection className="space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
            <span>
              {t(
                'PRESTATIONS AUDIOVISUELLES & PHOTOGRAPHIQUES · YAOUNDÉ & CAMEROUN',
                'AUDIOVISUAL & PHOTOGRAPHY SERVICES · YAOUNDÉ & CAMEROON'
              )}
            </span>
            <span aria-hidden="true">·</span>
            <span>TOMY CREATOR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-[var(--text-primary)]">
            {t(
              'Des productions pensées pour marquer les esprits',
              'Productions crafted to leave a lasting impression'
            )}
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            {t(
              'Que vous soyez une entreprise souhaitant révéler son savoir-faire, une marque de mode ou de beauté, un média ou un organisateur d’événement sportif, Thomas Fotso conçoit chaque tournage sur mesure.',
              'Whether you are a company showcasing its expertise, a fashion or beauty brand, a TV network, or a sports event organizer, Thomas Fotso designs every shoot to measure.'
            )}
          </p>
        </RevealSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((srv, idx) => {
            const titleText = lang === 'en' && srv.titleEn ? srv.titleEn : srv.title;
            const subtitleText =
              lang === 'en' && srv.subtitleEn ? srv.subtitleEn : srv.subtitle;
            const descText =
              lang === 'en' && srv.descriptionEn ? srv.descriptionEn : srv.description;
            const delivList =
              lang === 'en' && srv.deliverablesEn
                ? srv.deliverablesEn
                : srv.deliverables;
            const priceText =
              lang === 'en' && srv.pricingNoteEn ? srv.pricingNoteEn : srv.pricingNote;

            return (
              <RevealSection key={srv.id} delay={idx * 0.08}>
                <TiltGlassCard
                  intensity={4}
                  className="glass-panel card-hover-cinema rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full"
                >
                  <div className="flex flex-col h-full justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--accent-primary)] font-semibold">
                        <span className="tabular-nums">
                          {t('PRESTATION', 'SERVICE')} {srv.index}
                        </span>
                        <span className="text-[var(--text-secondary)] font-normal">
                          {priceText}
                        </span>
                      </div>

                      <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                        {titleText}
                      </h2>

                      <p className="text-sm font-medium text-[var(--text-primary)]/90">
                        {subtitleText}
                      </p>

                      <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {descText}
                      </p>

                      <div className="pt-3 border-t border-[var(--glass-border)] space-y-2">
                        <div className="text-xs font-semibold text-[var(--accent-primary)]">
                          {t(
                            'Livrables & Dispositif inclus :',
                            'Included Deliverables & Setup:'
                          )}
                        </div>
                        <ul className="space-y-1.5 text-xs sm:text-sm text-[var(--text-secondary)]">
                          {delivList.map((deliv) => (
                            <li key={deliv} className="flex items-start gap-2">
                              <span className="text-[var(--accent-primary)] select-none">
                                ·
                              </span>
                              <span>{deliv}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[var(--glass-border)] flex flex-wrap items-center justify-between gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSelectService(titleText, 'rdv')}
                        className="btn-cinema-glow px-4 py-2.5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>
                          {t('Prendre RDV pour ce service', 'Book a Call for this service')}
                        </span>
                      </motion.button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => handleSelectService(titleText, 'tournage')}
                        className="px-4 py-2.5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs font-medium transition-colors"
                      >
                        {t('Demander un devis détaillé', 'Request a detailed quote')}
                      </motion.button>
                    </div>
                  </div>
                </TiltGlassCard>
              </RevealSection>
            );
          })}
        </div>
      </section>

      {/* 2. MÉTHODOLOGIE DE PRODUCTION EN 4 TEMPS */}
      <RevealSection className="glass-panel rounded-3xl p-5 sm:p-10 space-y-8">
        <div className="space-y-1">
          <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
            {t(
              'MÉTHODE DE TRAVAIL · DU PREMIER RENDEZ-VOUS À L’ÉCRAN',
              'WORKFLOW · FROM FIRST MEETING TO FINAL SCREEN'
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">
            {t(
              'Comment se déroule une production avec Tomy Creator',
              'How a production unfolds with Tomy Creator'
            )}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              step: t('ÉTAPE 01', 'STEP 01'),
              title: t('Rendez-vous & Écriture', 'Meeting & Writing'),
              desc: t(
                'Écoute de votre besoin en rendez-vous, repérage des lieux et définition de l’angle narratif.',
                'Discovery meeting to understand your goals, location scouting, and narrative scripting.'
              ),
              icon: Sparkles
            },
            {
              step: t('ÉTAPE 02', 'STEP 02'),
              title: t('Tournage Terrain', 'On-Location Shoot'),
              desc: t(
                'Déploiement adapté au sujet : optique téléobjectif sur trépied fluide ou mobilité stabilisée 3 axes.',
                'Tailored camera rig deployment: telephoto lens on fluid tripod or 3-axis gimbal mobility.'
              ),
              icon: Camera
            },
            {
              step: t('ÉTAPE 03', 'STEP 03'),
              title: t('Montage & Étalonnage', 'Editing & Color Grading'),
              desc: t(
                'Construction du rythme dramaturgique, habillage sonore immersif et étalonnage des couleurs typé cinéma.',
                'Dramatic pacing, immersive sound design, and cinema-grade color grading.'
              ),
              icon: Sliders
            },
            {
              step: t('ÉTAPE 04', 'STEP 04'),
              title: t('Livraison Multi-Formats', 'Multi-Format Delivery'),
              desc: t(
                'Remise des masters haute définition (16:9 diffusion et 9:16 réseaux sociaux) prêts à rayonner.',
                'High-definition master delivery (16:9 broadcast and 9:16 social media formats).'
              ),
              icon: Film
            }
          ].map((item) => {
            const IconComp = item.icon;
            return (
              <TiltGlassCard
                key={item.step}
                intensity={5}
                className="p-5 rounded-3xl glass-panel card-hover-cinema space-y-2"
              >
                <div className="flex items-center justify-between text-xs text-[var(--accent-primary)] font-semibold">
                  <span className="tabular-nums">{item.step}</span>
                  <IconComp className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">{item.desc}</p>
              </TiltGlassCard>
            );
          })}
        </div>
      </RevealSection>

      {/* 3. ESPACE PRISE DE RENDEZ-VOUS & FORMULAIRE DE TOURNAGE */}
      <RevealSection id="espace-reservation" className="scroll-mt-24">
        <div className="glass-panel-strong rounded-3xl p-5 sm:p-10 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Left Info Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-2">
                <div className="text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
                  {t('PLANIFICATION & RÉSERVATION', 'SCHEDULING & BOOKING')}
                </div>
                <h2 className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]">
                  {t(
                    'Prendre rendez-vous ou demander un tournage',
                    'Book an appointment or request a shoot'
                  )}
                </h2>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  {t(
                    'Choisissez entre une prise de rendez-vous rapide (appel découverte, visioconférence ou rencontre sur site à Yaoundé/Douala) ou un brief complet de tournage.',
                    'Choose between a quick appointment booking (discovery call, video conference, or on-site meeting in Yaoundé/Douala) or a full shooting brief.'
                  )}
                </p>
              </div>

              {/* Switch Buttons */}
              <div className="grid grid-cols-2 gap-2 p-1.5 rounded-3xl glass-panel">
                <button
                  type="button"
                  onClick={() => setActiveFormTab('rdv')}
                  className={`py-3 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeFormTab === 'rdv'
                      ? 'bg-[var(--accent-primary)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>{t('Prise de RDV', 'Book Appointment')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveFormTab('tournage')}
                  className={`py-3 px-3 rounded-2xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    activeFormTab === 'tournage'
                      ? 'bg-[var(--accent-primary)] text-white shadow-md'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Film className="w-4 h-4 shrink-0" />
                  <span>{t('Brief Tournage', 'Shooting Brief')}</span>
                </button>
              </div>

              <div className="p-5 rounded-3xl glass-panel space-y-3 text-xs sm:text-sm text-[var(--text-secondary)]">
                <div className="flex items-center gap-3">
                  <img
                    src={brand.logoUrl}
                    alt={brand.mainBrand}
                    referrerPolicy="no-referrer"
                    className="w-11 h-11 rounded-2xl object-cover border border-[var(--glass-border)]"
                  />
                  <div>
                    <div className="text-[var(--text-primary)] font-semibold">
                      {brand.mainBrand}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                      {brand.directorName}
                    </div>
                  </div>
                </div>
                <div>
                  <strong className="text-[var(--accent-primary)]">
                    {t('Zone :', 'Location:')}
                  </strong>{' '}
                  {lang === 'en' ? brand.locationLabelEn : brand.locationLabel}
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                  <strong className="text-[var(--text-primary)]">
                    {brand.whatsappDisplay}
                  </strong>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)] shrink-0" />
                  <strong className="text-[var(--text-primary)]">
                    {brand.contactEmail}
                  </strong>
                </div>
                <div className="pt-2">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenWhatsApp(projectType)}
                    className="w-full py-2.5 px-4 rounded-full bg-[var(--accent-primary)]/15 hover:bg-[var(--accent-primary)] hover:text-white border border-[var(--accent-primary)]/40 text-[var(--text-primary)] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>
                      {t('Contact direct WhatsApp', 'Direct WhatsApp Contact')}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Right Interactive Form Column */}
            <div className="lg:col-span-7">
              <AnimatePresence mode="wait">
                {activeFormTab === 'rdv' ? (
                  aptState === 'success' ? (
                    <motion.div
                      key="rdv-success"
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--accent-primary)] space-y-6"
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-6 h-6 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                            {t(
                              'Rendez-vous préparé avec succès',
                              'Appointment prepared successfully'
                            )}
                          </h3>
                          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                            {t(
                              `Cliquez ci-dessous pour envoyer et confirmer immédiatement votre créneau sur le WhatsApp officiel de Thomas Fotso (${brand.whatsappDisplay}).`,
                              `Click below to immediately send and confirm your slot on Thomas Fotso's official WhatsApp (${brand.whatsappDisplay}).`
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl glass-panel text-xs text-[var(--text-primary)]">
                        <div className="text-[var(--accent-primary)] font-semibold mb-1">
                          {t(
                            'Récapitulatif de votre rendez-vous :',
                            'Your Appointment Summary:'
                          )}
                        </div>
                        <pre className="whitespace-pre-wrap font-sans">{aptSummary}</pre>
                      </div>

                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                          href={buildWhatsAppUrl(brand.whatsappNumber, aptSummary)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-3.5 px-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span>
                            {t(
                              'Confirmer le RDV sur WhatsApp',
                              'Confirm Appointment on WhatsApp'
                            )}
                          </span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                        <button
                          type="button"
                          onClick={() => setAptState('idle')}
                          className="py-3.5 px-5 rounded-full glass-panel text-[var(--text-primary)] text-xs sm:text-sm font-medium transition-colors"
                        >
                          {t('Planifier un autre RDV', 'Book another slot')}
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="rdv-form"
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleAppointmentSubmit}
                      className="space-y-4"
                      noValidate
                    >
                      <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
                        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                          <Calendar className="w-4 h-4 text-[var(--accent-primary)]" />
                          <span>
                            {t(
                              'Formulaire de Prise de Rendez-vous',
                              'Appointment Booking Form'
                            )}
                          </span>
                        </div>
                        <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                          <span>{t('Réponse sous 24h', 'Reply within 24h')}</span>
                        </span>
                      </div>

                      {aptState === 'error' && (
                        <div
                          role="alert"
                          className="p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-xs sm:text-sm text-[var(--text-primary)] flex items-start gap-2.5"
                        >
                          <AlertCircle className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                          <span>{aptError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="apt-name"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Nom & Prénom *', 'Full Name *')}
                          </label>
                          <input
                            id="apt-name"
                            type="text"
                            required
                            value={aptName}
                            onChange={(e) => setAptName(e.target.value)}
                            placeholder="Ex. Samuel E. / Marie K."
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="apt-org"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Entreprise / Organisation', 'Company / Organization')}
                          </label>
                          <input
                            id="apt-org"
                            type="text"
                            value={aptOrg}
                            onChange={(e) => setAptOrg(e.target.value)}
                            placeholder={t('Nom de votre structure', 'Your company name')}
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="apt-phone"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Téléphone / WhatsApp *', 'Phone / WhatsApp *')}
                          </label>
                          <input
                            id="apt-phone"
                            type="tel"
                            required
                            value={aptPhone}
                            onChange={(e) => setAptPhone(e.target.value)}
                            placeholder="+237 6..."
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="apt-email"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('E-mail professionnel', 'Business Email')}
                          </label>
                          <input
                            id="apt-email"
                            type="email"
                            value={aptEmail}
                            onChange={(e) => setAptEmail(e.target.value)}
                            placeholder="contact@entreprise.cm"
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="apt-type"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t(
                            'Format du rendez-vous souhaité',
                            'Preferred Meeting Format'
                          )}
                        </label>
                        <select
                          id="apt-type"
                          value={aptType}
                          onChange={(e) =>
                            setAptType(
                              e.target.value as AppointmentBooking['meetingType']
                            )
                          }
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                        >
                          <option value="Appel découverte (WhatsApp / Téléphone)">
                            {t(
                              'Appel découverte (WhatsApp / Téléphone)',
                              'Discovery Call (WhatsApp / Phone)'
                            )}
                          </option>
                          <option value="Visioconférence de cadrage">
                            {t('Visioconférence de cadrage', 'Video Conference')}
                          </option>
                          <option value="Rencontre physique & Repérage sur site">
                            {t(
                              'Rencontre physique & Repérage sur site',
                              'In-Person Meeting & Location Scouting'
                            )}
                          </option>
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label
                            htmlFor="apt-date"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Date souhaitée *', 'Preferred Date *')}
                          </label>
                          <input
                            id="apt-date"
                            type="date"
                            required
                            value={aptDate}
                            onChange={(e) => setAptDate(e.target.value)}
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="apt-slot"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Créneau horaire', 'Time Slot')}
                          </label>
                          <select
                            id="apt-slot"
                            value={aptSlot}
                            onChange={(e) => setAptSlot(e.target.value)}
                            className="theme-adaptive-input w-full px-3.5 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                          >
                            {timeSlots.map((slot) => (
                              <option key={slot} value={slot}>
                                {slot}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="apt-city"
                            className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                          >
                            {t('Ville / Lieu', 'City / Location')}
                          </label>
                          <input
                            id="apt-city"
                            type="text"
                            value={aptCity}
                            onChange={(e) => setAptCity(e.target.value)}
                            placeholder="Yaoundé, Douala..."
                            className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                          />
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="apt-topic"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t(
                            'Sujet du rendez-vous & attentes',
                            'Meeting Topic & Expectations'
                          )}
                        </label>
                        <textarea
                          id="apt-topic"
                          rows={3}
                          value={aptTopic}
                          onChange={(e) => setAptTopic(e.target.value)}
                          placeholder={t(
                            "Précisez l'objet de l'échange...",
                            'Describe the purpose of our meeting...'
                          )}
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>

                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={aptState === 'submitting'}
                        className="btn-cinema-glow w-full py-3.5 px-6 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                      >
                        <Calendar className="w-4 h-4" />
                        <span>
                          {aptState === 'submitting'
                            ? t('Préparation...', 'Preparing...')
                            : t(
                                'Confirmer la prise de rendez-vous',
                                'Confirm Appointment Booking'
                              )}
                        </span>
                      </motion.button>
                    </motion.form>
                  )
                ) : formState === 'success' ? (
                  <motion.div
                    key="shoot-success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-6 sm:p-8 rounded-3xl glass-panel border border-[var(--accent-primary)] space-y-6"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-6 h-6 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                          {t(
                            'Brief de tournage prêt',
                            'Shooting brief ready'
                          )}
                        </h3>
                        <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
                          {t(
                            `Transmettez maintenant votre brief directement à Thomas Fotso sur WhatsApp (${brand.whatsappDisplay}) ou par e-mail (${brand.contactEmail}).`,
                            `Send your brief directly to Thomas Fotso on WhatsApp (${brand.whatsappDisplay}) or by email (${brand.contactEmail}).`
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl glass-panel text-xs text-[var(--text-primary)]">
                      <div className="text-[var(--accent-primary)] font-semibold mb-1">
                        {t('Récapitulatif du brief :', 'Brief Summary:')}
                      </div>
                      <pre className="whitespace-pre-wrap font-sans">
                        {lastSubmittedSummary}
                      </pre>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <a
                        href={buildWhatsAppUrl(brand.whatsappNumber, lastSubmittedSummary)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-3.5 px-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>
                          {t(
                            'Envoyer ce brief sur WhatsApp',
                            'Send Brief on WhatsApp'
                          )}
                        </span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      <button
                        type="button"
                        onClick={() => {
                          setFormState('idle');
                          setNarrativeBrief('');
                        }}
                        className="py-3.5 px-5 rounded-full glass-panel text-[var(--text-primary)] text-xs sm:text-sm font-medium transition-colors"
                      >
                        {t('Nouvelle demande', 'New Request')}
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.form
                    key="shoot-form"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={handleShootingSubmit}
                    className="space-y-4"
                    noValidate
                  >
                    <div className="flex items-center justify-between border-b border-[var(--glass-border)] pb-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
                        <Film className="w-4 h-4 text-[var(--accent-primary)]" />
                        <span>
                          {t(
                            'Formulaire de Demande de Tournage & Devis',
                            'Shooting Request & Quote Form'
                          )}
                        </span>
                      </div>
                    </div>

                    {formState === 'error' && (
                      <div
                        role="alert"
                        className="p-4 rounded-2xl bg-red-500/15 border border-red-400/40 text-xs sm:text-sm text-[var(--text-primary)] flex items-start gap-2.5"
                      >
                        <AlertCircle className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="shoot-name"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Nom & Prénom *', 'Full Name *')}
                        </label>
                        <input
                          id="shoot-name"
                          type="text"
                          required
                          value={clientName}
                          onChange={(e) => setClientName(e.target.value)}
                          placeholder="Ex. Jean-Marc Kamga"
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="shoot-org"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t(
                            'Entreprise / Institution / Projet',
                            'Company / Institution / Project'
                          )}
                        </label>
                        <input
                          id="shoot-org"
                          type="text"
                          value={organization}
                          onChange={(e) => setOrganization(e.target.value)}
                          placeholder="Ex. Cimaco / Maison Orchelle..."
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="shoot-phone"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Téléphone / WhatsApp *', 'Phone / WhatsApp *')}
                        </label>
                        <input
                          id="shoot-phone"
                          type="tel"
                          required
                          value={phoneWhatsapp}
                          onChange={(e) => setPhoneWhatsapp(e.target.value)}
                          placeholder="+237 6..."
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="shoot-email"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Adresse e-mail professionnelle', 'Business Email')}
                        </label>
                        <input
                          id="shoot-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="contact@entreprise.cm"
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label
                          htmlFor="shoot-type"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Type de prestation', 'Service Type')}
                        </label>
                        <select
                          id="shoot-type"
                          value={projectType}
                          onChange={(e) => setProjectType(e.target.value)}
                          className="theme-adaptive-input w-full px-3.5 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.title}>
                              {lang === 'en' && s.titleEn ? s.titleEn : s.title}
                            </option>
                          ))}
                          <option value="Proposition d'épisode 237 Cinématique">
                            {t(
                              'Proposition d’épisode 237 Cinématique',
                              '237 Cinématique Episode Proposal'
                            )}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor="shoot-location"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Ville / Lieu du tournage', 'Shooting City / Location')}
                        </label>
                        <input
                          id="shoot-location"
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="Yaoundé, Douala, Kribi..."
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="shoot-date"
                          className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                        >
                          {t('Période ou date souhaitée', 'Preferred Date / Period')}
                        </label>
                        <input
                          id="shoot-date"
                          type="text"
                          value={desiredDate}
                          onChange={(e) => setDesiredDate(e.target.value)}
                          placeholder={t('Ex. Décembre 2026', 'e.g. December 2026')}
                          className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                        />
                      </div>
                    </div>

                    <fieldset>
                      <legend className="block text-xs font-medium text-[var(--text-primary)] mb-2">
                        {t(
                          'Formats & Livrables souhaités',
                          'Desired Formats & Deliverables'
                        )}
                      </legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {DELIVERABLE_OPTIONS.map((opt) => {
                          const checked = selectedDeliverables.includes(opt);
                          return (
                            <label
                              key={opt}
                              className={`flex items-start gap-2.5 p-3 rounded-2xl border text-xs cursor-pointer transition-colors ${
                                checked
                                  ? 'bg-[var(--accent-primary)]/15 border-[var(--accent-primary)] text-[var(--text-primary)] font-medium'
                                  : 'glass-panel text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleDeliverable(opt)}
                                className="mt-0.5 accent-[var(--accent-primary)]"
                              />
                              <span>{opt}</span>
                            </label>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label
                        htmlFor="shoot-brief"
                        className="block text-xs font-medium text-[var(--text-primary)] mb-1.5"
                      >
                        {t(
                          'Votre histoire, vos objectifs et le contexte du tournage *',
                          'Your story, goals, and shooting context *'
                        )}
                      </label>
                      <textarea
                        id="shoot-brief"
                        rows={4}
                        required
                        value={narrativeBrief}
                        onChange={(e) => setNarrativeBrief(e.target.value)}
                        placeholder={t(
                          'Décrivez le lieu, l’activité, l’émotion recherchée...',
                          'Describe the location, activity, and desired visual emotion...'
                        )}
                        className="theme-adaptive-input w-full px-4 py-3 rounded-2xl bg-black/80 border border-white/15 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                      />
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={formState === 'submitting'}
                      className="btn-cinema-glow w-full py-3.5 px-6 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Send className="w-4 h-4" />
                      <span>
                        {formState === 'submitting'
                          ? t('Préparation...', 'Preparing...')
                          : t(
                              'Valider ma demande de tournage',
                              'Submit Shooting Request'
                            )}
                      </span>
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </RevealSection>

      {/* 4. SECTION QUESTIONS FRÉQUENTES (FAQ) */}
      <RevealSection className="space-y-8" aria-labelledby="faq-heading">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs text-[var(--accent-primary)] font-semibold tracking-wide">
              <HelpCircle className="w-4 h-4" />
              <span>
                {t(
                  'QUESTIONS FRÉQUENTES (FAQ) · TARIFS, DISPONIBILITÉS & TOURNAGE',
                  'FREQUENTLY ASKED QUESTIONS (FAQ) · RATES, AVAILABILITY & SHOOTING'
                )}
              </span>
            </div>
            <h2
              id="faq-heading"
              className="text-2xl sm:text-4xl font-bold text-[var(--text-primary)]"
            >
              {t(
                'Tout savoir avant de lancer votre production',
                'Everything you need to know before launching your production'
              )}
            </h2>
          </div>

          {/* FAQ Category Filter */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-full glass-panel overflow-x-auto no-scrollbar max-w-full self-start">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedFaqCat(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  selectedFaqCat === cat
                    ? 'bg-[var(--accent-primary)] text-white shadow-md'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {cat === 'Toutes les questions'
                  ? t('Toutes les questions', 'All Questions')
                  : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqIds.includes(faq.id);
            const questionText =
              lang === 'en' && faq.questionEn ? faq.questionEn : faq.question;
            const answerText =
              lang === 'en' && faq.answerEn ? faq.answerEn : faq.answer;

            return (
              <div
                key={faq.id}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'glass-panel-strong border-[var(--accent-primary)]/60'
                    : 'glass-panel hover:border-[var(--accent-primary)]/40'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-[var(--accent-primary)] block">
                      {faq.category}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                      {questionText}
                    </h3>
                  </div>
                  <span
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen
                        ? 'bg-[var(--accent-primary)] text-white rotate-180'
                        : 'glass-panel text-[var(--text-secondary)]'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-[var(--glass-border)] text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                        {answerText}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </RevealSection>
    </div>
  );
};
