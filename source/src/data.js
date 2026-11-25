// Illustrative demo data for the AtlasBid UK prototype. All values are examples.
// Localised fields are { en, fr } objects, resolved with L(value, lang).

export const L = (v, lang) => (v && typeof v === 'object' && !Array.isArray(v) && 'en' in v ? v[lang] : v);

export const FX = 12.6; // indicative GBP→MAD rate used across the prototype

export const COMPANY = {
  name: 'BritInfra Engineering Ltd',
  city: { en: 'London', fr: 'Londres' },
  turnover: '£180M',
  certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001'],
  sweetSpot: [5, 70], // £M contract value band
};

export const PROFILES = [
  { id: 'aviation', label: { en: 'Aviation & Infrastructure', fr: 'Aéroports & infrastructures' }, short: { en: 'Aviation & Infra', fr: 'Aéroports & infra' } },
  { id: 'energy', label: { en: 'Clean Energy & Water', fr: 'Énergie propre & eau' }, short: { en: 'Energy & Water', fr: 'Énergie & eau' } },
  { id: 'digital', label: { en: 'Digital & Smart City', fr: 'Digital & ville intelligente' }, short: { en: 'Digital & Smart City', fr: 'Digital & smart city' } },
];

export const AUTHORITIES = ['ONDA', 'ONCF', 'MASEN', 'Ministry of Equipment', 'Tanger Med'];
export const AUTHORITY_LABEL = {
  'Ministry of Equipment': { en: 'Ministry of Equipment', fr: 'Ministère de l’Équipement' },
  'Unidentified authority': { en: 'Unidentified authority', fr: 'Autorité non identifiée' },
};
export const authLabel = (a, lang) => L(AUTHORITY_LABEL[a], lang) || a;

export const SECTORS = ['Aviation', 'Rail', 'Energy & Water', 'Digital & Smart City', 'Ports & Logistics'];
export const SECTOR_LABEL = {
  Aviation: { en: 'Aviation', fr: 'Aéroportuaire' },
  Rail: { en: 'Rail', fr: 'Ferroviaire' },
  'Energy & Water': { en: 'Energy & Water', fr: 'Énergie & eau' },
  'Digital & Smart City': { en: 'Digital & Smart City', fr: 'Digital & ville intelligente' },
  'Ports & Logistics': { en: 'Ports & Logistics', fr: 'Ports & logistique' },
};
export const sectorLabel = (s, lang) => L(SECTOR_LABEL[s], lang) || s;

export const JV_LABEL = {
  High: { en: 'High', fr: 'Élevé' },
  Moderate: { en: 'Moderate', fr: 'Modéré' },
  Low: { en: 'Low', fr: 'Faible' },
};

export const FACTOR_LABELS = [
  { en: 'Sector fit', fr: 'Adéquation sectorielle' },
  { en: 'Capability match', fr: 'Adéquation des capacités' },
  { en: 'Track-record relevance', fr: 'Pertinence des références' },
  { en: 'Commercial capacity', fr: 'Capacité commerciale' },
];

const DECREE = { en: 'Decree No. 2-22-431 of 8 March 2023', fr: 'décret n° 2-22-431 du 8 mars 2023' };

