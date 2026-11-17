export type ArtDirectionId =
  | 'tc-logo-charter'
  | 'cinema-champagne'
  | 'terre-ocre'
  | 'monochrome-argentique';

export type FoundationNarrativeMode = 'director_led' | 'collective_origin';

export interface BrandConfig {
  mainBrand: string; // Toujours "Tomy Creator"
  directorName: string; // "Thomas Fotso"
  roleTitle: string;
  roleTitleEn: string;
  flagshipProject: string; // "237 Cinématique"
  flagshipSlogan: string; // "Et si on redécouvrait le Cameroun comme un film ?"
  flagshipSloganEn: string;
  flagshipDevise: string; // "Raconter le Cameroun comme un film."
  flagshipDeviseEn: string;
  flagshipSignature: string; // "Le Cameroun comme vous ne l'avez jamais vu."
  flagshipSignatureEn: string;
  logoUrl: string;
  foundationNarrativeMode: FoundationNarrativeMode;
  foundationValidationStatus: 'pending_validation' | 'validated';
  directorLedNarrative: string;
  directorLedNarrativeEn: string;
  collectiveOriginNarrative: string;
  directorBioShort: string;
  directorBioShortEn: string;
  directorBioLong: string;
  directorBioLongEn: string;
  directorVisionQuote: string;
  directorVisionQuoteEn: string;
  whatsappNumber: string; // "237694925851"
  whatsappDisplay: string; // "+237 6 94 92 58 51"
  whatsappIsProvisional: boolean;
  contactEmail: string; // "tomycreator@gmail.com"
  emailIsProvisional: boolean;
  locationLabel: string;
  locationLabelEn: string;
  instagramUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
  pdfHistoryUrl: string;
  artDirection: ArtDirectionId;
}

export interface EpisodeItem {
  id: string;
  number: string;
  numberEn?: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  city: string;
  region: string;
  mapCoords: { x: number; y: number };
  theme: 'Ville & Quartier' | 'Artisan & Entreprise' | 'Patrimoine & Nature' | 'Culture & Tradition';
  themeEn?: string;
  duration: string;
  releaseDate: string;
  status: 'En préparation' | 'En montage' | 'Publié';
  statusEn?: string;
  isProvisional: boolean;
  synopsis: string;
  synopsisEn?: string;
  directorNote: string;
  directorNoteEn?: string;
  coverImage: string;
  videoUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  titleEn?: string;
  category:
    | 'Documentaire & 237 Cinématique'
    | 'Captation Sportive & Stade'
    | 'Portrait & Direction Artistique'
    | 'Coulisses & Mobile Filmmaking';
  categoryEn?: string;
  mediaType: 'Photo' | 'Vidéo';
  imageUrl: string;
  videoUrl?: string;
  location: string;
  year: string;
  cameraGear: string;
  cameraGearEn?: string;
  role: string;
  roleEn?: string;
  creditNote?: string;
  description: string;
  descriptionEn?: string;
  isProvisional: boolean;
  featured?: boolean;
}

export interface ServiceItem {
  id: string;
  index: string;
  title: string;
  titleEn?: string;
  subtitle: string;
  subtitleEn?: string;
  description: string;
  descriptionEn?: string;
  deliverables: string[];
  deliverablesEn?: string[];
  targetAudience: string;
  targetAudienceEn?: string;
  pricingNote: string;
  pricingNoteEn?: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  titleEn?: string;
  category: string;
  categoryEn?: string;
  contextType:
    | 'Projet Éditorial Propre'
    | 'Captation Terrain & Événement'
    | 'Production & Coulisses'
    | 'Emplacement Client à Compléter';
  contextTypeEn?: string;
  rolePlayed: string;
  rolePlayedEn?: string;
  locationAndYear: string;
  factualDescription: string;
  factualDescriptionEn?: string;
  visualEvidenceUrl: string;
  creditMention?: string;
  isProvisional: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  titleEn?: string;
  date: string;
  dateEn?: string;
  category: string;
  categoryEn?: string;
  readTime: string;
  readTimeEn?: string;
  excerpt: string;
  excerptEn?: string;
  content: string[];
  contentEn?: string[];
  imageUrl: string;
  isProvisional: boolean;
}

export interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  authorRoleEn?: string;
  organization: string;
  projectContext: string;
  projectContextEn?: string;
  quote: string;
  quoteEn?: string;
  location: string;
  avatarUrl: string;
  isProvisional: boolean;
}

export interface FaqItem {
  id: string;
  category: 'Tarifs & Devis' | 'Disponibilités & Délais' | 'Processus de tournage';
  question: string;
  questionEn?: string;
  answer: string;
  answerEn?: string;
}

export interface ShootingRequest {
  id: string;
  createdAt: string;
  clientName: string;
  organization: string;
  email: string;
  phoneWhatsapp: string;
  projectType: string;
  location: string;
  desiredDate: string;
  deliverables: string;
  narrativeBrief: string;
  status: 'Nouveau' | 'En étude' | 'Confirmé' | 'Archivé';
}

export interface AppointmentBooking {
  id: string;
  createdAt: string;
  clientName: string;
  organization: string;
  phoneWhatsapp: string;
  email: string;
  meetingType:
    | 'Appel découverte (WhatsApp / Téléphone)'
    | 'Visioconférence de cadrage'
    | 'Rencontre physique & Repérage sur site';
  preferredDate: string;
  preferredTimeSlot: string;
  city: string;
  topic: string;
  status: 'En attente' | 'Confirmé' | 'Reporté';
}

export interface PartnerCompany {
  id: string;
  name: string;
  sector: string;
  sectorEn: string;
  collaborationNote: string;
}

export interface SiteData {
  brand: BrandConfig;
  partnerCompanies: PartnerCompany[];
  episodes: EpisodeItem[];
  portfolio: PortfolioItem[];
  services: ServiceItem[];
  references: ReferenceItem[];
  news: NewsItem[];
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
  shootingRequests: ShootingRequest[];
  appointments: AppointmentBooking[];
}

