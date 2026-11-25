// Client-side French tender notice parser. Keyword, regex and rule based; no network calls.
import { FX, COMPANY, PROFILES, L } from './data.js';

const pad = (n) => String(n).padStart(2, '0');
const fmtFr = (d) => `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
const addDays = (n) => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + n);
  return d;
};

export function sampleNotice() {
  const opening = fmtFr(addDays(42));
  const visit = fmtFr(addDays(19));
  return `ROYAUME DU MAROC
OFFICE NATIONAL DES AÉROPORTS (ONDA)

AVIS D'APPEL D'OFFRES OUVERT INTERNATIONAL N° 58/2026/ONDA
Séance publique

Le ${opening} à 10h00, il sera procédé, dans la salle de réunion de la Direction des Achats de l'Office National Des Aéroports, sise à l'Aéroport Mohammed V – Nouaceur, Casablanca, à l'ouverture des plis relatifs à l'appel d'offres sur offres de prix pour :

Objet : Travaux d'extension de l'aérogare et mise en place d'un système intelligent de tri des bagages à l'Aéroport de Fès-Saïss.

Le dossier d'appel d'offres peut être retiré au bureau des marchés de l'ONDA. Il peut également être téléchargé à partir du portail des marchés publics : www.marchespublics.gov.ma

Le montant du cautionnement provisoire est fixé à : 2 500 000,00 DH (deux millions cinq cent mille dirhams).

L'estimation des coûts des prestations établie par le maître d'ouvrage est fixée à : 248 600 000,00 DH TTC.

Le contenu, la présentation ainsi que le dépôt des dossiers des concurrents doivent être conformes aux dispositions du règlement des achats de l'ONDA.

Une visite des lieux obligatoire est prévue le ${visit} à 10h00.

Les concurrents installés au Maroc doivent fournir le certificat de qualification et de classification : Secteur B, Qualification B2, Classe 1. Les concurrents non installés au Maroc doivent fournir le dossier technique comprenant les références similaires et les attestations délivrées par les maîtres d'ouvrage.

La certification ISO 9001 est exigée. Les groupements sont autorisés (groupement conjoint ou solidaire).

Le délai d'exécution est de 18 mois. Des pénalités de retard seront appliquées. La préférence nationale est applicable conformément à la réglementation en vigueur. Les offres doivent être rédigées en langue française.`;
}