export const TENDERS = [
  {
    id: 't1',
    ref: 'AOI N° 41/2026/ONDA',
    authority: 'ONDA',
    authorityFull: 'Office National Des Aéroports',
    title: {
      en: 'Marrakech-Menara Airport Terminal Expansion & Smart Baggage System',
      fr: 'Extension de l’aérogare de Marrakech-Menara et système intelligent de tri des bagages',
    },
    sector: 'Aviation',
    worldCup: true,
    valueGBP: 28.5,
    daysLeft: 45,
    scores: { aviation: 96, energy: 71, digital: 83 },
    offsets: [2, -1, 3, -4],
    jv: 'High',
    location: { en: 'Marrakech', fr: 'Marrakech' },
    procedure: { en: 'International open tender', fr: 'Appel d’offres ouvert international' },
    execution: { en: '24 months, phased around live terminal operations', fr: '24 mois, phasés autour de l’exploitation de l’aérogare' },
    bidBondMAD: 3600000,
    framework: {
      en: `ONDA purchasing regulation (règlement des achats), aligned with ${DECREE.en}`,
      fr: `Règlement des achats de l’ONDA, aligné sur le ${DECREE.fr}`,
    },
    summary: {
      en: 'ONDA is expanding Terminal 1 at Marrakech-Menara to lift capacity ahead of the 2030 FIFA World Cup. The package covers a 24,000 m² terminal extension, a new hold-baggage screening and sortation hall, and an RFID-enabled smart baggage tracking layer integrated with the airport operational database.',
      fr: 'L’ONDA agrandit le Terminal 1 de Marrakech-Menara pour augmenter sa capacité avant la Coupe du Monde 2030. Le lot comprend une extension de 24 000 m², un nouveau hall d’inspection et de tri des bagages de soute, et une couche de traçabilité RFID intégrée à la base de données opérationnelle de l’aéroport.',
    },
    scope: {
      en: [
        'Design-and-build terminal extension (approx. 24,000 m²) with phased handover',
        'Standard 3 hold-baggage screening and automated sortation hall',
        'RFID baggage tracking integrated with AODB and airline DCS feeds',
        'Testing, commissioning and ORAT support through tournament readiness',
      ],
      fr: [
        'Conception-réalisation de l’extension (environ 24 000 m²) avec réception phasée',
        'Hall d’inspection des bagages de soute Standard 3 et tri automatisé',
        'Traçabilité RFID des bagages intégrée à l’AODB et aux systèmes des compagnies',
        'Essais, mise en service et accompagnement ORAT jusqu’au tournoi',
      ],
    },
    rationale: {
      aviation: { en: 'Direct match: live-airport terminal delivery and baggage systems are BritInfra’s core references.', fr: 'Adéquation directe : les aérogares en exploitation et les systèmes bagages sont les références clés de BritInfra.' },
      energy: { en: 'Partial match: building services scope only; terminal works fall outside an energy-led profile.', fr: 'Adéquation partielle : seuls les lots techniques correspondent ; les travaux d’aérogare sortent d’un profil énergie.' },
      digital: { en: 'Good match on the RFID tracking and AODB integration layer; civil scope needs a partner.', fr: 'Bonne adéquation sur la traçabilité RFID et l’intégration AODB ; le génie civil nécessite un partenaire.' },
    },
    considerations: {
      en: [
        'Resident bidders must hold the Moroccan works qualification & classification certificate; non-resident firms evidence equivalent references.',
        'National preference: Moroccan bidders may benefit from a price margin of up to 15%. A Moroccan JV member reduces this gap.',
        'Mandatory site visit at Marrakech-Menara before submission.',
        'Bids in French; submission on paper or electronically via the national e-procurement portal.',
      ],
      fr: [
        'Les soumissionnaires installés au Maroc doivent détenir le certificat de qualification et de classification ; les entreprises non résidentes justifient de références équivalentes.',
        'Préférence nationale : les soumissionnaires marocains peuvent bénéficier d’une marge de prix allant jusqu’à 15 %. Un membre marocain du groupement réduit cet écart.',
        'Visite des lieux obligatoire à Marrakech-Menara avant le dépôt.',
        'Offres en français ; dépôt papier ou électronique via le portail national des marchés publics.',
      ],
    },
    jvRationale: {
      en: 'Lead a joint and several groupement as technical lead (≈55%) with a vetted Moroccan civil and airport contractor (≈45%). The partner brings the works classification, ONDA site experience and local labour supply; BritInfra leads baggage systems, design management and ORAT.',
      fr: 'Piloter un groupement solidaire en tant que chef de file technique (≈55 %) avec une entreprise marocaine vérifiée de génie civil aéroportuaire (≈45 %). Le partenaire apporte la classification, l’expérience des sites ONDA et la main-d’œuvre locale ; BritInfra pilote les systèmes bagages, la gestion de la conception et l’ORAT.',
    },
    partners: ['MA-104', 'MA-312', 'MA-508'],
  },
  {
    id: 't2',
    ref: 'AOI N° HSR-07/2026/ONCF',
    authority: 'ONCF',
    authorityFull: 'Office National des Chemins de Fer',
    title: {
      en: 'Kenitra–Marrakech High-Speed Rail Signalling & Telecoms',
      fr: 'Signalisation et télécommunications de la LGV Kénitra–Marrakech',
    },
    sector: 'Rail',
    worldCup: true,
    valueGBP: 64.0,
    daysLeft: 60,
    scores: { aviation: 91, energy: 58, digital: 86 },
    offsets: [-2, 3, 1, -3],
    jv: 'High',
    location: { en: 'Kenitra–Rabat–Casablanca–Marrakech corridor', fr: 'Corridor Kénitra–Rabat–Casablanca–Marrakech' },
    procedure: { en: 'International open tender with prequalification', fr: 'Appel d’offres international avec présélection' },
    execution: { en: '36 months, including 12-month operational support', fr: '36 mois, dont 12 mois d’assistance à l’exploitation' },
    bidBondMAD: 6000000,
    framework: { en: `ONCF purchasing regulation, aligned with ${DECREE.en}`, fr: `Règlement des achats de l’ONCF, aligné sur le ${DECREE.fr}` },
    summary: {
      en: 'ONCF is extending high-speed services south from Kenitra to Marrakech to connect World Cup host cities. This lot covers ETCS Level 2 signalling, GSM-R / FRMCS-ready radio, fibre backbone and the operational control centre interfaces along the new alignment.',
      fr: 'L’ONCF prolonge la grande vitesse de Kénitra à Marrakech pour relier les villes hôtes de la Coupe du Monde. Ce lot couvre la signalisation ETCS niveau 2, la radio GSM-R compatible FRMCS, la dorsale fibre et les interfaces avec le poste central de commande.',
    },
    scope: {
      en: [
        'ETCS Level 2 trackside and interlocking design, supply and installation',
        'GSM-R radio network with FRMCS migration path',
        'Fibre-optic backbone and SCADA telecoms for traction power',
        'Integration with the Casablanca operational control centre',
      ],
      fr: [
        'Conception, fourniture et pose de l’ETCS niveau 2 et des enclenchements',
        'Réseau radio GSM-R avec trajectoire de migration FRMCS',
        'Dorsale fibre optique et télécoms SCADA pour l’alimentation traction',
        'Intégration au poste central de commande de Casablanca',
      ],
    },
    rationale: {
      aviation: { en: 'Strong match: major transport systems integration and rail signalling references in the UK.', fr: 'Forte adéquation : références britanniques en intégration de grands systèmes de transport et en signalisation.' },
      energy: { en: 'Weak match: traction power interfaces only; signalling is outside an energy-led profile.', fr: 'Faible adéquation : seules les interfaces d’alimentation traction correspondent.' },
      digital: { en: 'Strong match on telecoms, fibre backbone and control-centre integration.', fr: 'Forte adéquation sur les télécoms, la dorsale fibre et l’intégration du poste de commande.' },
    },
    considerations: {
      en: [
        'Prequalification stage: financial capacity and three comparable signalling references required.',
        'Interoperability with existing Tangier–Kenitra Al Boraq systems must be demonstrated.',
        'National preference applies; local subcontracting share is scored in the technical evaluation.',
        'Large bid bond: arrange a UK bank counter-guarantee early.',
      ],
      fr: [
        'Phase de présélection : capacité financière et trois références comparables en signalisation exigées.',
        'L’interopérabilité avec les systèmes Al Boraq Tanger–Kénitra doit être démontrée.',
        'Préférence nationale applicable ; la part de sous-traitance locale est notée dans l’évaluation technique.',
        'Caution importante : organiser tôt une contre-garantie d’une banque britannique.',
      ],
    },
    jvRationale: {
      en: 'Form a groupement with a Moroccan telecoms and IT integrator for fibre, civils interfaces and local O&M, with a PMO consultancy supporting interface management with ONCF. BritInfra leads signalling design and safety case.',
      fr: 'Constituer un groupement avec un intégrateur marocain IT et télécoms pour la fibre, les interfaces génie civil et la maintenance locale, appuyé par un cabinet PMO pour la gestion des interfaces avec l’ONCF. BritInfra pilote la conception de la signalisation et le dossier de sécurité.',
    },
    partners: ['MA-415', 'MA-209', 'MA-508'],
  },
  {
    id: 't3',
    ref: 'AO N° 2026/MASEN/HYD-12',
    authority: 'MASEN',
    authorityFull: 'Moroccan Agency for Sustainable Energy',
    title: {
      en: 'Casablanca Hybrid Solar & Desalination Engineering Consultancy',
      fr: 'Ingénierie conseil pour un projet hybride solaire et dessalement à Casablanca',
    },
    sector: 'Energy & Water',
    worldCup: false,
    valueGBP: 14.2,
    daysLeft: 28,
    scores: { aviation: 84, energy: 97, digital: 61 },
    offsets: [-3, 2, 0, 1],
    jv: 'Moderate',
    location: { en: 'Greater Casablanca', fr: 'Grand Casablanca' },
    procedure: { en: 'International restricted tender (consultancy services)', fr: 'Appel d’offres international restreint (prestations de conseil)' },
    execution: { en: '30 months, feasibility through construction supervision', fr: '30 mois, de la faisabilité au suivi des travaux' },
    bidBondMAD: 1200000,
    framework: { en: 'MASEN procurement rules (state-owned company with its own purchasing regulation)', fr: 'Règles d’achat de MASEN (société publique dotée de son propre règlement)' },
    summary: {
      en: 'MASEN seeks an owner’s engineer for a hybrid solar PV and seawater reverse-osmosis desalination scheme serving Greater Casablanca. Services run from feasibility and ESIA review through EPC tender support and construction supervision.',
      fr: 'MASEN recherche un ingénieur conseil pour un projet hybride photovoltaïque et dessalement d’eau de mer par osmose inverse au service du Grand Casablanca, de la faisabilité et revue EIES jusqu’à l’appui aux appels d’offres EPC et au suivi des travaux.',
    },
    scope: {
      en: [
        'Feasibility, yield assessment and hybrid PV + storage configuration',
        'Desalination process design review (SWRO) and grid-connection studies',
        'EPC tender documentation and bid evaluation support',
        'Construction supervision and performance testing',
      ],
      fr: [
        'Faisabilité, productible et configuration hybride PV + stockage',
        'Revue du procédé de dessalement (SWRO) et études de raccordement',
        'Dossiers d’appel d’offres EPC et appui à l’évaluation',
        'Suivi des travaux et essais de performance',
      ],
    },
    rationale: {
      aviation: { en: 'Reasonable match: owner’s engineer and supervision capability transfers, sector references are lighter.', fr: 'Adéquation correcte : la capacité d’ingénieur conseil est transférable, les références sectorielles sont plus légères.' },
      energy: { en: 'Direct match: hybrid renewables and water treatment owner’s-engineer references.', fr: 'Adéquation directe : références d’ingénieur conseil en renouvelables hybrides et traitement de l’eau.' },
      digital: { en: 'Limited match: only SCADA and monitoring elements apply.', fr: 'Adéquation limitée : seuls le SCADA et la supervision correspondent.' },
    },
    considerations: {
      en: [
        'Consultancy evaluation weighted on methodology and key experts (typically 70/30 technical/financial).',
        'Key expert CVs must be committed for the contract duration.',
        'Short window: 28 days to assemble expert team and French-language methodology.',
      ],
      fr: [
        'Évaluation pondérée sur la méthodologie et les experts clés (en général 70/30 technique/financier).',
        'Les CV des experts clés doivent être engagés pour toute la durée du marché.',
        'Délai court : 28 jours pour constituer l’équipe et rédiger la méthodologie en français.',
      ],
    },
    jvRationale: {
      en: 'A full JV is optional. A local PMO consultancy as subconsultant adds permitting knowledge and on-site supervision staff at competitive day rates.',
      fr: 'Un groupement complet est facultatif. Un cabinet PMO local en sous-traitance apporte la connaissance des autorisations et du personnel de suivi sur site à des tarifs compétitifs.',
    },
    partners: ['MA-209', 'MA-508'],
  },
  {
    id: 't4',
    ref: 'AO N° 18/2026/MEE/DRCR',
    authority: 'Ministry of Equipment',
    authorityFull: 'Ministère de l’Équipement et de l’Eau',
    title: {
      en: 'Smart Stadium Access & Urban Mobility Platform',
      fr: 'Plateforme intelligente d’accès aux stades et de mobilité urbaine',
    },
    sector: 'Digital & Smart City',
    worldCup: true,
    valueGBP: 19.0,
    daysLeft: 35,
    scores: { aviation: 88, energy: 64, digital: 95 },
    offsets: [1, 2, -2, -1],
    jv: 'High',
    location: { en: 'World Cup host cities', fr: 'Villes hôtes de la Coupe du Monde' },
    procedure: { en: 'Open tender on price offers', fr: 'Appel d’offres ouvert sur offres de prix' },
    execution: { en: '20 months, live by mid-2029 test events', fr: '20 mois, opérationnelle pour les tests de mi-2029' },
    bidBondMAD: 1500000,
    framework: { en: `${DECREE.en} on public procurement (applies directly)`, fr: `${DECREE.fr.charAt(0).toUpperCase() + DECREE.fr.slice(1)} relatif aux marchés publics (application directe)` },
    summary: {
      en: 'A national platform to manage spectator access and last-mile mobility around World Cup stadiums: crowd-flow sensing, dynamic signage, shuttle and park-and-ride orchestration, and a unified operations dashboard shared with police and city authorities.',
      fr: 'Une plateforme nationale pour gérer l’accès des spectateurs et la mobilité du dernier kilomètre autour des stades : mesure des flux, signalétique dynamique, navettes et parkings relais, et un tableau de bord unifié partagé avec la police et les villes.',
    },
    scope: {
      en: [
        'Crowd-flow sensing and video analytics at stadium perimeters',
        'Dynamic wayfinding signage and journey planner integration',
        'Shuttle, park-and-ride and event-day traffic management modules',
        'Multi-agency operations centre dashboard and data platform',
      ],
      fr: [
        'Mesure des flux de foule et analyse vidéo aux abords des stades',
        'Signalétique dynamique et intégration d’un calculateur d’itinéraires',
        'Modules navettes, parkings relais et gestion du trafic les jours de match',
        'Tableau de bord du centre opérationnel multi-agences et plateforme de données',
      ],
    },
    rationale: {
      aviation: { en: 'Good match: major-event transport planning and systems integration references.', fr: 'Bonne adéquation : références en planification des transports de grands événements et en intégration.' },
      energy: { en: 'Weak match: outside an energy and water capability profile.', fr: 'Faible adéquation : hors du profil énergie et eau.' },
      digital: { en: 'Direct match: smart-city platforms, data integration and event operations.', fr: 'Adéquation directe : plateformes smart city, intégration de données et exploitation d’événements.' },
    },
    considerations: {
      en: [
        'Falls directly under Decree No. 2-22-431, including national preference and SME share provisions.',
        'Data hosting in Morocco and alignment with Law 09-08 on personal data protection (CNDP).',
        'Multi-city deployment requires local installation and maintenance capacity.',
      ],
      fr: [
        'Relève directement du décret n° 2-22-431, y compris la préférence nationale et la part réservée aux PME.',
        'Hébergement des données au Maroc et conformité à la loi 09-08 sur les données personnelles (CNDP).',
        'Le déploiement multi-villes exige une capacité locale d’installation et de maintenance.',
      ],
    },
    jvRationale: {
      en: 'Partner with a Moroccan IT and telecoms integrator for in-country hosting, installation and maintenance, plus a PMO consultancy with major-event readiness experience to manage multi-agency stakeholders.',
      fr: 'S’associer à un intégrateur marocain IT et télécoms pour l’hébergement, l’installation et la maintenance, et à un cabinet PMO expérimenté en grands événements pour coordonner les parties prenantes.',
    },
    partners: ['MA-415', 'MA-209', 'MA-508'],
  },
  {
    id: 't5',
    ref: 'AO N° 63/2026/ONDA',
    authority: 'ONDA',
    authorityFull: 'Office National Des Aéroports',
    title: {
      en: 'Mohammed V Airport Terminal HVAC & Energy Efficiency Upgrade',
      fr: 'Modernisation CVC et efficacité énergétique de l’aérogare de l’aéroport Mohammed V',
    },
    sector: 'Aviation',
    worldCup: true,
    valueGBP: 9.8,
    daysLeft: 21,
    scores: { aviation: 79, energy: 90, digital: 57 },
    offsets: [-1, 1, 2, -2],
    jv: 'Low',
    location: { en: 'Casablanca (Nouaceur)', fr: 'Casablanca (Nouaceur)' },
    procedure: { en: 'Open tender on price offers', fr: 'Appel d’offres ouvert sur offres de prix' },
    execution: { en: '14 months, night-shift works in live terminal', fr: '14 mois, travaux de nuit en aérogare exploitée' },
    bidBondMAD: 800000,
    framework: { en: `ONDA purchasing regulation, aligned with ${DECREE.en}`, fr: `Règlement des achats de l’ONDA, aligné sur le ${DECREE.fr}` },
    summary: {
      en: 'Replacement of chillers and air-handling units in Terminal 2 at Mohammed V International, with a building management system upgrade and energy-performance targets of a 25% reduction in HVAC consumption.',
      fr: 'Remplacement des groupes froids et des centrales de traitement d’air du Terminal 2 de l’aéroport Mohammed V, avec modernisation de la GTB et un objectif de baisse de 25 % de la consommation CVC.',
    },
    scope: {
      en: ['Chiller plant and AHU replacement with heat recovery', 'BMS upgrade and energy metering', 'Measurement and verification of energy savings over 12 months'],
      fr: ['Remplacement des groupes froids et CTA avec récupération de chaleur', 'Modernisation de la GTB et comptage énergétique', 'Mesure et vérification des économies sur 12 mois'],
    },
    rationale: {
      aviation: { en: 'Moderate match: airport building services, though mainly a mechanical package.', fr: 'Adéquation moyenne : lots techniques aéroportuaires, mais surtout de la mécanique.' },
      energy: { en: 'Strong match: energy-efficiency retrofit with measured performance targets.', fr: 'Forte adéquation : rénovation énergétique avec objectifs de performance mesurés.' },
      digital: { en: 'Weak match: BMS integration only.', fr: 'Faible adéquation : intégration GTB uniquement.' },
    },
    considerations: {
      en: [
        'Mechanical works classification typically required for resident bidders.',
        'Short window: 21 days left. Prioritise a go/no-go decision this week.',
        'Price-led evaluation: lowest compliant offer usually wins.',
      ],
      fr: [
        'Classification en lots techniques généralement exigée pour les soumissionnaires résidents.',
        'Délai court : 21 jours restants. Décider du go/no-go cette semaine.',
        'Évaluation au prix : l’offre conforme la moins-disante l’emporte en général.',
      ],
    },
    jvRationale: {
      en: 'A JV adds little on a price-led package of this size. Consider subcontracting installation to a Moroccan electromechanical integrator while BritInfra provides design and energy M&V.',
      fr: 'Un groupement apporte peu sur un lot de cette taille évalué au prix. Envisager de sous-traiter l’installation à un intégrateur électromécanique marocain, BritInfra assurant la conception et la vérification des économies.',
    },
    partners: ['MA-312'],
  },
  {
    id: 't6',
    ref: 'AO N° TMSA/2026/DSI-09',
    authority: 'Tanger Med',
    authorityFull: 'Tanger Med Special Agency (TMSA)',
    title: {
      en: 'Port Logistics AI & Industrial Cybersecurity',
      fr: 'IA pour la logistique portuaire et cybersécurité industrielle',
    },
    sector: 'Ports & Logistics',
    worldCup: false,
    valueGBP: 11.5,
    daysLeft: 50,
    scores: { aviation: 75, energy: 52, digital: 93 },
    offsets: [2, -2, 0, 1],
    jv: 'Moderate',
    location: { en: 'Tanger Med port complex', fr: 'Complexe portuaire Tanger Med' },
    procedure: { en: 'Consultation on invitation (pre-selected bidders)', fr: 'Consultation sur invitation (candidats présélectionnés)' },
    execution: { en: '18 months plus 3-year managed security service', fr: '18 mois puis 3 ans de service de sécurité managé' },
    bidBondMAD: 900000,
    framework: { en: 'TMSA group purchasing procedures (private-law company under state supervision)', fr: 'Procédures d’achat du groupe TMSA (société de droit privé sous tutelle de l’État)' },
    summary: {
      en: 'Predictive analytics for yard and gate operations combined with an OT security operations centre protecting terminal operating systems, cranes and access control across the Tanger Med complex.',
      fr: 'Analyse prédictive des opérations de parc et de portes, combinée à un centre de sécurité OT protégeant les systèmes d’exploitation des terminaux, les grues et le contrôle d’accès du complexe Tanger Med.',
    },
    scope: {
      en: [
        'AI models for yard planning, gate throughput and truck appointment optimisation',
        'OT network segmentation and asset inventory (IEC 62443 aligned)',
        'Industrial SOC with 24/7 monitoring and incident response',
      ],
      fr: [
        'Modèles d’IA pour la planification du parc, le débit des portes et les rendez-vous camions',
        'Segmentation du réseau OT et inventaire des actifs (conforme IEC 62443)',
        'SOC industriel avec surveillance 24/7 et réponse aux incidents',
      ],
    },
    rationale: {
      aviation: { en: 'Partial match: critical infrastructure systems experience, limited port references.', fr: 'Adéquation partielle : expérience des infrastructures critiques, peu de références portuaires.' },
      energy: { en: 'Weak match: outside an energy and water profile.', fr: 'Faible adéquation : hors du profil énergie et eau.' },
      digital: { en: 'Strong match: AI analytics and OT cybersecurity for critical national infrastructure.', fr: 'Forte adéquation : IA et cybersécurité OT pour les infrastructures critiques.' },
    },
    considerations: {
      en: [
        'Invitation-only: registration on the TMSA supplier panel is needed first.',
        'Managed SOC service requires Moroccan-based staff and data residency.',
        'DGSSI cybersecurity requirements apply to critical infrastructure operators.',
      ],
      fr: [
        'Sur invitation : l’inscription au panel fournisseurs de TMSA est un préalable.',
        'Le SOC managé exige du personnel basé au Maroc et l’hébergement local des données.',
        'Les exigences de la DGSSI s’appliquent aux opérateurs d’infrastructures critiques.',
      ],
    },
    jvRationale: {
      en: 'Team with a Moroccan cybersecurity integrator holding local SOC capacity for the managed-service phase; BritInfra leads AI analytics and OT architecture.',
      fr: 'S’associer à un intégrateur marocain en cybersécurité disposant d’un SOC local pour la phase de service managé ; BritInfra pilote l’IA et l’architecture OT.',
    },
    partners: ['MA-415', 'MA-508'],
  },
];