export const DEFAULT_PARTNER_COMPANIES: PartnerCompany[] = [
  {
    id: 'partner-cimaco',
    name: 'Cimaco',
    sector: 'Entreprise & Industrie',
    sectorEn: 'Corporate & Industry',
    collaborationNote: 'Production audiovisuelle & mise en valeur corporate'
  },
  {
    id: 'partner-maison-orchelle',
    name: 'Maison Orchelle',
    sector: 'Mode, Créations & Lifestyle',
    sectorEn: 'Fashion, Creation & Lifestyle',
    collaborationNote: 'Réalisation vidéo, direction artistique & image de marque'
  },
  {
    id: 'partner-dmt-beauty',
    name: 'DMT Beauty',
    sector: 'Beauté & Cosmétiques',
    sectorEn: 'Beauty & Cosmetics',
    collaborationNote: 'Contenus visuels, esthétique produit & storytelling'
  },
  {
    id: 'partner-arduisk',
    name: 'ARDUISK numérique',
    sector: 'Technologie & Solutions Numériques',
    sectorEn: 'Technology & Digital Solutions',
    collaborationNote: 'Communication audiovisuelle & capsules digitales'
  },
  {
    id: 'partner-reine-modelisme',
    name: 'Reine du modélisme',
    sector: 'Stylisme, Modélisme & Savoir-Faire',
    sectorEn: 'Fashion Design, Pattern Making & Craftsmanship',
    collaborationNote: 'Mise en lumière des créations & savoir-faire artisanal'
  },
  {
    id: 'partner-cam10',
    name: 'Cam10 dans l’émission « On se lâche »',
    sector: 'Média TV & Divertissement',
    sectorEn: 'TV Media & Entertainment',
    collaborationNote: 'Intervention audiovisuelle & captation plateau média'
  }
];

export const ART_DIRECTIONS: {
  id: ArtDirectionId;
  name: string;
  concept: string;
  paletteSummary: string;
  typographySummary: string;
  compositionSummary: string;
  photoIntention: string;
  swatches: string[];
}[] = [
  {
    id: 'tc-logo-charter',
    name: 'Charte Officielle Logo TC — Noir Profond, Blanc & Rouge Cinéma',
    concept:
      'Alignée sur le monogramme officiel TC de Tomy Creator : noir profond, typographie Poppins et accent rouge signature (#E51D2A).',
    paletteSummary:
      'Noir Onyx #06070A · Blanc Pur #F8FAFC · Rouge Signature TC #E51D2A',
    typographySummary: 'Poppins intégrale (300 à 700).',
    compositionSummary: 'Panneaux glass aux bordures arrondies.',
    photoIntention: 'Contrastes nets et mise en valeur du sujet.',
    swatches: ['#06070A', '#0F131A', '#E51D2A', '#F8FAFC']
  }
];

