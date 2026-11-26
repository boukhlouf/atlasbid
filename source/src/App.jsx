import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  LayoutDashboard, ScanText, Handshake, Briefcase, Search, X, ChevronRight, Plane, TrainFront, Sun, Cpu, Ship,
  Clock, TrendingUp, Target, ShieldCheck, AlertTriangle, CheckCircle2, Circle, FileText, MapPin, Award, Send,
  Sparkles, ArrowRight, Landmark, Scale, Plus, Check, Loader2, Calendar, BadgeCheck, ListChecks,
  SlidersHorizontal, Building2, Users, Banknote, Gavel, Trophy, RotateCcw, CircleAlert, Wrench, Compass,
  Globe2, Radar, ChevronDown, UserRound, Milestone,
} from 'lucide-react';
import {
  L, FX, CLIENTS, SECTOR_COLOR, tenderTimeline, STAGE_LABELS, CLIENT_INITIAL, PROFILES, AUTHORITIES, SECTORS, FACTOR_LABELS, TENDERS, PARTNERS, SPECIALTIES, SERVICES,
  CHECKLIST, INITIAL_CHECKS, INITIAL_REQUESTS, JV_LABEL, SPECIALTY_LABEL, sectorLabel, authLabel,
} from './data.js';
import { sampleNotice, parseNotice, parsedToTender } from './parser.js';

/* ---------- language ---------- */
const LangCtx = createContext({ lang: 'en', tx: (en) => en });
const useLang = () => useContext(LangCtx);

const loc = (lang) => (lang === 'fr' ? 'fr-FR' : 'en-GB');
const num1 = (n, lang) => n.toLocaleString(loc(lang), { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const fmtGBP = (m, lang) => (lang === 'fr' ? `${num1(m, lang)} M£` : `£${num1(m, lang)}M`);
const fmtMADm = (gbpM, lang) => (lang === 'fr' ? `${num1(gbpM * FX, lang)} M MAD` : `MAD ${num1(gbpM * FX, lang)}M`);
const fmtMAD = (n, lang) => (lang === 'fr' ? `${Math.round(n).toLocaleString('fr-FR')} MAD` : `MAD ${Math.round(n).toLocaleString('en-GB')}`);
const fmtGBPint = (n, lang) => (lang === 'fr' ? `${Math.round(n).toLocaleString('fr-FR')} £` : `£${Math.round(n).toLocaleString('en-GB')}`);
const pctTxt = (v, lang) => (lang === 'fr' ? `${v} %` : `${v}%`);
const dateIn = (days, lang) => {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString(loc(lang), { day: 'numeric', month: 'short', year: 'numeric' });
};
const fmtDate = (d, lang, opts = { day: 'numeric', month: 'short', year: 'numeric' }) => d.toLocaleDateString(loc(lang), opts);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cx = (...c) => c.filter(Boolean).join(' ');

const SECTOR_ICON = { Aviation: Plane, Rail: TrainFront, 'Energy & Water': Sun, 'Digital & Smart City': Cpu, 'Ports & Logistics': Ship };
const PROFILE_ICON = { aviation: Plane, energy: Sun, digital: Cpu };

const matchTone = (s) =>
  s >= 85
    ? { text: 'text-emerald-700', bar: 'bg-emerald-500', stroke: '#10b981' }
    : s >= 75
      ? { text: 'text-amber-700', bar: 'bg-amber-500', stroke: '#f59e0b' }
      : { text: 'text-rose-700', bar: 'bg-rose-500', stroke: '#f43f5e' };
const deadlineTone = (d) =>
  d <= 30 ? 'bg-rose-50 text-rose-700 ring-rose-200' : d <= 45 ? 'bg-amber-50 text-amber-800 ring-amber-200' : 'bg-emerald-50 text-emerald-700 ring-emerald-200';

/* ---------- primitives ---------- */
function Pill({ className, children }) {
  return <span className={cx('inline-flex items-center gap-1 whitespace-nowrap rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset', className)}>{children}</span>;
}

function JvDots({ level, showLabel = true }) {
  const { lang, tx } = useLang();
  const n = level === 'High' ? 3 : level === 'Moderate' ? 2 : 1;
  return (
    <span className="inline-flex items-center gap-1.5" title={`${tx('JV recommended', 'Groupement recommandé')} : ${L(JV_LABEL[level], lang)}`}>
      <span className="flex gap-0.5" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <span key={i} className={cx('h-1.5 w-3 rounded-full', i < n ? 'bg-slate-800' : 'bg-slate-200')} />
        ))}
      </span>
      {showLabel && <span className="text-xs font-medium text-slate-600">{L(JV_LABEL[level], lang)}</span>}
    </span>
  );
}

function ScoreRing({ score, size = 56, stroke = 5 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const tone = matchTone(score);
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`${score}%`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke={tone.stroke} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - score / 100)} style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(.2,.8,.2,1)' }}
        />
      </svg>
      <span key={score} className={cx('absolute inset-0 flex items-center justify-center font-semibold tabular-nums animate-pop', tone.text)} style={{ fontSize: size * 0.28 }} aria-hidden="true">
        {score}
        <span className="text-[0.55em] opacity-70">%</span>
      </span>
    </div>
  );
}

function Eyebrow({ icon: Icon, children, className }) {
  return (
    <div className={cx('flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500', className)}>
      {Icon && <Icon className="h-3.5 w-3.5" aria-hidden="true" />}
      {children}
    </div>
  );
}

function PageHead({ eyebrow, title, children }) {
  return (
    <div className="max-w-3xl">
      {eyebrow && <Eyebrow className="mb-2 text-emerald-700">{eyebrow}</Eyebrow>}
      <h1 className="font-display text-[28px] font-semibold leading-tight tracking-tight text-slate-900 text-balance sm:text-3xl">{title}</h1>
      {children && <p className="mt-2 text-[15px] leading-relaxed text-slate-600">{children}</p>}
    </div>
  );
}

const btnPrimary = 'inline-flex items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60';
const btnAccent = 'inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60';
const btnGhost = 'inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50';
const inputCls = 'w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500 transition focus:border-emerald-600';