export const SPECIALTY_LABEL = {
  'Civil & Airport Works': { en: 'Civil & Airport Works', fr: 'Génie civil & aéroports' },
  'PMO & Advisory': { en: 'PMO & Advisory', fr: 'PMO & conseil' },
  'Electromechanical & MEP': { en: 'Electromechanical & MEP', fr: 'Électromécanique & lots techniques' },
  'IT, Telecoms & Cyber': { en: 'IT, Telecoms & Cyber', fr: 'IT, télécoms & cyber' },
  'Legal & JV Structuring': { en: 'Legal & JV Structuring', fr: 'Juridique & groupements' },
};

export const PARTNERS = [
  {
    id: 'MA-104',
    city: 'Casablanca',
    name: { en: 'Civil & Airport Infrastructure Contractor', fr: 'Entreprise de génie civil et d’infrastructures aéroportuaires' },
    specialty: 'Civil & Airport Works',
    certs: ['ISO 9001', 'ISO 14001'],
    track: { en: 'ONDA terminal and airside works; public works for national ministries', fr: 'Travaux d’aérogares et côté piste pour l’ONDA ; travaux publics pour les ministères' },
    years: 27,
    staff: '650+',
    turnover: { en: 'MAD 400–600M', fr: '400–600 M MAD' },
    strengths: {
      en: ['Works classification held', 'Live-airport works', 'Local labour supply'],
      fr: ['Classification travaux détenue', 'Travaux en aéroport exploité', 'Main-d’œuvre locale'],
    },
    vetted: { en: 'Oct 2026', fr: 'oct. 2026' },
  },
  {
    id: 'MA-209',
    city: 'Rabat',
    name: { en: 'Transport & Infrastructure PMO Consultancy', fr: 'Cabinet PMO transport et infrastructures' },
    specialty: 'PMO & Advisory',
    certs: ['ISO 9001'],
    track: { en: 'Urban mobility programmes and major event readiness planning', fr: 'Programmes de mobilité urbaine et préparation des grands événements' },
    years: 15,
    staff: '85',
    turnover: { en: 'MAD 40–60M', fr: '40–60 M MAD' },
    strengths: {
      en: ['Ministry stakeholder access', 'Event operations planning', 'Bilingual reporting'],
      fr: ['Relations avec les ministères', 'Planification opérationnelle d’événements', 'Reporting bilingue'],
    },
    vetted: { en: 'Sep 2026', fr: 'sept. 2026' },
  },
  {
    id: 'MA-312',
    city: { en: 'Tangier', fr: 'Tanger' },
    name: { en: 'Electromechanical & Building Systems Integrator', fr: 'Intégrateur électromécanique et lots techniques du bâtiment' },
    specialty: 'Electromechanical & MEP',
    certs: ['ISO 9001', 'ISO 45001'],
    track: { en: 'HVAC, electrical and BMS packages for public facilities', fr: 'Lots CVC, électricité et GTB pour des équipements publics' },
    years: 19,
    staff: '240',
    turnover: { en: 'MAD 150–250M', fr: '150–250 M MAD' },
    strengths: {
      en: ['Mechanical works classification', 'Night-shift delivery', 'Northern Morocco coverage'],
      fr: ['Classification lots techniques', 'Travaux de nuit', 'Couverture du nord du Maroc'],
    },
    vetted: { en: 'Nov 2026', fr: 'nov. 2026' },
  },
  {
    id: 'MA-415',
    city: 'Casablanca',
    name: { en: 'Enterprise IT, Telecoms & Cybersecurity Integrator', fr: 'Intégrateur IT, télécoms et cybersécurité' },
    specialty: 'IT, Telecoms & Cyber',
    certs: ['ISO 27001', 'ISO 9001'],
    track: { en: 'Public sector networks, SOC services and critical infrastructure', fr: 'Réseaux du secteur public, services SOC et infrastructures critiques' },
    years: 14,
    staff: '310',
    turnover: { en: 'MAD 200–300M', fr: '200–300 M MAD' },
    strengths: {
      en: ['In-country SOC', 'Data residency', 'Public sector frameworks'],
      fr: ['SOC au Maroc', 'Hébergement local des données', 'Accords-cadres publics'],
    },
    vetted: { en: 'Oct 2026', fr: 'oct. 2026' },
  },
  {
    id: 'MA-508',
    city: 'Casablanca',
    name: { en: 'Corporate Legal & Procurement Structuring Counsel', fr: 'Cabinet d’avocats en droit des affaires et structuration des marchés' },
    specialty: 'Legal & JV Structuring',
    certs: [{ en: 'Casablanca Bar registered', fr: 'Inscrit au barreau de Casablanca' }],
    track: { en: 'Groupement agreements, local entity set-up and procurement disputes', fr: 'Conventions de groupement, création d’entités locales et contentieux des marchés' },
    years: 21,
    staff: '40',
    turnover: { en: 'Advisory firm', fr: 'Cabinet de conseil' },
    strengths: {
      en: ['JV & groupement drafting', 'Branch / subsidiary set-up', 'Bid challenge procedures'],
      fr: ['Rédaction de conventions de groupement', 'Création de filiale ou succursale', 'Recours en matière de marchés'],
    },
    vetted: { en: 'Aug 2026', fr: 'août 2026' },
  },
];

