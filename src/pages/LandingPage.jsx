import { useState, useEffect, useRef } from "react";
import { Link } from "react-router";

// ── CSS injected globally ──────────────────────────────────────────────────
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  :root {
    --green-dark: #192514;
    --green-primary: #55BB33;
    --green-lemon: #bdd630;
    --golden: #ecad20;
    --cream: #f7ecb3;
    --bg: #F5F7F2;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  body {
    font-family: 'Poppins', sans-serif;
    background: var(--bg);
    color: var(--green-dark);
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height%3D'100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(25,37,20,0.2); border-radius: 3px; }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-12px); }
  }
  @keyframes pulse-ring {
    0% { transform: scale(1); opacity: 0.6; }
    100% { transform: scale(1.4); opacity: 0; }
  }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes draw {
    from { stroke-dashoffset: 400; }
    to { stroke-dashoffset: 0; }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }

  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-slide-up { animation: slide-up 0.7s ease-out both; }
  .animate-fade { animation: fade-in 0.6s ease-out both; }
  .chart-path {
    stroke-dasharray: 400;
    stroke-dashoffset: 400;
    animation: draw 2s ease-out 0.5s both;
  }
  .pulse-dot { animation: pulse-ring 1.5s ease-out infinite; }
  .marquee-track {
    display: flex;
    animation: marquee 20s linear infinite;
    width: max-content;
  }
  .marquee-track:hover { animation-play-state: paused; }

  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

// ── Logo SVG ──────────────────────────────────────────────────────────────
const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 44 45" fill="none">
    <path d="M22.4877 23.6092C22.4877 23.6092 24.8105 19.3465 29.7453 18.3817C29.7453 18.3817 22.5846 15.3262 15.0848 18.3817C15.0848 18.3817 19.1489 18.8649 22.4877 23.6092Z" fill="#55BB33"/>
    <path d="M22.567 26.8841C22.567 26.8841 22.6389 27.4471 22.9781 27.5545C23.3173 27.6618 33.2353 28.7243 38.2068 18.1001C38.2068 18.1001 37.7105 17.6901 35.9692 19.0307C35.9692 19.0307 31.5512 23.9084 27.882 23.7083C27.882 23.7083 27.6824 23.0884 31.9462 21.0465C31.9462 21.0465 32.9548 20.2151 32.1033 19.9304C32.1033 19.9304 27.3476 21.1132 25.204 22.7305C25.204 22.7305 23.8972 23.2397 22.567 26.8858V26.8841Z" fill="#55BB33"/>
    <path d="M22.2733 26.8859C22.2733 26.8859 22.2014 27.4488 21.8622 27.5562C21.5231 27.6636 11.605 28.726 6.63354 18.1018C6.63354 18.1018 7.12981 17.6918 8.87116 19.0324C8.87116 19.0324 13.2891 23.9101 16.9583 23.71C16.9583 23.71 17.158 23.0901 12.8942 21.0482C12.8942 21.0482 11.8855 20.2169 12.7371 19.9321C12.7371 19.9321 17.4927 21.1149 19.6364 22.7322C19.6364 22.7322 20.9431 23.2414 22.2733 26.8875V26.8859Z" fill="#55BB33"/>
    <path d="M22.8401 17.0231C22.8401 17.0231 23.3554 11.698 20.8403 9.87417C18.3238 8.05195 13.179 9.33726 12.163 7.47925C12.163 7.47925 12.4214 18.9169 21.5333 16.2178C21.5333 16.2178 20.3235 11.7143 15.6794 10.6779C15.6794 10.6779 20.9416 11.0261 22.1867 17.0443L22.8401 17.0215V17.0231Z" fill="#55BB33"/>
    <path d="M18.9345 0C18.9345 0 19.1195 1.38619 22.3056 3.50452C25.4917 5.62285 23.5727 8.95654 22.8386 10.1719C22.8386 10.1719 23.4597 6.43634 20.507 3.94218C20.507 3.94218 22.8944 6.14999 22.3379 10.1817C22.3379 10.1817 16.5663 8.29598 18.9345 0Z" fill="#55BB33"/>
    <path d="M23.1337 16.0047C23.1337 16.0047 23.7798 10.1052 29.5059 8.90779C29.5059 8.90779 25.7311 9.69362 24.2305 13.914C24.2305 13.914 29.8613 16.5237 32.2002 9.51628C32.2002 9.51628 32.877 6.56656 32.7816 6.11914C32.7816 6.11914 31.7494 7.28081 27.0378 7.3166C27.0378 7.3166 22.1016 7.2987 23.1337 16.0047Z" fill="#55BB33"/>
    <path d="M40.8056 33.0926C40.8056 33.0926 36.8384 31.5079 33.5069 34.8709L31.4558 33.2032C31.4558 33.2032 34.6771 28.5452 42.1373 30.1298L40.807 33.0926H40.8056Z" fill="#55BB33"/>
    <path d="M43.4073 25.524L42.6614 28.4639C42.6614 28.4639 34.1896 25.9291 29.8789 31.9554L27.2595 30.7433C27.2595 30.7433 32.6641 22.9159 43.4088 25.5256L43.4073 25.524Z" fill="#55BB33"/>
    <path d="M36.1453 38.8261L39.4284 34.8579C39.4284 34.8579 36.0793 34.2706 34.8856 36.3271L36.1453 38.8261Z" fill="#55BB33"/>
    <path d="M2.60467 33.0569C2.60467 33.0569 6.57188 31.4722 9.90334 34.8352L11.9545 33.1676C11.9545 33.1676 8.73315 28.5095 1.27297 30.0942L2.60321 33.0569H2.60467Z" fill="#55BB33"/>
    <path d="M0.00146828 25.4866L0.747339 28.4266C0.747339 28.4266 9.21914 25.8917 13.5299 31.9181L16.1493 30.706C16.1493 30.706 10.7446 22.8786 0 25.4882L0.00146828 25.4866Z" fill="#55BB33"/>
    <path d="M7.26343 38.7888L3.98042 34.8205C3.98042 34.8205 7.3295 34.2332 8.52319 36.2897L7.26343 38.7888Z" fill="#55BB33"/>
    <path d="M16.7469 44.3009C16.7469 44.3009 21.7213 44.6686 26.3639 44.2276C26.3639 44.2276 21.5891 38.7154 16.7469 44.3009Z" fill="#55BB33"/>
    <path d="M15.0525 42.9814L12.5212 41.81C12.5212 41.81 20.9813 30.0567 30.6893 41.9873L28.3181 43.053C28.3181 43.053 21.6537 34.6024 15.0525 42.9814Z" fill="#55BB33"/>
    <path d="M10.8562 40.9575C10.8562 40.9575 20.3088 26.8613 32.1649 40.8517L34.3115 39.4314C34.3115 39.4314 23.3525 21.5704 8.93283 39.4314L10.8548 40.9575H10.8562Z" fill="#55BB33"/>
  </svg>
);