function Toasts({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite" role="status">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-start gap-3 rounded-xl bg-slate-900 px-4 py-3 text-sm text-white shadow-xl animate-slidein">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
          <div>
            <div className="font-medium">{t.title}</div>
            {t.body && <div className="mt-0.5 text-xs text-slate-300">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- navigation (grouped by visitor) ---------- */
const GROUP_COLOR = { inst: { dot: 'bg-indigo-400', icon: 'text-indigo-300' }, clients: { dot: 'bg-emerald-400', icon: 'text-emerald-400' }, partners: { dot: 'bg-amber-400', icon: 'text-amber-300' } };
const NAV_GROUPS = [
  {
    id: 'inst',
    label: { en: 'UK Consulate & trade bodies', fr: 'Consulat britannique & institutions' },
    items: [{ id: 'overview', label: { en: 'Market overview', fr: 'Vue d’ensemble' }, icon: Compass }],
  },
  {
    id: 'clients',
    label: { en: 'Clients · UK companies', fr: 'Clients · entreprises britanniques' },
    items: [
      { id: 'company', label: { en: 'Company profile', fr: 'Profil de l’entreprise' }, icon: Building2 },
      { id: 'hub', label: { en: 'AI Tender Hub', fr: 'Veille des appels d’offres' }, icon: LayoutDashboard },
      { id: 'parser', label: { en: 'Brief Parser & Risk', fr: 'Analyse d’avis & risques' }, icon: ScanText },
      { id: 'advisory', label: { en: 'Advisory & Bid Desk', fr: 'Accompagnement & offres' }, icon: Briefcase },
    ],
  },
  {
    id: 'partners',
    label: { en: 'Moroccan partners', fr: 'Partenaires marocains' },
    items: [{ id: 'partners', label: { en: 'Vetted partner network', fr: 'Réseau de partenaires vérifiés' }, icon: Handshake }],
  },
];
const NAV_FLAT = NAV_GROUPS.flatMap((g) => g.items);

function Logo({ compact }) {
  const { tx } = useLang();
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950" aria-hidden="true">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 19 L12 5 L21 19" />
          <path d="M7.5 13 H16.5" />
        </svg>
      </div>
      {compact ? (
        <span className="sr-only">AtlasBid UK</span>
      ) : (
        <div className="leading-tight">
          <div className="font-display text-[15px] font-semibold tracking-tight text-white">
            AtlasBid <span className="text-emerald-400">UK</span>
          </div>
          <div className="text-[11px] tracking-wide text-slate-400">{tx('UK–Morocco tender intelligence', 'Veille marchés Royaume-Uni–Maroc')}</div>
        </div>
      )}
    </div>
  );
}

function Sidebar({ view, setView, counts }) {
  const { lang, tx } = useLang();
  return (
    <aside className="sticky top-0 hidden h-screen w-[272px] shrink-0 flex-col overflow-y-auto bg-[#0F172A] px-4 py-6 lg:flex">
      <div className="px-2">
        <Logo />
      </div>
      <nav className="mt-9 flex flex-col gap-7" aria-label={tx('Main', 'Principale')}>
        {NAV_GROUPS.map((g) => (
          <div key={g.id}>
            <div className="mb-2 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              <span className={cx('h-1.5 w-1.5 shrink-0 rounded-full', GROUP_COLOR[g.id].dot)} aria-hidden="true" />
              {L(g.label, lang)}
            </div>
            <div className="flex flex-col gap-0.5">
              {g.items.map((n) => {
                const active = view === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setView(n.id)}
                    aria-current={active ? 'page' : undefined}
                    className={cx('group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition', active ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white')}
                  >
                    <n.icon className={cx('h-4 w-4 shrink-0', active ? GROUP_COLOR[g.id].icon : 'text-slate-400 group-hover:text-slate-200')} aria-hidden="true" />
                    <span className="flex-1">{L(n.label, lang)}</span>
                    {counts[n.id] != null && (
                      <span className={cx('rounded-full px-1.5 text-[11px] font-semibold tabular-nums', active ? 'bg-emerald-400/20 text-emerald-300' : 'bg-white/5 text-slate-400')}>{counts[n.id]}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto space-y-3 px-2 pt-8">
        <div className="flex items-center gap-2 text-xs text-slate-300">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          {tx('Monitoring 14 Moroccan buyers', '14 acheteurs marocains suivis')}
        </div>
        <div className="text-[11px] leading-relaxed text-slate-400">
          {tx('Prototype · illustrative data', 'Prototype · données illustratives')} · {lang === 'fr' ? `1 £ = ${FX.toFixed(2).replace('.', ',')} MAD` : `£1 = MAD ${FX.toFixed(2)}`}
        </div>
      </div>
    </aside>
  );
}

function LangSwitch() {
  const { lang, setLang, tx } = useLang();
  return (
    <div className="flex shrink-0 rounded-lg bg-slate-100 p-1 ring-1 ring-slate-200" role="radiogroup" aria-label={tx('Language', 'Langue')}>
      {[
        ['en', 'EN', 'English'],
        ['fr', 'FR', 'Français'],
      ].map(([id, short, full]) => (
        <button
          key={id}
          role="radio"
          aria-checked={lang === id}
          lang={id}
          title={full}
          onClick={() => setLang(id)}
          className={cx('rounded-md px-2.5 py-1.5 text-xs font-bold tracking-wide transition', lang === id ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800')}
        >
          <span aria-hidden="true">{short}</span>
          <span className="sr-only">{full}</span>
        </button>
      ))}
    </div>
  );
}

function Header({ profile, setProfile, view, setView, clientId, setClientId }) {
  const { lang, tx } = useLang();
  const showProfile = view === 'hub' || view === 'parser';
  return (
    <header style={{ top: 'env(safe-area-inset-top, 0px)' }} className="sticky z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-8">
        <div className="lg:hidden">
          <div className="rounded-lg bg-[#0F172A] p-1.5">
            <Logo compact />
          </div>
        </div>
        <div className="flex min-w-0 flex-1 items-center gap-3 overflow-visible md:flex-none">
          <ClientSwitcher clientId={clientId} setClientId={setClientId} />
        </div>
        <div className="md:hidden">
          <LangSwitch />
        </div>

        <div className={cx("flex items-center gap-3 md:ml-auto", showProfile && "max-md:w-full")}>
          {showProfile && (<>
          <span className="hidden text-xs font-semibold text-slate-500 xl:inline">{tx('Score as', 'Noter selon')}</span>
          <div className="hidden rounded-lg bg-slate-100 p-1 ring-1 ring-slate-200 md:flex" role="radiogroup" aria-label={tx('Sector profile', 'Profil sectoriel')}>
            {PROFILES.map((p) => {
              const Icon = PROFILE_ICON[p.id];
              const active = profile === p.id;
              return (
                <button
                  key={p.id}
                  role="radio"
                  aria-checked={active}
                  onClick={() => setProfile(p.id)}
                  className={cx('flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition', active ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:text-slate-800')}
                >
                  <Icon className={cx('h-3.5 w-3.5', active && 'text-emerald-600')} aria-hidden="true" />
                  <span className="2xl:hidden">{L(p.short, lang)}</span>
                  <span className="hidden 2xl:inline">{L(p.label, lang)}</span>
                </button>
              );
            })}
          </div>
          <label className="min-w-0 flex-1 md:hidden">
            <span className="sr-only">{tx('Sector profile', 'Profil sectoriel')}</span>
            <select id="profile-mobile" value={profile} onChange={(e) => setProfile(e.target.value)} className={cx(inputCls, 'py-2 font-medium')}>
              {PROFILES.map((p) => (
                <option key={p.id} value={p.id}>
                  {L(p.label, lang)}
                </option>
              ))}
            </select>
          </label>
          </>)}
          <div className="hidden md:block">
            <LangSwitch />
          </div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto border-t border-slate-800 bg-[#0F172A] px-2 py-1.5 lg:hidden" aria-label={tx('Main', 'Principale')}>
        {NAV_FLAT.map((n) => (
          <button
            key={n.id}
            onClick={() => setView(n.id)}
            aria-current={view === n.id ? 'page' : undefined}
            className={cx('flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium', view === n.id ? 'bg-white/10 text-white' : 'text-slate-300')}
          >
            <n.icon className={cx('h-3.5 w-3.5', view === n.id && 'text-emerald-400')} aria-hidden="true" />
            {L(n.label, lang)}
          </button>
        ))}
      </nav>
    </header>
  );
}

/* ---------- Connected client ---------- */
function ClientMark({ client, size = 36 }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg font-display font-bold text-white shadow-sm"
      style={{ width: size, height: size, fontSize: size * 0.36, background: `linear-gradient(135deg, ${client.color.from}, ${client.color.to})` }}
      aria-hidden="true"
    >
      {client.monogram}
    </span>
  );
}

function Avatar({ client, size = 32 }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-full bg-white font-semibold ring-2" style={{ width: size, height: size, fontSize: size * 0.38, color: client.color.to, '--tw-ring-color': client.color.from }} aria-hidden="true">
      {client.user.initials}
    </span>
  );
}

function ClientSwitcher({ clientId, setClientId }) {
  const { lang, tx, client } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('mousedown', close);
    window.addEventListener('keydown', esc);
    return () => {
      document.removeEventListener('mousedown', close);
      window.removeEventListener('keydown', esc);
    };
  }, [open]);
  return (
    <div className="relative min-w-0 max-w-full" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full min-w-0 max-w-full items-center gap-3 rounded-xl py-1 pl-1 pr-3 text-left transition hover:bg-slate-50"
      >
        <ClientMark client={client} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">{tx('Connected client', 'Client connecté')}</span>
          <span className="block truncate text-sm font-semibold text-slate-900">
            {client.name} <span className="hidden font-normal text-slate-500 sm:inline">— {L(client.city, lang)}</span>
          </span>
        </span>
        <ChevronDown className={cx('h-4 w-4 shrink-0 text-slate-500 transition', open && 'rotate-180')} aria-hidden="true" />
      </button>
      {open && (
        <div className="fixed inset-x-4 top-16 z-40 sm:absolute sm:inset-x-auto sm:left-0 sm:top-full sm:mt-2 sm:w-[380px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl animate-rise" role="listbox" aria-label={tx('Choose the connected client', 'Choisir le client connecté')}>
          <div className="border-b border-slate-100 px-4 py-3 text-xs font-semibold uppercase tracking-[0.1em] text-slate-500">{tx('Prototype · switch client account', 'Prototype · changer de compte client')}</div>
          {CLIENTS.map((c) => {
            const active = c.id === clientId;
            return (
              <button
                key={c.id}
                role="option"
                aria-selected={active}
                onClick={() => {
                  setClientId(c.id);
                  setOpen(false);
                }}
                className={cx('flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50', active && 'bg-slate-50')}
              >
                <ClientMark client={c} size={40} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-slate-900">{c.name}</span>
                  <span className="block truncate text-xs text-slate-600">
                    {L(c.city, lang)} · {c.user.name}
                  </span>
                  <span className={cx('mt-1 inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset', c.color.soft)}>{L(PROFILES.find((p) => p.id === c.profile).label, lang)}</span>
                </span>
                {active && <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CompanyProfile({ tenders, requests, intros, go }) {
  const { lang, tx, client, score } = useLang();
  const prof = PROFILES.find((p) => p.id === client.profile);
  const top = [...tenders].sort((a, b) => score(b, client.profile) - score(a, client.profile)).slice(0, 3);
  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="h-24 sm:h-28" style={{ background: `linear-gradient(120deg, ${client.color.from}, ${client.color.to})` }} aria-hidden="true" />
        <div className="px-6 pb-6 sm:px-8">
          <div className="-mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <div className="rounded-2xl bg-white p-1.5 shadow-md">
                <ClientMark client={client} size={72} />
              </div>
              <div className="pb-1">
                <h1 className="font-display text-2xl font-semibold text-slate-900 sm:text-[28px]">{client.name}</h1>
                <p className="text-sm text-slate-600">{L(client.tagline, lang)}</p>
              </div>
            </div>
            <span className={cx('inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset', client.color.soft)}>
              {React.createElement(PROFILE_ICON[client.profile], { className: 'h-3.5 w-3.5', 'aria-hidden': true })}
              {L(prof.label, lang)}
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              [tx('Headquarters', 'Siège'), L(client.city, lang)],
              [tx('Turnover', 'Chiffre d’affaires'), client.turnover],
              [tx('Employees', 'Effectif'), client.staff],
              [tx('Founded', 'Création'), client.founded],
            ].map(([l, v]) => (
              <div key={l} className="rounded-xl bg-slate-50 p-4">
                <dt className="text-xs text-slate-500">{l}</dt>
                <dd className="mt-0.5 font-display text-lg font-semibold tabular-nums text-slate-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <Eyebrow icon={UserRound}>{tx('Signed-in contact', 'Responsable connecté')}</Eyebrow>
          <div className="mt-4 flex items-center gap-3">
            <Avatar client={client} size={48} />
            <div>
              <div className="font-semibold text-slate-900">{client.user.name}</div>
              <div className="text-sm text-slate-600">{L(client.user.role, lang)}</div>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
            <button onClick={() => go('advisory')} className="rounded-xl bg-emerald-50 p-3 text-left ring-1 ring-emerald-100 transition hover:ring-emerald-300">
              <div className="font-display text-xl font-semibold text-emerald-700">{requests.filter((r) => r.status !== 'done').length}</div>
              <div className="text-xs text-emerald-900">{tx('Open advisory requests', 'Demandes en cours')}</div>
            </button>
            <button onClick={() => go('partners')} className="rounded-xl bg-violet-50 p-3 text-left ring-1 ring-violet-100 transition hover:ring-violet-300">
              <div className="font-display text-xl font-semibold text-violet-700">{intros.length}</div>
              <div className="text-xs text-violet-900">{tx('Introductions requested', 'Mises en relation')}</div>
            </button>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <Eyebrow icon={Wrench}>{tx('Activities', 'Activités')}</Eyebrow>
          <ul className="mt-4 space-y-2.5">
            {L(client.activities, lang).map((a) => (
              <li key={a} className="flex gap-2.5 text-sm text-slate-700">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full" style={{ background: client.color.from }} aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
          <div className="mt-5 text-xs text-slate-500">{L(client.references, lang)}</div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <Eyebrow icon={ShieldCheck}>{tx('Certifications & Morocco presence', 'Certifications & présence au Maroc')}</Eyebrow>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {client.certifications.map((c) => (
              <Pill key={c} className="bg-sky-50 text-sky-800 ring-sky-200">
                <BadgeCheck className="h-3 w-3" aria-hidden="true" />
                {c}
              </Pill>
            ))}
          </div>
          <div className="mt-5 flex gap-2.5 rounded-xl bg-amber-50 p-3.5 text-sm text-amber-900 ring-1 ring-amber-100">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
            {L(client.morocco, lang)}
          </div>
          <div className="mt-3 text-xs text-slate-500">
            {tx('Target contract size', 'Taille de marché visée')} : {fmtGBP(client.sweetSpot[0], lang)} – {fmtGBP(client.sweetSpot[1], lang)}
          </div>
        </section>
      </div>

      <section>
        <div className="flex items-end justify-between gap-3">
          <h2 className="font-display text-xl font-semibold text-slate-900">{tx('Best-matched tenders', 'Appels d’offres les mieux adaptés')}</h2>
          <button onClick={() => go('hub')} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
            {tx('Open Tender Hub', 'Ouvrir la veille')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {top.map((t) => (
            <div key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <SectorChip sector={t.sector} />
                <ScoreRing score={score(t, client.profile)} size={44} stroke={4} />
              </div>
              <div className="mt-3 text-sm font-semibold leading-snug text-slate-900">{L(t.title, lang)}</div>
              <div className="mt-3">
                <MiniStage tender={t} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* ---------- Procurement timeline ---------- */
function relDay(day, tx) {
  if (day === 0) return tx('today', 'aujourd’hui');
  return day > 0 ? tx(`in ${day} days`, `dans ${day} j`) : tx(`${-day} days ago`, `il y a ${-day} j`);
}

function MiniStage({ tender }) {
  const { lang, tx } = useLang();
  const { steps, current, next } = tenderTimeline(tender);
  return (
    <div className="min-w-0">
      <div className="flex gap-1" aria-hidden="true">
        {steps.map((s, i) => (
          <span key={s.id} className={cx('h-1.5 flex-1 rounded-full', i < current ? 'bg-emerald-400' : i === current ? 'bg-gradient-to-r from-emerald-500 to-sky-500' : 'bg-slate-200')} />
        ))}
      </div>
      <div className="mt-1.5 truncate text-xs text-slate-600">
        <span className="font-semibold text-slate-800">{L(STAGE_LABELS[steps[current].id], lang)}</span>
        {next && (
          <>
            {' '}
            · {tx('next', 'suite')} : {L(STAGE_LABELS[next.id], lang).toLowerCase()} {relDay(next.day, tx)}
          </>
        )}
      </div>
    </div>
  );
}

function TenderTimeline({ tender }) {
  const { lang, tx } = useLang();
  const { steps, current } = tenderTimeline(tender);
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Eyebrow icon={Milestone}>{tx('Procurement timeline', 'Calendrier de la procédure')}</Eyebrow>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-sky-500 px-2.5 py-1 text-xs font-semibold text-white">
          {tx('Current stage', 'Étape actuelle')} : {L(STAGE_LABELS[steps[current].id], lang)}
        </span>
      </div>
      <ol className="mt-5">
        {steps.map((s, i) => {
          const st = i < current ? 'done' : i === current ? 'current' : 'next';
          return (
            <li key={s.id} className="flex gap-3.5">
              <div className="flex flex-col items-center">
                <span
                  className={cx(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                    st === 'done' && 'bg-emerald-500 text-white',
                    st === 'current' && 'bg-white text-sky-700 ring-4 ring-sky-100 border-2 border-sky-500',
                    st === 'next' && 'bg-slate-100 text-slate-500',
                  )}
                >
                  {st === 'done' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                </span>
                {i < steps.length - 1 && <span className={cx('my-1 w-0.5 flex-1 rounded', i < current ? 'bg-emerald-300' : 'bg-slate-200')} aria-hidden="true" />}
              </div>
              <div className={cx('flex min-w-0 flex-1 flex-wrap items-baseline justify-between gap-x-3 pb-4', st === 'current' && 'rounded-lg')}>
                <div className={cx('text-sm', st === 'next' ? 'text-slate-600' : 'font-semibold text-slate-900')}>
                  {L(STAGE_LABELS[s.id], lang)}
                  {st === 'current' && <span className="ml-2 text-xs font-semibold text-sky-700">● {tx('now', 'en cours')}</span>}
                </div>
                <div className="text-xs tabular-nums text-slate-500">
                  {dateIn(s.day, lang)}
                  {s.end ? ` → ${dateIn(s.end, lang)}` : ''} · {relDay(s.day, tx)}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <p className="text-xs text-slate-500">{tx('Evaluation, award and signature dates are indicative estimates.', 'Les dates d’évaluation, d’attribution et de notification sont des estimations indicatives.')}</p>
    </section>
  );
}

function SectorChip({ sector }) {
  const { lang } = useLang();
  const Icon = SECTOR_ICON[sector] || Landmark;
  return (
    <Pill className={(SECTOR_COLOR[sector] || SECTOR_COLOR.Aviation).chip}>
      <Icon className="h-3 w-3" aria-hidden="true" />
      {sectorLabel(sector, lang)}
    </Pill>
  );
}

/* ---------- View 0: Overview (audience paths) ---------- */
function Overview({ tenders, go }) {
  const { lang, tx } = useLang();
  const pipeline = tenders.reduce((s, t) => s + t.valueGBP, 0);
  const wcShare = Math.round((tenders.filter((t) => t.worldCup).reduce((s, t) => s + t.valueGBP, 0) / pipeline) * 100);
  const bySector = SECTORS.map((s) => ({ s, v: tenders.filter((t) => t.sector === s).reduce((a, t) => a + t.valueGBP, 0) }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  const max = Math.max(...bySector.map((x) => x.v));
  const snapRef = useRef(null);

  const paths = [
    {
      id: 'inst',
      icon: Landmark,
      tile: 'from-indigo-500 to-violet-500',
      who: tx('UK Consulate & trade bodies', 'Consulat britannique & institutions'),
      need: tx('Understand the opportunity and how UK exporters are supported.', 'Mesurer l’opportunité et l’appui apporté aux exportateurs britanniques.'),
      points: [
        tx('Live pipeline by sector and buyer', 'Portefeuille actif par secteur et acheteur'),
        tx('World Cup 2030 procurement timeline', 'Calendrier des achats Coupe du Monde 2030'),
        tx('Compliance aligned with the UK Bribery Act', 'Conformité alignée sur le UK Bribery Act'),
      ],
      cta: [[tx('View market snapshot', 'Voir l’aperçu du marché'), () => snapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })]],
    },
    {
      id: 'clients',
      icon: Building2,
      tile: 'from-emerald-500 to-teal-500',
      who: tx('Clients · UK companies', 'Clients · entreprises britanniques'),
      need: tx('Find the right tenders, understand the rules and bid with confidence.', 'Trouver les bons marchés, comprendre les règles et soumissionner sereinement.'),
      points: [
        tx('Tenders scored against your capabilities', 'Appels d’offres notés selon vos capacités'),
        tx('French notices turned into English briefs', 'Avis en français convertis en synthèses en anglais'),
        tx('Bid readiness and advisory support', 'Préparation des offres et accompagnement'),
      ],
      cta: [
        [tx('Open Tender Hub', 'Ouvrir la veille'), () => go('hub')],
        [tx('Advisory desk', 'Accompagnement'), () => go('advisory')],
      ],
    },
    {
      id: 'partners',
      icon: Handshake,
      tile: 'from-amber-400 to-orange-500',
      who: tx('Moroccan partners', 'Partenaires marocains'),
      need: tx('Team with qualified British primes on major projects.', 'S’associer à des entreprises britanniques qualifiées sur les grands projets.'),
      points: [
        tx('Vetting by senior Moroccan procurement leadership', 'Vérification par une direction marocaine expérimentée'),
        tx('Anonymous profiles until mutual consent', 'Profils anonymes jusqu’à accord mutuel'),
        tx('Introductions tied to live tenders', 'Mises en relation liées à des marchés en cours'),
      ],
      cta: [[tx('See partner network', 'Voir le réseau'), () => go('partners')]],
    },
  ];

  const timeline = [
    ['2026', tx('Major tenders launched', 'Lancement des grands appels d’offres'), tx('Airports, high-speed rail, stadium cities', 'Aéroports, LGV, villes stades')],
    ['2027–28', tx('Design and construction', 'Conception et travaux'), tx('Peak demand for UK engineering and systems', 'Pic de besoins en ingénierie et systèmes britanniques')],
    ['2029', tx('Testing and readiness', 'Essais et préparation'), tx('Operational readiness and test events', 'Préparation opérationnelle et événements tests')],
    ['2030', tx('FIFA World Cup', 'Coupe du Monde FIFA'), tx('Co-hosted with Spain and Portugal', 'Coorganisée avec l’Espagne et le Portugal')],
  ];

  return (
    <div className="space-y-16">
      <section className="relative grid items-end gap-10 overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 sm:p-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-emerald-300/30 blur-3xl" />
          <div className="absolute right-10 -top-28 h-72 w-72 rounded-full bg-sky-300/30 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-300/25 blur-3xl" />
          <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-amber-200/40 blur-3xl" />
        </div>
        <div className="relative">
          <Eyebrow icon={Globe2} className="text-emerald-700">
            {tx('UK–Morocco infrastructure partnerships', 'Partenariats d’infrastructure Royaume-Uni–Maroc')}
          </Eyebrow>
          <h1 className="mt-4 font-display text-[30px] font-semibold leading-[1.12] tracking-tight text-slate-900 text-balance sm:text-[40px]">
            {tx('Helping British firms win Morocco’s 2030 infrastructure tenders, with vetted local partners.', 'Aider les entreprises britanniques à remporter les marchés d’infrastructure du Maroc 2030, avec des partenaires locaux vérifiés.')}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600">
            {tx(
              'AtlasBid UK tracks Moroccan public tenders, explains the procurement rules in plain English, and connects UK companies with pre-vetted Moroccan contractors and advisers.',
              'AtlasBid UK suit les appels d’offres publics marocains, explique clairement les règles de la commande publique et met en relation les entreprises britanniques avec des entreprises et conseils marocains vérifiés.',
            )}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => go('hub')} className={btnPrimary}>
              {tx('Explore live tenders', 'Voir les appels d’offres')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
            <button onClick={() => go('partners')} className={btnGhost}>
              {tx('Meet the partner network', 'Découvrir le réseau')}
            </button>
          </div>
        </div>
        <dl className="relative grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 shadow-sm">
          {[
            [tx('Tracked pipeline', 'Portefeuille suivi'), fmtGBP(pipeline, lang), fmtMADm(pipeline, lang)],
            [tx('Live tenders', 'Appels d’offres actifs'), tenders.length, tx(`${AUTHORITIES.length} public buyers`, `${AUTHORITIES.length} acheteurs publics`)],
            [tx('Linked to World Cup 2030', 'Liés à la Coupe du Monde 2030'), pctTxt(wcShare, lang), tx('of pipeline value', 'de la valeur du portefeuille')],
            [tx('Vetted partners', 'Partenaires vérifiés'), PARTNERS.length, tx('22+ years leadership', '22+ ans d’expérience')],
          ].map(([l, v, s], i) => (
            <div key={l} className="bg-white/90 p-5 backdrop-blur">
              <dt className="text-xs font-medium text-slate-600">{l}</dt>
              <dd className={cx('mt-1.5 font-display text-2xl font-semibold tabular-nums', ['text-emerald-600', 'text-sky-600', 'text-rose-600', 'text-violet-600'][i])}>{v}</dd>
              <dd className="mt-0.5 text-xs text-slate-500">{s}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="paths">
        <h2 id="paths" className="font-display text-xl font-semibold text-slate-900">
          {tx('Choose your path', 'Choisissez votre parcours')}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{tx('Each visitor reaches what they need first.', 'Chaque visiteur accède d’abord à ce dont il a besoin.')}</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {paths.map((p) => (
            <article key={p.id} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 transition duration-300 hover:border-slate-300 hover:shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)]">
              <div className={cx('flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm', p.tile)} aria-hidden="true">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{p.who}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{p.need}</p>
              <ul className="mt-5 space-y-2.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex gap-2.5 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                    {pt}
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-6">
                {p.cta.map(([label, fn]) => (
                  <button key={label} onClick={fn} className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-900">
                    {label} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section ref={snapRef} aria-labelledby="snap" className="scroll-mt-32">
        <h2 id="snap" className="font-display text-xl font-semibold text-slate-900">
          {tx('Market snapshot', 'Aperçu du marché')}
        </h2>
        <p className="mt-1 text-sm text-slate-600">{tx('Live pipeline tracked for UK companies, by sector.', 'Portefeuille suivi pour les entreprises britanniques, par secteur.')}</p>
        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Eyebrow icon={Banknote}>{tx('Pipeline by sector', 'Portefeuille par secteur')}</Eyebrow>
            <ul className="mt-5 space-y-4">
              {bySector.map(({ s, v }) => {
                const Icon = SECTOR_ICON[s];
                return (
                  <li key={s}>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="flex items-center gap-2 text-slate-700">
                        <span className={cx('flex h-6 w-6 items-center justify-center rounded-md', SECTOR_COLOR[s].icon)} aria-hidden="true"><Icon className="h-3.5 w-3.5" /></span>
                        {sectorLabel(s, lang)}
                      </span>
                      <span className="font-semibold tabular-nums text-slate-900">{fmtGBP(v, lang)}</span>
                    </div>
                    <div className="mt-1.5 h-2 rounded-full bg-slate-100">
                      <div className="h-2 rounded-full transition-all duration-700" style={{ width: `${(v / max) * 100}%`, background: SECTOR_COLOR[s].bar }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <Eyebrow icon={Trophy}>{tx('World Cup 2030 timeline', 'Calendrier Coupe du Monde 2030')}</Eyebrow>
            <ol className="mt-5">
              {timeline.map(([y, t, s], i) => (
                <li key={y} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className={cx('mt-1 h-3 w-3 rounded-full ring-4', ['bg-emerald-500 ring-emerald-100', 'bg-sky-500 ring-sky-100', 'bg-violet-500 ring-violet-100', 'bg-rose-500 ring-rose-100'][i])} aria-hidden="true" />
                    {i < timeline.length - 1 && <span className="my-1 w-px flex-1 bg-slate-200" aria-hidden="true" />}
                  </div>
                  <div className="pb-5">
                    <div className="font-mono text-xs font-semibold text-slate-500">{y}</div>
                    <div className="text-sm font-semibold text-slate-900">{t}</div>
                    <div className="text-sm text-slate-600">{s}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section aria-labelledby="how">
        <h2 id="how" className="font-display text-xl font-semibold text-slate-900">
          {tx('How AtlasBid works', 'Comment fonctionne AtlasBid')}
        </h2>
        <ol className="mt-6 grid gap-5 md:grid-cols-3">
          {[
            [Radar, tx('Detect', 'Détecter'), tx('Moroccan notices are collected daily and scored against each company’s sector profile.', 'Les avis marocains sont collectés chaque jour et notés selon le profil sectoriel de chaque entreprise.')],
            [ShieldCheck, tx('Qualify', 'Qualifier'), tx('Bid bonds, national preference and eligibility are flagged before any bid cost is spent.', 'Caution, préférence nationale et éligibilité sont signalées avant tout engagement de frais.')],
            [Handshake, tx('Partner and bid', 'S’associer et soumissionner'), tx('Vetted Moroccan partners and advisers help assemble a compliant, competitive offer.', 'Des partenaires et conseils marocains vérifiés aident à bâtir une offre conforme et compétitive.')],
          ].map(([Icon, t, d], i) => (
            <li key={t} className="rounded-2xl bg-white p-6 ring-1 ring-slate-200">
              <div className="flex items-center gap-3">
                <span className={cx('flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-sm', ['from-sky-500 to-blue-600', 'from-violet-500 to-fuchsia-500', 'from-emerald-500 to-teal-500'][i])} aria-hidden="true">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="font-mono text-xs font-semibold text-slate-500">0{i + 1}</span>
              </div>
              <div className="mt-3 font-display text-base font-semibold text-slate-900">{t}</div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{d}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}

/* ---------- View 1: Tender Hub ---------- */
function Kpi({ icon: Icon, label, value, sub, accent, tint = 'from-slate-50' }) {
  return (
    <div className={cx('rounded-xl border border-slate-200 bg-gradient-to-br to-white p-5', tint)}>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-slate-600">{label}</span>
        <span className={cx('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm', accent)} aria-hidden="true">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <div key={value} className="mt-3 font-display text-2xl font-semibold tabular-nums text-slate-900 animate-pop">{value}</div>
      <div className="mt-0.5 text-xs text-slate-500">{sub}</div>
    </div>
  );
}

function TenderHub({ tenders, profile, onOpen, recalcFlash }) {
  const { lang, tx, score, client } = useLang();
  const [q, setQ] = useState('');
  const [sector, setSector] = useState('All');
  const [authority, setAuthority] = useState('All');
  const [minScore, setMinScore] = useState(0);
  const [sort, setSort] = useState('match');

  const prof = PROFILES.find((p) => p.id === profile);
  const authorities = useMemo(() => Array.from(new Set([...AUTHORITIES, ...tenders.map((t) => t.authority)])), [tenders]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const list = tenders.filter((t) => {
      if (score(t) < minScore) return false;
      if (sector !== 'All' && t.sector !== sector) return false;
      if (authority !== 'All' && t.authority !== authority) return false;
      if (needle) {
        const hay = [L(t.title, 'en'), L(t.title, 'fr'), t.authority, t.authorityFull, t.sector, sectorLabel(t.sector, 'fr'), L(t.location, 'en'), L(t.location, 'fr'), L(t.summary, 'en'), L(t.summary, 'fr'), t.ref]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const sorters = { match: (a, b) => score(b) - score(a), deadline: (a, b) => a.daysLeft - b.daysLeft, value: (a, b) => b.valueGBP - a.valueGBP };
    return list.sort(sorters[sort]);
  }, [tenders, q, sector, authority, minScore, sort, profile, score]);

  const relevant = filtered.filter((t) => score(t) >= 70);
  const high = filtered.filter((t) => score(t) > 85);
  const pipeline = relevant.reduce((s, t) => s + t.valueGBP, 0);
  const closing = filtered.filter((t) => t.daysLeft <= 30);
  const filtersOn = q || sector !== 'All' || authority !== 'All' || minScore > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <PageHead eyebrow={tx('Clients · UK companies', 'Clients · entreprises britanniques')} title={tx('AI Tender Hub', 'Veille intelligente des appels d’offres')}>
          {tx(
            `Moroccan public tenders scored against ${client.name}’s capabilities for the ${L(prof.label, 'en')} profile.`,
            `Appels d’offres publics marocains notés selon les capacités de ${client.name} pour le profil ${L(prof.label, 'fr')}.`,
          )}
        </PageHead>
        <div className={cx('flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition duration-500', recalcFlash ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'text-slate-500')} aria-live="polite">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          {recalcFlash ? tx(`Scores recalculated for ${L(prof.label, 'en')}`, `Scores recalculés pour ${L(prof.label, 'fr')}`) : tx('Scores follow the sector profile', 'Les scores suivent le profil sectoriel')}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <Kpi icon={Target} label={tx('Active relevant tenders', 'Appels d’offres pertinents')} value={relevant.length} sub={tx('Match score 70% or above', 'Score de 70 % ou plus')} accent="bg-gradient-to-br from-indigo-500 to-violet-500 text-white" tint="from-indigo-50" />
        <Kpi icon={TrendingUp} label={tx('High match (>85%)', 'Forte adéquation (>85 %)')} value={high.length} sub={L(prof.short, lang)} accent="bg-gradient-to-br from-emerald-500 to-teal-500 text-white" tint="from-emerald-50" />
        <Kpi icon={Banknote} label={tx('Total pipeline value', 'Valeur du portefeuille')} value={fmtGBP(pipeline, lang)} sub={fmtMADm(pipeline, lang)} accent="bg-gradient-to-br from-sky-500 to-blue-600 text-white" tint="from-sky-50" />
        <Kpi icon={Clock} label={tx('Closing within 30 days', 'Clôture sous 30 jours')} value={closing.length} sub={tx('Bid opening dates', 'Dates d’ouverture des plis')} accent="bg-gradient-to-br from-rose-500 to-orange-500 text-white" tint="from-rose-50" />
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-12">
          <label className="relative md:col-span-4">
            <span className="sr-only">{tx('Search tenders', 'Rechercher')}</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
            <input id="hub-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={tx('Search, e.g. baggage, signalling, solar', 'Rechercher : bagages, signalisation, solaire…')} className={cx(inputCls, 'pl-9')} />
          </label>
          <label className="md:col-span-2">
            <span className="sr-only">{tx('Sector', 'Secteur')}</span>
            <select id="hub-sector" value={sector} onChange={(e) => setSector(e.target.value)} className={inputCls}>
              <option value="All">{tx('All sectors', 'Tous les secteurs')}</option>
              {SECTORS.map((s) => (
                <option key={s} value={s}>
                  {sectorLabel(s, lang)}
                </option>
              ))}
            </select>
          </label>
          <label className="md:col-span-3">
            <span className="sr-only">{tx('Contracting authority', 'Maître d’ouvrage')}</span>
            <select id="hub-authority" value={authority} onChange={(e) => setAuthority(e.target.value)} className={inputCls}>
              <option value="All">{tx('All contracting authorities', 'Tous les maîtres d’ouvrage')}</option>
              {authorities.map((a) => (
                <option key={a} value={a}>
                  {authLabel(a, lang)}
                </option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-3 md:col-span-3">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
            <label htmlFor="hub-min" className="shrink-0 text-xs font-medium text-slate-700">
              {tx('Min. match', 'Score min.')}
            </label>
            <input id="hub-min" type="range" min="0" max="95" step="5" value={minScore} onChange={(e) => setMinScore(+e.target.value)} className="w-full accent-emerald-700" />
            <span className="w-11 shrink-0 text-right text-sm font-semibold tabular-nums text-slate-800">{pctTxt(minScore, lang)}</span>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4">
          <div className="text-sm text-slate-600" aria-live="polite">
            {tx('Showing', 'Affichage de')} <span className="font-semibold text-slate-900">{filtered.length}</span> {tx('of', 'sur')} {tenders.length} {tx('tenders', 'appels d’offres')}
            {filtersOn && (
              <button
                onClick={() => {
                  setQ('');
                  setSector('All');
                  setAuthority('All');
                  setMinScore(0);
                }}
                className="ml-3 inline-flex items-center gap-1 font-medium text-emerald-700 hover:underline"
              >
                <RotateCcw className="h-3 w-3" aria-hidden="true" /> {tx('Clear filters', 'Effacer les filtres')}
              </button>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs" role="group" aria-label={tx('Sort', 'Trier')}>
            <span className="mr-1 text-slate-600">{tx('Sort', 'Trier')}</span>
            {[
              ['match', tx('Match', 'Score')],
              ['deadline', tx('Deadline', 'Échéance')],
              ['value', tx('Value', 'Montant')],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} aria-pressed={sort === k} className={cx('rounded-md px-2.5 py-1.5 font-medium transition', sort === k ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100')}>
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <Search className="mx-auto h-6 w-6 text-slate-400" aria-hidden="true" />
            <div className="mt-2 text-sm font-medium text-slate-800">{tx('No tenders match these filters', 'Aucun appel d’offres ne correspond')}</div>
            <div className="text-sm text-slate-600">{tx('Lower the minimum match or clear the search.', 'Baissez le score minimum ou effacez la recherche.')}</div>
          </div>
        )}
        {filtered.map((t) => {
                    return (
            <button
              key={t.id}
              onClick={() => onOpen(t.id)}
              className="group grid w-full grid-cols-[auto_1fr] items-center gap-5 rounded-xl border border-slate-200 bg-white p-5 text-left transition duration-200 hover:-translate-y-px hover:border-slate-300 hover:shadow-[0_8px_30px_-12px_rgba(15,23,42,0.18)] md:grid-cols-[auto_1fr_auto_auto_auto_auto]"
            >
              <ScoreRing score={score(t)} size={54} />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <Pill className="bg-slate-900 text-white ring-slate-900">{authLabel(t.authority, lang)}</Pill>
                  <SectorChip sector={t.sector} />
                  {t.worldCup && <Pill className="bg-gradient-to-r from-rose-50 to-amber-50 text-rose-700 ring-rose-200"><Trophy className="h-3 w-3" aria-hidden="true" />{tx('World Cup 2030', 'Coupe du Monde 2030')}</Pill>}
                  {t.parsed && <Pill className="bg-sky-50 text-sky-800 ring-sky-200">{tx('Parsed notice', 'Avis analysé')}</Pill>}
                </div>
                <div className="mt-2 text-[15px] font-semibold leading-snug text-slate-900 group-hover:text-emerald-800">{L(t.title, lang)}</div>
                <div className="mt-1 truncate font-mono text-xs text-slate-500">
                  {t.ref} · {L(t.location, lang)}
                </div>
                <div className="mt-3 max-w-md">
                  <MiniStage tender={t} />
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-2 md:hidden">
                  <span className="text-sm font-semibold tabular-nums text-slate-900">{fmtGBP(t.valueGBP, lang)}</span>
                  <Pill className={deadlineTone(t.daysLeft)}>{tx(`${t.daysLeft} days left`, `${t.daysLeft} jours restants`)}</Pill>
                  <JvDots level={t.jv} />
                </div>
              </div>
              <div className="hidden w-28 text-right md:block">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">{tx('Value', 'Montant')}</div>
                <div className="font-semibold tabular-nums text-slate-900">{fmtGBP(t.valueGBP, lang)}</div>
                <div className="text-xs tabular-nums text-slate-500">{fmtMADm(t.valueGBP, lang)}</div>
              </div>
              <div className="hidden w-32 text-right md:block">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">{tx('Closes', 'Clôture')}</div>
                <Pill className={deadlineTone(t.daysLeft)}>
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  {tx(`${t.daysLeft} days`, `${t.daysLeft} jours`)}
                </Pill>
                <div className="mt-0.5 text-xs text-slate-500">{dateIn(t.daysLeft, lang)}</div>
              </div>
              <div className="hidden w-32 md:block">
                <div className="text-[11px] uppercase tracking-wider text-slate-500">{tx('JV recommended', 'Groupement conseillé')}</div>
                <div className="mt-1">
                  <JvDots level={t.jv} />
                </div>
              </div>
              <ChevronRight className="hidden h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-600 md:block" aria-hidden="true" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Tender drawer ---------- */
const BOND_NOTES = {
  en: [
    'Issued by a bank approved in Morocco. UK banks typically act through a counter-guarantee to a Moroccan correspondent bank; allow 2–3 weeks.',
    'Must be valid for the full bid validity period stated in the bid rules (règlement de consultation).',
    'On award, replaced by a performance bond (caution définitive), typically 3% of the contract value.',
    'Retention (retenue de garantie) is usually 10% of each interim payment, capped at 7% of contract value, and can be replaced by a bank guarantee.',
  ],
  fr: [
    'Émise par une banque agréée au Maroc. Les banques britanniques passent en général par une contre-garantie auprès d’une banque correspondante marocaine ; prévoir 2 à 3 semaines.',
    'Valable pendant toute la durée de validité des offres fixée par le règlement de consultation.',
    'À l’attribution, remplacée par la caution définitive, en général 3 % du montant du marché.',
    'La retenue de garantie est en général de 10 % de chaque acompte, plafonnée à 7 % du marché, et peut être remplacée par une caution bancaire.',
  ],
};

function TenderDrawer({ tender, profile, onClose, goPartners, goAdvisory }) {
  const { lang, tx, score } = useLang();
  const open = !!tender;
  const [shown, setShown] = useState(null);
  const closeRef = useRef(null);
  const scrollRef = useRef(null);
  useEffect(() => {
    if (tender) setShown(tender);
  }, [tender]);
  useEffect(() => {
    if (!open) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const f = setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.removeEventListener('keydown', k);
      clearTimeout(f);
    };
  }, [open, onClose]);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, [tender && tender.id]);
  const t = tender || shown;
  const prof = PROFILES.find((p) => p.id === profile);

  return (
    <div className={cx('fixed inset-0 z-50', open ? 'pointer-events-auto' : 'pointer-events-none invisible delay-[400ms]')} aria-hidden={!open}>
      <div className={cx('absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity duration-300', open ? 'opacity-100' : 'opacity-0')} onClick={onClose} />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={tx('Tender brief', 'Fiche de l’appel d’offres')}
        className={cx('absolute right-0 top-0 flex h-full w-full max-w-[640px] flex-col bg-white shadow-2xl transition-transform duration-[400ms] ease-[cubic-bezier(.2,.8,.2,1)]', open ? 'translate-x-0' : 'translate-x-full')}
      >
        {t && (
          <>
            <div className="border-b border-slate-200 bg-white px-5 py-5 sm:px-7">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Pill className="bg-slate-900 text-white ring-slate-900">{authLabel(t.authority, lang)}</Pill>
                    <span className="font-mono text-xs text-slate-500">{t.ref}</span>
                    {t.worldCup && <Pill className="bg-amber-50 text-amber-800 ring-amber-200">{tx('World Cup 2030', 'Coupe du Monde 2030')}</Pill>}
                  </div>
                  <h2 className="mt-2.5 font-display text-xl font-semibold leading-snug text-slate-900 text-balance">{L(t.title, lang)}</h2>
                  <div className="mt-1 text-sm text-slate-600">{t.authorityFull}</div>
                </div>
                <button ref={closeRef} onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-800" aria-label={tx('Close brief', 'Fermer la fiche')}>
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-7 overflow-y-auto px-5 py-6 sm:px-7">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center gap-4">
                  <ScoreRing score={score(t)} size={68} stroke={6} />
                  <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {tx('Match', 'Adéquation')} · {L(prof.label, lang)}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-slate-700">{L(t.rationale[profile], lang)}</p>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {FACTOR_LABELS.map((f, i) => {
                    const val = Math.round(clamp(score(t) + (t.offsets[i] || 0) * (profile === 'aviation' ? 1 : profile === 'energy' ? -1.4 : 0.8), 20, 99));
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-600">{L(f, lang)}</span>
                          <span className="font-semibold tabular-nums text-slate-800">{val}</span>
                        </div>
                        <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                          <div className={cx('h-1.5 rounded-full transition-all duration-700', matchTone(val).bar)} style={{ width: `${val}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-slate-200 bg-slate-200">
                {[
                  [tx('Estimated budget', 'Estimation'), fmtGBP(t.valueGBP, lang), fmtMADm(t.valueGBP, lang), Banknote],
                  [tx('Bid opening', 'Ouverture des plis'), tx(`${t.daysLeft} days left`, `${t.daysLeft} jours restants`), dateIn(t.daysLeft, lang), Calendar],
                  [tx('Procedure', 'Procédure'), L(t.procedure, lang), null, Gavel],
                  [tx('Execution', 'Délai d’exécution'), L(t.execution, lang), null, Clock],
                  [tx('Location', 'Lieu'), L(t.location, lang), null, MapPin],
                  [tx('JV recommended', 'Groupement conseillé'), null, null, Users, <JvDots key="jv" level={t.jv} />],
                ].map(([label, v, sub, Icon, node]) => (
                  <div key={label} className="bg-white p-4">
                    <dt className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      <Icon className="h-3 w-3" aria-hidden="true" />
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm font-semibold leading-snug text-slate-900">{node || v}</dd>
                    {sub && <dd className="text-xs tabular-nums text-slate-500">{sub}</dd>}
                  </div>
                ))}
              </dl>

              <TenderTimeline tender={t} />

              <section className="space-y-3">
                <Eyebrow icon={FileText}>{tx('Summary', 'Synthèse')}</Eyebrow>
                <p className="text-[15px] leading-relaxed text-slate-700">{L(t.summary, lang)}</p>
                <ul className="space-y-2 pt-1">
                  {L(t.scope, lang).map((s) => (
                    <li key={s} className="flex gap-2.5 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">
                <Eyebrow icon={ShieldCheck}>{tx('Bid bond guidance · caution provisoire', 'Caution provisoire · repères')}</Eyebrow>
                <div className="mt-3 flex flex-wrap items-baseline gap-x-3">
                  <span className="font-display text-xl font-semibold tabular-nums text-slate-900">{t.bidBondMAD ? fmtMAD(t.bidBondMAD, lang) : tx('Not stated', 'Non précisée')}</span>
                  {t.bidBondMAD > 0 && t.valueGBP > 0 && (
                    <span className="text-sm tabular-nums text-slate-600">
                      ≈ {fmtGBPint(t.bidBondMAD / FX, lang)} · {pctTxt(((t.bidBondMAD / (t.valueGBP * 1e6 * FX)) * 100).toLocaleString(loc(lang), { maximumFractionDigits: 2 }), lang)} {tx('of estimate', 'de l’estimation')}
                    </span>
                  )}
                </div>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-700">
                  {BOND_NOTES[lang].map((s) => (
                    <li key={s} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-amber-600" aria-hidden="true" />
                      {s}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3">
                <Eyebrow icon={Scale}>{tx('Moroccan procurement considerations', 'Points de vigilance – commande publique marocaine')}</Eyebrow>
                <div className="rounded-lg bg-slate-100 px-3.5 py-2.5 text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">{tx('Framework:', 'Cadre :')}</span> {L(t.framework, lang)}
                </div>
                <ul className="space-y-2.5">
                  {L(t.considerations, lang).map((c) => (
                    <li key={c} className="flex gap-2.5 text-sm leading-relaxed text-slate-700">
                      <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden="true" />
                      {c}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-3 rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-3">
                  <Eyebrow icon={Handshake}>{tx('JV rationale', 'Intérêt d’un groupement')}</Eyebrow>
                  <JvDots level={t.jv} />
                </div>
                <p className="text-sm leading-relaxed text-slate-700">{L(t.jvRationale, lang)}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {t.partners.map((pid) => {
                    const p = PARTNERS.find((x) => x.id === pid);
                    return (
                      <button key={pid} onClick={() => goPartners(t.id)} className="inline-flex items-center gap-1.5 rounded-md bg-slate-50 px-2.5 py-1.5 text-xs text-slate-700 ring-1 ring-slate-200 transition hover:bg-emerald-50 hover:ring-emerald-200">
                        <BadgeCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                        <span className="font-mono font-semibold">#{pid}</span>
                        <span className="text-slate-600">{L(SPECIALTY_LABEL[p.specialty], lang)}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:px-7">
              <button onClick={() => goPartners(t.id)} className={btnGhost}>
                <Handshake className="h-4 w-4" aria-hidden="true" /> {tx('Local partners', 'Partenaires locaux')}
              </button>
              <button onClick={() => goAdvisory(t.id)} className={btnPrimary}>
                <Briefcase className="h-4 w-4" aria-hidden="true" /> {tx('Advisory desk', 'Accompagnement')}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

/* ---------- View 2: Parser ---------- */
const FLAG_TONE = {
  high: { cls: 'border-rose-200 bg-rose-50', pill: 'bg-rose-100 text-rose-800 ring-rose-200', label: { en: 'High', fr: 'Élevé' } },
  medium: { cls: 'border-amber-200 bg-amber-50', pill: 'bg-amber-100 text-amber-900 ring-amber-200', label: { en: 'Medium', fr: 'Moyen' } },
  low: { cls: 'border-slate-200 bg-white', pill: 'bg-slate-100 text-slate-700 ring-slate-200', label: { en: 'Low', fr: 'Faible' } },
  info: { cls: 'border-sky-200 bg-sky-50', pill: 'bg-sky-100 text-sky-800 ring-sky-200', label: { en: 'Note', fr: 'Info' } },
};
const CHECK_TONE = {
  met: { icon: CheckCircle2, cls: 'text-emerald-700', label: { en: 'Met', fr: 'Conforme' } },
  action: { icon: Wrench, cls: 'text-amber-700', label: { en: 'Action', fr: 'À faire' } },
  partner: { icon: Handshake, cls: 'text-sky-700', label: { en: 'Via partner', fr: 'Via partenaire' } },
  gap: { icon: AlertTriangle, cls: 'text-rose-700', label: { en: 'Gap', fr: 'Manque' } },
};
const DECISION = {
  GO: { cls: 'bg-emerald-700 text-white', label: { en: 'GO', fr: 'GO' } },
  'GO WITH JV': { cls: 'bg-emerald-700 text-white', label: { en: 'GO WITH JV', fr: 'GO EN GROUPEMENT' } },
  'CONDITIONAL GO': { cls: 'bg-amber-500 text-slate-950', label: { en: 'CONDITIONAL GO', fr: 'GO SOUS CONDITIONS' } },
  'NO-GO': { cls: 'bg-rose-700 text-white', label: { en: 'NO-GO', fr: 'NO-GO' } },
};

function Parser({ profile, onAddTender, addedKeys, goPartners, goAdvisoryWith }) {
  const { lang, tx, client } = useLang();
  const [text, setText] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [step, setStep] = useState(0);
  const [error, setError] = useState('');
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (result && text.trim()) setResult(parseNotice(text, profile, lang, client));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, lang, client]);

  const STEPS = [
    tx('Detecting authority and procedure', 'Identification du maître d’ouvrage et de la procédure'),
    tx('Extracting budget, bond and dates', 'Extraction de l’estimation, de la caution et des dates'),
    tx('Translating object to English', 'Traduction de l’objet en anglais'),
    tx('Scoring against company profile', 'Notation selon le profil de l’entreprise'),
  ];

  function run() {
    setError('');
    if (text.trim().length < 60) {
      setError(tx('Paste a longer notice (a few sentences at least) or load the sample ONDA notice.', 'Collez un avis plus long (quelques phrases au minimum) ou chargez l’exemple ONDA.'));
      return;
    }
    setBusy(true);
    setResult(null);
    setStep(0);
    timers.current.forEach(clearTimeout);
    STEPS.forEach((_, i) => timers.current.push(setTimeout(() => setStep(i + 1), 260 * (i + 1))));
    timers.current.push(
      setTimeout(() => {
        setResult(parseNotice(text, profile, lang, client));
        setBusy(false);
      }, 260 * (STEPS.length + 1)),
    );
  }
  const loadSample = () => {
    setText(sampleNotice());
    setResult(null);
    setError('');
  };

  const added = result && addedKeys.includes(result.ref + result.titleFr);

  return (
    <div className="space-y-8">
      <PageHead eyebrow={tx('Clients · UK companies', 'Clients · entreprises britanniques')} title={tx('Tender Brief Parser & Risk Scanner', 'Analyse d’avis & détection des risques')}>
        {tx(
          `Paste a French Moroccan tender notice. The parser extracts the key terms, translates the object, flags procurement risks and scores the notice for ${client.name}. Everything runs in your browser.`,
          `Collez un avis d’appel d’offres marocain. L’outil extrait les informations clés, traduit l’objet en anglais, signale les risques et note l’avis pour ${client.name}. Tout s’exécute dans votre navigateur.`,
        )}
      </PageHead>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-3.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <FileText className="h-4 w-4 text-slate-500" aria-hidden="true" /> {tx('Notice text', 'Texte de l’avis')}
              <Pill className="bg-slate-50 text-slate-600 ring-slate-200">FR</Pill>
            </div>
            <div className="flex gap-2">
              {text && (
                <button
                  onClick={() => {
                    setText('');
                    setResult(null);
                    setError('');
                  }}
                  className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100"
                >
                  {tx('Clear', 'Effacer')}
                </button>
              )}
              <button onClick={loadSample} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-slate-50">
                <Plane className="h-3.5 w-3.5" aria-hidden="true" /> {tx('Load Sample ONDA Notice (FR)', 'Charger l’avis ONDA d’exemple')}
              </button>
            </div>
          </div>
          <label htmlFor="notice" className="sr-only">
            {tx('French tender notice', 'Avis d’appel d’offres en français')}
          </label>
          <textarea
            id="notice"
            lang="fr"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={tx('Paste the French tender notice here, or load the sample ONDA notice.', 'Collez ici l’avis d’appel d’offres, ou chargez l’exemple ONDA.')}
            className="min-h-[340px] flex-1 resize-y border-0 bg-transparent px-5 py-4 font-mono text-[13px] leading-relaxed text-slate-800 placeholder:font-sans placeholder:text-slate-500 focus:ring-0 xl:min-h-[520px]"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5">
            <span className="text-xs tabular-nums text-slate-500">
              {text.length.toLocaleString(loc(lang))} {tx('characters', 'caractères')}
            </span>
            <button onClick={run} disabled={busy} className={btnAccent}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
              {tx('Parse & Score Tender', 'Analyser et noter l’avis')}
            </button>
          </div>
          {error && (
            <div role="alert" className="mx-5 mb-5 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200">
              {error}
            </div>
          )}
        </div>

        <div className="min-w-0" aria-live="polite">
          {!result && !busy && (
            <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100" aria-hidden="true">
                <ScanText className="h-6 w-6 text-slate-500" />
              </div>
              <div className="mt-4 text-sm font-semibold text-slate-900">{tx('Your structured English brief appears here', 'La synthèse structurée apparaîtra ici')}</div>
              <p className="mt-1 max-w-sm text-sm leading-relaxed text-slate-600">
                {tx(
                  'Title, authority, budget in MAD and £, eligibility checklist, procurement red flags and a go/no-go recommendation with JV strategy.',
                  'Titre, maître d’ouvrage, budget en MAD et en £, conditions d’éligibilité, points de vigilance et recommandation go/no-go avec stratégie de groupement.',
                )}
              </p>
              <button onClick={loadSample} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:underline">
                {tx('Start with the sample ONDA notice', 'Commencer avec l’exemple ONDA')} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {busy && (
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="text-sm font-semibold text-slate-900">{tx('Analysing notice…', 'Analyse en cours…')}</div>
              <ul className="mt-5 space-y-3.5">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-3 text-sm">
                    {step > i ? <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden="true" /> : step === i ? <Loader2 className="h-4 w-4 animate-spin text-slate-500" aria-hidden="true" /> : <Circle className="h-4 w-4 text-slate-300" aria-hidden="true" />}
                    <span className={step >= i ? 'text-slate-800' : 'text-slate-500'}>{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {result && !busy && (
            <div className="space-y-5 animate-fadein">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                <div className="bg-[#0F172A] px-6 py-5 text-white">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded bg-white/10 px-1.5 py-0.5 font-semibold">{authLabel(result.authority, lang)}</span>
                    <span className="font-mono text-slate-300">{result.ref}</span>
                    <span className="text-slate-300">· {result.procedure}</span>
                  </div>
                  <div className="mt-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-emerald-400">{tx('Translated title', 'Titre traduit (EN)')}</div>
                  <h2 className="mt-1 font-display text-lg font-semibold leading-snug text-balance" lang="en">
                    {result.title}
                  </h2>
                  <p className="mt-1.5 text-xs italic text-slate-300" lang="fr">
                    FR : {result.titleFr}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-px bg-slate-200 sm:grid-cols-4">
                  {[
                    [tx('Authority', 'Maître d’ouvrage'), result.authorityFull, null],
                    [tx('Estimated budget', 'Estimation'), result.budgetGBP ? fmtGBP(result.budgetGBP, lang) : tx('Not stated', 'Non précisée'), result.budgetMAD ? `${fmtMAD(result.budgetMAD, lang)}${result.ttc ? tx(' incl. VAT', ' TTC') : ''}` : null],
                    [tx('Bid bond', 'Caution provisoire'), result.bondMAD ? fmtMAD(result.bondMAD, lang) : tx('Not stated', 'Non précisée'), result.bondMAD ? `≈ ${fmtGBPint(result.bondMAD / FX, lang)}` : null],
                    [
                      tx('Bid opening', 'Ouverture des plis'),
                      result.openingDate ? fmtDate(result.openingDate, lang) : tx('Not stated', 'Non précisée'),
                      result.daysLeft != null ? (result.daysLeft >= 0 ? tx(`${result.daysLeft} days left`, `${result.daysLeft} jours restants`) : tx('Passed', 'Dépassée')) : null,
                    ],
                  ].map(([l, v, s]) => (
                    <div key={l} className="min-w-0 bg-white p-4">
                      <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{l}</dt>
                      <dd className="mt-1 text-sm font-semibold leading-snug text-slate-900">{v}</dd>
                      {s && <dd className="text-xs tabular-nums text-slate-600">{s}</dd>}
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-x-6 gap-y-1 border-t border-slate-100 px-6 py-3 text-sm text-slate-600">
                  <span>
                    <span className="font-medium text-slate-800">{tx('Sector:', 'Secteur :')}</span> {sectorLabel(result.sector, lang)}
                    {result.secondary && ` + ${sectorLabel(result.secondary, lang)}`}
                  </span>
                  <span>
                    <span className="font-medium text-slate-800">{tx('Execution:', 'Exécution :')}</span> {result.execution}
                  </span>
                  {result.visitDate && (
                    <span>
                      <span className="font-medium text-slate-800">{tx('Site visit:', 'Visite des lieux :')}</span> {fmtDate(result.visitDate, lang, { day: 'numeric', month: 'short' })}
                    </span>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <div className="flex flex-wrap items-center gap-4">
                  <ScoreRing score={result.match} size={64} stroke={6} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
                      {tx('Recommendation', 'Recommandation')} · {L(PROFILES.find((p) => p.id === profile).label, lang)}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-2">
                      <span className={cx('rounded-md px-2.5 py-1 text-sm font-bold tracking-wide', DECISION[result.decision].cls)}>{L(DECISION[result.decision].label, lang)}</span>
                      <span className="text-sm text-slate-600">
                        {tx('Bid readiness', 'Maturité de l’offre')} <span className="font-semibold tabular-nums text-slate-900">{result.readiness}/100</span>
                      </span>
                      <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                        {tx('JV need', 'Besoin de groupement')} <JvDots level={result.jvLevel} />
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-slate-700 ring-1 ring-slate-200">
                  <Eyebrow icon={Handshake} className="mb-1.5">
                    {tx('JV strategy', 'Stratégie de groupement')}
                  </Eyebrow>
                  {result.strategy}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    disabled={added}
                    onClick={() => onAddTender(text)}
                    className={cx('inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-semibold transition', added ? 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200' : 'bg-slate-900 text-white hover:bg-slate-800')}
                  >
                    {added ? <Check className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                    {added ? tx('Added to Tender Hub', 'Ajouté à la veille') : tx('Add to Tender Hub', 'Ajouter à la veille')}
                  </button>
                  <button onClick={() => goPartners(null, result.partners)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    <Handshake className="h-4 w-4" aria-hidden="true" /> {tx('Suggested partners', 'Partenaires suggérés')}
                  </button>
                  <button onClick={() => goAdvisoryWith(text, result)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50">
                    <Briefcase className="h-4 w-4" aria-hidden="true" /> {tx('Request Go/No-Go audit', 'Demander un audit Go/No-Go')}
                  </button>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <Eyebrow icon={ListChecks}>{tx('Eligibility & certification', 'Éligibilité & certifications')}</Eyebrow>
                  <ul className="mt-4 space-y-3">
                    {result.checklist.map((c) => {
                      const tone = CHECK_TONE[c.status];
                      return (
                        <li key={c.label} className="flex gap-2.5">
                          <tone.icon className={cx('mt-0.5 h-4 w-4 shrink-0', tone.cls)} aria-hidden="true" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 text-sm font-medium text-slate-900">
                              {c.label}
                              <span className={cx('text-[11px] font-semibold uppercase tracking-wider', tone.cls)}>{L(tone.label, lang)}</span>
                            </div>
                            <div className="text-sm text-slate-600">{c.note}</div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <Eyebrow icon={AlertTriangle}>{tx('Procurement red flags', 'Points de vigilance')}</Eyebrow>
                    <span className="text-xs tabular-nums text-slate-500">
                      {result.flags.length} {tx('found', 'détectés')}
                    </span>
                  </div>
                  <ul className="mt-4 space-y-2.5">
                    {result.flags.map((f) => {
                      const tone = FLAG_TONE[f.level];
                      return (
                        <li key={f.title} className={cx('rounded-lg border p-3', tone.cls)}>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-sm font-semibold text-slate-900">{f.title}</span>
                            <Pill className={tone.pill}>{L(tone.label, lang)}</Pill>
                          </div>
                          <p className="mt-1 text-[13px] leading-relaxed text-slate-700">{f.text}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <p className="text-xs leading-relaxed text-slate-500">
                {tx(
                  'Rule-based demo parser: keyword, pattern and budget extraction on the pasted text, scored against the active company profile. Always verify against the full bid rules (règlement de consultation) and special conditions (CPS).',
                  'Analyseur de démonstration à base de règles : extraction de mots-clés, de motifs et de montants, notée selon le profil actif. Toujours vérifier le règlement de consultation et le CPS complets.',
                )}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- View 3: Partners ---------- */
const SPEC_COLOR = {
  'Civil & Airport Works': 'bg-sky-50 text-sky-700 ring-sky-200',
  'PMO & Advisory': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Electromechanical & MEP': 'bg-amber-50 text-amber-800 ring-amber-200',
  'IT, Telecoms & Cyber': 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200',
  'Legal & JV Structuring': 'bg-teal-50 text-teal-700 ring-teal-200',
};
const OBJECTIVES = [
  { en: 'JV / groupement partner for a live bid', fr: 'Partenaire de groupement pour une offre en cours' },
  { en: 'Subcontracting for installation and local labour', fr: 'Sous-traitance pour l’installation et la main-d’œuvre locale' },
  { en: 'Long-term teaming for the World Cup 2030 pipeline', fr: 'Alliance durable pour les projets Coupe du Monde 2030' },
  { en: 'Legal and structuring advice', fr: 'Conseil juridique et structuration' },
];
const FORMATS = [
  { en: 'Video call', fr: 'Visioconférence' },
  { en: 'In person · Casablanca', fr: 'Sur place · Casablanca' },
  { en: 'In person · London', fr: 'Sur place · Londres' },
];

function IntroModal({ partner, tenders, defaultTenderId, onClose, onSubmit, existing }) {
  const { lang, tx } = useLang();
  const [tenderId, setTenderId] = useState(existing ? existing.tenderId : defaultTenderId || '');
  const [objective, setObjective] = useState(0);
  const [format, setFormat] = useState(0);
  const [message, setMessage] = useState('');
  const [state, setState] = useState(existing ? 'done' : 'form');
  const [ref, setRef] = useState(existing ? existing.ref : '');
  const focusRef = useRef(null);
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', k);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  useEffect(() => {
    focusRef.current?.focus();
  }, [state]);
  const tender = tenders.find((t) => t.id === tenderId);

  function submit(e) {
    e.preventDefault();
    setState('sending');
    setTimeout(() => {
      setRef(onSubmit({ partnerId: partner.id, tenderId, objective, format, message }));
      setState('done');
    }, 900);
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-labelledby="intro-title">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-[2px] animate-fadein" onClick={onClose} />
      <div className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white shadow-2xl animate-rise sm:rounded-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
          <div>
            <div id="intro-title" className="text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-500">
              {tx('Warm introduction request', 'Demande de mise en relation')}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">#{partner.id}</span>
              <span className="text-sm text-slate-700">{L(partner.name, lang)}</span>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100" aria-label={tx('Close', 'Fermer')}>
            <X className="h-5 w-5" />
          </button>
        </div>

        {state !== 'done' ? (
          <form onSubmit={submit} className="space-y-5 px-6 py-6">
            <div>
              <label htmlFor="intro-tender" className="text-sm font-semibold text-slate-800">
                {tx('Linked tender', 'Appel d’offres concerné')}
              </label>
              <select ref={focusRef} id="intro-tender" value={tenderId} onChange={(e) => setTenderId(e.target.value)} className={cx(inputCls, 'mt-1.5')}>
                <option value="">{tx('General introduction (no specific tender)', 'Mise en relation générale (sans marché précis)')}</option>
                {tenders.map((t) => (
                  <option key={t.id} value={t.id}>
                    {authLabel(t.authority, lang)} · {L(t.title, lang)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="intro-objective" className="text-sm font-semibold text-slate-800">
                {tx('Objective', 'Objectif')}
              </label>
              <select id="intro-objective" value={objective} onChange={(e) => setObjective(+e.target.value)} className={cx(inputCls, 'mt-1.5')}>
                {OBJECTIVES.map((o, i) => (
                  <option key={i} value={i}>
                    {L(o, lang)}
                  </option>
                ))}
              </select>
            </div>
            <fieldset>
              <legend className="text-sm font-semibold text-slate-800">{tx('Preferred first meeting', 'Premier échange souhaité')}</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
                {FORMATS.map((f, i) => (
                  <label
                    key={i}
                    className={cx(
                      'cursor-pointer rounded-lg border px-2 py-2.5 text-center text-xs font-medium transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600',
                      format === i ? 'border-emerald-600 bg-emerald-50 text-emerald-900' : 'border-slate-200 text-slate-700 hover:border-slate-300',
                    )}
                  >
                    <input type="radio" name="format" className="sr-only" checked={format === i} onChange={() => setFormat(i)} />
                    {L(f, lang)}
                  </label>
                ))}
              </div>
            </fieldset>
            <div>
              <label htmlFor="intro-msg" className="text-sm font-semibold text-slate-800">
                {tx('Note for the partnerships team', 'Message pour l’équipe partenariats')} <span className="font-normal text-slate-500">({tx('optional', 'facultatif')})</span>
              </label>
              <textarea
                id="intro-msg"
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={tx('e.g. We would lead baggage systems and need a classified civil works partner.', 'ex. : nous pilotons les systèmes bagages et cherchons un partenaire génie civil classé.')}
                className={cx(inputCls, 'mt-1.5')}
              />
            </div>
            <div className="flex items-start gap-2.5 rounded-lg bg-slate-50 p-3.5 text-sm leading-relaxed text-slate-700">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              {tx('The partner’s identity is disclosed only after they accept. Both sides sign a mutual NDA before documents are shared.', 'L’identité du partenaire n’est communiquée qu’après son accord. Les deux parties signent un accord de confidentialité avant tout échange de documents.')}
            </div>
            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {tx('Cancel', 'Annuler')}
              </button>
              <button type="submit" disabled={state === 'sending'} className={btnAccent}>
                {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {state === 'sending' ? tx('Sending…', 'Envoi…') : tx('Send introduction request', 'Envoyer la demande')}
              </button>
            </div>
          </form>
        ) : (
          <div className="px-6 py-7" role="status">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 animate-pop" aria-hidden="true">
                <Check className="h-6 w-6 text-emerald-700" />
              </div>
              <div className="mt-3 font-display text-lg font-semibold text-slate-900">{tx('Introduction requested', 'Mise en relation demandée')}</div>
              <div className="mt-1 text-sm text-slate-600">
                {tx('Reference', 'Référence')} <span className="font-mono font-semibold text-slate-900">{ref}</span>
                {tender && <> · {authLabel(tender.authority, lang)}</>}
              </div>
            </div>
            <ol className="mt-7">
              {[
                [tx('Request logged', 'Demande enregistrée'), tx('Received by the AtlasBid partnerships desk', 'Reçue par l’équipe partenariats AtlasBid'), 'done'],
                [tx('Leadership review', 'Revue par la direction'), tx('Fit check by our Moroccan procurement lead within 24 hours', 'Vérification par notre responsable marchés publics sous 24 heures'), 'current'],
                [tx(`Partner #${partner.id} consent`, `Accord du partenaire #${partner.id}`), tx('Anonymised brief shared; partner confirms interest', 'Fiche anonymisée transmise ; le partenaire confirme son intérêt'), 'next'],
                [tx('Introduction call', 'Premier échange'), tx('Diary invitation sent to both parties', 'Invitation envoyée aux deux parties'), 'next'],
              ].map(([title, sub, st], i, arr) => (
                <li key={title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className={cx('flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold', st === 'done' ? 'bg-emerald-600 text-white' : st === 'current' ? 'bg-amber-100 text-amber-900 ring-2 ring-amber-300' : 'bg-slate-100 text-slate-500')}>
                      {st === 'done' ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : i + 1}
                    </span>
                    {i < arr.length - 1 && <span className="my-1 w-px flex-1 bg-slate-200" aria-hidden="true" />}
                  </div>
                  <div className="pb-4">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="text-sm text-slate-600">{sub}</div>
                  </div>
                </li>
              ))}
            </ol>
            <button ref={focusRef} onClick={onClose} className={cx(btnPrimary, 'mt-2 w-full')}>
              {tx('Done', 'Terminé')}
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

function Partners({ tenders, contextTenderId, highlightIds, clearContext, intros, onIntro, openTender }) {
  const { lang, tx } = useLang();
  const [spec, setSpec] = useState('All');
  const [modal, setModal] = useState(null);
  const ctxTender = tenders.find((t) => t.id === contextTenderId);
  const recommended = ctxTender ? ctxTender.partners : highlightIds || [];
  const list = PARTNERS.filter((p) => spec === 'All' || p.specialty === spec).sort((a, b) => (recommended.includes(b.id) ? 1 : 0) - (recommended.includes(a.id) ? 1 : 0));

  return (
    <div className="space-y-8">
      <PageHead eyebrow={tx('Moroccan partners', 'Partenaires marocains')} title={tx('Vetted Moroccan Partners', 'Partenaires marocains vérifiés')}>
        {tx('Anonymised profiles of pre-vetted local firms. Identities are disclosed after mutual consent.', 'Profils anonymisés d’entreprises locales vérifiées. Les identités sont communiquées après accord mutuel.')}
      </PageHead>

      <div className="relative overflow-hidden rounded-2xl bg-[#0F172A] p-6 text-white sm:p-8">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-500/10" aria-hidden="true" />
        <div className="absolute -bottom-16 right-28 h-40 w-40 rounded-full bg-amber-400/10" aria-hidden="true" />
        <div className="relative grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <Eyebrow icon={Award} className="text-emerald-400">
              {tx('Vetted by senior Moroccan leadership', 'Vérifiés par une direction marocaine expérimentée')}
            </Eyebrow>
            <p className="mt-3 text-base leading-relaxed text-slate-200">
              {lang === 'fr' ? (
                <>
                  Chaque partenaire est examiné par notre responsable marocain infrastructures et marchés publics, fort de <span className="font-semibold text-white">plus de 22 ans</span> d’expérience entre les achats d’une autorité aéroportuaire et le pilotage de grands programmes d’infrastructure (PMO).
                </>
              ) : (
                <>
                  Every partner is reviewed by our Moroccan infrastructure and procurement lead, with <span className="font-semibold text-white">22+ years</span> across airport authority procurement and major infrastructure PMO delivery.
                </>
              )}
            </p>
          </div>
          <ul className="grid gap-2.5 text-sm text-slate-300">
            {[
              [tx('Legal & financial standing', 'Solidité juridique et financière'), tx('Registry, tax and social-security status checked', 'Registre, situation fiscale et sociale vérifiés')],
              [tx('Delivery references', 'Références'), tx('Verified with contracting authorities', 'Vérifiées auprès des maîtres d’ouvrage')],
              [tx('Compliance screening', 'Conformité'), tx('Anti-bribery checks aligned with the UK Bribery Act 2010', 'Contrôles anticorruption alignés sur le UK Bribery Act 2010')],
            ].map(([a, b]) => (
              <li key={a} className="flex gap-2">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>
                  <span className="font-medium text-white">{a}.</span> {b}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {(ctxTender || (highlightIds && highlightIds.length > 0)) && (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-sm">
          <Target className="h-4 w-4 text-emerald-700" aria-hidden="true" />
          <span className="min-w-0 flex-1 text-emerald-900">
            {ctxTender ? (
              <>
                {tx('Recommended partners for', 'Partenaires recommandés pour')}{' '}
                <button onClick={() => openTender(ctxTender.id)} className="font-semibold underline-offset-2 hover:underline">
                  {authLabel(ctxTender.authority, lang)} · {L(ctxTender.title, lang)}
                </button>
              </>
            ) : (
              tx('Partners suggested for the parsed notice', 'Partenaires suggérés pour l’avis analysé')
            )}
          </span>
          <button onClick={clearContext} className="text-xs font-semibold text-emerald-800 hover:underline">
            {tx('Clear', 'Effacer')}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2" role="group" aria-label={tx('Filter by specialty', 'Filtrer par spécialité')}>
        {SPECIALTIES.map((s) => (
          <button
            key={s}
            onClick={() => setSpec(s)}
            aria-pressed={spec === s}
            className={cx('rounded-full px-3.5 py-1.5 text-xs font-semibold ring-1 transition', spec === s ? 'bg-slate-900 text-white ring-slate-900' : 'bg-white text-slate-700 ring-slate-200 hover:ring-slate-400')}
          >
            {s === 'All' ? tx('All specialties', 'Toutes les spécialités') : L(SPECIALTY_LABEL[s], lang)}
          </button>
        ))}
      </div>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((p) => {
          const rec = recommended.includes(p.id);
          const intro = intros.find((i) => i.partnerId === p.id);
          return (
            <article key={p.id} className={cx('flex flex-col rounded-2xl border bg-white p-6 transition duration-300', rec ? 'border-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.08)]' : 'border-slate-200')}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-slate-900">#{p.id}</span>
                    <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {L(p.city, lang)}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-[15px] font-semibold leading-snug text-slate-900">{L(p.name, lang)}</h3>
                  <Pill className={cx('mt-2', SPEC_COLOR[p.specialty])}>{L(SPECIALTY_LABEL[p.specialty], lang)}</Pill>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <Pill className="bg-emerald-50 text-emerald-800 ring-emerald-200">
                    <BadgeCheck className="h-3 w-3" aria-hidden="true" /> {tx('Vetted', 'Vérifié')}
                  </Pill>
                  {rec && <Pill className="bg-amber-50 text-amber-800 ring-amber-200">{tx('Recommended', 'Recommandé')}</Pill>}
                </div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{L(p.track, lang)}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.certs.map((c) => (
                  <Pill key={L(c, 'en')} className="bg-slate-50 text-slate-700 ring-slate-200">
                    <ShieldCheck className="h-3 w-3 text-slate-500" aria-hidden="true" />
                    {L(c, lang)}
                  </Pill>
                ))}
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-2 border-t border-slate-100 pt-4 text-xs">
                <div>
                  <dt className="text-slate-500">{tx('Established', 'Ancienneté')}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{tx(`${p.years} yrs`, `${p.years} ans`)}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{tx('Staff', 'Effectif')}</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">{p.staff}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">{tx('Turnover', 'Chiffre d’affaires')}</dt>
                  <dd className="font-semibold text-slate-900">{L(p.turnover, lang)}</dd>
                </div>
              </dl>
              <ul className="mt-4 space-y-1.5">
                {L(p.strengths, lang).map((s) => (
                  <li key={s} className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-5">
                <div className="mb-2.5 text-xs text-slate-500">
                  {tx('Last vetted', 'Dernière vérification')} {L(p.vetted, lang)} · {L(SPECIALTY_LABEL[p.specialty], lang)}
                </div>
                {intro ? (
                  <button onClick={() => setModal({ partner: p, existing: intro })} className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
                    <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> {tx('Introduction requested', 'Mise en relation demandée')} · {intro.ref}
                  </button>
                ) : (
                  <button onClick={() => setModal({ partner: p })} className={cx(btnPrimary, 'w-full')}>
                    <Handshake className="h-4 w-4" aria-hidden="true" /> {tx('Request Warm Introduction', 'Demander une mise en relation')}
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {modal && <IntroModal partner={modal.partner} existing={modal.existing} tenders={tenders} defaultTenderId={contextTenderId || ''} onClose={() => setModal(null)} onSubmit={onIntro} />}
    </div>
  );
}

/* ---------- View 4: Advisory ---------- */
const STATUS = {
  received: { cls: 'bg-sky-50 text-sky-800 ring-sky-200', label: { en: 'Received', fr: 'Reçue' } },
  assigned: { cls: 'bg-amber-50 text-amber-800 ring-amber-200', label: { en: 'Advisor assigned', fr: 'Conseiller désigné' } },
  progress: { cls: 'bg-amber-50 text-amber-800 ring-amber-200', label: { en: 'In progress', fr: 'En cours' } },
  done: { cls: 'bg-emerald-50 text-emerald-800 ring-emerald-200', label: { en: 'Completed', fr: 'Terminée' } },
};
const TIMINGS = [
  { en: 'Within 1 week', fr: 'Sous 1 semaine' },
  { en: 'Within 2 weeks', fr: 'Sous 2 semaines' },
  { en: 'Before bid deadline', fr: 'Avant la date limite' },
  { en: 'No fixed date', fr: 'Sans date précise' },
];

function Advisory({ tenders, prefillTenderId, prefillService, prefillNotes, checks, setChecks, requests, onSubmit, openTender }) {
  const { lang, tx } = useLang();
  const [ckTender, setCkTender] = useState(prefillTenderId || 't1');
  const [service, setService] = useState(prefillService || 'gonogo');
  const [linked, setLinked] = useState(prefillTenderId || '');
  const [notes, setNotes] = useState(prefillNotes || '');
  const [timing, setTiming] = useState(0);
  const [sending, setSending] = useState(false);

  const state = checks[ckTender] || {};
  const allItems = CHECKLIST.flatMap((s) => s.items);
  const done = allItems.filter((i) => state[i.id]).length;
  const pct = Math.round((done / allItems.length) * 100);
  const ckT = tenders.find((t) => t.id === ckTender);
  const toggle = (id) => setChecks((c) => ({ ...c, [ckTender]: { ...(c[ckTender] || {}), [id]: !(c[ckTender] || {})[id] } }));

  function submit(e) {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      onSubmit({ serviceId: service, tenderId: linked, notes, timing });
      setNotes('');
      setSending(false);
    }, 700);
  }
  const svc = SERVICES.find((s) => s.id === service);
  const readyTone =
    pct >= 80
      ? ['bg-emerald-50 text-emerald-800 ring-emerald-200', 'bg-emerald-500', tx('Ready to submit', 'Prêt à déposer')]
      : pct >= 40
        ? ['bg-amber-50 text-amber-800 ring-amber-200', 'bg-amber-500', tx('In preparation', 'En préparation')]
        : ['bg-rose-50 text-rose-800 ring-rose-200', 'bg-rose-500', tx('Early stage', 'Démarrage')];

  return (
    <div className="space-y-8">
      <PageHead eyebrow={tx('Clients · UK companies', 'Clients · entreprises britanniques')} title={tx('Advisory & Bid Support Desk', 'Accompagnement & appui aux offres')}>
        {tx('Track bid readiness per tender and request support from AtlasBid’s UK–Morocco advisory team.', 'Suivez la préparation de chaque offre et sollicitez l’équipe de conseil Royaume-Uni–Maroc d’AtlasBid.')}
      </PageHead>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <section className="min-w-0 rounded-xl border border-slate-200 bg-white" aria-labelledby="ck-title">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="ck-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                <ListChecks className="h-4 w-4 text-slate-500" aria-hidden="true" /> {tx('Bid readiness checklist', 'Check-list de préparation de l’offre')}
              </h2>
              <label className="flex min-w-0 items-center gap-2 text-xs text-slate-600">
                <span className="shrink-0">{tx('Tender', 'Marché')}</span>
                <select id="ck-tender" value={ckTender} onChange={(e) => setCkTender(e.target.value)} className="min-w-0 max-w-[260px] truncate rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs font-medium text-slate-800">
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>
                      {authLabel(t.authority, lang)} · {L(t.title, lang)}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <div key={pct} className="font-display text-3xl font-semibold tabular-nums text-slate-900 animate-pop">{pctTxt(pct, lang)}</div>
                <div className="text-sm text-slate-600">
                  {tx(`${done} of ${allItems.length} items complete`, `${done} éléments sur ${allItems.length}`)}
                  {ckT ? tx(` · bid opens in ${ckT.daysLeft} days`, ` · ouverture des plis dans ${ckT.daysLeft} jours`) : ''}
                </div>
              </div>
              <Pill className={readyTone[0]}>{readyTone[2]}</Pill>
            </div>
            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={tx('Bid readiness', 'Préparation de l’offre')}>
              <div className={cx('h-full rounded-full transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)]', readyTone[1])} style={{ width: `${pct}%` }} />
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {CHECKLIST.map((sec) => {
              const n = sec.items.filter((i) => state[i.id]).length;
              return (
                <div key={sec.id} className="p-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">{L(sec.label, lang)}</h3>
                    <span className={cx('text-xs font-semibold tabular-nums', n === sec.items.length ? 'text-emerald-700' : 'text-slate-500')}>
                      {n}/{sec.items.length}
                    </span>
                  </div>
                  <ul className="mt-2 grid gap-0.5">
                    {sec.items.map((it) => {
                      const on = !!state[it.id];
                      return (
                        <li key={it.id}>
                          <button onClick={() => toggle(it.id)} role="checkbox" aria-checked={on} className="flex w-full items-start gap-3 rounded-md px-2 py-2 text-left text-sm transition hover:bg-slate-50">
                            <span className={cx('mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition', on ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-slate-400 bg-white')} aria-hidden="true">
                              {on && <Check className="h-3 w-3" strokeWidth={3} />}
                            </span>
                            <span className={cx('transition-colors', on ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800')}>{L(it.label, lang)}</span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>

        <div className="min-w-0 space-y-6">
          <form onSubmit={submit} className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="adv-title">
            <h2 id="adv-title" className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Briefcase className="h-4 w-4 text-slate-500" aria-hidden="true" /> {tx('Request advisory engagement', 'Demander un accompagnement')}
            </h2>
            <fieldset className="mt-5">
              <legend className="text-sm font-semibold text-slate-800">{tx('Service', 'Prestation')}</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {SERVICES.map((s) => (
                  <label
                    key={s.id}
                    className={cx('cursor-pointer rounded-lg border p-3 text-xs transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-emerald-600', service === s.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-slate-300')}
                  >
                    <input type="radio" name="service" className="sr-only" checked={service === s.id} onChange={() => setService(s.id)} />
                    <div className={cx('text-sm font-semibold', service === s.id ? 'text-emerald-900' : 'text-slate-900')}>{L(s.label, lang)}</div>
                    <div className="mt-0.5 text-slate-600">{L(s.sla, lang)}</div>
                  </label>
                ))}
              </div>
            </fieldset>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label htmlFor="adv-tender" className="text-sm font-semibold text-slate-800">
                  {tx('Linked tender', 'Marché concerné')} <span className="font-normal text-slate-500">({tx('optional', 'facultatif')})</span>
                </label>
                <select id="adv-tender" value={linked} onChange={(e) => setLinked(e.target.value)} className={cx(inputCls, 'mt-1.5')}>
                  <option value="">{tx('No specific tender', 'Aucun marché précis')}</option>
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>
                      {authLabel(t.authority, lang)} · {L(t.title, lang)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="adv-timing" className="text-sm font-semibold text-slate-800">
                  {tx('Needed by', 'Échéance souhaitée')}
                </label>
                <select id="adv-timing" value={timing} onChange={(e) => setTiming(+e.target.value)} className={cx(inputCls, 'mt-1.5')}>
                  {TIMINGS.map((t, i) => (
                    <option key={i} value={i}>
                      {L(t, lang)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="adv-notes" className="text-sm font-semibold text-slate-800">
                {tx('Notes', 'Précisions')}
              </label>
              <textarea id="adv-notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={tx('Scope, questions or constraints for the advisory team', 'Périmètre, questions ou contraintes pour l’équipe de conseil')} className={cx(inputCls, 'mt-1.5')} />
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-slate-600">{svc && tx(`Typical turnaround: ${L(svc.sla, 'en')}`, `Délai habituel : ${L(svc.sla, 'fr')}`)}</span>
              <button type="submit" disabled={sending} className={btnAccent}>
                {sending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Send className="h-4 w-4" aria-hidden="true" />}
                {tx('Submit request', 'Envoyer la demande')}
              </button>
            </div>
          </form>

          <section className="rounded-xl border border-slate-200 bg-white" aria-labelledby="queue-title">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 id="queue-title" className="text-sm font-semibold text-slate-900">
                {tx('Request queue', 'Suivi des demandes')}
              </h2>
              <span className="text-xs tabular-nums text-slate-500">
                {requests.length} {tx('requests', 'demandes')}
              </span>
            </div>
            <ul className="divide-y divide-slate-100" aria-live="polite">
              {requests.map((r) => {
                const t = tenders.find((x) => x.id === r.tenderId);
                const st = STATUS[r.status];
                return (
                  <li key={r.ref} className={cx('px-5 py-4 sm:px-6', r.fresh && 'animate-highlight')}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-semibold text-slate-500">{r.ref}</span>
                          <span className="text-sm font-semibold text-slate-900">{L(SERVICES.find((s) => s.id === r.serviceId).label, lang)}</span>
                        </div>
                        {t && (
                          <button onClick={() => openTender(t.id)} className="mt-0.5 block max-w-full truncate text-left text-sm text-emerald-700 hover:underline">
                            {authLabel(t.authority, lang)} · {L(t.title, lang)}
                          </button>
                        )}
                        {L(r.notes, lang) && <p className="mt-1 text-sm leading-relaxed text-slate-600">{L(r.notes, lang)}</p>}
                        <div className="mt-1 text-xs text-slate-500">
                          {r.submitted === 0 ? tx('Submitted just now', 'Envoyée à l’instant') : tx(`Submitted ${dateIn(r.submitted, 'en')}`, `Envoyée le ${dateIn(r.submitted, 'fr')}`)}
                          {r.timing != null && ` · ${L(TIMINGS[r.timing], lang).toLowerCase()}`}
                        </div>
                      </div>
                      <Pill className={st.cls}>
                        {r.status === 'received' && <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />}
                        {L(st.label, lang)}
                      </Pill>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}

/* ---------- App ---------- */
const readLang = () => {
  try {
    return localStorage.getItem('atlasbid-lang') === 'fr' ? 'fr' : 'en';
  } catch {
    return 'en';
  }
};

export default function App() {
  const [lang, setLang] = useState(readLang);
  const [view, setView] = useState('overview');
  const [profile, setProfileRaw] = useState('aviation');
  const [tenders, setTenders] = useState(TENDERS);
  const [drawerId, setDrawerId] = useState(null);
  const [partnerCtx, setPartnerCtx] = useState({ tenderId: null, ids: null });
  const [advPrefill, setAdvPrefill] = useState({ tenderId: null, service: null, notes: null, nonce: 0 });
  const [clientId, setClientId] = useState('britinfra');
  const client = CLIENTS.find((c) => c.id === clientId);
  const [clientState, setClientState] = useState(() => Object.fromEntries(CLIENTS.map((c) => [c.id, { checks: CLIENT_INITIAL[c.id].checks, requests: CLIENT_INITIAL[c.id].requests, intros: [] }])));
  const upd = (cid, key, fn) => setClientState((cs) => ({ ...cs, [cid]: { ...cs[cid], [key]: typeof fn === 'function' ? fn(cs[cid][key]) : fn } }));
  const { checks, requests, intros } = clientState[clientId];
  const setChecks = (fn) => upd(clientId, 'checks', fn);
  const setRequests = (fn) => upd(clientId, 'requests', fn);
  const setIntros = (fn) => upd(clientId, 'intros', fn);
  const [toasts, setToasts] = useState([]);
  const [recalcFlash, setRecalcFlash] = useState(false);
  const [addedKeys, setAddedKeys] = useState([]);
  const counter = useRef({ req: 1043, intro: 210, tender: 0 });
  const flashT = useRef(null);
  const tx = (en, fr) => (lang === 'fr' ? fr : en);
  const score = useCallback(
    (t, prof = profile) => (t.clientBiased ? t.scores[prof] : clamp(t.scores[prof] + (client.bias[t.sector] || 0), 25, 99)),
    [profile, client],
  );

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem('atlasbid-lang', lang);
    } catch {
      /* storage unavailable */
    }
  }, [lang]);

  const toast = (title, body) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t.slice(-2), { id, title, body }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3600);
  };

  const setProfile = (p) => {
    if (p === profile) return;
    setProfileRaw(p);
    setRecalcFlash(true);
    clearTimeout(flashT.current);
    flashT.current = setTimeout(() => setRecalcFlash(false), 2400);
    toast(tx('Match scores recalculated', 'Scores recalculés'), L(PROFILES.find((x) => x.id === p).label, lang));
  };

  const switchClient = (id) => {
    if (id === clientId) return;
    const c = CLIENTS.find((x) => x.id === id);
    setClientId(id);
    setProfileRaw(c.profile);
    setPartnerCtx({ tenderId: null, ids: null });
    setAdvPrefill((p) => ({ tenderId: null, service: null, notes: null, nonce: p.nonce + 1 }));
    toast(tx(`Signed in as ${c.user.name}`, `Connecté en tant que ${c.user.name}`), `${c.name} · ${L(PROFILES.find((x) => x.id === c.profile).label, lang)}`);
  };

  const go = (v) => {
    setView(v);
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() => document.getElementById('main')?.focus({ preventScroll: true }));
  };

  const drawerTender = tenders.find((t) => t.id === drawerId) || null;

  const goPartners = (tenderId, ids = null) => {
    setPartnerCtx({ tenderId, ids });
    setDrawerId(null);
    go('partners');
  };
  const goAdvisory = (tenderId) => {
    setAdvPrefill((p) => ({ tenderId, service: 'bid', notes: '', nonce: p.nonce + 1 }));
    setDrawerId(null);
    go('advisory');
  };

  const addParsed = (text) => {
    const pEn = parseNotice(text, profile, 'en', client);
    const pFr = parseNotice(text, profile, 'fr', client);
    const key = pEn.ref + pEn.titleFr;
    const existing = tenders.find((t) => t.parsedKey === key);
    if (existing) return existing.id;
    counter.current.tender += 1;
    const id = `p${counter.current.tender}`;
    const t = { ...parsedToTender(pEn, pFr, id), parsedKey: key };
    setTenders((ts) => [...ts, t]);
    setAddedKeys((r) => [...r, key]);
    toast(tx('Added to Tender Hub', 'Ajouté à la veille'), L(t.title, lang));
    return id;
  };

  const goAdvisoryWith = (text, result) => {
    const id = addParsed(text);
    const flags = result.flags
      .filter((f) => f.level === 'high' || f.level === 'medium')
      .map((f) => f.title.toLowerCase())
      .join('; ');
    setAdvPrefill((p) => ({
      tenderId: id,
      service: 'gonogo',
      notes: tx(
        `Parsed notice ${result.ref}: ${L(DECISION[result.decision].label, 'en')} (${result.match}% match). Validate: ${flags}.`,
        `Avis analysé ${result.ref} : ${L(DECISION[result.decision].label, 'fr')} (${result.match} %). À valider : ${flags}.`,
      ),
      nonce: p.nonce + 1,
    }));
    go('advisory');
  };

  const submitIntro = (data) => {
    counter.current.intro += 1;
    const ref = `INT-${counter.current.intro}`;
    setIntros((i) => [...i.filter((x) => x.partnerId !== data.partnerId), { ...data, ref }]);
    toast(tx('Introduction request sent', 'Demande de mise en relation envoyée'), `#${data.partnerId} · ${ref}`);
    return ref;
  };

  const submitRequest = (data) => {
    counter.current.req += 1;
    const ref = `ADV-${counter.current.req}`;
    const cid = clientId;
    setRequests((r) => [{ ...data, ref, status: 'received', submitted: 0, fresh: true }, ...r.map((x) => ({ ...x, fresh: false }))]);
    toast(tx('Advisory request logged', 'Demande enregistrée'), `${ref} · ${L(SERVICES.find((s) => s.id === data.serviceId).label, lang)}`);
    setTimeout(() => upd(cid, 'requests', (r) => r.map((x) => (x.ref === ref ? { ...x, status: 'assigned' } : x))), 3000);
  };

  const counts = { hub: tenders.filter((t) => score(t) >= 70).length, partners: PARTNERS.length, advisory: requests.filter((r) => r.status !== 'done').length };

  return (
    <LangCtx.Provider value={{ lang, setLang, tx, client, score }}>
      <a href="#main" className="sr-only z-[90] rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        {tx('Skip to content', 'Aller au contenu')}
      </a>
      <div className="flex min-h-screen bg-white font-sans text-slate-900 antialiased">
        <Sidebar view={view} setView={go} counts={counts} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header profile={profile} setProfile={setProfile} view={view} setView={go} clientId={clientId} setClientId={switchClient} />
          <main id="main" tabIndex={-1} className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-8 outline-none sm:px-8 lg:py-12">
            <div key={view + clientId} className="animate-viewin">
              {view === 'overview' && <Overview tenders={tenders} go={go} />}
              {view === 'company' && <CompanyProfile tenders={tenders} requests={requests} intros={intros} go={go} />}
              {view === 'hub' && <TenderHub tenders={tenders} profile={profile} onOpen={setDrawerId} recalcFlash={recalcFlash} />}
              {view === 'parser' && <Parser profile={profile} onAddTender={addParsed} addedKeys={addedKeys} goPartners={goPartners} goAdvisoryWith={goAdvisoryWith} />}
              {view === 'partners' && (
                <Partners tenders={tenders} contextTenderId={partnerCtx.tenderId} highlightIds={partnerCtx.ids} clearContext={() => setPartnerCtx({ tenderId: null, ids: null })} intros={intros} onIntro={submitIntro} openTender={setDrawerId} />
              )}
              {view === 'advisory' && (
                <Advisory
                  key={advPrefill.nonce + clientId}
                  tenders={tenders}
                  prefillTenderId={advPrefill.tenderId}
                  prefillService={advPrefill.service}
                  prefillNotes={advPrefill.notes}
                  checks={checks}
                  setChecks={setChecks}
                  requests={requests}
                  onSubmit={submitRequest}
                  openTender={setDrawerId}
                />
              )}
            </div>
          </main>
          <footer className="border-t border-slate-200 px-4 py-5 text-xs leading-relaxed text-slate-500 sm:px-8">
            {tx(
              `AtlasBid UK prototype · Tenders, values, dates and partner records are illustrative examples for demonstration. Indicative rate £1 = MAD ${FX.toFixed(2)}.`,
              `Prototype AtlasBid UK · Les marchés, montants, dates et fiches partenaires sont des exemples illustratifs. Taux indicatif 1 £ = ${FX.toFixed(2).replace('.', ',')} MAD.`,
            )}
          </footer>
        </div>
        <TenderDrawer tender={drawerTender} profile={profile} onClose={() => setDrawerId(null)} goPartners={goPartners} goAdvisory={goAdvisory} />
        <Toasts toasts={toasts} />
      </div>
    </LangCtx.Provider>
  );
}