const AUTHORITIES = [
  { re: /office national des a[ée]roports|\bONDA\b/i, short: 'ONDA', full: 'Office National Des Aéroports' },
  { re: /office national des chemins de fer|\bONCF\b/i, short: 'ONCF', full: 'Office National des Chemins de Fer' },
  { re: /moroccan agency for sustainable energy|\bMASEN\b/i, short: 'MASEN', full: 'Moroccan Agency for Sustainable Energy' },
  { re: /minist[èe]re de l['’]\s*[ée]quipement/i, short: 'Ministry of Equipment', full: 'Ministère de l’Équipement et de l’Eau' },
  { re: /tanger\s*med|\bTMSA\b/i, short: 'Tanger Med', full: 'Tanger Med Special Agency (TMSA)' },
  { re: /\bONEE\b|office national de l['’][ée]lectricit[ée]/i, short: 'ONEE', full: 'Office National de l’Électricité et de l’Eau Potable' },
];

const TRANSLATIONS = [
  [/[àÀaA] l['’][aA][ée]roport (?:[iI]nternational )?de ([A-ZÀ-Ý][\wÀ-ÿ'’-]*(?:[ -][A-ZÀ-Ý][\wÀ-ÿ'’-]*)*)/g, 'at $1 Airport'],
  [/de l['’][aA][ée]roport (?:[iI]nternational )?de ([A-ZÀ-Ý][\wÀ-ÿ'’-]*(?:[ -][A-ZÀ-Ý][\wÀ-ÿ'’-]*)*)/g, 'of $1 Airport'],
  [/travaux d['’]extension de l['’]a[ée]rogare/gi, 'terminal expansion works'],
  [/travaux d['’]extension/gi, 'expansion works'],
  [/travaux d['’]am[ée]nagement/gi, 'fit-out works'],
  [/travaux de construction/gi, 'construction works'],
  [/travaux de r[ée]habilitation/gi, 'rehabilitation works'],
  [/mise en place d['’]un syst[èe]me intelligent de tri des bagages/gi, 'deployment of a smart baggage handling system'],
  [/syst[èe]me (?:intelligent )?de tri des bagages/gi, 'baggage handling system'],
  [/mise en place d['’]une?/gi, 'deployment of a'],
  [/mise en place de/gi, 'deployment of'],
  [/fourniture,? installation et mise en service d['’]/gi, 'supply, installation and commissioning of '],
  [/fourniture et installation d['’]/gi, 'supply and installation of '],
  [/fourniture et installation de/gi, 'supply and installation of'],
  [/[ée]tudes? et assistance technique/gi, 'engineering studies and technical assistance'],
  [/assistance [àa] ma[îi]trise d['’]ouvrage/gi, 'owner’s engineer services (AMO)'],
  [/ma[îi]trise d['’](?:œ|oe)uvre/gi, 'design and supervision services (MOE)'],
  [/signalisation ferroviaire/gi, 'railway signalling'],
  [/ligne [àa] grande vitesse/gi, 'high-speed line'],
  [/centrale solaire/gi, 'solar power plant'],
  [/station de dessalement/gi, 'desalination plant'],
  [/dessalement de l['’]eau de mer/gi, 'seawater desalination'],
  [/g[ée]nie climatique|climatisation/gi, 'HVAC'],
  [/efficacit[ée] [ée]nerg[ée]tique/gi, 'energy efficiency'],
  [/cybers[ée]curit[ée]/gi, 'cybersecurity'],
  [/plate-?forme num[ée]rique/gi, 'digital platform'],
  [/vid[ée]osurveillance/gi, 'CCTV'],
  [/contr[ôo]le d['’]acc[èe]s/gi, 'access control'],
  [/billetterie/gi, 'ticketing'],
  [/stades/gi, 'stadiums'],
  [/stade/gi, 'stadium'],
  [/a[ée]rogare/gi, 'terminal'],
  [/entretien|maintenance/gi, 'maintenance'],
  [/travaux/gi, 'works'],
  [/fourniture/gi, 'supply'],
  [/[ée]tudes?/gi, 'studies'],
  [/\bet\b/gi, 'and'],
  [/\bdes\b|\bdu\b|\bde la\b/gi, 'of the'],
  [/\bde l['’]/gi, 'of the '],
  [/\bpour\b/gi, 'for'],
  [/\bdans\b/gi, 'in'],
  [/\bau\b/gi, 'at the'],
];

export function translateTitle(fr) {
  let s = fr.trim().replace(/\.$/, '');
  TRANSLATIONS.forEach(([re, rep]) => {
    s = s.replace(re, rep);
  });
  s = s.replace(/\s+/g, ' ').trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function parseFrNumber(raw) {
  let s = raw.replace(/[\s  ]/g, '');
  if (s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if ((s.match(/\./g) || []).length > 1) s = s.replace(/\./g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

const SECTOR_KEYWORDS = {
  Aviation: [/a[ée]roport/i, /a[ée]rogare/i, /bagages/i, /piste/i, /a[ée]rien/i, /\bONDA\b/],
  Rail: [/ferroviaire/i, /signalisation/i, /grande vitesse/i, /\bONCF\b/, /\bgare\b/i, /voie ferr[ée]e/i],
  'Energy & Water': [/solaire/i, /photovolta/i, /[ée]olien/i, /dessalement/i, /efficacit[ée] [ée]nerg/i, /climatisation|g[ée]nie climatique/i, /\bMASEN\b/, /eau potable/i],
  'Digital & Smart City': [/num[ée]rique/i, /cybers[ée]curit[ée]/i, /logiciel/i, /plate-?forme/i, /intelligent/i, /donn[ée]es/i, /vid[ée]osurveillance/i, /t[ée]l[ée]com/i, /stade/i],
  'Ports & Logistics': [/\bport\b/i, /portuaire/i, /logistique/i, /conteneurs?/i, /tanger\s*med/i],
};

export const PROFILE_FIT = {
  aviation: { Aviation: 1, Rail: 0.86, 'Ports & Logistics': 0.6, 'Energy & Water': 0.5, 'Digital & Smart City': 0.62 },
  energy: { 'Energy & Water': 1, Aviation: 0.45, Rail: 0.4, 'Ports & Logistics': 0.42, 'Digital & Smart City': 0.4 },
  digital: { 'Digital & Smart City': 1, 'Ports & Logistics': 0.82, Rail: 0.74, Aviation: 0.66, 'Energy & Water': 0.42 },
};

const SECTOR_PARTNERS = {
  Aviation: ['MA-104', 'MA-312', 'MA-508'],
  Rail: ['MA-415', 'MA-209', 'MA-508'],
  'Energy & Water': ['MA-209', 'MA-312', 'MA-508'],
  'Digital & Smart City': ['MA-415', 'MA-209', 'MA-508'],
  'Ports & Logistics': ['MA-415', 'MA-508'],
};

function daysUntil(d) {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return Math.round((d - t) / 86400000);
}

function findDates(sentence) {
  const out = [];
  const re = /(\d{1,2})\/(\d{1,2})\/(\d{4})/g;
  let m;
  while ((m = re.exec(sentence))) out.push(new Date(+m[3], +m[2] - 1, +m[1]));
  return out;
}

const fmtDateLong = (d, lang) => d.toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
const fmtNum = (n, lang) => Math.round(n).toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-GB');

export function parseNotice(text, profileId, lang = 'en', client = COMPANY) {
  const co = { short: client.short || 'BritInfra', name: client.name, certifications: client.certifications, sweetSpot: client.sweetSpot, bias: client.bias || {} };
  const tx = (en, fr) => (lang === 'fr' ? fr : en);
  const clean = text.replace(/\r/g, '');
  const sentences = clean.split(/(?<=[.;:])\s+|\n+/).filter((s) => s.trim());

  const auth = AUTHORITIES.find((a) => a.re.test(clean));
  const refM = clean.match(/N[°º]\s*([A-Z0-9][\w/.-]*)/i);
  const objM = clean.match(/objet\s*:\s*([^\n]+)/i);
  const titleFr = objM ? objM[1].trim() : (sentences.find((s) => s.length > 40) || '').trim();

  let procedure = tx('Tender (procedure not stated)', 'Procédure non précisée');
  if (/appel d['’]offres ouvert international/i.test(clean)) procedure = tx('International open tender', 'Appel d’offres ouvert international');
  else if (/appel d['’]offres restreint/i.test(clean)) procedure = tx('Restricted tender', 'Appel d’offres restreint');
  else if (/pr[ée]s[ée]lection|pr[ée]qualification/i.test(clean)) procedure = tx('Tender with prequalification', 'Appel d’offres avec présélection');
  else if (/concours/i.test(clean)) procedure = tx('Design competition', 'Concours');
  else if (/manifestation d['’]int[ée]r[êe]t/i.test(clean)) procedure = tx('Expression of interest', 'Appel à manifestation d’intérêt');
  else if (/bons? de commande/i.test(clean)) procedure = tx('Purchase-order based procurement', 'Marché sur bons de commande');
  else if (/appel d['’]offres ouvert/i.test(clean)) procedure = tx('Open tender', 'Appel d’offres ouvert');

  const estM = clean.match(/estimation[^:]{0,160}:\s*([\d\s  .,]+)\s*(?:DH|MAD|dirhams)\s*(TTC|HT)?/i);
  let budgetMAD = estM ? parseFrNumber(estM[1]) : null;
  const ttc = estM ? (estM[2] || '').toUpperCase() === 'TTC' : false;
  const bondM = clean.match(/(?:cautionnement|caution) provisoire[^:]{0,80}:\s*([\d\s  .,]+)\s*(?:DH|MAD|dirhams)/i);
  const bondMAD = bondM ? parseFrNumber(bondM[1]) : null;
  if (budgetMAD !== null && budgetMAD < 1000) budgetMAD = null;

  const openSentence = sentences.find((s) => /ouverture des plis|s[ée]ance publique|date limite|il sera proc[ée]d[ée]/i.test(s) && findDates(s).length);
  const visitSentence = sentences.find((s) => /visite/i.test(s) && findDates(s).length);
  const allDates = findDates(clean);
  const openingDate = openSentence ? findDates(openSentence)[0] : allDates.length ? allDates.reduce((a, b) => (b > a ? b : a)) : null;
  const visitDate = visitSentence ? findDates(visitSentence)[0] : null;
  const daysLeft = openingDate ? daysUntil(openingDate) : null;

  const execM = clean.match(/d[ée]lai d['’]ex[ée]cution[^0-9]{0,40}(\d+)\s*(mois|jours|semaines)/i);
  const unit = execM ? execM[2].toLowerCase() : '';
  const execution = execM
    ? `${execM[1]} ${tx({ mois: 'months', jours: 'days', semaines: 'weeks' }[unit], unit)}`
    : tx('Not stated', 'Non précisé');

  const sectorScores = Object.entries(SECTOR_KEYWORDS).map(([sector, res]) => [sector, res.reduce((n, re) => n + (re.test(clean) ? 1 : 0), 0)]);
  sectorScores.sort((a, b) => b[1] - a[1]);
  const sector = sectorScores[0][1] > 0 ? sectorScores[0][0] : 'Digital & Smart City';
  const secondary = sectorScores[1] && sectorScores[1][1] > 0 ? sectorScores[1][0] : null;

  const budgetGBP = budgetMAD ? budgetMAD / FX / 1e6 : null;
  const inBand = budgetGBP !== null && budgetGBP >= co.sweetSpot[0] && budgetGBP <= co.sweetSpot[1];

  const has = (re) => re.test(clean);
  const iso9001 = has(/ISO\s*9001/i);
  const iso14001 = has(/ISO\s*14001/i);
  const iso27001 = has(/ISO\s*27001/i);
  const qualif = has(/qualification et (?:de )?classification/i);
  const visitMandatory = has(/visite[^.]{0,60}obligatoire|obligatoire[^.]{0,40}visite/i);
  const groupement = has(/groupements?/i);
  const prefNat = has(/pr[ée]f[ée]rence nationale/i);
  const french = has(/langue fran[çc]aise/i);
  const portal = has(/marchespublics\.gov\.ma|portail des march[ée]s publics/i);
  const ownRules = has(/r[èe]glement des achats/i);
  const penalties = has(/p[ée]nalit[ée]s/i);
  const samples = has(/[ée]chantillons?/i);

  function scoreFor(pid) {
    const fit = PROFILE_FIT[pid][sector] ?? 0.5;
    const sec = secondary ? (PROFILE_FIT[pid][secondary] ?? 0.5) * 0.12 : 0;
    let s = 38 + 52 * fit + 10 * sec;
    if (inBand) s += 4;
    if (iso9001) s += 2;
    s += co.bias[sector] || 0;
    return Math.max(30, Math.min(97, Math.round(s)));
  }
  const scores = Object.fromEntries(PROFILES.map((p) => [p.id, scoreFor(p.id)]));
  const match = scores[profileId];

  const flags = [];
  if (prefNat)
    flags.push({
      level: 'high',
      title: tx('National preference applies', 'Préférence nationale applicable'),
      text: tx(
        'Moroccan bidders may benefit from a price margin of up to 15%. A Moroccan groupement member reduces this gap.',
        'Les soumissionnaires marocains peuvent bénéficier d’une marge de prix allant jusqu’à 15 %. Un membre marocain du groupement réduit cet écart.',
      ),
    });
  if (daysLeft !== null && daysLeft < 0)
    flags.push({
      level: 'high',
      title: tx('Opening date has passed', 'Date d’ouverture dépassée'),
      text: tx('The bid opening date in this notice is in the past. Check for a corrigendum or a relaunch.', 'La date d’ouverture des plis est passée. Vérifier s’il existe un rectificatif ou une relance.'),
    });
  else if (daysLeft !== null && daysLeft < 21)
    flags.push({
      level: 'high',
      title: tx(`Only ${daysLeft} days to bid opening`, `Seulement ${daysLeft} jours avant l’ouverture des plis`),
      text: tx(
        'Very tight for a foreign bidder: translations, bank guarantee and partner agreement all sit on the critical path.',
        'Très serré pour un soumissionnaire étranger : traductions, caution bancaire et accord de partenariat sont sur le chemin critique.',
      ),
    });
  else if (daysLeft !== null && daysLeft < 35)
    flags.push({
      level: 'medium',
      title: tx(`${daysLeft} days to bid opening`, `${daysLeft} jours avant l’ouverture des plis`),
      text: tx('Workable, but start the bank guarantee and translations this week.', 'Faisable, mais lancer la caution bancaire et les traductions cette semaine.'),
    });
  if (visitMandatory)
    flags.push({
      level: 'medium',
      title: tx('Mandatory site visit', 'Visite des lieux obligatoire'),
      text: tx(
        `In-country attendance required${visitDate ? ` on ${fmtDateLong(visitDate, lang)}` : ''}. Missing it usually excludes the bid.`,
        `Présence sur place requise${visitDate ? ` le ${fmtDateLong(visitDate, lang)}` : ''}. Une absence entraîne en général l’exclusion de l’offre.`,
      ),
    });
  if (qualif)
    flags.push({
      level: 'medium',
      title: tx('Moroccan qualification & classification', 'Qualification et classification marocaines'),
      text: tx(
        'Resident bidders need the works classification certificate. Non-resident firms must evidence equivalent references; a classified local partner strengthens the file.',
        'Les soumissionnaires résidents doivent produire le certificat de classification. Les non-résidents justifient de références équivalentes ; un partenaire local classé renforce le dossier.',
      ),
    });
  if (bondMAD && budgetMAD && bondMAD / budgetMAD > 0.015)
    flags.push({
      level: 'medium',
      title: tx('High bid bond ratio', 'Caution provisoire élevée'),
      text: tx(
        `Bid bond is ${((bondMAD / budgetMAD) * 100).toFixed(1)}% of the estimate. Confirm bank lines early.`,
        `La caution représente ${((bondMAD / budgetMAD) * 100).toFixed(1).replace('.', ',')} % de l’estimation. Confirmer tôt les lignes bancaires.`,
      ),
    });
  if (!budgetMAD)
    flags.push({
      level: 'medium',
      title: tx('No budget estimate found', 'Aucune estimation trouvée'),
      text: tx(
        'The notice does not state an estimate. Request it from the authority or size it from comparable contracts.',
        'L’avis ne mentionne pas d’estimation. La demander au maître d’ouvrage ou l’évaluer à partir de marchés comparables.',
      ),
    });
  if (samples)
    flags.push({
      level: 'medium',
      title: tx('Samples required', 'Échantillons exigés'),
      text: tx('Physical samples must be delivered in Morocco before the deadline.', 'Des échantillons physiques doivent être livrés au Maroc avant la date limite.'),
    });
  if (french)
    flags.push({
      level: 'low',
      title: tx('French-language bid', 'Offre en français'),
      text: tx('Budget for certified translation of the full technical and administrative dossier.', 'Prévoir la traduction certifiée de l’ensemble du dossier technique et administratif.'),
    });
  if (penalties)
    flags.push({
      level: 'low',
      title: tx('Delay penalties', 'Pénalités de retard'),
      text: tx('Liquidated damages for late completion apply. Review caps in the special conditions (CPS).', 'Des pénalités de retard s’appliquent. Vérifier les plafonds dans le CPS.'),
    });
  if (ownRules)
    flags.push({
      level: 'info',
      title: tx('Authority’s own purchasing regulation', 'Règlement des achats propre au maître d’ouvrage'),
      text: tx(
        'Procured under the authority’s own règlement des achats rather than directly under Decree No. 2-22-431. Check its specific rules.',
        'La procédure relève du règlement des achats de l’établissement et non directement du décret n° 2-22-431. En vérifier les règles spécifiques.',
      ),
    });
  if (ttc && budgetMAD)
    flags.push({
      level: 'info',
      title: tx('Estimate includes VAT', 'Estimation TTC'),
      text: tx(
        `The estimate is quoted including 20% VAT. Ex-VAT value is about £${(budgetGBP / 1.2).toFixed(1)}M.`,
        `L’estimation inclut 20 % de TVA. La valeur HT est d’environ ${(budgetGBP / 1.2).toFixed(1).replace('.', ',')} M£.`,
      ),
    });

  const held = tx(`Held by ${co.name}`, `Détenue par ${co.name}`);
  const hasCert = (c) => co.certifications.includes(c);
  const has9001 = hasCert('ISO 9001');
  const checklist = [];
  if (iso9001) checklist.push({ status: has9001 ? 'met' : 'gap', label: tx('ISO 9001 certification', 'Certification ISO 9001'), note: has9001 ? held : tx('Not held', 'Non détenue') });
  if (iso14001) checklist.push({ status: hasCert('ISO 14001') ? 'met' : 'gap', label: tx('ISO 14001 certification', 'Certification ISO 14001'), note: hasCert('ISO 14001') ? held : tx('Not held', 'Non détenue') });
  if (iso27001) checklist.push({ status: hasCert('ISO 27001') ? 'met' : 'gap', label: tx('ISO 27001 certification', 'Certification ISO 27001'), note: hasCert('ISO 27001') ? held : tx('Not held', 'Non détenue') });
  if (qualif)
    checklist.push({
      status: 'action',
      label: tx('Similar references and client certificates', 'Références similaires et attestations'),
      note: tx('Non-resident route: 3+ comparable projects with signed client attestations', 'Voie non-résident : au moins 3 projets comparables avec attestations signées'),
    });
  if (qualif)
    checklist.push({
      status: 'partner',
      label: tx('Works qualification & classification', 'Qualification et classification'),
      note: tx('Covered through a classified Moroccan groupement member', 'Couverte par un membre marocain classé du groupement'),
    });
  checklist.push({
    status: 'action',
    label: tx('Bid bond (caution provisoire)', 'Caution provisoire'),
    note: bondMAD
      ? tx(`MAD ${fmtNum(bondMAD, lang)} via a Moroccan bank or UK counter-guarantee`, `${fmtNum(bondMAD, lang)} MAD via une banque marocaine ou une contre-garantie britannique`)
      : tx('Amount not stated', 'Montant non précisé'),
  });
  if (visitMandatory) checklist.push({ status: 'action', label: tx('Site visit attendance', 'Participation à la visite des lieux'), note: tx('Nominate an in-country representative', 'Désigner un représentant sur place') });
  if (french) checklist.push({ status: 'action', label: tx('French-language dossier', 'Dossier en français'), note: tx('Certified translation of administrative and technical files', 'Traduction certifiée des pièces administratives et techniques') });
  if (portal)
    checklist.push({
      status: 'action',
      label: tx('E-procurement portal registration', 'Inscription au portail des marchés publics'),
      note: tx('Register on the national public procurement portal for e-submission', 'S’inscrire sur le portail national pour le dépôt électronique'),
    });
  if (groupement) checklist.push({ status: 'met', label: tx('Joint ventures permitted', 'Groupements autorisés'), note: tx('Groupement conjoint or solidaire accepted', 'Groupement conjoint ou solidaire accepté') });

  const highFlags = flags.filter((f) => f.level === 'high').length;
  const medFlags = flags.filter((f) => f.level === 'medium').length;
  const jvNeed = (prefNat ? 2 : 0) + (qualif ? 2 : 0) + (visitMandatory ? 1 : 0) + (budgetGBP && budgetGBP > 15 ? 1 : 0);
  const jvLevel = jvNeed >= 4 ? 'High' : jvNeed >= 2 ? 'Moderate' : 'Low';
  const readiness = Math.max(0, Math.min(100, Math.round(match - highFlags * 9 - medFlags * 3 + (groupement ? 4 : 0))));
  let decision;
  if (daysLeft !== null && daysLeft < 0) decision = 'NO-GO';
  else if (match >= 80 && highFlags <= 1) decision = jvLevel === 'Low' ? 'GO' : 'GO WITH JV';
  else if (match >= 65) decision = 'CONDITIONAL GO';
  else decision = 'NO-GO';

  const partners = SECTOR_PARTNERS[sector] || ['MA-508'];
  let strategy;
  if (decision === 'NO-GO') {
    strategy =
      match < 65
        ? tx(
            'Sector fit with the active company profile is weak. Track the authority for better-aligned lots, or switch the sector profile to test another business line.',
            'L’adéquation avec le profil actif est faible. Suivre ce maître d’ouvrage pour des lots mieux alignés, ou changer de profil sectoriel pour tester une autre activité.',
          )
        : tx('Do not pursue this notice as published. Monitor for a relaunch and pre-position a local partner.', 'Ne pas répondre à cet avis en l’état. Surveiller une relance et pré-positionner un partenaire local.');
  } else if (jvLevel === 'Low') {
    strategy = tx(
      'Bid as sole prime contractor. Use a Moroccan subcontractor for installation and local labour, and keep design, systems integration and commissioning in-house.',
      'Soumissionner seul en tant que titulaire. Sous-traiter l’installation et la main-d’œuvre à une entreprise marocaine, et garder la conception, l’intégration et la mise en service en interne.',
    );
  } else {
    const share = jvLevel === 'High' ? '55/45' : '65/35';
    const lead = sector === 'Aviation' ? tx('baggage and airport systems', 'les systèmes bagages et aéroportuaires') : tx('systems integration', 'l’intégration des systèmes');
    strategy = tx(
      `Bid through a ${groupement ? 'joint and several groupement (groupement solidaire)' : 'joint venture'} with ${co.short} as lead member (mandataire), split around ${share}. The Moroccan partner ${qualif ? 'brings the works classification, ' : ''}${visitMandatory ? 'covers the site visit, ' : ''}supplies local resources${prefNat ? ' and narrows the national preference gap' : ''}. ${co.short} leads design management, ${lead} and commissioning.`,
      `Soumissionner en ${groupement ? 'groupement solidaire' : 'coentreprise'} avec ${co.short} comme mandataire, sur une base d’environ ${share}. Le partenaire marocain ${qualif ? 'apporte la classification, ' : ''}${visitMandatory ? 'assure la visite des lieux, ' : ''}fournit les ressources locales${prefNat ? ' et réduit l’écart dû à la préférence nationale' : ''}. ${co.short} pilote la conception, ${lead} et la mise en service.`,
    );
  }

  return {
    authority: auth ? auth.short : 'Unidentified authority',
    authorityFull: auth ? auth.full : tx('Contracting authority not detected', 'Maître d’ouvrage non détecté'),
    ref: refM ? `N° ${refM[1]}` : tx('Not stated', 'Non précisée'),
    titleFr,
    title: titleFr ? translateTitle(titleFr) : tx('Untitled notice', 'Avis sans objet'),
    procedure,
    budgetMAD,
    budgetGBP,
    ttc,
    bondMAD,
    openingDate,
    visitDate,
    daysLeft,
    execution,
    sector,
    secondary,
    scores,
    match,
    flags,
    checklist,
    decision,
    readiness,
    jvLevel,
    strategy,
    partners,
    groupement,
    prefNat,
    qualif,
    visitMandatory,
    ownRules,
  };
}

// Build a bilingual hub tender from the English and French parses of the same notice.
export function parsedToTender(pEn, pFr, id) {
  const both = (k) => ({ en: pEn[k], fr: pFr[k] });
  return {
    id,
    ref: pEn.ref,
    authority: pEn.authority,
    authorityFull: pEn.authorityFull,
    title: { en: pEn.title, fr: pEn.titleFr.replace(/\.$/, '') },
    sector: pEn.sector,
    worldCup: /a[ée]roport|stade|grande vitesse/i.test(pEn.titleFr),
    valueGBP: pEn.budgetGBP ? Math.round(pEn.budgetGBP * 10) / 10 : 0,
    daysLeft: pEn.daysLeft ?? 30,
    scores: pEn.scores,
    offsets: [1, -2, 2, -1],
    jv: pEn.jvLevel,
    location: { en: 'See notice', fr: 'Voir l’avis' },
    procedure: both('procedure'),
    execution: both('execution'),
    bidBondMAD: pEn.bondMAD || 0,
    framework: pEn.ownRules
      ? { en: 'Authority purchasing regulation (règlement des achats), aligned with Decree No. 2-22-431 of 8 March 2023', fr: 'Règlement des achats du maître d’ouvrage, aligné sur le décret n° 2-22-431 du 8 mars 2023' }
      : { en: 'Decree No. 2-22-431 of 8 March 2023 on public procurement', fr: 'Décret n° 2-22-431 du 8 mars 2023 relatif aux marchés publics' },
    summary: {
      en: `Parsed from a French notice published by ${pEn.authorityFull}. Original object: “${pEn.titleFr}”.`,
      fr: `Extrait d’un avis publié par ${pFr.authorityFull}. Objet d’origine : « ${pFr.titleFr} ».`,
    },
    scope: { en: [pEn.title, `Execution period: ${pEn.execution}`], fr: [pFr.titleFr, `Délai d’exécution : ${pFr.execution}`] },
    rationale: Object.fromEntries(
      PROFILES.map((pr) => [
        pr.id,
        {
          en: `Score derived from sector keywords, budget band and stated certification requirements for the ${L(pr.label, 'en')} profile.`,
          fr: `Score calculé à partir des mots-clés sectoriels, de la tranche budgétaire et des certifications exigées pour le profil ${L(pr.label, 'fr')}.`,
        },
      ]),
    ),
    considerations: {
      en: pEn.flags.filter((f) => f.level !== 'info').map((f) => `${f.title}: ${f.text}`),
      fr: pFr.flags.filter((f) => f.level !== 'info').map((f) => `${f.title} : ${f.text}`),
    },
    jvRationale: both('strategy'),
    partners: pEn.partners,
    parsed: true,
    clientBiased: true,
    timeline: { published: -3, visit: pEn.visitDate ? daysUntil(pEn.visitDate) : null },
  };
}
