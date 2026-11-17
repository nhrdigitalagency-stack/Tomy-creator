import React, { useState } from 'react';
import {
  MessageCircle,
  X,
  Copy,
  Check,
  ExternalLink,
  Calendar,
  Share2,
  CheckCircle2,
  Mail,
  Phone
} from 'lucide-react';
import { BrandConfig, AppointmentBooking } from '../data/siteContent';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  brand: BrandConfig;
  initialTopic?: string;
  onBookAppointment?: (
    apt: Omit<AppointmentBooking, 'id' | 'createdAt' | 'status'>
  ) => void;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const digitsOnly = phone.replace(/[^0-9]/g, '') || '237694925851';
  return `https://wa.me/${digitsOnly}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppShareSiteUrl(brand: BrandConfig): string {
  const siteUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-xjilhi3dvoeq4piieichav-323022168140.europe-west2.run.app';
  const shareText = [
    `*${brand.mainBrand.toUpperCase()} — ${brand.directorName}*`,
    `${brand.roleTitle} | Projet phare : *${brand.flagshipProject}*`,
    `« ${brand.flagshipSlogan} »`,
    `WhatsApp : ${brand.whatsappDisplay} | E-mail : ${brand.contactEmail}`,
    siteUrl
  ].join('\n');
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  isOpen,
  onClose,
  brand,
  initialTopic,
  onBookAppointment
}) => {
  const { t } = useThemeLanguage();

  const topics = [
    t('Prendre rendez-vous avec Thomas Fotso', 'Book an appointment with Thomas Fotso'),
    t('Demande de tournage entreprise / marque', 'Corporate / Brand film shooting inquiry'),
    t('Proposer un sujet ou un lieu pour 237 Cinématique', 'Propose a subject or location for 237 Cinématique'),
    t('Captation événementielle, média ou sportive', 'Live event, TV media, or sports coverage')
  ];

  const timeSlots = [
    t('Matin · 09h00 – 12h00', 'Morning · 09:00 AM – 12:00 PM'),
    t('Après-midi · 14h00 – 17h00', 'Afternoon · 02:00 PM – 05:00 PM'),
    t('Fin de journée · 17h30 – 19h30', 'Evening · 05:30 PM – 07:30 PM')
  ];

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'rdv'>('whatsapp');

  // WhatsApp Message State
  const [senderName, setSenderName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState(initialTopic || topics[0]);
  const [city, setCity] = useState('Yaoundé, Cameroun');
  const [customDetails, setCustomDetails] = useState('');
  const [copied, setCopied] = useState(false);

  // Quick Appointment State
  const [aptName, setAptName] = useState('');
  const [aptOrg, setAptOrg] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptEmail, setAptEmail] = useState('');
  const [aptType, setAptType] = useState<AppointmentBooking['meetingType']>(
    'Appel découverte (WhatsApp / Téléphone)'
  );
  const [aptDate, setAptDate] = useState('');
  const [aptSlot, setAptSlot] = useState(timeSlots[0]);
  const [aptTopic, setAptTopic] = useState('');
  const [aptSubmitted, setAptSubmitted] = useState(false);

  if (!isOpen) return null;

  const siteOrigin =
    typeof window !== 'undefined'
      ? window.location.origin
      : 'https://ais-pre-xjilhi3dvoeq4piieichav-323022168140.europe-west2.run.app';

  const formattedMessage = [
    `*${brand.mainBrand.toUpperCase()} — ${brand.directorName}*`,
    `Bonjour ${brand.directorName},`,
    senderName ? `Je suis ${senderName}.` : '',
    `• Objet : ${selectedTopic}`,
    `• Ville / Lieu : ${city}`,
    customDetails ? `• Détails : ${customDetails}` : '',
    `• Site web : ${siteOrigin}`
  ]
    .filter(Boolean)
    .join('\n');

  const waHref = buildWhatsAppUrl(brand.whatsappNumber, formattedMessage);
  const waShareSiteHref = buildWhatsAppShareSiteUrl(brand);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleQuickAppointmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName.trim() || !aptPhone.trim() || !aptDate) return;

    if (onBookAppointment) {
      onBookAppointment({
        clientName: aptName.trim(),
        organization: aptOrg.trim() || 'Indépendant / Particulier',
        phoneWhatsapp: aptPhone.trim(),
        email: aptEmail.trim() || 'Non renseigné',
        meetingType: aptType,
        preferredDate: aptDate,
        preferredTimeSlot: aptSlot,
        city: city.trim() || 'Yaoundé / Cameroun (+237)',
        topic: aptTopic.trim() || 'Échange sur un projet audiovisuel'
      });
    }
    setAptSubmitted(true);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
    >
      <div className="w-full max-w-xl glass-panel-strong rounded-3xl p-5 sm:p-8 space-y-5 relative my-auto max-h-[92vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          aria-label={t('Fermer', 'Close')}
          className="absolute top-5 right-5 p-2.5 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--accent-primary)]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Official TC Logo */}
        <div className="flex items-center gap-3.5 pr-8">
          <img
            src={brand.logoUrl}
            alt={`Logo ${brand.mainBrand}`}
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-2xl object-cover border border-[var(--glass-border)] shrink-0"
          />
          <div>
            <div className="text-xs font-semibold text-[var(--accent-primary)] uppercase tracking-wider">
              {brand.mainBrand} · {brand.directorName}
            </div>
            <h3
              id="contact-modal-title"
              className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
            >
              {t('Contacter & Prendre Rendez-vous', 'Contact & Book an Appointment')}
            </h3>
          </div>
        </div>

        {/* Official Phone & Email Strip */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <a
            href={`https://wa.me/${brand.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold flex items-center gap-1.5"
          >
            <Phone className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{brand.whatsappDisplay}</span>
          </a>
          <a
            href={`mailto:${brand.contactEmail}`}
            className="px-3.5 py-2 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] font-semibold flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>{brand.contactEmail}</span>
          </a>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl glass-panel">
          <button
            type="button"
            onClick={() => {
              setActiveTab('whatsapp');
              setAptSubmitted(false);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'whatsapp'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{t('WhatsApp & Partage', 'WhatsApp & Share')}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rdv')}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'rdv'
                ? 'bg-[var(--accent-primary)] text-white shadow-md'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>{t('Prendre Rendez-vous', 'Book Appointment')}</span>
          </button>
        </div>

        {activeTab === 'whatsapp' ? (
          <div className="space-y-4">
            {/* WhatsApp Social Card Preview (Logo TC + Site Information) */}
            <div className="p-4 rounded-2xl glass-panel space-y-3">
              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--accent-primary)] flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5" />
                  <span>
                    {t(
                      'Aperçu WhatsApp (Logo TC & Infos du site)',
                      'WhatsApp Card Preview (TC Logo & Site Info)'
                    )}
                  </span>
                </span>
                <a
                  href={waShareSiteHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold text-white bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] px-3 py-1.5 rounded-full transition-colors flex items-center gap-1"
                >
                  <span>{t('Partager le site', 'Share website')}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--glass-border)]">
                <img
                  src={brand.logoUrl}
                  alt="Aperçu Logo TC WhatsApp"
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 rounded-xl object-cover border border-[var(--glass-border)] shrink-0"
                />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="text-xs font-bold text-[var(--text-primary)] truncate">
                    {brand.mainBrand} — {brand.directorName} | {brand.flagshipProject}
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                    « {brand.flagshipSlogan} » · {brand.whatsappDisplay} · {brand.contactEmail}
                  </p>
                  <div className="text-[10px] text-[var(--accent-primary)] truncate">
                    {siteOrigin}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="wa-sender-name"
                    className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                  >
                    {t('Votre nom ou entreprise', 'Your name or company')}
                  </label>
                  <input
                    id="wa-sender-name"
                    type="text"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={t('Ex. Marie N. — Direction', 'e.g. Marie N. — Management')}
                    className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="wa-city"
                    className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                  >
                    {t('Ville / Lieu', 'City / Location')}
                  </label>
                  <input
                    id="wa-city"
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Yaoundé, Douala..."
                    className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="wa-topic"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  {t('Objet de votre demande', 'Subject of your inquiry')}
                </label>
                <select
                  id="wa-topic"
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white focus:outline-none focus:border-[var(--accent-primary)]"
                >
                  {topics.map((topicItem) => (
                    <option key={topicItem} value={topicItem}>
                      {topicItem}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="wa-details"
                  className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                >
                  {t(
                    'Votre message pour Thomas Fotso',
                    'Your message for Thomas Fotso'
                  )}
                </label>
                <textarea
                  id="wa-details"
                  rows={2}
                  value={customDetails}
                  onChange={(e) => setCustomDetails(e.target.value)}
                  placeholder={t(
                    'Précisez la date souhaitée ou votre besoin...',
                    'Specify your desired date or project details...'
                  )}
                  className="theme-adaptive-input w-full px-3.5 py-2 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-[var(--accent-primary)]"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-5 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {t('Écrire sur WhatsApp', 'Send on WhatsApp')} ({brand.whatsappDisplay})
                </span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                type="button"
                onClick={handleCopy}
                className="py-3 px-5 rounded-full glass-panel hover:border-[var(--accent-primary)] text-[var(--text-primary)] text-xs sm:text-sm font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>{t('Copié', 'Copied')}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>{t('Copier', 'Copy')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* TAB 2: PRISE DE RENDEZ-VOUS RAPIDE */
          <div className="space-y-4">
            {aptSubmitted ? (
              <div className="p-5 rounded-2xl glass-panel border border-[var(--accent-primary)] space-y-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-[var(--accent-primary)] mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-[var(--text-primary)]">
                    {t(
                      'Demande de rendez-vous enregistrée',
                      'Appointment request saved'
                    )}
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    {t(
                      `Votre créneau (${aptDate} · ${aptSlot}) est prêt. Confirmez-le directement sur WhatsApp au ${brand.whatsappDisplay}.`,
                      `Your slot (${aptDate} · ${aptSlot}) is ready. Confirm it directly on WhatsApp at ${brand.whatsappDisplay}.`
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                  <a
                    href={buildWhatsAppUrl(
                      brand.whatsappNumber,
                      `Bonjour ${brand.directorName} (${brand.mainBrand}),\nJe souhaite confirmer mon rendez-vous :\n• Nom : ${aptName}\n• Format : ${aptType}\n• Date : ${aptDate} (${aptSlot})\n• Sujet : ${aptTopic || 'Projet audiovisuel'}`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-5 rounded-full bg-[var(--accent-primary)] text-white text-xs font-semibold flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>
                      {t('Confirmer ce RDV sur WhatsApp', 'Confirm on WhatsApp')}
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setAptSubmitted(false)}
                    className="py-2.5 px-4 rounded-full glass-panel text-[var(--text-primary)] text-xs"
                  >
                    {t('Modifier', 'Edit')}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleQuickAppointmentSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="modal-apt-name"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      {t('Votre nom complet *', 'Your full name *')}
                    </label>
                    <input
                      id="modal-apt-name"
                      type="text"
                      required
                      value={aptName}
                      onChange={(e) => setAptName(e.target.value)}
                      placeholder="Ex. Jean N."
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-apt-phone"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      {t('Téléphone / WhatsApp *', 'Phone / WhatsApp *')}
                    </label>
                    <input
                      id="modal-apt-phone"
                      type="tel"
                      required
                      value={aptPhone}
                      onChange={(e) => setAptPhone(e.target.value)}
                      placeholder="+237 6..."
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="modal-apt-org"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      {t('Entreprise / Organisation', 'Company / Organization')}
                    </label>
                    <input
                      id="modal-apt-org"
                      type="text"
                      value={aptOrg}
                      onChange={(e) => setAptOrg(e.target.value)}
                      placeholder={t('Nom de votre structure', 'Company name')}
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-apt-email"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      E-mail
                    </label>
                    <input
                      id="modal-apt-email"
                      type="email"
                      value={aptEmail}
                      onChange={(e) => setAptEmail(e.target.value)}
                      placeholder="contact@domaine.cm"
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-apt-type"
                    className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                  >
                    {t('Format du rendez-vous', 'Meeting format')}
                  </label>
                  <select
                    id="modal-apt-type"
                    value={aptType}
                    onChange={(e) =>
                      setAptType(e.target.value as AppointmentBooking['meetingType'])
                    }
                    className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label
                      htmlFor="modal-apt-date"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      {t('Date souhaitée *', 'Preferred date *')}
                    </label>
                    <input
                      id="modal-apt-date"
                      type="date"
                      required
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modal-apt-slot"
                      className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                    >
                      {t('Créneau horaire', 'Time slot')}
                    </label>
                    <select
                      id="modal-apt-slot"
                      value={aptSlot}
                      onChange={(e) => setAptSlot(e.target.value)}
                      className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                    >
                      {timeSlots.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="modal-apt-topic"
                    className="block text-xs font-medium text-[var(--text-primary)] mb-1"
                  >
                    {t('Objet du rendez-vous', 'Meeting topic')}
                  </label>
                  <input
                    id="modal-apt-topic"
                    type="text"
                    value={aptTopic}
                    onChange={(e) => setAptTopic(e.target.value)}
                    placeholder={t(
                      "Ex. Film d'entreprise / Épisode 237 Cinématique",
                      'e.g. Corporate film / 237 Cinématique episode'
                    )}
                    className="theme-adaptive-input w-full px-3.5 py-2.5 rounded-2xl bg-black/80 border border-white/15 text-xs sm:text-sm text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-6 rounded-full bg-[var(--accent-primary)] hover:bg-[var(--accent-hover)] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>
                    {t('Valider la prise de rendez-vous', 'Confirm Appointment')}
                  </span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