export const SPECIALTIES = ['All', ...PARTNERS.map((p) => p.specialty)];

export const SERVICES = [
  { id: 'gonogo', label: { en: 'Go/No-Go Feasibility Audit', fr: 'Audit de faisabilité Go/No-Go' }, sla: { en: '5 business days', fr: '5 jours ouvrés' } },
  { id: 'bid', label: { en: 'Bid Preparation Support', fr: 'Appui à la préparation de l’offre' }, sla: { en: 'Kick-off within 48 hours', fr: 'Lancement sous 48 heures' } },
  { id: 'jv', label: { en: 'Moroccan Partner & JV Structuring', fr: 'Partenaire marocain & structuration du groupement' }, sla: { en: '10 business days', fr: '10 jours ouvrés' } },
  { id: 'entity', label: { en: 'Local Subsidiary / Branch Setup', fr: 'Création de filiale / succursale' }, sla: { en: '4–6 weeks', fr: '4 à 6 semaines' } },
];

export const CHECKLIST = [
  {
    id: 'admin',
    label: { en: 'Administrative Dossier', fr: 'Dossier administratif' },
    items: [
      { id: 'a1', label: { en: 'Sworn statement (déclaration sur l’honneur) signed', fr: 'Déclaration sur l’honneur signée' } },
      { id: 'a2', label: { en: 'Signatory powers / power of attorney', fr: 'Pouvoirs du signataire / procuration' } },
      { id: 'a3', label: { en: 'UK tax and social-security equivalence certificates', fr: 'Attestations fiscales et sociales britanniques équivalentes' } },
      { id: 'a4', label: { en: 'Companies House extract with certified French translation', fr: 'Extrait Companies House avec traduction certifiée en français' } },
    ],
  },
  {
    id: 'tech',
    label: { en: 'Technical Proposal', fr: 'Offre technique' },
    items: [
      { id: 't1', label: { en: 'Methodology note and work programme (in French)', fr: 'Note méthodologique et planning (en français)' } },
      { id: 't2', label: { en: 'Reference certificates (attestations de référence) from clients', fr: 'Attestations de référence des maîtres d’ouvrage' } },
      { id: 't3', label: { en: 'Key staff CVs committed for contract duration', fr: 'CV du personnel clé engagé pour la durée du marché' } },
      { id: 't4', label: { en: 'Quality, HSE and environmental plans', fr: 'Plans qualité, HSE et environnement' } },
    ],
  },
  {
    id: 'fin',
    label: { en: 'Financial Offer', fr: 'Offre financière' },
    items: [
      { id: 'f1', label: { en: 'Priced bill of quantities (bordereau des prix) in MAD', fr: 'Bordereau des prix – détail estimatif en MAD' } },
      { id: 'f2', label: { en: 'Form of tender (acte d’engagement) signed', fr: 'Acte d’engagement signé' } },
      { id: 'f3', label: { en: 'FX exposure and payment terms reviewed', fr: 'Exposition de change et délais de paiement vérifiés' } },
    ],
  },
  {
    id: 'bond',
    label: { en: 'Bid Bond Bank Guarantee', fr: 'Caution provisoire bancaire' },
    items: [
      { id: 'b1', label: { en: 'Caution provisoire from a Moroccan bank or UK counter-guarantee', fr: 'Caution émise par une banque marocaine ou contre-garantie britannique' } },
      { id: 'b2', label: { en: 'Amount and validity match the bid rules (RC)', fr: 'Montant et validité conformes au règlement de consultation' } },
      { id: 'b3', label: { en: 'Original lodged before bid opening', fr: 'Original déposé avant l’ouverture des plis' } },
    ],
  },
  {
    id: 'legal',
    label: { en: 'Legal / JV Alignment', fr: 'Juridique / groupement' },
    items: [
      { id: 'l1', label: { en: 'Groupement agreement (joint and several or joint) signed', fr: 'Convention de groupement (solidaire ou conjoint) signée' } },
      { id: 'l2', label: { en: 'Lead member (mandataire) mandate issued', fr: 'Mandat du mandataire établi' } },
      { id: 'l3', label: { en: 'Work share and liability split agreed', fr: 'Répartition des prestations et des responsabilités convenue' } },
      { id: 'l4', label: { en: 'Partner anti-bribery due diligence (UK Bribery Act 2010)', fr: 'Diligence anticorruption sur le partenaire (UK Bribery Act 2010)' } },
    ],
  },
];