export const INITIAL_SITE_DATA: SiteData = {
  brand: {
    mainBrand: 'Tomy Creator',
    directorName: 'Thomas Fotso',
    roleTitle: 'Réalisateur et créateur audiovisuel',
    roleTitleEn: 'Film Director & Audiovisual Content Creator',
    flagshipProject: '237 Cinématique',
    flagshipSlogan: 'Et si on redécouvrait le Cameroun comme un film ?',
    flagshipSloganEn: 'What if we rediscovered Cameroon like a movie?',
    flagshipDevise: 'Raconter le Cameroun comme un film.',
    flagshipDeviseEn: 'Telling the story of Cameroon like a movie.',
    flagshipSignature: "Le Cameroun comme vous ne l'avez jamais vu.",
    flagshipSignatureEn: 'Cameroon like you have never seen it before.',
    logoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-16_at_10.25.07_b5ed22ad.jpeg',
    foundationNarrativeMode: 'director_led',
    foundationValidationStatus: 'validated',
    directorLedNarrative:
      "Porté par Thomas Fotso (Tomy Creator), 237 Cinématique est né d'une conviction simple : le Cameroun possède une richesse culturelle, humaine et naturelle exceptionnelle qui mérite d'être racontée avec la qualité visuelle et la profondeur narrative d'un film.",
    directorLedNarrativeEn:
      "Led by Thomas Fotso (Tomy Creator), 237 Cinématique was born from a clear conviction: Cameroon possesses exceptional cultural, human, and natural wealth that deserves to be told with the visual quality and narrative depth of cinema.",
    collectiveOriginNarrative:
      "Imaginé par une génération de vidéastes, photographes et créateurs passionnés par le storytelling visuel — et dirigé dans l'univers de réalisation de Thomas Fotso (Tomy Creator) — 237 Cinématique transforme la manière dont le Cameroun est raconté à l'écran.",
    directorBioShort:
      "Réalisateur et créateur de contenu audiovisuel basé à Douala au Cameroun, Thomas Fotso — connu sous la signature Tomy Creator — façonne des récits visuels où la rigueur du cadrage rencontre l'émotion documentaire.",
    directorBioShortEn:
      "Film director and audiovisual creator based in Douala, Cameroon, Thomas Fotso — known under the signature Tomy Creator — crafts visual stories where framing precision meets documentary emotion.",
    directorBioLong:
      "De la captation sportive au ras de la pelouse jusqu'à la réalisation documentaire, aux émissions télévisées et aux films de marque pour des entreprises de référence, Thomas Fotso explore chaque sujet avec une exigence cinématographique. Avec son projet éditorial phare 237 Cinématique, il pose un regard neuf, structuré et lumineux sur les villes, les artisans, les entreprises et les paysages du Cameroun (+237).",
    directorBioLongEn:
      "From pitch-side sports cinematography to documentary filmmaking, TV broadcasts, and brand films for leading companies, Thomas Fotso approaches every subject with cinematic rigor. Through his flagship editorial project 237 Cinématique, he brings a fresh, structured, and luminous perspective to the cities, artisans, businesses, and landscapes of Cameroon (+237).",
    directorVisionQuote:
      "Chaque lieu a une âme. Chaque personne a une histoire. Chaque entreprise a un parcours. Chaque événement mérite d'être raconté comme un film.",
    directorVisionQuoteEn:
      "Every place has a soul. Every person has a story. Every company has a journey. Every event deserves to be told like a film.",
    whatsappNumber: '237694925851',
    whatsappDisplay: '+237 6 94 92 58 51',
    whatsappIsProvisional: false,
    contactEmail: 'tomycreator@gmail.com',
    emailIsProvisional: false,
    locationLabel: 'Douala & Yaoundé, Cameroun (+237) · Déplacements nationaux & internationaux',
    locationLabelEn: 'Douala & Yaoundé, Cameroon (+237) · National & International shoots',
    instagramUrl: 'https://instagram.com',
    youtubeUrl: 'https://youtube.com',
    tiktokUrl: 'https://tiktok.com',
    pdfHistoryUrl: '/assets/aistudio/Historique_237_Cinematique_Mise_en_page_9219b07f.pdf',
    artDirection: 'tc-logo-charter'
  },
  partnerCompanies: DEFAULT_PARTNER_COMPANIES,
  episodes: [
    {
      id: 'ep-01',
      number: 'Épisode 01',
      numberEn: 'Episode 01',
      title: 'Les Battements du Stade : Au Cœur de l’Arène',
      titleEn: 'Heartbeats of the Stadium: Inside the Arena',
      subtitle: 'Immersion visuelle au ras de la pelouse et dans la ferveur du sport camerounais',
      subtitleEn: 'Pitch-level visual immersion into the passion of Cameroonian sports',
      city: 'Yaoundé / Douala',
      region: 'Centre & Littoral',
      mapCoords: { x: 46, y: 74 },
      theme: 'Culture & Tradition',
      themeEn: 'Culture & Tradition',
      duration: '08 min 40',
      releaseDate: 'Saison 1 · Épisode Pilote',
      status: 'Publié',
      statusEn: 'Released',
      isProvisional: false,
      synopsis:
        "Au Cameroun, le stade n'est pas qu'une infrastructure sportive : c'est un théâtre d'émotions collectives. Cet épisode suit la tension, la géométrie des tribunes et l'intensité des regards depuis le bord du terrain.",
      synopsisEn:
        "In Cameroon, the stadium is more than a sports venue: it is a theater of collective emotion. This episode captures the tension, the geometry of the stands, and the intensity of the game from pitch level.",
      directorNote:
        "Cadrage longue focale au ras du gazon pour isoler les gestes et compresser la perspective des gradins jaunes et béton.",
      directorNoteEn:
        "Telephoto framing at grass level to isolate gestures and compress the monumental perspective of the stadium stands.",
      coverImage: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      videoUrl: ''
    },
    {
      id: 'ep-02',
      number: 'Épisode 02',
      numberEn: 'Episode 02',
      title: 'L’Art du Mouvement : Coulisses & Regards Croisés',
      titleEn: 'The Art of Movement: Behind the Scenes & Perspectives',
      subtitle: 'Portrait d’une jeunesse créative qui réinvente la narration visuelle au +237',
      subtitleEn: 'Portrait of a creative generation reinventing visual storytelling in +237',
      city: 'Douala & Yaoundé',
      region: 'Littoral & Centre',
      mapCoords: { x: 52, y: 76 },
      theme: 'Artisan & Entreprise',
      themeEn: 'Artisan & Business',
      duration: '06 min 15',
      releaseDate: 'Saison 1',
      status: 'Publié',
      statusEn: 'Released',
      isProvisional: false,
      synopsis:
        "Derrière chaque plan fluide se cache une chorégraphie technique. Rencontre avec les créateurs, entrepreneurs et techniciens de l'image qui façonnent un nouveau langage documentaire camerounais.",
      synopsisEn:
        "Behind every fluid shot lies technical choreography. Meet the creators, entrepreneurs, and image technicians shaping a new Cameroonian documentary language.",
      directorNote:
        "Tournage à double stabilisateur mobile en lumière naturelle rasante, privilégiant les plans-séquences immersifs.",
      directorNoteEn:
        "Dual-gimbal mobile cinematography in natural grazing light, favoring immersive long takes.",
      coverImage: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      videoUrl: ''
    },
    {
      id: 'ep-03',
      number: 'Épisode 03',
      numberEn: 'Episode 03',
      title: 'Lignes & Patrimoine : L’Identité en Noir et Blanc',
      titleEn: 'Lines & Heritage: Identity in Black and White',
      subtitle: 'Dialogue entre motifs graphiques traditionnels, élégance contemporaine et mémoire',
      subtitleEn: 'Dialogue between traditional geometric motifs, contemporary elegance, and memory',
      city: 'Bafoussam & Foumban',
      region: 'Région de l’Ouest',
      mapCoords: { x: 38, y: 66 },
      theme: 'Patrimoine & Nature',
      themeEn: 'Heritage & Nature',
      duration: '11 min 20',
      releaseDate: 'Saison 1',
      status: 'En montage',
      statusEn: 'In Post-Production',
      isProvisional: false,
      synopsis:
        "Exploration visuelle des hautes terres de l'Ouest : de la rigueur géométrique des fresques et architectures royales jusqu'aux ateliers d'artisans qui perpétuent un savoir-faire séculaire.",
      synopsisEn:
        "Visual exploration of the Western Highlands: from the geometric precision of royal frescoes and architecture to artisan workshops perpetuating centuries-old craftsmanship.",
      directorNote:
        "Travail sur le contraste pur, les textures murales et la verticalité des portraits pour donner une stature monumentale aux artisans.",
      directorNoteEn:
        "High-contrast monochrome work emphasizing wall textures and vertical framing to give artisans a monumental presence.",
      coverImage: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
      videoUrl: ''
    },
    {
      id: 'ep-04',
      number: 'Épisode 04',
      numberEn: 'Episode 04',
      title: 'Horizons Monumentaux : Les Cathédrales de Béton et de Lumière',
      titleEn: 'Monumental Horizons: Cathedrals of Concrete and Light',
      subtitle: 'Architecture, perspectives urbaines et souffle épique des grandes infrastructures',
      subtitleEn: 'Architecture, urban perspectives, and the epic scale of major infrastructures',
      city: 'Douala & Kribi',
      region: 'Littoral & Sud',
      mapCoords: { x: 34, y: 82 },
      theme: 'Ville & Quartier',
      themeEn: 'City & Neighborhood',
      duration: '09 min 50',
      releaseDate: 'Saison 1',
      status: 'En préparation',
      statusEn: 'In Pre-Production',
      isProvisional: false,
      synopsis:
        "Un voyage cinématographique à travers les quartiers historiques, les façades maritimes et les infrastructures modernes qui dessinent le visage contemporain du Cameroun.",
      synopsisEn:
        "A cinematic journey through historic neighborhoods, maritime facades, and modern infrastructures shaping the contemporary face of Cameroon.",
      directorNote:
        "Prises de vue sur trépied lourd à l'heure dorée pour capter la symétrie architecturale et la vie humaine qui l'anime.",
      directorNoteEn:
        "Fluid-head tripod cinematography at golden hour to capture architectural symmetry and vibrant street life.",
      coverImage: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      videoUrl: ''
    }
  ],
  portfolio: [
    {
      id: 'pf-01',
      title: 'Portrait Manifeste — L’Œil et la Géométrie',
      titleEn: 'Manifesto Portrait — The Eye and Geometry',
      category: 'Portrait & Direction Artistique',
      categoryEn: 'Portrait & Art Direction',
      mediaType: 'Photo',
      imageUrl: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
      location: 'Douala, Cameroun',
      year: '2025',
      cameraGear: 'Canon EOS DSLR · Téléobjectif zoom · Traitement N&B haut contraste',
      cameraGearEn: 'Canon EOS DSLR · Telephoto Zoom · High-Contrast B&W Grade',
      role: 'Direction artistique & Réalisateur (Thomas Fotso)',
      roleEn: 'Art Direction & Director (Thomas Fotso)',
      description:
        "Portrait éditorial en noir et blanc affirmant la double identité de Tomy Creator : l'élégance formelle et la maîtrise de l'outil optique sur fond de motifs géométriques d'inspiration patrimoniale.",
      descriptionEn:
        "Black-and-white editorial portrait affirming the dual identity of Tomy Creator: formal elegance and optical mastery against heritage-inspired geometric motifs.",
      isProvisional: false,
      featured: true
    },
    {
      id: 'pf-02',
      title: 'Au Ras du Gazon — Captation Sportive en Stade',
      titleEn: 'Pitch Level — Stadium Sports Cinematography',
      category: 'Captation Sportive & Stade',
      categoryEn: 'Sports & Stadium Cinematography',
      mediaType: 'Photo',
      imageUrl: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      location: 'Complexe Sportif, Cameroun',
      year: '2025',
      cameraGear: 'Canon EOS · Téléobjectif longue focale · Prise de vue au sol',
      cameraGearEn: 'Canon EOS · Long Telephoto Lens · Ground-Level Framing',
      role: 'Photographe & Cadreur terrain (Thomas Fotso)',
      roleEn: 'Pitch-Side Photographer & Camera Operator (Thomas Fotso)',
      creditNote: 'Crédit photo coulisses : @ndzasso picture',
      description:
        "Mise en situation réelle en bord de pelouse lors d'une rencontre sportive. L'angle en contre-plongée au ras de l'herbe permet de détacher les joueurs sur la perspective monumentale des tribunes.",
      descriptionEn:
        "Real pitch-side action during a major match. The low-angle framing at grass level isolates athletes against the monumental backdrop of the stadium stands.",
      isProvisional: false,
      featured: true
    },
    {
      id: 'pf-03',
      title: 'Dispositif Trépied & Perspective des Tribunes',
      titleEn: 'Tripod Rig & Stadium Stand Perspective',
      category: 'Captation Sportive & Stade',
      categoryEn: 'Sports & Stadium Cinematography',
      mediaType: 'Photo',
      imageUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      location: 'Stade Omnisports, Cameroun',
      year: '2025',
      cameraGear: 'Canon EOS sur trépied vidéo à tête fluide · Écran orientable',
      cameraGearEn: 'Canon EOS on Fluid-Head Video Tripod · Articulating Monitor',
      role: 'Réalisateur & Opérateur prise de vue (Thomas Fotso)',
      roleEn: 'Director & Camera Operator (Thomas Fotso)',
      creditNote: 'Crédit photo : @ndzasso picture',
      description:
        "Préparation et calibrage du cadre sur trépied le long de la piste d'athlétisme avant le coup d'envoi. Rigueur des lignes de fuite et stabilité des panoramiques vidéo.",
      descriptionEn:
        "Rig calibration along the athletics track before kickoff. Precision vanishing lines and ultra-smooth video panning.",
      isProvisional: false,
      featured: true
    },
    {
      id: 'pf-04',
      title: 'Chorégraphie Mobile — Tournage Stabilisé à Deux Caméras',
      titleEn: 'Mobile Choreography — Dual-Gimbal Stabilized Shoot',
      category: 'Coulisses & Mobile Filmmaking',
      categoryEn: 'Behind the Scenes & Mobile Filmmaking',
      mediaType: 'Photo',
      imageUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      location: 'Douala, Cameroun',
      year: '2025',
      cameraGear: 'Stabilisateurs 3 axes DJI Osmo Mobile & iPhone Pro',
      cameraGearEn: 'DJI Osmo Mobile 3-Axis Gimbals & iPhone Pro',
      role: 'Direction de cadrage & Coordination plateau',
      roleEn: 'Camera Direction & On-Set Coordination',
      description:
        "Coulisses d'un tournage agile en intérieur démontrant la complémentarité entre direction d'équipe et maîtrise des stabilisateurs gyroscopiques pour des mouvements de caméra fluides.",
      descriptionEn:
        "Behind the scenes of an agile indoor shoot showcasing team coordination and 3-axis gimbal mastery for seamless camera movement.",
      isProvisional: false,
      featured: true
    },
    {
      id: 'pf-05',
      title: 'Séquence Manifeste — 237 Cinématique (Format Film)',
      titleEn: 'Manifesto Sequence — 237 Cinématique (Film Format)',
      category: 'Documentaire & 237 Cinématique',
      categoryEn: 'Documentary & 237 Cinématique',
      mediaType: 'Vidéo',
      imageUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      videoUrl: '',
      location: 'Cameroun (+237)',
      year: '2025',
      cameraGear: 'Production hybride 4K · Étalonnage cinéma',
      cameraGearEn: '4K Hybrid Production · Cinema Color Grading',
      role: 'Réalisation & Montage — Thomas Fotso',
      roleEn: 'Directing & Editing — Thomas Fotso',
      description:
        "Séquence d'ouverture présentant la vision de 237 Cinématique : raconter chaque ville, chaque artisan et chaque parcours entrepreneurial camerounais comme une œuvre de cinéma.",
      descriptionEn:
        "Opening sequence presenting the vision of 237 Cinématique: telling the story of every Cameroonian city, artisan, and entrepreneurial journey like a work of cinema.",
      isProvisional: false,
      featured: true
    },
    {
      id: 'pf-06',
      title: 'Films de Marque & Collaborations Entreprises',
      titleEn: 'Brand Films & Corporate Collaborations',
      category: 'Documentaire & 237 Cinématique',
      categoryEn: 'Documentary & 237 Cinématique',
      mediaType: 'Vidéo',
      imageUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      videoUrl: '',
      location: 'Douala / Yaoundé',
      year: '2025',
      cameraGear: 'Caméra cinéma & Stabilisation 3 axes · Prise de son dédiée',
      cameraGearEn: 'Cinema Camera & 3-Axis Gimbal · Dedicated Sound Recording',
      role: 'Réalisation — Tomy Creator',
      roleEn: 'Directed by Tomy Creator',
      description:
        "Réalisations corporate, mode, beauté et médias conçues pour valoriser l'histoire, les ateliers et l'humain (Cimaco, Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme, Cam10).",
      descriptionEn:
        "Corporate, fashion, beauty, and media productions designed to highlight craftsmanship and human stories (Cimaco, Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme, Cam10).",
      isProvisional: false,
      featured: false
    }
  ],
  services: [
    {
      id: 'srv-01',
      index: '01',
      title: 'Documentaires Cinématographiques & Format 237 Cinématique',
      titleEn: 'Cinematic Documentaries & 237 Cinématique Format',
      subtitle: 'Raconter un lieu, un patrimoine, un artisan ou une institution comme un film',
      subtitleEn: 'Telling the story of a place, heritage, artisan, or institution like a film',
      description:
        "Conception et réalisation de courts et moyens métrages documentaires à forte valeur narrative. Du repérage à l'étalonnage final, nous révélons l'âme d'un quartier, d'un village ou d'une initiative culturelle.",
      descriptionEn:
        "Conception and direction of short and medium-length documentaries with strong narrative value. From location scouting to final color grading, we reveal the soul of a neighborhood, village, or cultural initiative.",
      deliverables: [
        'Écriture narrative, repérages et préparation éditoriale',
        'Tournage multi-supports (optiques téléobjectifs & mouvements stabilisés)',
        'Montage narratif, habillage sonore et étalonnage cinématographique',
        'Déclinaisons formats longs (YouTube / Diffusion) et capsules verticales'
      ],
      deliverablesEn: [
        'Narrative writing, location scouting, and editorial preparation',
        'Multi-rig shooting (telephoto lenses & stabilized camera movements)',
        'Narrative editing, sound design, and cinema color grading',
        'Full-length masters (YouTube / Broadcast) and vertical social cuts'
      ],
      targetAudience: 'Institutions culturelles, collectivités, projets patrimoniaux, médias et mécènes',
      targetAudienceEn: 'Cultural institutions, municipalities, heritage projects, media, and sponsors',
      pricingNote: 'Sur devis personnalisé selon durée, lieux de tournage et équipe requise',
      pricingNoteEn: 'Custom quote based on duration, shooting locations, and crew size'
    },
    {
      id: 'srv-02',
      index: '02',
      title: 'Films d’Entreprise, Entrepreneurs & Storytelling de Marque',
      titleEn: 'Corporate Films, Entrepreneurs & Brand Storytelling',
      subtitle: 'Valoriser votre parcours, vos équipes et votre savoir-faire avec authenticité',
      subtitleEn: 'Showcase your journey, teams, and expertise with cinematic authenticity',
      description:
        "Parce que derrière chaque entreprise se cache une histoire humaine unique, Tomy Creator réalise des portraits d'entrepreneurs et des films institutionnels (à l'image de nos collaborations avec Cimaco, Maison Orchelle, DMT Beauty ou ARDUISK numérique).",
      descriptionEn:
        "Because behind every business lies a unique human story, Tomy Creator directs entrepreneur portraits and corporate films (such as our collaborations with Cimaco, Maison Orchelle, DMT Beauty, and ARDUISK numérique).",
      deliverables: [
        'Interviews dirigées et mise en lumière des dirigeants ou artisans',
        'Captation des gestes métiers, des bureaux ou des sites de production',
        'Film manifeste principal + extraits courts pour réseaux sociaux',
        'Reportage photographique haute résolution livré en parallèle'
      ],
      deliverablesEn: [
        'Directed interviews highlighting founders, executives, or artisans',
        'B-roll of craft gestures, offices, or industrial production sites',
        'Main manifesto brand film + short social media cutdowns',
        'High-resolution photography reportage delivered alongside video'
      ],
      targetAudience: 'Entreprises, PME, startups, maisons de mode & beauté, artisans au Cameroun',
      targetAudienceEn: 'Corporations, SMEs, startups, fashion & beauty houses, and artisans in Cameroon',
      pricingNote: 'Sur devis selon cahier des charges',
      pricingNoteEn: 'Tailored quote based on project brief'
    },
    {
      id: 'srv-03',
      index: '03',
      title: 'Captation Sportive, Événementielle & Plateau Média',
      titleEn: 'Sports Cinematography, Live Events & TV Media',
      subtitle: 'Saisir l’intensité de l’instant au plus près de l’action',
      subtitleEn: 'Capturing the intensity of the moment as close to the action as possible',
      description:
        "Expérience terrain éprouvée en enceinte sportive, lors d'événements majeurs et en émission télévisée (Cam10 — « On se lâche »). Cadrage au ras de la pelouse, réactivité au téléobjectif et restitution dynamique.",
      descriptionEn:
        "Proven field experience in sports stadiums, major events, and television studio shows (Cam10 — 'On se lâche'). Pitch-level framing, telephoto responsiveness, and dynamic aftermovies.",
      deliverables: [
        'Couverture photographique d’action en haute vitesse',
        'Captation vidéo sur trépied fluide et stabilisateur mobile',
        'Film récapitulatif dynamique (Aftermovie) livré rapidement',
        'Sélection de clichés retouchés prêts pour la presse et les réseaux'
      ],
      deliverablesEn: [
        'High-speed action photography coverage',
        'Video capture on fluid-head tripod and mobile 3-axis gimbal',
        'Dynamic event recap (Aftermovie) with fast turnaround',
        'Curated retouched photographs ready for press and social media'
      ],
      targetAudience: 'Fédérations, clubs sportifs, chaînes TV, organisateurs d’événements et agences',
      targetAudienceEn: 'Sports federations, clubs, TV networks, event organizers, and agencies',
      pricingNote: 'Sur devis selon la durée de l’événement et les délais de livraison',
      pricingNoteEn: 'Custom quote based on event duration and delivery timeline'
    },
    {
      id: 'srv-04',
      index: '04',
      title: 'Création de Contenus Courts & Direction Mobile Filmmaking',
      titleEn: 'Short-Form Content Creation & Mobile Filmmaking Direction',
      subtitle: 'Formats verticaux haute rétention à l’esthétique soignée',
      subtitleEn: 'High-retention vertical formats with refined cinematic aesthetics',
      description:
        "Allier la souplesse du tournage mobile stabilisé (cardans 3 axes) à la rigueur d'un réalisateur pour produire des séries de contenus réguliers, immersifs et immédiatement engageants sur les plateformes sociales.",
      descriptionEn:
        "Combining the agility of 3-axis stabilized mobile filmmaking with a director's eye to produce regular, immersive, and high-converting social media series.",
      deliverables: [
        'Conception de séries éditoriales courtes (Reels, TikTok, Shorts)',
        'Tournage agile en intérieur ou extérieur avec stabilisation 3 axes',
        'Montage rythmé, sound design immersif et sous-titrage éditorial',
        'Accompagnement sur la cohérence visuelle du flux'
      ],
      deliverablesEn: [
        'Creative direction for short-form series (Reels, TikTok, Shorts)',
        'Agile indoor/outdoor shooting with 3-axis stabilization',
        'Rhythmic editing, immersive sound design, and dynamic captions',
        'Ongoing visual consistency consulting'
      ],
      targetAudience: 'Créateurs, marques mode & beauté, personnalités publiques et projets digitaux',
      targetAudienceEn: 'Creators, fashion & beauty brands, public figures, and digital projects',
      pricingNote: 'Forfait au tournage ou accompagnement mensuel sur devis',
      pricingNoteEn: 'Per-shoot package or monthly retainer upon request'
    }
  ],
  references: [
    {
      id: 'ref-01',
      title: 'Projet Éditorial & Documentaire — 237 Cinématique',
      titleEn: 'Editorial & Documentary Project — 237 Cinématique',
      category: 'Série Documentaire & Patrimoine (+237)',
      categoryEn: 'Documentary Series & Heritage (+237)',
      contextType: 'Projet Éditorial Propre',
      contextTypeEn: 'Original Editorial Project',
      rolePlayed: 'Création, Direction Artistique & Réalisation',
      rolePlayedEn: 'Creation, Art Direction & Directing',
      locationAndYear: 'Cameroun · En cours',
      factualDescription:
        "Initiative documentaire dédiée à la mise en valeur cinématographique des villes, villages, quartiers, entreprises, artisans et paysages du Cameroun. Charte éditoriale fondée sur l'excellence, l'authenticité et la transmission.",
      factualDescriptionEn:
        "Documentary initiative dedicated to showcasing the cities, villages, neighborhoods, businesses, artisans, and landscapes of Cameroon through cinema.",
      visualEvidenceUrl: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
      isProvisional: false
    },
    {
      id: 'ref-02',
      title: 'Captation Terrain en Enceinte Sportive (Stade Omnisports)',
      titleEn: 'Stadium Field Cinematography & Sports Coverage',
      category: 'Photographie & Vidéo de Sport',
      categoryEn: 'Sports Photography & Video',
      contextType: 'Captation Terrain & Événement',
      contextTypeEn: 'Field Capture & Live Event',
      rolePlayed: 'Opérateur prise de vue & Photographe bord de terrain',
      rolePlayedEn: 'Camera Operator & Pitch-Side Photographer',
      locationAndYear: 'Cameroun · Enceinte sportive',
      factualDescription:
        "Prises de vue réalisées en bord de pelouse et sur piste d'athlétisme avec boîtier Canon EOS, téléobjectif et trépied vidéo lors de rencontres sportives majeures.",
      factualDescriptionEn:
        "Pitch-side and athletics track cinematography using Canon EOS DSLR bodies, telephoto lenses, and fluid-head video tripods during major sporting events.",
      visualEvidenceUrl: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      creditMention: 'Photos plateau créditées @ndzasso picture',
      isProvisional: false
    },
    {
      id: 'ref-03',
      title: 'Production Collaborative & Tournage Mobile Stabilisé',
      titleEn: 'Collaborative Production & Stabilized Mobile Filmmaking',
      category: 'Réalisation & Coulisses de Production',
      categoryEn: 'Directing & Production Behind-the-Scenes',
      contextType: 'Production & Coulisses',
      contextTypeEn: 'Production & Behind the Scenes',
      rolePlayed: 'Direction de cadrage & Coordination binôme stabilisateur',
      rolePlayedEn: 'Camera Direction & Dual-Gimbal Coordination',
      locationAndYear: 'Douala / Yaoundé · Plateau intérieur',
      factualDescription:
        "Mise en œuvre de dispositifs de prise de vue à double stabilisateur 3 axes pour des séquences fluides en intérieur et une narration visuelle agile en équipe.",
      factualDescriptionEn:
        "Deployment of dual 3-axis gimbal rigs for smooth indoor sequences and agile team-based visual storytelling.",
      visualEvidenceUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      isProvisional: false
    },
    {
      id: 'ref-04',
      title: 'Collaborations Entreprises, Marques & Médias',
      titleEn: 'Corporate, Brand & TV Media Collaborations',
      category: 'Films de Marque, Mode, Beauté, Tech & Télévision',
      categoryEn: 'Brand Films, Fashion, Beauty, Tech & TV',
      contextType: 'Production & Coulisses',
      contextTypeEn: 'Brand & Media Productions',
      rolePlayed: 'Réalisation, Direction Artistique & Production Audiovisuelle',
      rolePlayedEn: 'Directing, Art Direction & Audiovisual Production',
      locationAndYear: 'Douala & Cameroun (+237)',
      factualDescription:
        "Accompagnement audiovisuel et collaborations réalisées avec Cimaco, Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme ainsi que la chaîne Cam10 dans le cadre de l’émission « On se lâche ».",
      factualDescriptionEn:
        "Audiovisual production and creative collaborations with Cimaco, Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme, and Cam10 TV on the show 'On se lâche'.",
      visualEvidenceUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      isProvisional: false
    }
  ],
  news: [
    {
      id: 'news-01',
      title: 'Pourquoi lancer 237 Cinématique : raconter le Cameroun comme un film',
      titleEn: 'Why launch 237 Cinématique: telling Cameroon like a movie',
      date: 'Dossier Éditorial Officiel',
      dateEn: 'Official Editorial Feature',
      category: 'Manifeste 237 Cinématique',
      categoryEn: '237 Cinématique Manifesto',
      readTime: '3 min de lecture',
      readTimeEn: '3 min read',
      excerpt:
        "Pendant des années, les contenus publiés sur les réseaux sociaux ont souvent montré le Cameroun de manière rapide, sans véritable narration ni recherche cinématographique. Voici l'ambition qui fonde 237 Cinématique.",
      excerptEn:
        "For years, social media content often showed Cameroon in a rushed manner, without true narrative depth or cinematic craft. Here is the ambition behind 237 Cinématique.",
      content: [
        "237 Cinématique est un projet né d'une conviction simple : le Cameroun possède une richesse culturelle, humaine et naturelle exceptionnelle qui mérite d'être racontée avec la qualité visuelle d'un film.",
        "Pendant des années, les contenus publiés sur les réseaux sociaux ont souvent montré le Cameroun de manière rapide, sans véritable narration ni recherche cinématographique. Pourtant, derrière chaque quartier, chaque village, chaque entreprise, chaque artisan et chaque personne se cache une histoire unique.",
        "Le nom 237 Cinématique fait référence à l'indicatif téléphonique du Cameroun (+237) et au style cinématographique de toutes les productions. Notre mission est de valoriser le Cameroun à travers des documentaires mettant en lumière les villes, villages, quartiers, entreprises, artisans, entrepreneurs, artistes, événements, traditions et paysages."
      ],
      contentEn: [
        "237 Cinématique was born from a simple conviction: Cameroon possesses exceptional cultural, human, and natural wealth that deserves to be told with the visual quality of a film.",
        "For years, social media content often depicted Cameroon quickly, without real storytelling or cinematic research. Yet behind every neighborhood, village, company, artisan, and individual lies a unique story.",
        "The name 237 Cinématique refers to Cameroon's country code (+237) and the cinematic style of all our productions. Our mission is to showcase Cameroon through documentaries highlighting its cities, villages, companies, artisans, entrepreneurs, artists, events, traditions, and landscapes."
      ],
      imageUrl: '/assets/aistudio/IMG_8869.JPG_aa3dda67.jpeg',
      isProvisional: false
    },
    {
      id: 'news-02',
      title: 'Cadrer l’intensité sportive : immersion au ras de la pelouse',
      titleEn: 'Framing sports intensity: pitch-level immersion',
      date: 'Carnet de terrain · Stade',
      dateEn: 'Field Notes · Stadium',
      category: 'Coulisses de Tournage',
      categoryEn: 'Behind the Scenes',
      readTime: '2 min de lecture',
      readTimeEn: '2 min read',
      excerpt:
        "Retour sur les choix optiques et le positionnement au sol lors des captations en stade : comment le téléobjectif et le trépied fluide transforment l'énergie d'un match en tableau cinématographique.",
      excerptEn:
        "A look back at optical choices and ground-level positioning during stadium shoots: how telephoto lenses and fluid tripods turn match energy into cinema.",
      content: [
        "La photographie et la vidéo sportives exigent une anticipation permanente. En s'installant directement au ras du gazon, la perspective change radicalement : le sujet gagne en stature et les gradins deviennent une toile de fond graphique.",
        "L'association d'un boîtier Canon EOS monté au téléobjectif pour les plans serrés et d'un trépied à tête fluide le long de la piste permet d'alterner entre l'impact du détail et l'ampleur de l'architecture du stade."
      ],
      contentEn: [
        "Sports photography and cinematography demand constant anticipation. By positioning the camera directly at grass level, the perspective changes dramatically: the athlete gains monumental stature and the stands become a graphic backdrop.",
        "Combining a Canon EOS body with a telephoto lens for tight shots and a fluid-head tripod along the track allows us to alternate between intimate detail and the grand scale of stadium architecture."
      ],
      imageUrl: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      isProvisional: false
    },
    {
      id: 'news-03',
      title: 'Entreprises, Mode, Beauté & Médias : l’écriture cinéma au service des marques',
      titleEn: 'Corporate, Fashion, Beauty & Media: cinema storytelling for brands',
      date: 'Productions · Douala & Cameroun',
      dateEn: 'Productions · Douala & Cameroon',
      category: 'Prestations Tomy Creator',
      categoryEn: 'Tomy Creator Services',
      readTime: '2 min de lecture',
      readTimeEn: '2 min read',
      excerpt:
        "De Cimaco à Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme et Cam10 (« On se lâche »), découvrez comment nous accompagnons les marques et médias camerounais.",
      excerptEn:
        "From Cimaco to Maison Orchelle, DMT Beauty, ARDUISK numérique, Reine du modélisme, and Cam10 ('On se lâche'), discover how we support Cameroonian brands and media.",
      content: [
        "Chaque entreprise a un parcours et chaque marque possède un savoir-faire qui mérite d'être filmé avec justesse. À Douala et dans tout le Cameroun, Tomy Creator accompagne des acteurs variés : industrie (Cimaco), mode et modélisme (Maison Orchelle, Reine du modélisme), cosmétique (DMT Beauty), technologie (ARDUISK numérique) et télévision (Cam10 dans l'émission « On se lâche »).",
        "Rendez-vous dans la rubrique Prestations & Tournage ou cliquez sur le bouton flottant Contacter (+237 6 94 92 58 51 / tomycreator@gmail.com) pour réserver un créneau de rendez-vous ou soumettre votre brief complet."
      ],
      contentEn: [
        "Every company has a journey and every brand holds expertise that deserves to be filmed with precision. In Douala and across Cameroon, Tomy Creator partners with diverse leaders: industry (Cimaco), fashion and pattern design (Maison Orchelle, Reine du modélisme), beauty (DMT Beauty), tech (ARDUISK numérique), and TV media (Cam10 on the show 'On se lâche').",
        "Visit the Services & Booking page or click the floating Contact button (+237 6 94 92 58 51 / tomycreator@gmail.com) to book an appointment or submit your production brief."
      ],
      imageUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      isProvisional: false
    }
  ],
  testimonials: [
    {
      id: 'testi-01',
      authorName: 'Direction & Équipes Partenaires',
      authorRole: 'Collaborations Corporate, Mode & Beauté',
      authorRoleEn: 'Corporate, Fashion & Beauty Collaborations',
      organization: 'Cimaco · Maison Orchelle · DMT Beauty',
      projectContext: 'Films de marque, capsules visuelles & mise en valeur produit',
      projectContextEn: 'Brand films, visual capsules & product showcase',
      quote:
        "Travailler avec Thomas Fotso (Tomy Creator), c'est bénéficier d'un regard de réalisateur qui sublime immédiatement l'identité d'une marque. Du cadrage à la lumière, chaque détail est pensé pour donner une dimension haut de gamme à nos créations et à nos équipes.",
      quoteEn:
        "Working with Thomas Fotso (Tomy Creator) means benefiting from a director's eye that immediately elevates brand identity. From framing to lighting, every detail is crafted to give a high-end dimension to our creations and teams.",
      location: 'Douala · Cameroun',
      avatarUrl: '/assets/aistudio/IMG_8871.JPG_193971a0.jpeg',
      isProvisional: false
    },
    {
      id: 'testi-02',
      authorName: 'Partenaires Tech, Modélisme & Médias TV',
      authorRole: 'Productions Digitales, Artisanat & Télévision',
      authorRoleEn: 'Digital Productions, Craftsmanship & Television',
      organization: 'ARDUISK numérique · Reine du modélisme · Cam10 (« On se lâche »)',
      projectContext: 'Captation plateau, storytelling artisanal & communication digitale',
      projectContextEn: 'Studio capture, craft storytelling & digital communication',
      quote:
        "Que ce soit sur le plateau de l'émission « On se lâche » sur Cam10, dans un atelier de modélisme ou pour des contenus numériques innovants, Tomy Creator apporte un dynamisme, une fluidité de mouvement et une rigueur professionnelle remarquables.",
      quoteEn:
        "Whether on the set of 'On se lâche' on Cam10 TV, inside a fashion design studio, or producing innovative digital content, Tomy Creator brings remarkable energy, fluid camera movement, and professional rigor.",
      location: 'Douala / Yaoundé · Cameroun',
      avatarUrl: '/assets/aistudio/IMG_0964.JPG_3dfe2bbe.jpeg',
      isProvisional: false
    },
    {
      id: 'testi-03',
      authorName: 'Partenaire de Production Visuelle',
      authorRole: 'Photographe & Opérateur Plateau',
      authorRoleEn: 'Photographer & Camera Operator',
      organization: 'Collaboration Terrain · @ndzasso picture',
      projectContext: 'Captation en enceinte sportive & Stade Omnisports',
      projectContextEn: 'Stadium sports cinematography & field coverage',
      quote:
        "Sur le terrain avec Thomas Fotso (Tomy Creator), on partage une exigence rare sur le cadrage et la lumière. Même dans l'intensité d'un événement sportif en stade, chaque angle au ras de la pelouse est composé comme un plan de cinéma.",
      quoteEn:
        "On the field with Thomas Fotso (Tomy Creator), we share a rare standard for framing and light. Even in the intensity of a live stadium match, every pitch-level angle is composed like a cinema shot.",
      location: 'Yaoundé / Douala · +237',
      avatarUrl: '/assets/aistudio/IMG_8868.JPG_42386957.jpeg',
      isProvisional: false
    }
  ],
  faqs: [
    {
      id: 'faq-01',
      category: 'Tarifs & Devis',
      question: 'Comment sont calculés les tarifs d’un tournage avec Tomy Creator ?',
      questionEn: 'How are shooting rates calculated with Tomy Creator?',
      answer:
        "Chaque projet audiovisuel est chiffré sur mesure selon quatre critères transparents : le temps de préparation et de repérage, la durée du tournage sur le terrain (demi-journée, journée ou plusieurs jours), le dispositif technique déployé (caméra DSLR Canon EOS, téléobjectifs, trépied fluide, stabilisateurs DJI, prise de son) et le volume de post-production (montage narratif, étalonnage cinéma, déclinaisons verticales). Un devis détaillé vous est transmis sous 24h à 48h après notre premier échange.",
      answerEn:
        "Every audiovisual project is custom-quoted based on four transparent criteria: pre-production and scouting time, shooting duration on location (half-day, full-day, or multi-day), technical rig deployed (Canon EOS DSLR, telephoto lenses, fluid tripod, DJI gimbals, audio), and post-production scope (narrative editing, cinema color grading, vertical cuts). A detailed quote is delivered within 24 to 48 hours."
    },
    {
      id: 'faq-02',
      category: 'Tarifs & Devis',
      question: 'Quelles sont les modalités de règlement et d’acompte pour bloquer une date ?',
      questionEn: 'What are the payment and deposit terms to lock in a shooting date?',
      answer:
        "La réservation ferme d'une date de tournage s'effectue à la validation du devis avec le versement d'un acompte de démarrage (généralement 40% à 50%), permettant de couvrir la pré-production, les repérages et la logistique. Le solde est réglé à la livraison et validation des masters vidéo/photo.",
      answerEn:
        "Booking a confirmed shooting date requires quote approval and an initial deposit (typically 40% to 50%) covering pre-production, location scouting, and logistics. The balance is settled upon delivery and approval of the final video/photo masters."
    },
    {
      id: 'faq-03',
      category: 'Disponibilités & Délais',
      question: 'Combien de temps à l’avance faut-il réserver un tournage ou prendre rendez-vous ?',
      questionEn: 'How far in advance should I book a shoot or schedule an appointment?',
      answer:
        "Pour un documentaire, un film d'entreprise ou un épisode 237 Cinématique, nous recommandons de nous solliciter 2 à 3 semaines à l'avance afin de soigner l'écriture et les repérages. Pour une captation événementielle, média ou sportive urgente, nous pouvons intervenir dans des délais très courts selon les disponibilités du planning.",
      answerEn:
        "For a documentary, corporate film, or 237 Cinématique episode, we recommend reaching out 2 to 3 weeks in advance for scriptwriting and scouting. For urgent live event, media, or sports coverage, we can deploy on short notice depending on schedule availability."
    },
    {
      id: 'faq-04',
      category: 'Disponibilités & Délais',
      question: 'Vous déplacez-vous à Douala, Yaoundé et dans toutes les régions du Cameroun (+237) ?',
      questionEn: 'Do you travel across Douala, Yaoundé, and all regions of Cameroon (+237)?',
      answer:
        "Oui. Basé à Douala et actif à Yaoundé, l'ADN même de Tomy Creator et de 237 Cinématique est d'explorer les 10 régions du Cameroun (Littoral, Centre, Ouest, Sud, Nord, etc.) ainsi que d'accompagner nos clients à l'international.",
      answerEn:
        "Yes. Based in Douala and active in Yaoundé, the very DNA of Tomy Creator and 237 Cinématique is to explore all 10 regions of Cameroon as well as accompany clients internationally."
    },
    {
      id: 'faq-05',
      category: 'Processus de tournage',
      question: 'Comment se déroule concrètement le processus de production du premier rendez-vous à la livraison ?',
      questionEn: 'How does the production process work from the first meeting to final delivery?',
      answer:
        "Le processus suit 4 étapes claires : 1) Rendez-vous découverte (WhatsApp au +237 6 94 92 58 51, téléphone ou rencontre sur site) pour définir vos objectifs ; 2) Écriture du séquencier et repérage lumineux/sonore du lieu ; 3) Tournage dirigé par Thomas Fotso ; 4) Montage dramaturgique, étalonnage cinématographique et livraison des fichiers en haute définition (16:9 et formats réseaux sociaux 9:16).",
      answerEn:
        "The process follows 4 clear stages: 1) Discovery meeting (WhatsApp at +237 6 94 92 58 51, phone, or on-site meeting) to define your goals; 2) Storyboard writing and lighting/audio scouting; 3) Shooting directed by Thomas Fotso; 4) Narrative editing, cinema color grading, and high-definition delivery (16:9 widescreen and 9:16 social formats)."
    },
    {
      id: 'faq-06',
      category: 'Processus de tournage',
      question: 'Comment proposer mon entreprise, mon atelier ou ma ville pour un épisode de 237 Cinématique ?',
      questionEn: 'How can I propose my company, workshop, or city for a 237 Cinématique episode?',
      answer:
        "Vous pouvez utiliser le formulaire de prise de rendez-vous ou de demande de tournage en sélectionnant « Proposition d'épisode 237 Cinématique », ou cliquer sur le bouton flottant « Contacter » en bas à droite pour écrire directement à Thomas Fotso sur WhatsApp (+237 6 94 92 58 51) ou par mail (tomycreator@gmail.com).",
      answerEn:
        "You can use the appointment or shooting request form by selecting '237 Cinématique Episode Proposal', or click the floating 'Contact' button at the bottom right to message Thomas Fotso directly on WhatsApp (+237 6 94 92 58 51) or by email (tomycreator@gmail.com)."
    }
  ],
  shootingRequests: [],
  appointments: []
};
