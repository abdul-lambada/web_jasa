import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/ServiceCard";
import { ClientCard } from "@/components/ClientCard";
import { FeatureItem } from "@/components/FeatureItem";
import { WorkflowStep } from "@/components/WorkflowStep";
import { useEffect, useMemo, useRef, useState } from "react";
import { 
  Code2, 
  Wrench, 
  Rocket, 
  Handshake, 
  Clock, 
  FileCode, 
  CheckCircle,
  MessageCircle,
  Calendar,
  Settings,
  FileCheck
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import heroImage from "@/assets/hero-coding.jpg";

const Index = () => {
  type Service = { icon: string; title: string; description: string };
  type Client = { name: string; category: string; year: number };
  type Feature = { icon: string; title: string; description: string };
  type Workflow = { step_number: number; title: string; description: string };
  type Settings = Record<string, string>;

  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [workflow, setWorkflow] = useState<Workflow[]>([]);
  const [settings, setSettings] = useState<Settings>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  // Slider state: logical index (1..N) when using virtual clones
  const [clientSlide, setClientSlide] = useState<number>(1);
  const [clientPaused, setClientPaused] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const transitioningRef = useRef<boolean>(false);
  // Hero parallax refs
  const heroBlobA = useRef<HTMLDivElement | null>(null);
  const heroBlobB = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);
  const underlineRef = useRef<HTMLSpanElement | null>(null);
  const navItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [hoverNavKey, setHoverNavKey] = useState<string | null>(null);
  const timelineItemRefs = useRef<HTMLDivElement[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [observedStep, setObservedStep] = useState<number>(0);
  const isStepHovering = useRef<boolean>(false);

  // Meet form state
  const [meetName, setMeetName] = useState<string>("");
  const [meetWA, setMeetWA] = useState<string>("");
  const [waPattern, setWaPattern] = useState<'4-4-4-3' | '3-4-4-4'>('4-4-4-3');
  const [meetService, setMeetService] = useState<string>("");
  const [meetDate, setMeetDate] = useState<string>("");
  const [meetTime, setMeetTime] = useState<string>("");
  const [meetTZ, setMeetTZ] = useState<string>(Intl.DateTimeFormat().resolvedOptions().timeZone || "");
  const [meetMsg, setMeetMsg] = useState<string>("");
  const [meetSubmitting, setMeetSubmitting] = useState<boolean>(false);
  const [meetSuccess, setMeetSuccess] = useState<string>("");
  const [meetErrors, setMeetErrors] = useState<Record<string, string>>({});
  const [promoOpen, setPromoOpen] = useState<boolean>(false);

  // Fallback workflow to ensure section always has content
  const defaultWorkflow: Workflow[] = [
    { step_number: 1, title: 'Konsultasi Kebutuhan', description: 'Diskusi singkat tentang kebutuhan dan target Anda.' },
    { step_number: 2, title: 'Penawaran & Scope', description: 'Kami kirimkan penawaran, timeline, dan ruang lingkup kerja.' },
    { step_number: 3, title: 'Eksekusi & Update', description: 'Pengerjaan dimulai dengan update rutin progres.' },
    { step_number: 4, title: 'Review & Serah Terima', description: 'Revisi sesuai masukan dan serah terima hasil akhir.' },
  ];
  const showWorkflow = useMemo(() => (workflow && workflow.length ? workflow : defaultWorkflow), [workflow]);

  // Sections + active nav state (declared early for use in effects below)
  const sections = useMemo(() => [
    "beranda",
    "layanan",
    "client",
    "keunggulan",
    "alur-kerja",
  ], []);
  const [activeSection, setActiveSection] = useState<string>("beranda");
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setActiveSection(id);
    if (window?.history?.replaceState) {
      window.history.replaceState(null, "", `#${id}`);
    }
  };

  const iconMap: Record<string, LucideIcon> = {
    Code2,
    Wrench,
    Rocket,
    Handshake,
    Clock,
    FileCode,
    CheckCircle,
    MessageCircle,
    Calendar,
  };

  // Parallax motion for hero blobs (disabled if prefers-reduced-motion)
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) return;
    const handler = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10; // -5..5
      const y = (e.clientY / innerHeight - 0.5) * 10;
      if (heroBlobA.current) heroBlobA.current.style.transform = `translate(${x}px, ${y}px)`;
      if (heroBlobB.current) heroBlobB.current.style.transform = `translate(${-x}px, ${-y}px)`;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, []);

  // Inject micro-interaction and mesh CSS once
  useEffect(() => {
    const id = 'public-enhanced-css';
    if (document.getElementById(id)) return;
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `
      .btn-anim{transition:transform .15s ease, box-shadow .2s ease}
      .btn-anim:hover{transform:translateY(-1px);box-shadow:0 6px 20px -6px rgb(0 0 0 / .15)}
      .btn-anim:active{transform:translateY(0)}
      .hover-raise{transition:transform .25s ease, box-shadow .25s ease}
      .hover-raise:hover{transform:translateY(-2px);box-shadow:0 12px 30px -12px rgb(0 0 0 / .18)}
      .mesh-bg{position:absolute;inset:0;pointer-events:none;opacity:.5;background:
        radial-gradient(40% 30% at 20% 20%, rgba(99,102,241,.35), transparent 60%),
        radial-gradient(35% 25% at 80% 30%, rgba(16,185,129,.30), transparent 60%),
        radial-gradient(25% 35% at 30% 80%, rgba(244,63,94,.25), transparent 60%)
      }
      .hero-anim{position:absolute; width:44px; height:44px; right:-14px; top:-14px}
      .hero-anim .ring{position:absolute; inset:0; border-radius:9999px; border:2px dashed rgba(99,102,241,.5); animation:spin 10s linear infinite}
      .hero-anim .dot{position:absolute; width:8px; height:8px; background:rgb(99,102,241); border-radius:9999px; left:50%; top:-4px; transform:translateX(-50%); animation:pulse 2.4s ease-in-out infinite}
      @keyframes spin{to{transform:rotate(360deg)}}
      @keyframes pulse{0%,100%{transform:translateX(-50%) scale(1)}50%{transform:translateX(-50%) scale(1.2)}}
      .marquee-track{animation:marquee 24s linear infinite}
      .marquee-track:hover{animation-play-state:paused}
      @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
      /* Subtle gradient border on hover for cards */
      .grad-border{position:relative;border-radius:16px}
      .grad-border::before{content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;background:linear-gradient(120deg,#22c55e,#6366f1);-webkit-mask:linear-gradient(#000 0 0) content-box,linear-gradient(#000 0 0);-webkit-mask-composite:xor;mask-composite:exclude;opacity:0;transition:opacity .25s ease}
      .grad-border:hover::before{opacity:1}
      /* Timeline */
      .timeline{position:relative}
      .timeline::before{content:"";position:absolute;left:20px;top:0;bottom:0;width:2px;background:linear-gradient(#e5e7eb,#c7d2fe)}
      .timeline-item{position:relative;padding-left:48px}
      .timeline-item::before{content:"";position:absolute;left:12px;top:.5rem;width:16px;height:16px;border-radius:9999px;background:#6366f1;box-shadow:0 0 0 4px rgba(99,102,241,.15)}
      .timeline-item.current{filter:drop-shadow(0 6px 24px rgba(99,102,241,.35))}
      /* Feature hover icon color */
      .feature-card:hover svg{color:#6366f1}
      /* Floating WA sticker */
      .wa-float{position:fixed;right:1rem;bottom:1rem;z-index:60;display:flex;flex-direction:column;align-items:end;gap:.5rem}
      .wa-badge{background:linear-gradient(135deg,#a5b4fc,#86efac);color:#0f172a;font-weight:700;border-radius:14px;padding:.4rem .6rem .4rem .6rem;box-shadow:0 6px 20px -6px rgba(99,102,241,.35);border:1px solid rgba(99,102,241,.25)}
      .wa-badge .waw{color:#16a34a}
      .wa-btn{position:relative;display:inline-flex;align-items:center;gap:.5rem;height:48px;padding:0 14px;border-radius:9999px;background:#22c55e;color:#fff;font-weight:600;box-shadow:0 10px 30px -6px rgba(34,197,94,.6);animation:bob 3s ease-in-out infinite}
      .wa-btn:hover{background:#16a34a}
      .wa-btn::after{content:"";position:absolute;inset:-6px;border:2px solid rgba(34,197,94,.5);border-radius:9999px;animation:pulse-ring 2.2s ease-out infinite}
      .wa-sparkle{position:absolute;width:8px;height:8px;border-radius:9999px;background:radial-gradient(circle,#fefce8,#fde68a);box-shadow:0 0 12px 4px rgba(250,204,21,.6);animation:twinkle 2.4s ease-in-out infinite}
      .wa-s1{right:-6px;top:-6px;animation-delay:.1s}
      .wa-s2{left:-8px;bottom:-4px;animation-delay:.8s}
      .wa-s3{right:20px;bottom:-10px;animation-delay:1.4s}
      @keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
      @keyframes pulse-ring{0%{opacity:.5;transform:scale(1)}100%{opacity:0;transform:scale(1.6)}}
      @keyframes twinkle{0%,100%{opacity:.2;transform:scale(.8)}50%{opacity:1;transform:scale(1.1)}}
      @media (prefers-reduced-motion: reduce){ .btn-anim, .hover-raise{transition:none} .marquee-track{animation:none} .wa-btn{animation:none} .wa-btn::after{animation:none} .wa-sparkle{animation:none} }
    `;
    document.head.appendChild(style);
  }, []);

  // Navbar shadow on scroll
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const onScroll = () => {
      if (window.scrollY > 8) el.classList.add('shadow-lg');
      else el.classList.remove('shadow-lg');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Promo modal persistence (respects hide days). Supports force-show via URL.
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const force = params.get('utm_promo') === '1' || params.get('show_promo') === '1' || params.get('promo') === '1';
      if (force) { setPromoOpen(true); return; }
      const never = localStorage.getItem('promo_never_show') === '1';
      if (never) { setPromoOpen(false); return; }
      const last = Number(localStorage.getItem('promo_last_dismissed_at') || 0);
      const hideDays = Math.max(1, Number(localStorage.getItem('promo_hide_days') || '1'));
      const ms = hideDays * 24 * 60 * 60 * 1000;
      if (!last || Date.now() - last > ms) setPromoOpen(true);
    } catch {
      setPromoOpen(true);
    }
  }, []);

  const dismissPromoForDays = (days: number) => {
    try { localStorage.setItem('promo_last_dismissed_at', String(Date.now() + (days * 24 * 60 * 60 * 1000 - (24*60*60*1000)) + (24*60*60*1000))); } catch {}
    // store now; we will compare by difference; simpler: store now and compare with window, but to honor days we'll store now and another key
    try { localStorage.setItem('promo_hide_days', String(days)); } catch {}
    setPromoOpen(false);
  };
  const dismissPromoForADay = () => { try { localStorage.setItem('promo_last_dismissed_at', String(Date.now())); localStorage.setItem('promo_hide_days','1'); } catch {} setPromoOpen(false); };
  const dismissPromoForAWeek = () => { try { localStorage.setItem('promo_last_dismissed_at', String(Date.now())); localStorage.setItem('promo_hide_days','7'); } catch {} setPromoOpen(false); };
  const dismissPromoForever = () => { try { localStorage.setItem('promo_never_show','1'); } catch {} setPromoOpen(false); };

  // Sliding underline for navbar
  useEffect(() => {
    const nav = navRef.current; const ul = underlineRef.current; const btn = navItemRefs.current[activeSection];
    if (!nav || !ul || !btn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = btn.getBoundingClientRect();
    const left = btnRect.left - navRect.left;
    ul.style.left = `${left}px`;
    ul.style.width = `${btnRect.width}px`;
    ul.style.opacity = '1';
  }, [activeSection]);

  // Observe workflow items to set current step on scroll
  useEffect(() => {
    if (loading || !showWorkflow.length) return;
    // trim refs to current length
    timelineItemRefs.current = timelineItemRefs.current.slice(0, showWorkflow.length);
    const obs = new IntersectionObserver((entries) => {
      // pick the entry with greatest intersectionRatio
      let bestIdx = -1; let bestRatio = 0;
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const idx = timelineItemRefs.current.indexOf(e.target as HTMLDivElement);
        if (idx >= 0 && e.intersectionRatio > bestRatio) { bestRatio = e.intersectionRatio; bestIdx = idx; }
      });
      if (bestIdx >= 0) {
        setObservedStep(bestIdx);
        if (!isStepHovering.current) setCurrentStep(bestIdx);
      }
    }, { threshold: [0.25, 0.5, 0.75] });
    timelineItemRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, [loading, showWorkflow.length]);
  // Hover-driven underline
  useEffect(() => {
    const nav = navRef.current; const ul = underlineRef.current; const key = hoverNavKey; const btn = key ? navItemRefs.current[key] : null;
    if (!nav || !ul) return;
    const targetBtn = btn || navItemRefs.current[activeSection];
    if (!targetBtn) return;
    const navRect = nav.getBoundingClientRect();
    const btnRect = targetBtn.getBoundingClientRect();
    ul.style.left = `${btnRect.left - navRect.left}px`;
    ul.style.width = `${btnRect.width}px`;
    ul.style.opacity = '1';
  }, [hoverNavKey, activeSection]);
  useEffect(() => {
    const onResize = () => {
      const nav = navRef.current; const ul = underlineRef.current; const btn = navItemRefs.current[activeSection];
      if (!nav || !ul || !btn) return;
      const navRect = nav.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      ul.style.left = `${btnRect.left - navRect.left}px`;
      ul.style.width = `${btnRect.width}px`;
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [activeSection]);

  // Set favicon and Open Graph meta from settings after load
  useEffect(() => {
    if (!settings) return;
    const logo = settings.brand_logo ? resolveAssetUrl(settings.brand_logo) : '';
    const brand = settings.brand_name ?? 'SyntaxTrust';
    // Favicon
    if (logo) {
      const setLink = (rel: string, id: string) => {
        let link = document.head.querySelector(`link#${id}`) as HTMLLinkElement | null;
        if (!link) { link = document.createElement('link'); link.id = id; link.rel = rel; document.head.appendChild(link); }
        link.href = logo;
      };
      setLink('icon', 'dynamic-favicon');
      setLink('apple-touch-icon', 'dynamic-apple');
    }
    // OG tags
    const setMeta = (prop: string, content: string) => {
      let el = document.head.querySelector(`meta[property='${prop}']`) as HTMLMetaElement | null;
      if (!el) { el = document.createElement('meta'); el.setAttribute('property', prop); document.head.appendChild(el); }
      el.setAttribute('content', content);
    };
    setMeta('og:site_name', brand);
    setMeta('og:title', brand);
    if (logo) setMeta('og:image', logo);
  }, [settings]);

  // On-scroll reveal: build CSS based on settings and respect prefers-reduced-motion
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const styleId = 'reveal-css';
    const prev = document.getElementById(styleId);
    if (prev) prev.remove();

    const style = document.createElement('style');
    style.id = styleId;
    const animStyle = (settings.anim_style ?? 'fade') as string;
    const dur = Math.max(100, Math.min(2000, Number(settings.anim_duration_ms ?? 600)));
    let initial = 'transform:translateY(8px);';
    if (animStyle === 'fade-left') initial = 'transform:translateX(-12px);';
    if (animStyle === 'fade-right') initial = 'transform:translateX(12px);';
    if (animStyle === 'zoom') initial = 'transform:scale(.96);';
    const base = reduce 
      ? `.reveal{opacity:1;transform:none} .reveal.reveal-show{opacity:1;transform:none}`
      : `.reveal{opacity:0;${initial}transition:opacity ${dur}ms ease,transform ${dur}ms ease} .reveal.reveal-show{opacity:1;transform:none}`;
    style.textContent = base;
    document.head.appendChild(style);

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('reveal-show');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    if (!reduce) document.querySelectorAll('.reveal').forEach((el) => obs.observe(el));
    return () => { obs.disconnect(); };
  }, [services, clients, features, workflow, settings]);

  // Build client slides (3 items per slide; grid adapts responsively)
  const clientSlides = useMemo(() => {
    const size = 3;
    const chunks: Client[][] = [];
    for (let i = 0; i < clients.length; i += size) {
      chunks.push(clients.slice(i, i + size));
    }
    // Ensure at least one slide to keep layout stable
    return chunks.length ? chunks : [[]];
  }, [clients]);
  const totalClientSlides = clientSlides.length;
  // Virtual slides: [lastClone, ...slides, firstClone]
  const virtualSlides = useMemo(() => {
    if (totalClientSlides === 0) return [] as Client[][];
    const first = clientSlides[0];
    const last = clientSlides[totalClientSlides - 1];
    return [last, ...clientSlides, first];
  }, [clientSlides, totalClientSlides]);
  const totalVirtual = virtualSlides.length;
  const goClientPrev = () => setClientSlide(s => s - 1);
  const goClientNext = () => setClientSlide(s => s + 1);
  const goClientTo = (i: number) => setClientSlide(i + 1); // map 0-based dot to logical index (1..N)

  // Autoplay slider every 5s with hover pause
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (loading || totalClientSlides <= 1 || reduce) return;
    const id = setInterval(() => {
      if (!clientPaused) setClientSlide(s => s + 1);
    }, 5000);
    return () => clearInterval(id);
  }, [clientPaused, loading, totalClientSlides]);

  // Handle seamless jump when reaching clones
  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const onEnd = () => {
      transitioningRef.current = false;
      // If moved to first clone (index 0), jump to real last (N)
      if (clientSlide === 0) {
        el.style.transition = 'none';
        setClientSlide(totalClientSlides);
        requestAnimationFrame(() => { el.style.transition = ''; });
      }
      // If moved to last clone (index N+1), jump to real first (1)
      if (clientSlide === totalClientSlides + 1) {
        el.style.transition = 'none';
        setClientSlide(1);
        requestAnimationFrame(() => { el.style.transition = ''; });
      }
    };
    el.addEventListener('transitionend', onEnd);
    return () => el.removeEventListener('transitionend', onEnd);
  }, [clientSlide, totalClientSlides]);

  // Touch swipe for slider
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; touchDeltaX.current = 0; };
  const onTouchMove = (e: React.TouchEvent) => { if (touchStartX.current !== null) touchDeltaX.current = e.touches[0].clientX - touchStartX.current; };
  const onTouchEnd = () => {
    const threshold = 50; // px
    if (Math.abs(touchDeltaX.current) > threshold) {
      if (touchDeltaX.current < 0) goClientNext(); else goClientPrev();
    }
    touchStartX.current = null; touchDeltaX.current = 0;
  };

  // Resolve asset URLs stored as '/web_jasa/...'
  const resolveAssetUrl = (u?: string) => {
    if (!u) return '';
    if (u.startsWith('/web_jasa/')) {
      // Point to Apache (default port) instead of Vite dev server port 8080
      return `${window.location.protocol}//${window.location.hostname}${u}`;
    }
    return u;
  };


  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [s, sv, c, f, w] = await Promise.all([
          fetch('/web_jasa/api/settings.php').then(r => r.ok ? r.json() : Promise.reject(new Error('settings'))),
          fetch('/web_jasa/api/services.php').then(r => r.ok ? r.json() : Promise.reject(new Error('services'))),
          fetch('/web_jasa/api/clients.php').then(r => r.ok ? r.json() : Promise.reject(new Error('clients'))),
          fetch('/web_jasa/api/features.php').then(r => r.ok ? r.json() : Promise.reject(new Error('features'))),
          fetch('/web_jasa/api/workflow.php').then(r => r.ok ? r.json() : Promise.reject(new Error('workflow'))),
        ]);
        setSettings(s || {});
        setServices(Array.isArray(sv) ? sv : []);
        setClients(Array.isArray(c) ? c : []);
        setFeatures(Array.isArray(f) ? f : []);
        setWorkflow(Array.isArray(w) ? w : []);
      } catch (e) {
        setError('Gagal memuat data. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash && sections.includes(hash)) {
      setActiveSection(hash);
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 0);
    }
  }, [sections]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = (entry.target as HTMLElement).id;
          if (sections.includes(id)) {
            setActiveSection(id);
            if (window?.history?.replaceState) {
              window.history.replaceState(null, "", `#${id}`);
            }
          }
        }
      });
    }, { threshold: 0.5 });

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header/Navigation */}
      <header ref={headerRef} className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {settings.brand_logo ? (
              <>
                <img src={resolveAssetUrl(settings.brand_logo)} alt="Logo" className="h-8 w-auto" loading="eager" decoding="async" />
                <span className="font-bold text-2xl text-foreground">{settings.brand_name ?? 'SyntaxTrust'}</span>
              </>
            ) : (
              <>
                <Code2 className="w-8 h-8 text-accent" />
                <span className="font-bold text-2xl bg-gradient-hero bg-clip-text text-transparent">
                  {settings.brand_name ?? 'SyntaxTrust'}
                </span>
              </>
            )}
          </div>
          
          {/* Desktop Navigation */}
          <nav ref={navRef} className="hidden md:flex items-center gap-8 relative pb-1">
            <button 
              ref={el => navItemRefs.current['beranda'] = el}
              onClick={() => scrollToSection('beranda')}
              onMouseEnter={()=>setHoverNavKey('beranda')} onMouseLeave={()=>setHoverNavKey(null)}
              className={`text-sm font-medium transition-colors ${activeSection === 'beranda' ? 'text-foreground underline underline-offset-8 decoration-2 decoration-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Beranda
            </button>
            <button 
              ref={el => navItemRefs.current['layanan'] = el}
              onClick={() => scrollToSection('layanan')}
              onMouseEnter={()=>setHoverNavKey('layanan')} onMouseLeave={()=>setHoverNavKey(null)}
              className={`text-sm font-medium transition-colors ${activeSection === 'layanan' ? 'text-foreground underline underline-offset-8 decoration-2 decoration-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Layanan
            </button>
            <button 
              ref={el => navItemRefs.current['client'] = el}
              onClick={() => scrollToSection('client')}
              onMouseEnter={()=>setHoverNavKey('client')} onMouseLeave={()=>setHoverNavKey(null)}
              className={`text-sm font-medium transition-colors ${activeSection === 'client' ? 'text-foreground underline underline-offset-8 decoration-2 decoration-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Client
            </button>
            <button 
              ref={el => navItemRefs.current['keunggulan'] = el}
              onClick={() => scrollToSection('keunggulan')}
              onMouseEnter={()=>setHoverNavKey('keunggulan')} onMouseLeave={()=>setHoverNavKey(null)}
              className={`text-sm font-medium transition-colors ${activeSection === 'keunggulan' ? 'text-foreground underline underline-offset-8 decoration-2 decoration-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Keunggulan
            </button>
            <button 
              ref={el => navItemRefs.current['alur-kerja'] = el}
              onClick={() => scrollToSection('alur-kerja')}
              onMouseEnter={()=>setHoverNavKey('alur-kerja')} onMouseLeave={()=>setHoverNavKey(null)}
              className={`text-sm font-medium transition-colors ${activeSection === 'alur-kerja' ? 'text-foreground underline underline-offset-8 decoration-2 decoration-accent' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Alur Kerja
            </button>
            <span ref={underlineRef} className="absolute -bottom-0.5 h-0.5 bg-accent rounded transition-all duration-300 ease-out" style={{left:0,width:0,opacity:0}} />
          </nav>

          <Button 
            variant="cta" 
            size="sm"
            asChild
          >
            <a href={`https://wa.me/${settings.whatsapp_number ?? '6281234567890'}?text=${encodeURIComponent(settings.whatsapp_message ?? 'Halo! Saya tertarik dengan layanan SyntaxTrust dan ingin konsultasi.')}`} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="w-4 h-4" />
              Hubungi Kami
            </a>
          </Button>
        </div>
      </header>
      {error && (
        <div className="bg-red-500/10 text-red-600 border border-red-500/30 py-2">
          <div className="container mx-auto px-4 text-sm">{error}</div>
        </div>
      )}

      {/* Hero Section */}
      <section id="beranda" className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-5" />
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="space-y-4">
                <div className="relative inline-block">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                    Tugas Website <span className="text-accent">Bikin Pusing?</span> Kami Bantu Sampai Tuntas!
                  </h1>
                  <div className="hero-anim" aria-hidden>
                    <span className="ring" />
                    <span className="dot" />
                  </div>
                </div>
              </div>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Jasa profesional pengerjaan tugas, modifikasi web, dan pembuatan website dari nol. Pengerjaan cepat, garansi revisi, dan harga nego!
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  variant="cta" 
                  size="xl"
                  className="btn-anim rounded-full font-semibold px-6"
                  asChild
                >
                  <a href={`https://wa.me/${settings.whatsapp_number ?? '6281234567890'}?text=${encodeURIComponent(settings.whatsapp_message ?? 'Halo! Saya tertarik dengan layanan SyntaxTrust dan ingin konsultasi.')}`} target="_blank" rel="noopener noreferrer">
                    <span className="inline-flex items-center gap-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Konsultasi Gratis Sekarang</span>
                    </span>
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="btn-anim rounded-full font-semibold px-6"
                  onClick={() => document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="inline-flex items-center gap-2">
                    <FileCode className="w-5 h-5" />
                    <span>Lihat Layanan</span>
                  </span>
                </Button>
              </div>
              {/* Hero Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60">
                  <Clock className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Cepat & Tepat</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60">
                  <CheckCircle className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Garansi Revisi</span>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-background/60">
                  <FileCode className="w-4 h-4 text-accent" />
                  <span className="text-foreground">Harga Transparan</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-border/50 bg-card">
                {settings.brand_logo ? (
                  <img
                    src={resolveAssetUrl(settings.brand_logo)}
                    alt="Logo"
                    className="w-full h-full object-contain p-8"
                  />
                ) : (
                  <img 
                    src={heroImage} 
                    alt="Workspace pengembangan web modern" 
                    className="w-full h-full object-cover"
                    loading="lazy" decoding="async" fetchPriority="low"
                    sizes="(min-width: 1024px) 50vw, 100vw"
                  />
                )}
              </div>
              <div ref={heroBlobA} className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl will-change-transform" />
              <div ref={heroBlobB} className="absolute -top-6 -left-6 w-32 h-32 bg-accent-orange/20 rounded-full blur-3xl will-change-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Promo Modal */}
      {promoOpen && (
        <div role="dialog" aria-modal className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={dismissPromoForADay} />
          <div className="relative w-full max-w-md mx-4 rounded-2xl bg-card border border-border shadow-2xl p-6">
            <button aria-label="Tutup" onClick={dismissPromoForADay} className="absolute top-2 right-2 rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted">
              ×
            </button>
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-foreground">Promo Pembuatan Website</h3>
              <p className="text-muted-foreground">Diskon spesial untuk order minggu ini. Konsultasi gratis dan garansi revisi!</p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button asChild variant="cta" className="btn-anim flex-1" onClick={dismissPromoForADay}>
                  <a href={`https://wa.me/${settings.whatsapp_number ?? '6281234567890'}?text=${encodeURIComponent('Halo! Saya tertarik promo pembuatan website.')}#promo`} target="_blank" rel="noopener noreferrer">
                    <span className="inline-flex items-center gap-2"><MessageCircle className="w-5 h-5" /> Chat Promo</span>
                  </a>
                </Button>
                <Button variant="outline" className="btn-anim flex-1" onClick={() => { dismissPromoForADay(); document.getElementById('layanan')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  <span className="inline-flex items-center gap-2"><FileCode className="w-5 h-5" /> Lihat Layanan</span>
                </Button>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <button type="button" onClick={dismissPromoForAWeek} className="hover:text-foreground hover:underline">Jangan tampil 7 hari</button>
                <button type="button" onClick={dismissPromoForever} className="hover:text-foreground hover:underline">Jangan tampil lagi</button>
              </div>
            </div>
          </div>
        </div>
      )}

      

      {/* FAQ Section */}
      <section id="jadwal" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">FAQ</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Pertanyaan yang sering ditanyakan</p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {[{q:'Berapa lama pengerjaan?',a:'Tergantung kompleksitas. Umumnya 3–14 hari.'},{q:'Apakah termasuk domain/hosting?',a:'Tidak. Layanan fokus pada pembuatan kode/source.'},{q:'Ada garansi revisi?',a:'Ada revisi minor hingga sesuai brief awal.'}].map((f, i) => (
              <details key={i} className="rounded-xl border border-border/50 bg-card p-4">
                <summary className="cursor-pointer font-medium text-foreground">{f.q}</summary>
                <div className="mt-2 text-muted-foreground">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="layanan" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Layanan Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Solusi lengkap untuk semua kebutuhan website Anda, dari tugas kuliah hingga proyek profesional
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {loading && services.length === 0 && (
              <>
                <div className="h-40 rounded-xl bg-muted animate-pulse" />
                <div className="h-40 rounded-xl bg-muted animate-pulse" />
                <div className="h-40 rounded-xl bg-muted animate-pulse" />
              </>
            )}
            {!loading && services.map((s, idx) => (
              <div key={`${s.title}-${idx}`} className="reveal group transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl grad-border"
                   style={{ transitionDelay: `${idx * Number(settings.anim_delay_ms ?? 60)}ms`, transitionDuration: `${Number(settings.anim_duration_ms ?? 600)}ms` }}>
                <ServiceCard
                  icon={iconMap[s.icon] ?? Code2}
                  title={s.title}
                  description={s.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Portfolio Section (Slider) */}
      <section id="client" className="py-20 bg-gradient-to-b from-background to-muted/30 relative">
        <div className="mesh-bg" />
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Client Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Beberapa portfolio klien yang pernah kami bantu</p>
          </div>

          {/* Logo Marquee */}
          {!loading && clients.length > 0 && (
            <div className="overflow-hidden border border-border/50 rounded-xl bg-card/60 backdrop-blur mb-8">
              <div className="flex gap-8 whitespace-nowrap px-6 py-3 marquee-track">
                {[...clients, ...clients].map((c, i) => (
                  <span key={`marq-${i}`} className="text-sm text-muted-foreground hover-raise px-3 py-1 rounded-full border border-border/50 bg-background/60">{c.name}</span>
                ))}
              </div>
            </div>
          )}
          

          {/* Slider viewport */}
          <div className="relative max-w-5xl mx-auto"
               onMouseEnter={() => setClientPaused(true)}
               onMouseLeave={() => setClientPaused(false)}
               onTouchStart={onTouchStart}
               onTouchMove={onTouchMove}
               onTouchEnd={onTouchEnd}
          >
            {/* Navigation arrows */}
            {!loading && clients.length > 0 && (
              <>
                <button
                  aria-label="Sebelumnya"
                  onClick={goClientPrev}
                  className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border shadow hover:bg-background transition btn-anim"
                >
                  <span className="m-auto">‹</span>
                </button>
                <button
                  aria-label="Berikutnya"
                  onClick={goClientNext}
                  className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 border border-border shadow hover:bg-background transition btn-anim"
                >
                  <span className="m-auto">›</span>
                </button>
              </>
            )}

            <div className="overflow-hidden rounded-2xl border border-border/50 bg-card">
              {/* Track */}
              <div
                ref={sliderRef}
                className="flex transition-transform duration-500 ease-out"
                style={{ width: `${totalVirtual * 100}%`, transform: `translateX(-${clientSlide * (100 / totalVirtual)}%)` }}
              >
                {virtualSlides.map((slide, i) => (
                  <div key={`vs-${i}`} className="w-full" style={{ width: `${100 / totalVirtual}%` }}>
                    <div className="p-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {loading && clients.length === 0 && (
                        <>
                          <div className="h-28 rounded-xl bg-muted animate-pulse" />
                          <div className="h-28 rounded-xl bg-muted animate-pulse" />
                          <div className="h-28 rounded-xl bg-muted animate-pulse" />
                        </>
                      )}
                      {!loading && slide.map((c, idx) => (
                        <div key={`${c.name}-${idx}`} className="reveal transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                             style={{ transitionDelay: `${idx * Number(settings.anim_delay_ms ?? 60)}ms`, transitionDuration: `${Number(settings.anim_duration_ms ?? 600)}ms` }}>
                          <ClientCard
                            name={c.name}
                            category={c.category}
                            year={String(c.year)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots */}
            {!loading && clients.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {clientSlides.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Ke slide ${i + 1}`}
                    onClick={() => goClientTo(i)}
                    className={`h-2.5 rounded-full transition-all ${((clientSlide - 1 + totalClientSlides) % totalClientSlides) === i ? 'bg-foreground w-6' : 'bg-muted-foreground/40 w-2.5'} btn-anim`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="keunggulan" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Kenapa Pilih Kami?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Komitmen kami untuk memberikan layanan terbaik dengan harga yang fair
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {loading && features.length === 0 && (
              <>
                <div className="h-24 rounded-xl bg-muted animate-pulse" />
                <div className="h-24 rounded-xl bg-muted animate-pulse" />
              </>
            )}
            {!loading && features.map((f, idx) => (
              <div key={`${f.title}-${idx}`} className="reveal transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl feature-card"
                   style={{ transitionDelay: `${idx * Number(settings.anim_delay_ms ?? 60)}ms`, transitionDuration: `${Number(settings.anim_duration_ms ?? 600)}ms` }}>
                <FeatureItem
                  icon={iconMap[f.icon] ?? Handshake}
                  title={f.title}
                  description={f.description}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-secondary/50 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 md:p-12 shadow-card border border-accent/20">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-accent" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">Apa yang Anda Dapatkan?</h2>
              </div>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p className="text-lg">
                  Layanan kami berfokus penuh pada proses <span className="font-semibold text-foreground">development</span> (pembuatan kode). 
                  Harga yang disepakati saat meet <span className="font-semibold text-foreground">tidak termasuk biaya pembelian domain dan hosting</span>.
                </p>
                <p className="text-lg">
                  Kami akan menyerahkan <span className="font-semibold text-foreground">file source code lengkap</span> yang sudah jadi (.zip) 
                  dan siap untuk Anda upload ke penyedia hosting manapun pilihan Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="alur-kerja" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">Alur Kerja Kami</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Proses sederhana dan transparan dari konsultasi hingga serah terima
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-12 timeline">
            {loading && workflow.length === 0 && (
              <>
                <div className="h-16 rounded-xl bg-muted animate-pulse" />
                <div className="h-16 rounded-xl bg-muted animate-pulse" />
                <div className="h-16 rounded-xl bg-muted animate-pulse" />
              </>
            )}
            {showWorkflow.map((w, idx) => (
              <div
                key={`${w.step_number}-${idx}`}
                ref={el => { if (el) (timelineItemRefs.current[idx] = el); }}
                onMouseEnter={()=> setCurrentStep(idx)} onMouseLeave={()=> setCurrentStep(observedStep)}
                className={`reveal transition-all duration-300 hover:-translate-y-1 hover:shadow-lg timeline-item ${currentStep===idx?'current':''}`}
                style={{ transitionDelay: `${idx * Number(settings.anim_delay_ms ?? 60)}ms`, transitionDuration: `${Number(settings.anim_duration_ms ?? 600)}ms` }}>
                <WorkflowStep
                  number={w.step_number}
                  title={w.title}
                  description={w.description}
                />
              </div>
            ))}
            <div className="text-center mt-8">
              <Button asChild variant="cta" className="btn-anim rounded-full">
                <a href="#jadwal">Jadwalkan Meet Sekarang</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule Meet Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 space-y-3">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Jadwalkan Meet Online</h2>
              <p className="text-lg text-muted-foreground">Pilih tanggal dan layanan yang Anda butuhkan</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-card">
              {meetSuccess && (
                <div className="mb-4 rounded-md border border-green-500/40 bg-green-500/10 text-green-700 px-4 py-2 text-sm">{meetSuccess}</div>
              )}
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setMeetErrors({});
                  setMeetSuccess("");
                  const errs: Record<string,string> = {};
                  if (!meetName || meetName.trim().length < 2) errs.name = 'Nama wajib diisi';
                  const waDigits = (meetWA || '').replace(/\D+/g, '');
                  if (!waDigits || waDigits.length < 10 || waDigits.length > 15) errs.whatsapp = 'WA harus 10-15 digit';
                  if (!meetService) errs.service_title = 'Pilih layanan';
                  if (!meetDate) errs.preferred_date = 'Tanggal wajib diisi';
                  else {
                    const d = new Date(meetDate + 'T00:00:00');
                    if (d.getDay() === 0) errs.preferred_date = 'Hari Minggu tidak tersedia';
                  }
                  if (meetTime && !/^([01]\d|2[0-3]):[0-5]\d$/.test(meetTime)) errs.preferred_time = 'Format jam HH:MM';
                  if (Object.keys(errs).length) { setMeetErrors(errs); return; }
                  try {
                    setMeetSubmitting(true);
                    const res = await fetch('/web_jasa/api/meetings.php', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        name: meetName.trim(),
                        whatsapp: waDigits,
                        service_title: meetService,
                        preferred_date: meetDate,
                        preferred_time: meetTime,
                        timezone: meetTZ,
                        message: meetMsg.trim(),
                      })
                    });
                    const j = await res.json().catch(() => ({}));
                    if (!res.ok || j.ok === false) {
                      setMeetErrors(j.errors || { _global: 'Gagal mengirim. Coba lagi.' });
                    } else {
                      setMeetSuccess('Berhasil mengajukan jadwal. Kami akan menghubungi Anda via WhatsApp.');
                      setMeetName(''); setMeetWA(''); setMeetService(''); setMeetDate(''); setMeetTime(''); setMeetMsg('');
                    }
                  } catch {
                    setMeetErrors({ _global: 'Terjadi kesalahan jaringan.' });
                  } finally {
                    setMeetSubmitting(false);
                  }
                }}
                className="grid gap-4"
              >
                {meetErrors._global && <div className="text-sm text-red-600">{meetErrors._global}</div>}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-foreground">Nama</label>
                    <input value={meetName} onChange={e=>setMeetName(e.target.value)} className={`w-full rounded-md border px-3 h-10 bg-background ${meetErrors.name ? 'border-red-500' : 'border-border'} btn-anim`} placeholder="Nama Anda" />
                    {meetErrors.name && <div className="text-xs text-red-600 mt-1">{meetErrors.name}</div>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-foreground">WhatsApp</label>
                    <input value={meetWA} onChange={e=>{
                      const digits=(e.target.value||'').replace(/\D+/g,'').slice(0,15);
                      let grouped = digits;
                      if (waPattern==='4-4-4-3') grouped = digits.replace(/(\d{4})(\d{0,4})(\d{0,4})(\d{0,3}).*/, (m,a,b,c,d)=>[a,b,c,d].filter(Boolean).join(' '));
                      else grouped = digits.replace(/(\d{3})(\d{0,4})(\d{0,4})(\d{0,4}).*/, (m,a,b,c,d)=>[a,b,c,d].filter(Boolean).join(' '));
                      setMeetWA(grouped.trim());
                    }} className={`w-full rounded-md border px-3 h-10 bg-background ${meetErrors.whatsapp ? 'border-red-500' : 'border-border'} btn-anim`} placeholder="6281 2345 6789 012" />
                    {meetErrors.whatsapp && <div className="text-xs text-red-600 mt-1">{meetErrors.whatsapp}</div>}
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                      Pola: 
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="waFmt" className="accent-accent" checked={waPattern==='4-4-4-3'} onChange={()=>setWaPattern('4-4-4-3')} /> 4-4-4-3
                      </label>
                      <label className="inline-flex items-center gap-1 cursor-pointer">
                        <input type="radio" name="waFmt" className="accent-accent" checked={waPattern==='3-4-4-4'} onChange={()=>setWaPattern('3-4-4-4')} /> 3-4-4-4
                      </label>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-foreground">Pilih Layanan</label>
                    <select value={meetService} onChange={e=>setMeetService(e.target.value)} className={`w-full rounded-md border px-3 h-10 bg-background ${meetErrors.service_title ? 'border-red-500' : 'border-border'} btn-anim`}>
                      <option value="">-- Pilih salah satu --</option>
                      {services.map((s, idx)=> (
                        <option key={`${s.title}-${idx}`} value={s.title}>{s.title}</option>
                      ))}
                    </select>
                    {meetErrors.service_title && <div className="text-xs text-red-600 mt-1">{meetErrors.service_title}</div>}
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-foreground">Tanggal Meet</label>
                    <input type="date" value={meetDate} onChange={e=>setMeetDate(e.target.value)} min={new Date().toISOString().slice(0,10)} max={new Date(Date.now()+60*24*60*60*1000).toISOString().slice(0,10)} className={`w-full rounded-md border px-3 h-10 bg-background ${meetErrors.preferred_date ? 'border-red-500' : 'border-border'} btn-anim`} />
                    {meetErrors.preferred_date && <div className="text-xs text-red-600 mt-1">{meetErrors.preferred_date}</div>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {[{l:'Hari ini',d:0},{l:'Besok',d:1},{l:'+7 hari',d:7}].map((q)=> (
                        <button type="button" key={q.l} onClick={()=>{
                          const d=new Date(); d.setDate(d.getDate()+q.d);
                          setMeetDate(d.toISOString().slice(0,10));
                        }} className="text-xs px-2 py-1 rounded-md border border-border hover:bg-muted">
                          {q.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-foreground">Waktu (opsional)</label>
                    <input type="time" value={meetTime} onChange={e=>setMeetTime(e.target.value)} className={`w-full rounded-md border px-3 h-10 bg-background ${meetErrors.preferred_time ? 'border-red-500' : 'border-border'} btn-anim`} />
                    {meetErrors.preferred_time && <div className="text-xs text-red-600 mt-1">{meetErrors.preferred_time}</div>}
                  </div>
                  <div>
                    <label className="block text-sm mb-1 text-foreground">Zona Waktu</label>
                    <input value={meetTZ} onChange={e=>setMeetTZ(e.target.value)} className="w-full rounded-md border px-3 h-10 bg-background border-border btn-anim" placeholder="Asia/Jakarta" />
                    <div className="text-xs text-muted-foreground mt-1">Otomatis terdeteksi: {meetTZ}</div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1 text-foreground">Pesan (opsional)</label>
                  <textarea value={meetMsg} onChange={e=>setMeetMsg(e.target.value)} rows={4} className="w-full rounded-md border px-3 py-2 bg-background border-border btn-anim" placeholder="Jelaskan kebutuhan singkat Anda"></textarea>
                </div>
                <div className="flex justify-end">
                  <Button variant="cta" disabled={meetSubmitting} className="btn-anim">
                    {meetSubmitting ? 'Mengirim...' : 'Kirim Pengajuan Meet'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDE2em0wLTEwaC0xNnYyaDEydi0yem0wIDRoLTh2Mmg4di0yem0wIDR2Mmg4di0yaC04eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center space-y-8 rounded-3xl bg-white/10 border border-white/20 backdrop-blur p-10 shadow-xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
              Siap Diskusi Proyek Anda?
            </h2>
            <p className="text-lg md:text-xl text-primary-foreground/90 leading-relaxed">
              Jangan biarkan tugas web menghambat nilai Anda. Hubungi kami untuk atur jadwal meet dan dapatkan harga terbaik!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button asChild variant="cta" className="btn-anim">
                <a href="#jadwal">Jadwalkan Meet</a>
              </Button>
              <Button asChild variant="outline" className="btn-anim">
                <a href="#layanan">Lihat Layanan</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              {settings.brand_logo ? (
                <>
                  <img src={resolveAssetUrl(settings.brand_logo)} alt="Logo" className="h-6 w-auto" loading="eager" decoding="async" />
                  <span className="font-bold text-xl text-foreground">{settings.brand_name ?? 'SyntaxTrust'}</span>
                </>
              ) : (
                <>
                  <Code2 className="w-6 h-6 text-accent" />
                  <span className="font-bold text-xl text-foreground">{settings.brand_name ?? 'SyntaxTrust'}</span>
                </>
              )}
            </div>
            <p className="text-muted-foreground text-sm">
              © 2025 SyntaxTrust. Solusi terpercaya untuk kebutuhan website Anda.
            </p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Sticker */}
      <div className="wa-float">
        <div className="wa-badge">Yuk Konsultasi lewat <span className="waw">WhatsApp</span></div>
        <a
          href={`https://wa.me/${settings.whatsapp_number ?? '6281234567890'}?text=${encodeURIComponent(settings.whatsapp_message ?? 'Halo! Saya tertarik dengan layanan SyntaxTrust dan ingin konsultasi.')}`}
          target="_blank" rel="noopener noreferrer"
          className="wa-btn"
        >
          <MessageCircle className="w-5 h-5" /> Chat WhatsApp
        </a>
      </div>
    </div>
  );
};

export default Index;