// ── Reveal hook ───────────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { el.classList.add("visible"); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

// ── Reusable Reveal wrapper ───────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }) {
  const ref = useReveal();
  return (
    <div ref={ref} className={`reveal ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#features", label: "Features" },
    { href: "#how", label: "How it works" },
    { href: "#dashboard", label: "Dashboard" },
    { href: "#about", label: "About" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <>
      <style>{globalStyles}</style>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          background: scrolled ? "rgba(245,247,242,0.97)" : "rgba(245,247,242,0.85)",
          borderBottom: "1px solid rgba(25,37,20,0.08)",
          boxShadow: scrolled ? "0 2px 20px rgba(25,37,20,0.08)" : "none",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between" style={{ height: 72 }}>
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <Logo />
            <span className="font-black text-xl tracking-tight" style={{ color: "var(--green-dark)", fontFamily: "Poppins", letterSpacing: "-0.03em" }}>
              SahlaFarm
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-9">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm font-medium no-underline transition-colors duration-200"
                style={{ color: "rgba(25,37,20,0.65)" }}
                onMouseOver={(e) => (e.target.style.color = "#192514")}
                onMouseOut={(e) => (e.target.style.color = "rgba(25,37,20,0.65)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-6 py-2.5 rounded-full font-semibold text-sm border border-[rgba(25,37,20,0.25)] transition-all duration-200 hover:border-[#192514] hover:bg-[rgba(25,37,20,0.05)] hover:-translate-y-0.5 no-underline" style={{ color: "var(--green-dark)" }}>
              Log in
            </Link>
            <Link to="/signup" className="px-6 py-2.5 rounded-full font-semibold text-sm text-[#F5F7F2] transition-all duration-200 hover:-translate-y-0.5 no-underline" style={{ background: "var(--green-dark)" }}>
              Get Started →
            </Link>
          </div>

          {/* Hamburger */}
          <button className="md:hidden flex flex-col gap-1.5 p-1 bg-transparent border-none cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-5.5 h-0.5 rounded-sm transition-all duration-300" style={{ width: 22, height: 2, background: "var(--green-dark)" }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed top-[72px] left-0 right-0 z-40 flex flex-col gap-4 px-6 py-5 md:hidden" style={{ background: "rgba(245,247,242,0.98)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(25,37,20,0.08)" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-lg font-medium no-underline" style={{ color: "var(--green-dark)" }} onClick={() => setMenuOpen(false)}>{l.label}</a>
          ))}
          <Link to="/signup" className="mt-2 text-center py-3 px-6 rounded-full font-semibold text-sm text-[#F5F7F2] no-underline" style={{ background: "var(--green-dark)" }} onClick={() => setMenuOpen(false)}>
            Get Started →
          </Link>
        </div>
      )}
    </>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="min-h-screen flex items-center relative overflow-hidden" style={{ paddingTop: 72, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(85,187,51,0.15) 0%, transparent 70%)" }}>
      <div className="absolute top-[10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(85,187,51,0.08) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[5%] left-[-10%] w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(189,214,48,0.07) 0%, transparent 70%)" }} />

      <div className="max-w-6xl mx-auto px-6 py-20 w-full relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          {/* Left */}
          <div className="flex flex-col gap-7">
            <div className="animate-fade" style={{ animationDelay: "0.1s" }}>
              <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-3.5 py-1.5 rounded-full" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)", letterSpacing: "0.02em" }}>
                <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#55BB33] inline-block" />
                IoT · AI · Real-time monitoring
              </span>
            </div>

            <h1 className="animate-slide-up font-black leading-[1.05] tracking-tighter" style={{ fontSize: "clamp(40px,5.5vw,68px)", animationDelay: "0.2s", letterSpacing: "-0.04em", color: "var(--green-dark)" }}>
              Innovation<br />in the<br />
              <span style={{ color: "var(--green-primary)" }}>palm</span> of<br />your hands.
            </h1>

            <p className="animate-slide-up text-base leading-relaxed max-w-[480px]" style={{ animationDelay: "0.35s", color: "rgba(25,37,20,0.65)" }}>
              Sahla Farm bridges traditional farming knowledge with real-time IoT data, AI-powered insights, and intelligent automation — making smart agriculture accessible to every farmer.
            </p>

            <div className="animate-slide-up flex gap-3 flex-wrap" style={{ animationDelay: "0.5s" }}>
              <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-[#F5F7F2] no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ background: "var(--green-dark)", boxShadow: "0 0 0 0 transparent" }}
                onMouseOver={(e) => { e.currentTarget.style.boxShadow = "0 8px 24px rgba(25,37,20,0.25)"; e.currentTarget.style.background = "#2a3d20"; }}
                onMouseOut={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.background = "var(--green-dark)"; }}>
                Start farming smarter →
              </Link>
              <a href="#dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-[rgba(25,37,20,0.05)]" style={{ color: "var(--green-dark)", border: "1.5px solid rgba(25,37,20,0.25)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                See it in action
              </a>
            </div>

            {/* Stats */}
            <div className="animate-slide-up flex gap-8 pt-4 border-t" style={{ animationDelay: "0.65s", borderColor: "rgba(25,37,20,0.08)" }}>
              {[
                { value: "40%", label: "Less water used" },
                { value: "24/7", label: "Real-time monitoring" },
                { value: "3x", label: "Crop yield increase" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-8">
                  {i > 0 && <div className="w-px self-stretch" style={{ background: "rgba(25,37,20,0.08)" }} />}
                  <div>
                    <div className="font-black text-3xl" style={{ color: "var(--green-dark)", letterSpacing: "-0.03em" }}>{s.value}</div>
                    <div className="text-xs mt-0.5" style={{ color: "rgba(25,37,20,0.55)" }}>{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard card */}
          <div className="animate-float hidden md:block relative">
            <div className="bg-white rounded-[28px] p-5" style={{ border: "1px solid rgba(25,37,20,0.08)", boxShadow: "0 32px 80px rgba(25,37,20,0.15)" }}>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-xs font-medium uppercase tracking-widest" style={{ color: "rgba(25,37,20,0.45)" }}>Soil Moisture</div>
                  <div className="font-black text-3xl" style={{ color: "var(--green-dark)", letterSpacing: "-0.03em" }}>45.2<span className="text-sm font-medium ml-0.5">%</span></div>
                </div>
                <div className="text-xs font-semibold px-3.5 py-1.5 rounded-full" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e" }}>This week ↓</div>
              </div>
              <svg width="100%" height="110" viewBox="0 0 400 110" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#55BB33" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#55BB33" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d="M0,80 L57,70 L114,60 L171,85 L228,40 L285,50 L342,30 L400,45" fill="url(#chartGrad)" />
                <path className="chart-path" d="M0,80 L57,70 L114,60 L171,85 L228,40 L285,50 L342,30 L400,45" fill="none" stroke="#55BB33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label: "TEMPERATURE", val: "24.5°C", bg: "#55BB33", dark: true },
                  { label: "HUMIDITY", val: "65%", bg: "white", dark: false },
                  { label: "SOIL MOISTURE", val: "45.2%", bg: "white", dark: false },
                  { label: "LIGHT", val: "1450 lux", bg: "white", dark: false },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl p-3" style={{ background: s.bg, border: s.dark ? "none" : "1px solid rgba(25,37,20,0.08)" }}>
                    <div className="text-[10px] font-semibold uppercase tracking-widest mb-1" style={{ color: s.dark ? "rgba(255,255,255,0.85)" : "rgba(25,37,20,0.45)" }}>{s.label}</div>
                    <div className="font-black text-2xl" style={{ color: s.dark ? "white" : "var(--green-dark)", letterSpacing: "-0.02em" }}>{s.val}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating alert */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-3.5 flex items-center gap-2.5" style={{ border: "1px solid rgba(25,37,20,0.08)", boxShadow: "0 16px 40px rgba(25,37,20,0.12)", minWidth: 200 }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(236,173,32,0.15)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ecad20" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: "var(--green-dark)" }}>Heavy Rainfall Alert</div>
                <div className="text-[11px] mt-0.5" style={{ color: "rgba(25,37,20,0.5)" }}>Expected in 12h · High severity</div>
              </div>
            </div>
            {/* Floating pump */}
            <div className="absolute -top-4 -left-5 rounded-2xl px-4 py-3 flex items-center gap-2.5" style={{ background: "var(--green-dark)", boxShadow: "0 16px 40px rgba(25,37,20,0.25)" }}>
              <div className="w-2 h-2 rounded-full bg-[#55BB33]" />
              <span className="text-white text-xs font-semibold">Pump · Auto · ON</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Marquee ───────────────────────────────────────────────────────────────
function Marquee() {
  const items = ["IoT Sensors", "Real-time Analytics", "AI Recommendations", "Smart Irrigation", "Crop Monitoring", "Plug & Play Setup", "Weather Alerts", "Multi-platform"];
  const track = [...items, ...items];
  return (
    <section className="py-8 overflow-hidden bg-white" style={{ borderTop: "1px solid rgba(25,37,20,0.06)", borderBottom: "1px solid rgba(25,37,20,0.06)" }}>
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} className="flex items-center gap-12 pr-12 whitespace-nowrap">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(25,37,20,0.35)" }}>{item}</span>
            <span style={{ color: "rgba(25,37,20,0.2)" }}>●</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ── Features ──────────────────────────────────────────────────────────────
function Features() {
  return (
    <section id="features" className="py-28 max-w-6xl mx-auto px-6">
      <Reveal className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)" }}>Platform Features</span>
        <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--green-dark)" }}>
          Everything your farm needs,<br /><span style={{ color: "var(--green-primary)" }}>nothing it doesn't.</span>
        </h2>
        <p className="text-base mx-auto" style={{ color: "rgba(25,37,20,0.6)", lineHeight: 1.7, maxWidth: 560 }}>
          Six core capabilities that transform raw environmental data into clear, actionable farm management.
        </p>
      </Reveal>

      <div className="grid gap-5" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
        {/* Feature 1 — wide */}
        <Reveal className="col-span-full md:col-span-2 rounded-3xl p-7 grid grid-cols-1 md:grid-cols-2 gap-8 items-center" style={{ background: "var(--green-dark)", border: "1px solid transparent" }}>
          <div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: "rgba(85,187,51,0.2)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
            </div>
            <h3 className="font-black text-2xl text-white mb-3" style={{ letterSpacing: "-0.02em" }}>Real-time Sensor Monitoring</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>Four environmental sensors track soil moisture, temperature, air humidity, and light intensity — refreshed continuously so you never miss a critical change.</p>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { label: "Soil", val: "45.2%", highlight: false },
              { label: "Temp", val: "24.5°C", highlight: true },
              { label: "Humidity", val: "65%", highlight: false },
              { label: "Light", val: "1450 lux", highlight: false },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-3.5" style={{ background: s.highlight ? "rgba(85,187,51,0.3)" : "rgba(255,255,255,0.08)" }}>
                <div className="text-[10px] font-semibold uppercase tracking-widest mb-1.5" style={{ color: s.highlight ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)" }}>{s.label}</div>
                <div className="font-black text-2xl" style={{ color: s.highlight ? "white" : "#55BB33" }}>{s.val}</div>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Feature 2-6 */}
        {[
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M9 9h6M9 12h6M9 15h4" /></svg>, iconBg: "rgba(85,187,51,0.1)", title: "AI-Powered Crop Advisor", desc: "Chat with an intelligent assistant that understands your crop type, growth stage, and current conditions to give precise, context-aware recommendations." },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ecad20" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>, iconBg: "rgba(236,173,32,0.12)", title: "Smart Monitoring Alerts", desc: "Frost risk, heavy rainfall, overwatering — Sahla Farm detects environmental threats before they cause damage and alerts you instantly." },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a9e1e" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>, iconBg: "rgba(189,214,48,0.12)", title: "Intelligent Actuator Control", desc: "Automate your pump and ventilation systems. Switch between fully automatic, semi-automatic, or manual modes — complete control at every level." },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#192514" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>, iconBg: "rgba(25,37,20,0.06)", title: "Live Camera Stream", desc: "Visual monitoring of your crops from anywhere in the world. Never miss a critical visual change in field conditions or plant health." },
          { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a8a1e" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>, iconBg: "rgba(85,187,51,0.15)", title: "Historical Data & Trends", desc: "7-day sensor histories with interactive charts. Understand patterns, compare crop cycles, and make smarter decisions based on your farm's real data.", tint: true },
        ].map((f, i) => (
          <Reveal key={f.title} delay={i * 50} className="rounded-3xl p-7 border transition-all duration-300 cursor-default group" style={{ background: f.tint ? "rgba(85,187,51,0.06)" : "white", border: f.tint ? "1px solid rgba(85,187,51,0.2)" : "1px solid rgba(25,37,20,0.07)" }}
            onMouseOver={(e) => { if (!f.tint) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(25,37,20,0.1)"; e.currentTarget.style.borderColor = "rgba(85,187,51,0.3)"; } }}
            onMouseOut={(e) => { if (!f.tint) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "rgba(25,37,20,0.07)"; } }}>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: f.iconBg }}>{f.icon}</div>
            <h3 className="font-bold text-xl mb-2.5" style={{ letterSpacing: "-0.02em", color: "var(--green-dark)" }}>{f.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(25,37,20,0.6)" }}>{f.desc}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { n: 1, title: "Plug in the Sahla Box", desc: "Place the Sahla Box in your field. Connect power. That's it — it self-configures using your Wi-Fi or GSM connection." },
    { n: 2, title: "Configure your crop", desc: "Select your crop type, growth stage, and farming mode. Sahla Farm tailors its monitoring and recommendations to your exact situation." },
    { n: 3, title: "Monitor in real time", desc: "Your dashboard comes alive with live sensor data, charts, alerts, and actuator status — accessible from any device, anywhere." },
    { n: 4, title: "Act on AI insights", desc: "Receive personalized recommendations from the AI advisor. Automate irrigation, manage ventilation, and grow with confidence." },
  ];
  return (
    <section id="how" className="py-28 relative overflow-hidden" style={{ background: "var(--green-dark)" }}>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(85,187,51,0.08) 0%, transparent 70%)" }} />
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <Reveal className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(85,187,51,0.15)", color: "#7edd55", border: "1px solid rgba(85,187,51,0.3)" }}>Simple setup</span>
          <h2 className="font-black leading-tight text-white mb-4" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em" }}>
            Up and running<br /><span style={{ color: "var(--green-primary)" }}>in four steps.</span>
          </h2>
          <p className="text-base mx-auto" style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.7, maxWidth: 480 }}>No technical expertise required. The Sahla Box does the heavy lifting.</p>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 100} className="rounded-3xl p-7" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg text-white shrink-0" style={{ background: i === 0 ? "#55BB33" : i === 1 ? "rgba(85,187,51,0.4)" : i === 2 ? "rgba(85,187,51,0.25)" : "rgba(85,187,51,0.1)", color: i === 3 ? "rgba(85,187,51,0.7)" : "white" }}>
                  {s.n}
                </div>
                {i < 3 && <div className="h-px flex-1" style={{ background: `linear-gradient(to right, rgba(85,187,51,${0.5 - i * 0.15}), transparent)` }} />}
              </div>
              <h3 className="font-bold text-lg text-white mb-2.5" style={{ letterSpacing: "-0.02em" }}>{s.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Dashboard Preview ─────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <section id="dashboard" className="py-28 max-w-6xl mx-auto px-6">
      <Reveal className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)" }}>Live dashboard</span>
        <h2 className="font-black leading-tight mb-4" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--green-dark)" }}>
          Your farm,<br /><span style={{ color: "var(--green-primary)" }}>at a glance.</span>
        </h2>
        <p className="text-base mx-auto" style={{ color: "rgba(25,37,20,0.6)", lineHeight: 1.7, maxWidth: 560 }}>A command center designed to surface exactly what matters — clean, fast, and actionable.</p>
      </Reveal>

      <Reveal className="bg-white rounded-[28px] overflow-hidden" style={{ border: "1px solid rgba(25,37,20,0.08)", boxShadow: "0 40px 100px rgba(25,37,20,0.12)" }}>
        {/* Title bar */}
        <div className="flex items-center gap-2 px-6 py-3.5" style={{ background: "#F5F7F2", borderBottom: "1px solid rgba(25,37,20,0.07)" }}>
          {[{ c: "#ff5f57" }, { c: "#febc2e" }, { c: "#28c840" }].map((d) => (
            <div key={d.c} className="w-3 h-3 rounded-full" style={{ background: d.c }} />
          ))}
          <div className="flex-1 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3.5 py-1.5 text-xs" style={{ border: "1px solid rgba(25,37,20,0.1)", color: "rgba(25,37,20,0.5)" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" /></svg>
              sahlafarm.com/dashboard
            </div>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "72px 1fr", minHeight: 520 }}>
          {/* Sidebar */}
          <div className="flex flex-col items-center py-5 gap-5" style={{ background: "linear-gradient(180deg,rgba(43,32,51,1) 0%,rgba(28,35,42,1) 100%)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "rgba(85,187,51,0.2)" }}>
              <Logo size={20} />
            </div>
            {[
              <svg key="home" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
              <svg key="msg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
              <svg key="cam" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>,
            ].map((icon, i) => (
              <div key={i} className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: i === 0 ? "rgba(255,255,255,0.15)" : "transparent" }}>{icon}</div>
            ))}
          </div>

          {/* Main */}
          <div className="p-5 flex flex-col gap-3.5" style={{ background: "#F8FBF5" }}>
            {/* Chart */}
            <div className="bg-white rounded-2xl p-4" style={{ border: "1px solid rgba(25,37,20,0.07)" }}>
              <div className="flex justify-between items-center mb-3">
                <div>
                  <div className="text-[11px] font-medium uppercase tracking-widest" style={{ color: "rgba(25,37,20,0.4)" }}>Soil Moisture · %</div>
                  <div className="font-black text-lg" style={{ color: "var(--green-dark)", letterSpacing: "-0.02em" }}>This week ↓</div>
                </div>
                <div className="text-[11px] px-2.5 py-1 rounded-md" style={{ color: "rgba(25,37,20,0.5)", background: "rgba(25,37,20,0.06)" }}>MON–SUN</div>
              </div>
              <svg width="100%" height="70" viewBox="0 0 600 70" preserveAspectRatio="none">
                <path d="M0,50 L86,42 L171,35 L257,55 L343,22 L428,30 L514,15 L600,28" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M0,50 L86,42 L171,35 L257,55 L343,22 L428,30 L514,15 L600,28 L600,70 L0,70Z" fill="rgba(85,187,51,0.07)" />
              </svg>
            </div>

            {/* Sensor grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { label: "Soil Moisture", val: "45.2%", active: true },
                { label: "Temperature", val: "24.5°C", active: false },
                { label: "Humidity", val: "65%", active: false },
                { label: "Light", val: "1450 lux", active: false },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3" style={{ background: s.active ? "#55BB33" : "white", border: s.active ? "none" : "1px solid rgba(25,37,20,0.07)" }}>
                  <div className="text-[9px] font-semibold uppercase tracking-widest mb-2" style={{ color: s.active ? "rgba(255,255,255,0.8)" : "rgba(25,37,20,0.4)" }}>{s.label}</div>
                  <div className="font-black text-xl" style={{ color: s.active ? "white" : "var(--green-dark)", letterSpacing: "-0.02em" }}>{s.val}</div>
                </div>
              ))}
            </div>

            {/* Actuators + Crop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="flex flex-col gap-2.5">
                {[
                  { label: "Pump · Auto", time: "08:00 – 08:20", status: "OFF", on: false },
                  { label: "Fan · Semi-auto", time: "14:00 – 14:30", status: "ON", on: true },
                ].map((a) => (
                  <div key={a.label} className="rounded-2xl p-3.5 flex items-center justify-between" style={{ background: "#192514" }}>
                    <div>
                      <div className="text-[10px] font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>{a.label}</div>
                      <div className="text-sm font-bold text-white mt-0.5">{a.time}</div>
                    </div>
                    <div className="text-[11px] font-bold px-2.5 py-1 rounded-lg" style={{ background: a.on ? "#55BB33" : "rgba(85,187,51,0.25)", color: a.on ? "white" : "#7edd55" }}>{a.status}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl p-3.5 flex flex-col justify-between" style={{ background: "#192514" }}>
                <div className="text-[10px] font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.5)" }}>Crop Info</div>
                <div className="text-sm font-semibold text-white mt-1.5">🌿 Tomatoes</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>Flowering · Growth priority</div>
                <div className="mt-2.5 text-[11px] leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>AI: Water promptly — soil is very dry and overheating detected.</div>
              </div>
            </div>
          </div>
        </div>
      </Reveal>

      <div className="text-center mt-10">
        <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-[#F5F7F2] no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ background: "var(--green-dark)" }}>
          Get dashboard access →
        </Link>
      </div>
    </section>
  );
}

// ── About ─────────────────────────────────────────────────────────────────
function About() {
  const values = [
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, iconBg: "rgba(85,187,51,0.12)", title: "Reliable by design", desc: "Edge computing ensures your farm stays monitored even without internet connectivity." },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ecad20" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>, iconBg: "rgba(236,173,32,0.12)", title: "Accessible to everyone", desc: "Plug & Play setup. No engineers needed — any farmer can deploy Sahla in minutes." },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#192514" strokeWidth="2" strokeLinecap="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" /></svg>, iconBg: "rgba(25,37,20,0.06)", title: "Built to scale", desc: "From a small greenhouse to a large farm — Sahla grows with your operation seamlessly." },
  ];

  return (
    <section id="about" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)" }}>Our story</span>
            <h2 className="font-black leading-tight mb-6" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--green-dark)" }}>
              Born from a<br /><span style={{ color: "var(--green-primary)" }}>real problem.</span>
            </h2>
            <p className="text-base leading-relaxed mb-5" style={{ color: "rgba(25,37,20,0.65)" }}>Sahla Farm was born from a real-world challenge: how can farmers monitor their crops efficiently without expensive infrastructure or technical barriers?</p>
            <p className="text-base leading-relaxed mb-8" style={{ color: "rgba(25,37,20,0.65)" }}>We are a team passionate about technology and sustainability. Instead of overwhelming farmers with complexity, we focused on building a solution that is intuitive, reliable, and scalable.</p>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Mission", text: "Simplify smart agriculture through reliable IoT systems every farmer can use." },
                { label: "Vision", text: "Farms that are connected, efficient, and sustainable — technology enhancing nature." },
              ].map((m) => (
                <div key={m.label} className="p-5 rounded-2xl" style={{ background: "#F5F7F2" }}>
                  <div className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "rgba(25,37,20,0.45)" }}>{m.label}</div>
                  <div className="text-sm leading-relaxed" style={{ color: "var(--green-dark)" }}>{m.text}</div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150} className="flex flex-col gap-5">
            {values.map((v) => (
              <div key={v.title} className="flex gap-4 p-5 rounded-2xl transition-all duration-300 cursor-default" style={{ background: "#F5F7F2" }}
                onMouseOver={(e) => { e.currentTarget.style.background = "white"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(25,37,20,0.08)"; }}
                onMouseOut={(e) => { e.currentTarget.style.background = "#F5F7F2"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: v.iconBg }}>{v.icon}</div>
                <div>
                  <div className="font-bold text-base mb-1.5" style={{ letterSpacing: "-0.01em", color: "var(--green-dark)" }}>{v.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(25,37,20,0.6)" }}>{v.desc}</div>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Benefits ──────────────────────────────────────────────────────────────
function Benefits() {
  const items = [
    { val: "40%", label: "Water Savings", desc: "Precise irrigation scheduling eliminates waste and ensures crops get exactly what they need.", dark: false, color: "var(--green-primary)" },
    { val: "3x", label: "Yield Increase", desc: "Optimal growing conditions maintained round the clock lead to healthier, more productive harvests.", dark: true, color: "#55BB33" },
    { val: "0", label: "Technical barriers", desc: "No engineering degree required. If you can plug in a device, you can run a smart farm.", dark: false, color: "var(--golden)" },
  ];
  return (
    <section className="py-28 max-w-6xl mx-auto px-6">
      <Reveal className="text-center mb-16">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)" }}>Real outcomes</span>
        <h2 className="font-black leading-tight" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--green-dark)" }}>
          Results that<br /><span style={{ color: "var(--green-primary)" }}>speak for themselves.</span>
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {items.map((item, i) => (
          <Reveal key={item.label} delay={i * 100} className="rounded-3xl p-10 text-center border transition-all duration-300 cursor-default"
            style={{ background: item.dark ? "var(--green-dark)" : "white", border: item.dark ? "1px solid transparent" : "1px solid rgba(25,37,20,0.07)" }}
            onMouseOver={(e) => { if (!item.dark) { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(25,37,20,0.1)"; } }}
            onMouseOut={(e) => { if (!item.dark) { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; } }}>
            <div className="font-black leading-none mb-3" style={{ fontSize: 56, color: item.color, letterSpacing: "-0.03em" }}>{item.val}</div>
            <div className="font-bold text-lg mb-2" style={{ letterSpacing: "-0.02em", color: item.dark ? "white" : "var(--green-dark)" }}>{item.label}</div>
            <div className="text-sm leading-relaxed" style={{ color: item.dark ? "rgba(255,255,255,0.55)" : "rgba(25,37,20,0.55)" }}>{item.desc}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

// ── CTA ───────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 max-w-6xl mx-auto px-6">
      <Reveal className="rounded-[32px] px-16 py-20 text-center relative overflow-hidden" style={{ background: "var(--green-dark)" }}>
        <div className="absolute -top-12 -right-12 w-72 h-72 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(85,187,51,0.15) 0%, transparent 70%)" }} />
        <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(189,214,48,0.1) 0%, transparent 70%)" }} />
        <div className="relative z-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6" style={{ background: "rgba(85,187,51,0.15)", color: "#7edd55", border: "1px solid rgba(85,187,51,0.3)" }}>Start today</span>
          <h2 className="font-black text-white leading-tight mb-5" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em" }}>
            Your farm deserves<br />smarter technology.
          </h2>
          <p className="text-base mb-10 mx-auto" style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: 480 }}>
            Join farmers already using Sahla Farm to reduce waste, increase yields, and farm with confidence.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/signup" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white no-underline transition-all duration-200 hover:-translate-y-0.5" style={{ background: "#55BB33" }}>Get started for free →</Link>
            <a href="#dashboard" className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold text-sm text-white no-underline transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10" style={{ border: "1.5px solid rgba(255,255,255,0.25)" }}>View demo</a>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────
function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => { setSending(false); setSubmitted(true); }, 1200);
  };

  const inputStyle = {
    width: "100%", padding: "12px 16px",
    border: "1.5px solid rgba(25,37,20,0.12)", borderRadius: 12,
    fontSize: 15, fontFamily: "Poppins, sans-serif",
    color: "var(--green-dark)", background: "white", outline: "none",
  };

  const contactInfo = [
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>, label: "Email", value: "contact@sahlafarm.com" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>, label: "Location", value: "Algiers, Algeria" },
    { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>, label: "Response time", value: "Within 24 hours" },
  ];

  return (
    <section id="contact" className="py-28 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start">
          <Reveal>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6" style={{ background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)" }}>Get in touch</span>
            <h2 className="font-black leading-tight mb-5" style={{ fontSize: "clamp(32px,5vw,52px)", letterSpacing: "-0.03em", color: "var(--green-dark)" }}>
              Let's talk about<br /><span style={{ color: "var(--green-primary)" }}>your farm.</span>
            </h2>
            <p className="text-base leading-relaxed mb-10" style={{ color: "rgba(25,37,20,0.6)" }}>Whether you're a small greenhouse grower or a large-scale operation, we'd love to show you how Sahla Farm can transform your workflow.</p>
            <div className="flex flex-col gap-5">
              {contactInfo.map((c) => (
                <div key={c.label} className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#F5F7F2" }}>{c.icon}</div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-widest mb-0.5" style={{ color: "rgba(25,37,20,0.4)" }}>{c.label}</div>
                    <div className="text-sm font-medium" style={{ color: "var(--green-dark)" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(25,37,20,0.6)" }}>First name</label>
                  <input type="text" placeholder="Yahia" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#55BB33")} onBlur={(e) => (e.target.style.borderColor = "rgba(25,37,20,0.12)")} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(25,37,20,0.6)" }}>Last name</label>
                  <input type="text" placeholder="Gueroudji" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#55BB33")} onBlur={(e) => (e.target.style.borderColor = "rgba(25,37,20,0.12)")} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(25,37,20,0.6)" }}>Email</label>
                <input type="email" placeholder="you@sahlafarm.com" style={inputStyle} onFocus={(e) => (e.target.style.borderColor = "#55BB33")} onBlur={(e) => (e.target.style.borderColor = "rgba(25,37,20,0.12)")} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(25,37,20,0.6)" }}>Farm type</label>
                <select style={{ ...inputStyle, appearance: "none", cursor: "pointer" }} onFocus={(e) => (e.target.style.borderColor = "#55BB33")} onBlur={(e) => (e.target.style.borderColor = "rgba(25,37,20,0.12)")}>
                  <option value="" disabled>Select your farm type</option>
                  {["Greenhouse", "Open field", "Vertical farm", "Orchard", "Other"].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "rgba(25,37,20,0.6)" }}>Message</label>
                <textarea placeholder="Tell us about your farm and what you're looking for..." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={(e) => (e.target.style.borderColor = "#55BB33")} onBlur={(e) => (e.target.style.borderColor = "rgba(25,37,20,0.12)")} />
              </div>
              {!submitted ? (
                <button type="submit" className="w-full py-4 rounded-full font-semibold text-sm text-[#F5F7F2] transition-all duration-200 hover:-translate-y-0.5 cursor-pointer border-none" style={{ background: "var(--green-dark)", opacity: sending ? 0.7 : 1 }}>
                  {sending ? "Sending..." : "Send message →"}
                </button>
              ) : (
                <div className="text-center py-3 rounded-xl text-sm font-semibold" style={{ color: "#3a8a1e", background: "rgba(85,187,51,0.1)" }}>
                  ✓ Message sent! We'll be in touch within 24 hours.
                </div>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────
function Footer() {
  const product = ["Features", "Dashboard", "How it works", "Mobile app"];
  const company = ["About us", "Contact", "Blog"];
  const legal = ["Privacy", "Terms"];
  return (
    <footer className="px-6 pt-16 pb-8" style={{ background: "var(--green-dark)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pb-12" style={{ borderBottom: "1px solid rgba(245,247,242,0.1)" }}>
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={32} />
              <span className="font-black text-lg text-white" style={{ letterSpacing: "-0.03em" }}>SahlaFarm</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(245,247,242,0.5)", maxWidth: 280 }}>Smarter farms, stronger yields, sustainable futures. Innovation in the palm of your hands.</p>
          </div>

          {[
            { title: "Product", links: product },
            { title: "Company", links: company },
            { title: "Legal", links: legal },
          ].map((col) => (
            <div key={col.title}>
              <div className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: "rgba(245,247,242,0.35)" }}>{col.title}</div>
              <div className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <a key={l} href="#" className="text-sm no-underline transition-colors duration-200" style={{ color: "rgba(245,247,242,0.6)" }}
                    onMouseOver={(e) => (e.target.style.color = "white")}
                    onMouseOut={(e) => (e.target.style.color = "rgba(245,247,242,0.6)")}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-wrap justify-between items-center gap-3">
          <span className="text-xs" style={{ color: "rgba(245,247,242,0.35)" }}>© 2026 SahlaFarm. All rights reserved.</span>
          <span className="text-xs" style={{ color: "rgba(245,247,242,0.35)" }}>Algiers, Algeria · sahlafarm.com</span>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Poppins, sans-serif" }}>
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <HowItWorks />
      <DashboardPreview />
      <About />
      <Benefits />
      <CTA />
      <Contact />
      <Footer />
    </div>
  );
}