export const INITIAL_CHECKS = {
  t1: { a1: true, a2: true, a3: true, t2: true, t3: true, b1: true, l4: true },
  t2: { a1: true, a2: true, t2: true },
  t4: { a1: true, l4: true },
};

export const INITIAL_REQUESTS = [
  {
    ref: 'ADV-1042',
    serviceId: 'gonogo',
    tenderId: 't2',
    notes: { en: 'Assess prequalification thresholds and signalling reference fit.', fr: 'Évaluer les seuils de présélection et l’adéquation des références en signalisation.' },
    status: 'progress',
    submitted: -3,
  },
  {
    ref: 'ADV-1039',
    serviceId: 'jv',
    tenderId: 't1',
    notes: { en: 'Groupement terms with MA-104; work share 55/45.', fr: 'Termes du groupement avec MA-104 ; répartition 55/45.' },
    status: 'done',
    submitted: -9,
  },
];

/* ---------- Fictional UK client companies (demo) ---------- */
export const CLIENTS = [
  {
    id: 'britinfra',
    name: 'BritInfra Engineering Ltd',
    short: 'BritInfra',
    city: { en: 'London', fr: 'Londres' },
    monogram: 'BI',
    color: { from: '#10b981', to: '#0d9488', soft: 'bg-emerald-50 text-emerald-700 ring-emerald-200', text: 'text-emerald-700' },
    profile: 'aviation',
    tagline: { en: 'Airport, rail and transport infrastructure engineering', fr: 'Ingénierie des infrastructures aéroportuaires, ferroviaires et de transport' },
    activities: {
      en: ['Airport terminal design & build', 'Baggage handling and airport systems', 'Rail signalling and telecoms', 'Operational readiness (ORAT)'],
      fr: ['Conception-réalisation d’aérogares', 'Systèmes bagages et aéroportuaires', 'Signalisation et télécoms ferroviaires', 'Préparation opérationnelle (ORAT)'],
    },
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 45001', 'ISO 27001'],
    turnover: '£180M',
    staff: '1,250',
    founded: 1998,
    sweetSpot: [5, 70],
    morocco: { en: 'No local entity yet · first bids in 2026', fr: 'Pas encore d’entité locale · premières offres en 2026' },
    references: { en: '14 UK airport and rail programmes', fr: '14 programmes aéroportuaires et ferroviaires au Royaume-Uni' },
    user: { name: 'James Whitmore', role: { en: 'Bid Director, International', fr: 'Directeur des offres, international' }, initials: 'JW' },
    bias: { Aviation: 0, Rail: 0, 'Energy & Water': 0, 'Digital & Smart City': 0, 'Ports & Logistics': 0 },
  },
  {
    id: 'severnway',
    name: 'Severnway Renewables Ltd',
    short: 'Severnway',
    city: { en: 'Bristol', fr: 'Bristol' },
    monogram: 'SR',
    color: { from: '#f59e0b', to: '#ea580c', soft: 'bg-amber-50 text-amber-800 ring-amber-200', text: 'text-amber-700' },
    profile: 'energy',
    tagline: { en: 'Owner’s engineer for solar, storage and water treatment', fr: 'Ingénieur conseil en solaire, stockage et traitement de l’eau' },
    activities: {
      en: ['Solar PV and battery storage engineering', 'Desalination and water treatment design review', 'Energy-efficiency retrofits and M&V', 'Construction supervision'],
      fr: ['Ingénierie photovoltaïque et stockage', 'Revue de conception dessalement et traitement de l’eau', 'Rénovation énergétique et mesure des économies', 'Supervision des travaux'],
    },
    certifications: ['ISO 9001', 'ISO 14001', 'ISO 50001'],
    turnover: '£46M',
    staff: '310',
    founded: 2009,
    sweetSpot: [3, 30],
    morocco: { en: 'Representative office in Rabat since 2025', fr: 'Bureau de représentation à Rabat depuis 2025' },
    references: { en: '2.1 GW of renewables supervised in UK, MENA and Iberia', fr: '2,1 GW de renouvelables supervisés au Royaume-Uni, MENA et Ibérie' },
    user: { name: 'Priya Nair', role: { en: 'Head of International Business Development', fr: 'Directrice du développement international' }, initials: 'PN' },
    bias: { Aviation: -4, Rail: -3, 'Energy & Water': 1, 'Digital & Smart City': -2, 'Ports & Logistics': -2 },
  },
  {
    id: 'pennine',
    name: 'Pennine Smart Systems Ltd',
    short: 'Pennine',
    city: { en: 'Manchester', fr: 'Manchester' },
    monogram: 'PS',
    color: { from: '#8b5cf6', to: '#4f46e5', soft: 'bg-violet-50 text-violet-700 ring-violet-200', text: 'text-violet-700' },
    profile: 'digital',
    tagline: { en: 'Smart-city platforms, data and OT cybersecurity', fr: 'Plateformes smart city, données et cybersécurité OT' },
    activities: {
      en: ['Crowd and mobility analytics', 'Integrated operations centres', 'Industrial (OT) cybersecurity and SOC', 'AI for ports and logistics'],
      fr: ['Analyse des foules et de la mobilité', 'Centres opérationnels intégrés', 'Cybersécurité industrielle (OT) et SOC', 'IA pour les ports et la logistique'],
    },
    certifications: ['ISO 9001', 'ISO 27001', 'Cyber Essentials Plus'],
    turnover: '£72M',
    staff: '540',
    founded: 2012,
    sweetSpot: [4, 40],
    morocco: { en: 'Casablanca branch opened in 2024', fr: 'Succursale à Casablanca ouverte en 2024' },
    references: { en: 'Event-day platforms for 9 UK stadiums and 3 ports', fr: 'Plateformes jour de match pour 9 stades et 3 ports britanniques' },
    user: { name: 'Oliver Grant', role: { en: 'Managing Director, MENA', fr: 'Directeur général MENA' }, initials: 'OG' },
    bias: { Aviation: -3, Rail: 1, 'Energy & Water': -2, 'Digital & Smart City': 2, 'Ports & Logistics': 3 },
  },
];

export const SECTOR_COLOR = {
  Aviation: { chip: 'bg-sky-50 text-sky-700 ring-sky-200', bar: '#0ea5e9', icon: 'bg-sky-100 text-sky-700' },
  Rail: { chip: 'bg-violet-50 text-violet-700 ring-violet-200', bar: '#8b5cf6', icon: 'bg-violet-100 text-violet-700' },
  'Energy & Water': { chip: 'bg-amber-50 text-amber-800 ring-amber-200', bar: '#f59e0b', icon: 'bg-amber-100 text-amber-700' },
  'Digital & Smart City': { chip: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200', bar: '#d946ef', icon: 'bg-fuchsia-100 text-fuchsia-700' },
  'Ports & Logistics': { chip: 'bg-teal-50 text-teal-700 ring-teal-200', bar: '#14b8a6', icon: 'bg-teal-100 text-teal-700' },
};

// Procurement timeline: days relative to today (negative = past)
export const TIMELINE_META = {
  t1: { published: -24, visit: 14 },
  t2: { published: -30, visit: null, prequal: -2 },
  t3: { published: -18, visit: 6 },
  t4: { published: -10, visit: 9 },
  t5: { published: -26, visit: -4 },
  t6: { published: -7, visit: null },
};

export const STAGE_LABELS = {
  published: { en: 'Notice published', fr: 'Avis publié' },
  prequal: { en: 'Prequalification', fr: 'Présélection' },
  visit: { en: 'Site visit', fr: 'Visite des lieux' },
  questions: { en: 'Clarification deadline', fr: 'Date limite des questions' },
  opening: { en: 'Bid opening', fr: 'Ouverture des plis' },
  evaluation: { en: 'Evaluation', fr: 'Évaluation des offres' },
  award: { en: 'Award', fr: 'Attribution' },
  contract: { en: 'Contract signature', fr: 'Notification du marché' },
};

export function tenderTimeline(t) {
  const m = TIMELINE_META[t.id] || t.timeline || { published: -5, visit: null };
  const steps = [{ id: 'published', day: m.published }];
  if (m.prequal != null) steps.push({ id: 'prequal', day: m.prequal });
  if (m.visit != null) steps.push({ id: 'visit', day: m.visit });
  steps.push({ id: 'questions', day: t.daysLeft - 7 });
  steps.push({ id: 'opening', day: t.daysLeft });
  steps.push({ id: 'evaluation', day: t.daysLeft + 1, end: t.daysLeft + 30 });
  steps.push({ id: 'award', day: t.daysLeft + 45 });
  steps.push({ id: 'contract', day: t.daysLeft + 75 });
  steps.sort((a, b) => a.day - b.day);
  let current = 0;
  steps.forEach((s, i) => {
    if (s.day <= 0) current = i;
  });
  return { steps, current, next: steps[current + 1] };
}

export const CLIENT_INITIAL = {
  britinfra: { checks: INITIAL_CHECKS, requests: INITIAL_REQUESTS },
  severnway: {
    checks: { t3: { a1: true, a2: true, t1: true, t3: true, l4: true }, t5: { a1: true, f3: true } },
    requests: [
      { ref: 'ADV-1036', serviceId: 'entity', tenderId: '', notes: { en: 'Convert Rabat representative office into a branch.', fr: 'Transformer le bureau de Rabat en succursale.' }, status: 'progress', submitted: -12 },
    ],
  },
  pennine: {
    checks: { t4: { a1: true, a2: true, a3: true, t1: true, t2: true, t3: true, f1: true, l1: true, l4: true }, t6: { a1: true } },
    requests: [
      { ref: 'ADV-1040', serviceId: 'bid', tenderId: 't4', notes: { en: 'French methodology review for the stadium platform.', fr: 'Relecture de la méthodologie en français pour la plateforme stades.' }, status: 'progress', submitted: -5 },
      { ref: 'ADV-1031', serviceId: 'jv', tenderId: 't6', notes: { en: 'Teaming terms with MA-415 for the SOC phase.', fr: 'Accord d’équipe avec MA-415 pour la phase SOC.' }, status: 'done', submitted: -20 },
    ],
  },
};
