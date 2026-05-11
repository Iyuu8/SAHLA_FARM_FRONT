import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ── Minimal Custom CSS (Only for Keyframes & Noise Background) ──
const customStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');

  body { font-family: 'Poppins', sans-serif; background: #F5F7F2; color: #192514; overflow-x: hidden; }
  body::before {
    content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.4;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(25,37,20,0.2); border-radius: 3px; }
  
  .hide-scrollbar::-webkit-scrollbar { display: none; }
  .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

  @keyframes float { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
  @keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.4); opacity: 0; } }
  @keyframes slide-up { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
  @keyframes draw { from { stroke-dashoffset: 400; } to { stroke-dashoffset: 0; } }
  @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

  .animate-float { animation: float 4s ease-in-out infinite; }
  .animate-slide-up { animation: slide-up 0.7s ease-out both; }
  .animate-fade { animation: fade-in 0.6s ease-out both; }
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .chart-path { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw 2s ease-out 0.5s both; }
  .marquee-track { display: flex; animation: marquee 20s linear infinite; width: max-content; }
  .marquee-track:hover { animation-play-state: paused; }
`;

// ── Reusable Tailwind Class Strings ──
const classes = {
  btnPrimary: "bg-[#192514] text-[#F5F7F2] px-6 sm:px-8 py-3.5 rounded-full font-semibold text-[14px] sm:text-[15px] cursor-pointer border-none transition-all duration-300 inline-flex items-center justify-center gap-2 hover:bg-[#2a3d20] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(25,37,20,0.25)]",
  btnSecondary: "bg-transparent text-[#192514] px-6 sm:px-8 py-3.5 rounded-full font-semibold text-[14px] sm:text-[15px] cursor-pointer border-[1.5px] border-[#192514]/25 transition-all duration-300 inline-flex items-center justify-center gap-2 hover:border-[#192514] hover:bg-[#192514]/5 hover:-translate-y-0.5",
  badge: "inline-flex items-center gap-1.5 bg-[#55BB33]/10 text-[#3a8a1e] text-[12px] sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-[#55BB33]/25 tracking-wide",
  navLink: "text-[#192514]/65 text-[15px] font-medium no-underline transition-colors duration-200 hover:text-[#192514]",
  card: "bg-white rounded-3xl border border-[#192514]/10 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(25,37,20,0.1)] hover:border-[#55BB33]/30"
};

// ── Logo SVG ──
function Logo() {
  return (
    <svg width="36" height="36" viewBox="0 0 44 45" fill="none" className="shrink-0 w-8 h-8 sm:w-9 sm:h-9">
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
}

// ── useReveal hook ──
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ══════════════════ NAV ══════════════════
function Nav() {
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Features","How it works","Dashboard","About","Contact"];
  const hrefs = ["#features","#how","#dashboard","#about","#contact"];

  return (
    <>
      <nav className={`fixed top-0 inset-x-0 z-[100] backdrop-blur-[20px] transition-all duration-300 ${scrolled ? "bg-[#F5F7F2]/95 border-b border-[#192514]/10 shadow-[0_2px_20px_rgba(25,37,20,0.08)]" : "bg-[#F5F7F2]/85 border-b-transparent"}`}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-[72px] flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 no-underline">
            <Logo />
            <span className="font-extrabold tracking-tight text-[18px] sm:text-[20px] text-[#192514]">SahlaFarm</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {links.map((l, i) => <a key={l} href={hrefs[i]} className={classes.navLink}>{l}</a>)}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className={`${classes.btnSecondary} px-5 py-2 text-sm`}>{t('landing.login', 'Log in')}</Link>
            <Link to="/signup" className={`${classes.btnPrimary} px-5 py-2 text-sm`}>{t('landing.signup', 'Get Started →')}</Link>
          </div>

          <div className="flex md:hidden items-center gap-4">

            <button className="flex flex-col gap-[5px] p-1 bg-transparent border-none cursor-pointer" onClick={() => setMenuOpen(!menuOpen)}>
              {[0,1,2].map(i => <span key={i} className="block w-[22px] h-[2px] bg-[#192514] rounded-sm"/>)}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed top-[72px] inset-x-0 bg-[#F5F7F2]/95 border-b border-[#192514]/10 px-6 py-5 flex flex-col gap-4 z-[99] backdrop-blur-[20px] md:hidden">
          {links.map((l, i) => <a key={l} href={hrefs[i]} className="text-[#192514] font-medium no-underline text-[17px]" onClick={() => setMenuOpen(false)}>{l}</a>)}
          <Link to="/login" className={`${classes.btnSecondary} text-center mt-2 justify-center`} onClick={() => setMenuOpen(false)}>{t('landing.login', 'Log in')}</Link>
          <Link to="/signup" className={`${classes.btnPrimary} text-center mt-2 justify-center`} onClick={() => setMenuOpen(false)}>{t('landing.signup', 'Get Started →')}</Link>
        </div>
      )}
    </>
  );
}

// ══════════════════ HERO ══════════════════
function Hero() {
  return (
    <section className="min-h-screen flex items-center pt-[90px] md:pt-[72px] relative overflow-hidden bg-[radial-gradient(ellipse_100%_60%_at_50%_-10%,rgba(85,187,51,0.15)_0%,transparent_70%)]">
      <div className="absolute top-[10%] -right-[5%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] rounded-full bg-[radial-gradient(circle,rgba(85,187,51,0.08)_0%,transparent_70%)] pointer-events-none"/>
      <div className="absolute bottom-[5%] -left-[10%] w-[200px] md:w-[400px] h-[200px] md:h-[400px] rounded-full bg-[radial-gradient(circle,rgba(189,214,48,0.07)_0%,transparent_70%)] pointer-events-none"/>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 md:py-20 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center text-center lg:text-left">

          {/* Left */}
          <div className="flex flex-col gap-6 md:gap-7 items-center lg:items-start">
            <div className="animate-fade" style={{ animationDelay:"0.1s" }}>
              <span className={classes.badge}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#55BB33] inline-block animate-[pulse-ring_1.5s_ease-out_infinite]"/>
                IoT · AI · Real-time monitoring
              </span>
            </div>

            <h1 className="animate-slide-up font-extrabold tracking-tight leading-[1.1] text-[38px] sm:text-[48px] md:text-[60px] lg:text-[68px]" style={{ animationDelay:"0.2s" }}>
              Innovation<br className="hidden sm:block"/> in the <span className="text-[#55BB33]">palm</span><br className="hidden sm:block"/> of your hands.
            </h1>

            <p className="animate-slide-up text-[15px] sm:text-[17px] text-[#192514]/65 leading-relaxed max-w-[480px]" style={{ animationDelay:"0.35s" }}>
              Sahla Farm bridges traditional farming knowledge with real-time IoT data, AI-powered insights, and intelligent automation — making smart agriculture accessible to every farmer.
            </p>

            <div className="animate-slide-up flex flex-col sm:flex-row gap-3 w-full sm:w-auto" style={{ animationDelay:"0.5s" }}>
              <Link to="/signup" className={`${classes.btnPrimary} w-full sm:w-auto`}>Start farming smarter →</Link>
              <a href="#dashboard" className={`${classes.btnSecondary} w-full sm:w-auto`}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                See it in action
              </a>
            </div>

            <div className="animate-slide-up flex flex-wrap justify-center lg:justify-start gap-6 sm:gap-8 pt-6 border-t border-[#192514]/10 w-full" style={{ animationDelay:"0.65s" }}>
              {[["40%","Less water"],["24/7","Monitoring"],["3x","Yield boost"]].map(([val, label], i) => (
                <div key={i} className="flex gap-6 sm:gap-8 items-center">
                  {i > 0 && <div className="w-px h-8 bg-[#192514]/10 hidden sm:block"/>}
                  <div className="text-center lg:text-left">
                    <div className="font-extrabold text-[24px] sm:text-[32px] text-[#192514] tracking-tight">{val}</div>
                    <div className="text-[12px] sm:text-[13px] text-[#192514]/55 mt-0.5">{label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Dashboard card */}
          <div className="animate-float hidden lg:block relative w-full max-w-[500px] mx-auto">
            <div className="bg-white rounded-[28px] border border-[#192514]/10 p-5 shadow-[0_32px_80px_rgba(25,37,20,0.15)]">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <div className="text-[11px] text-[#192514]/45 font-medium uppercase tracking-widest">Soil Moisture</div>
                  <div className="font-extrabold text-[28px] tracking-tight">45.2<span className="text-[14px] font-medium ml-0.5">%</span></div>
                </div>
                <div className="bg-[#55BB33]/10 text-[#3a8a1e] px-3.5 py-1.5 rounded-full text-[12px] font-semibold">This week ↓</div>
              </div>
              <svg width="100%" height="110" viewBox="0 0 400 110" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#55BB33" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#55BB33" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path d="M0,80 L57,70 L114,60 L171,85 L228,40 L285,50 L342,30 L400,45" fill="url(#chartGrad)"/>
                <path d="M0,80 L57,70 L114,60 L171,85 L228,40 L285,50 L342,30 L400,45" fill="none" stroke="#55BB33" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="chart-path"/>
              </svg>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {[
                  { label:"TEMPERATURE", val:"24.5°C", active:true },
                  { label:"HUMIDITY",    val:"65%",    active:false },
                  { label:"SOIL MOISTURE",val:"45.2%", active:false },
                  { label:"LIGHT",       val:"1450 lux",active:false },
                ].map(({ label, val, active }) => (
                  <div key={label} className={`rounded-2xl p-3 ${active ? 'bg-[#55BB33] border-none' : 'bg-white border border-[#192514]/10'}`}>
                    <div className={`text-[10px] font-semibold mb-1 uppercase tracking-widest ${active ? 'text-white/85' : 'text-[#192514]/45'}`}>{label}</div>
                    <div className={`font-extrabold text-[22px] tracking-tight ${active ? 'text-white' : 'text-[#192514]'}`}>{val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Floating alert */}
            <div className="absolute -bottom-5 -right-5 bg-white rounded-2xl py-3.5 px-4.5 border border-[#192514]/10 shadow-[0_16px_40px_rgba(25,37,20,0.12)] flex items-center gap-2.5 min-w-[260px]">
              <div className="w-8 h-8 rounded-lg bg-[#ecad20]/15 flex items-center justify-center text-[#ecad20]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              </div>
              <div>
                <div className="text-[12px] font-bold text-[#192514]">AI Advisor Alert</div>
                <div className="text-[11px] text-[#192514]/50">Moisture dropping. Auto-water in 10m.</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ══════════════════ MARQUEE ══════════════════
function Marquee() {
  const items = ["NO SUBSCRIPTION FEES", "FULL DATA PRIVACY", "WORKS OFFLINE", "OPEN ARCHITECTURE", "LOCALLY HOSTED"];
  const track = [...items, ...items];

  return (
    <section className="py-6 md:py-8 border-y border-[#192514]/5 bg-white overflow-hidden">
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={i} className={`inline-flex items-center gap-8 md:gap-12 ${i % items.length === items.length - 1 ? 'pr-8 md:pr-12' : ''}`}>
            <span className="text-[12px] md:text-[13px] font-semibold text-[#192514]/35 tracking-widest uppercase whitespace-nowrap pl-8 md:pl-12">{item}</span>
            <span className="text-[#192514]/20 text-[10px]">●</span>
          </span>
        ))}
      </div>
    </section>
  );
}

// ══════════════════ FEATURES ══════════════════
function Features() {
  return (
    <section id="features" className="py-16 md:py-24 lg:py-[120px] px-4 sm:px-6 max-w-[1200px] mx-auto">
      <div className="text-center mb-12 lg:mb-[72px] reveal">
        <span className={`${classes.badge} mb-4 inline-flex`}>Platform Features</span>
        <h2 className="font-extrabold tracking-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] mb-4">
          Everything your farm needs,<br/><span className="text-[#55BB33]">nothing it doesn't.</span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-[#192514]/60 leading-relaxed max-w-[560px] mx-auto">
          Six core capabilities that transform raw environmental data into clear, actionable farm management.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Wide feature */}
        <div className={`${classes.card} reveal md:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-[#192514] border-transparent text-white`}>
          <div>
            <div className="w-12 h-12 rounded-xl bg-[#55BB33]/20 flex items-center justify-center mb-5">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 className="text-[22px] sm:text-2xl font-extrabold text-white tracking-tight mb-3">Real-time Sensor Monitoring</h3>
            <p className="text-white/65 leading-relaxed text-[14px] sm:text-[15px]">Four environmental sensors track soil moisture, temperature, air humidity, and light intensity — refreshed continuously so you never miss a sudden change in conditions.</p>
          </div>
          <div className="bg-white/5 rounded-2xl p-4 sm:p-5 flex gap-2 sm:gap-3 flex-wrap">
            {[
              { label:"Temp", val:"24°" }, { label:"Hum", val:"65%" },
              { label:"Soil", val:"45%" }, { label:"Light", val:"1.4k" }
            ].map(s => (
              <div key={s.label} className="flex-auto basis-[45%] lg:basis-[40%] bg-white/5 p-3 rounded-xl">
                <div className="text-[10px] sm:text-[11px] text-white/50 uppercase tracking-widest mb-1">{s.label}</div>
                <div className="text-[18px] sm:text-[20px] font-bold text-white">{s.val}</div>
              </div>
            ))}
          </div>
        </div>

        {[
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
            iconBg:"bg-[#55BB33]/15", title:"AI Crop Advisor", desc:"Chat naturally with your farm data. The AI analyzes historical trends and current conditions to give specific advice for whatever you are currently growing."
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ecad20" strokeWidth="2" strokeLinecap="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
            iconBg:"bg-[#ecad20]/10", title:"Smart Monitoring Alerts", desc:"Frost risk, heavy rainfall, overwatering — Sahla Farm detects environmental threats before they cause damage and alerts you instantly."
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#8a9e1e" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/></svg>,
            iconBg:"bg-[#bdd630]/10", title:"Intelligent Actuator Control", desc:"Automate your pump and ventilation systems. Switch between fully automatic, semi-automatic, or manual modes — complete control at every level."
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#192514" strokeWidth="2" strokeLinecap="round"><path d="M23 7l-7 5 7 5V7z"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
            iconBg:"bg-[#192514]/5", title:"Live Camera Stream", desc:"Visual monitoring of your crops from anywhere in the world. Never miss a critical visual change in field conditions or plant health."
          },
          {
            icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3a8a1e" strokeWidth="2" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
            iconBg:"bg-[#55BB33]/15", title:"Historical Data & Trends", desc:"7-day sensor histories with interactive charts. Understand patterns, compare crop cycles, and make smarter decisions based on your farm's real data.",
            extraClass: "bg-[#55BB33]/5 border-[#55BB33]/20"
          },
        ].map(({ icon, iconBg, title, desc, extraClass }, i) => (
          <div key={title} className={`${classes.card} reveal ${extraClass || ''}`} style={{ animationDelay:`${0.1 + i*0.05}s` }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${iconBg}`}>
              {icon}
            </div>
            <h3 className="text-[17px] sm:text-[18px] font-bold text-[#192514] tracking-tight mb-3">{title}</h3>
            <p className="text-[#192514]/65 leading-relaxed text-[13px] sm:text-[14px]">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ══════════════════ HOW IT WORKS ══════════════════
function How() {
  const steps = [
    { n:"1", title:"Place the hardware", desc:"Install the pre-configured Sahla Box in your greenhouse. It runs locally via Home Assistant.", opacity:1 },
    { n:"2", title:"Connect sensors", desc:"Plug in temperature, humidity, and soil sensors. The system recognizes them instantly.", opacity:0.7 },
    { n:"3", title:"Sync the dashboard", desc:"Log into the web app. Your live data is securely synced and available from anywhere.", opacity:0.5 },
    { n:"4", title:"Act on AI insights", desc:"Receive personalized recommendations from the AI advisor. Automate irrigation, manage ventilation, and grow with confidence.", opacity:0.3 },
  ];

  return (
    <section id="how" className="py-16 md:py-24 lg:py-[120px] px-4 sm:px-6 bg-[#192514] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[300px] md:w-[500px] h-[300px] md:h-[500px] rounded-full bg-[radial-gradient(circle,rgba(85,187,51,0.08)_0%,transparent_70%)] pointer-events-none"/>
      <div className="max-w-[1200px] mx-auto relative z-10">
        <div className="text-center mb-12 lg:mb-[72px] reveal">
          <span className="inline-flex items-center gap-1.5 bg-[#55BB33]/15 text-[#7edd55] text-[12px] sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-[#55BB33]/30 tracking-wide mb-4">Simple setup</span>
          <h2 className="font-extrabold tracking-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] text-white mb-4">
            Up and running<br/><span className="text-[#55BB33]">in four steps.</span>
          </h2>
          <p className="text-[15px] sm:text-[17px] text-white/55 leading-relaxed max-w-[560px] mx-auto">No technical expertise required. The Sahla Box does the heavy lifting.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map(({ n, title, desc, opacity }, i) => (
            <div key={n} className="reveal bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-7" style={{ animationDelay:`${i*0.1}s` }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-[18px] shrink-0" style={{ background: `rgba(85,187,51,${opacity})`, color: opacity > 0.4 ? "white" : "rgba(85,187,51,0.7)" }}>{n}</div>
                {i < 3 && <div className="h-px flex-1 hidden sm:block" style={{ background: `linear-gradient(to right, rgba(85,187,51,${opacity * 0.5}), transparent)` }}/>}
              </div>
              <h3 className="text-[18px] sm:text-[19px] font-bold text-white mb-2.5 tracking-tight">{title}</h3>
              <p className="text-white/50 text-[13px] sm:text-[14px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ══════════════════ DASHBOARD PREVIEW ══════════════════
function DashboardPreview() {
  return (
    <section id="dashboard" className="py-16 md:py-24 lg:py-[120px] px-4 sm:px-6 max-w-[1200px] mx-auto">
      <div className="text-center mb-12 lg:mb-16 reveal">
        <h2 className="font-extrabold tracking-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] mb-4">
          Your farm, <span className="text-[#55BB33]">visualized.</span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-[#192514]/60 leading-relaxed max-w-[560px] mx-auto">
          Clean, distraction-free interface designed to highlight exactly what needs your attention.
        </p>
      </div>

      {/* Wrapping the Dashboard in a horizontally scrollable container for mobile */}
      <div className="reveal w-full overflow-x-auto hide-scrollbar pb-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="min-w-[900px] bg-[#1c232a] rounded-[24px] p-2 shadow-[0_20px_50px_rgba(25,37,20,0.1)] lg:shadow-[0_40px_100px_rgba(25,37,20,0.15)] overflow-hidden">
          <div className="bg-white rounded-2xl overflow-hidden border border-[#192514]/5">
            {/* Browser header */}
            <div className="bg-[#f5f5f5] py-3 px-4 flex gap-2 items-center border-b border-[#e5e5e5]">
              <div className="flex gap-1.5">
                {["#ff5f56","#ffbd2e","#27c93f"].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background:c }}/>)}
              </div>
              <div className="bg-white rounded-md py-1 px-3 text-[12px] text-[#888] flex items-center gap-1.5 mx-auto w-[300px] justify-center shadow-sm">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                sahlafarm.com/dashboard
              </div>
            </div>

            <div className="grid grid-cols-[72px_1fr] min-h-[520px]">
              {/* Sidebar */}
              <div className="bg-gradient-to-b from-[#2b2033] to-[#1c232a] flex flex-col items-center py-5 gap-5">
                <div className="w-10 h-10 rounded-xl bg-[#55BB33]/20 flex items-center justify-center">
                  <Logo/>
                </div>
                {[
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>,
                ].map((icon, i) => (
                  <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center ${i===0 ? 'bg-white/15' : 'bg-transparent'}`}>{icon}</div>
                ))}
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col gap-3.5 bg-[#F8FBF5]">
                {/* Chart */}
                <div className="bg-white rounded-2xl border border-[#192514]/5 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <div className="text-[11px] text-[#192514]/40 font-medium uppercase tracking-widest">Soil Moisture · %</div>
                      <div className="text-[18px] font-extrabold text-[#192514] tracking-tight">This week ↓</div>
                    </div>
                    <div className="text-[11px] text-[#192514]/40 font-medium">Apr 10 - Apr 16</div>
                  </div>
                  <svg width="100%" height="80" viewBox="0 0 400 80" preserveAspectRatio="none">
                    <path d="M0,60 L50,40 L100,50 L150,20 L200,30 L250,50 L300,10 L350,30 L400,20" fill="none" stroke="#55BB33" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M0,60 L50,40 L100,50 L150,20 L200,30 L250,50 L300,10 L350,30 L400,20 L400,80 L0,80 Z" fill="rgba(85,187,51,0.05)"/>
                  </svg>
                </div>

                <div className="grid grid-cols-[2fr_1.2fr] gap-3.5 flex-1">
                  {/* Sensors */}
                  <div className="grid grid-cols-2 gap-3.5">
                    {[
                      { l:"Temp", v:"24.5", u:"°C", c:"#ecad20" },
                      { l:"Humid", v:"65", u:"%", c:"#3a8a1e" },
                      { l:"Light", v:"1.4k", u:"lx", c:"#192514" },
                      { l:"Soil", v:"45", u:"%", c:"#55BB33", a:true },
                    ].map(({ l, v, u, c, a }) => (
                      <div key={l} className={`rounded-2xl p-4 flex flex-col justify-center ${a ? 'bg-[#55BB33] border-none' : 'bg-white border border-[#192514]/5'}`}>
                        <div className={`text-[10px] uppercase tracking-widest font-semibold mb-1 ${a ? 'text-white/70' : 'text-[#192514]/40'}`}>{l}</div>
                        <div className={`text-2xl font-extrabold ${a ? 'text-white' : 'text-[#192514]'}`}>{v}<span className="text-[14px] font-medium ml-0.5">{u}</span></div>
                      </div>
                    ))}
                  </div>

                  {/* Automation & Info */}
                  <div className="flex flex-col gap-3.5">
                    <div className="bg-white border border-[#192514]/5 rounded-2xl p-3.5 flex-1 flex flex-col gap-2.5">
                      <div className="text-[10px] text-[#192514]/40 font-semibold uppercase tracking-widest">Active Rules</div>
                      {[
                        { label:"Water Pump · Auto", time:"08:00 – 08:20", on:false },
                        { label:"Fan · Semi-auto", time:"14:00 – 14:30", on:true },
                      ].map(({ label, time, on }) => (
                        <div key={label} className="bg-[#192514] rounded-xl py-3 px-3.5 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] text-white/50 mb-0.5">{label}</div>
                            <div className="text-[13px] font-bold text-white">{time}</div>
                          </div>
                          <div className={`text-[11px] font-bold py-1 px-2.5 rounded-lg ${on ? 'bg-[#55BB33] text-white' : 'bg-[#55BB33]/25 text-[#7edd55]'}`}>{on ? "ON" : "OFF"}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-[#192514] rounded-2xl p-3.5 flex flex-col justify-between">
                      <div className="text-[10px] text-white/50 mb-1.5 uppercase tracking-widest">Crop Info</div>
                      <div className="text-[13px] text-white font-semibold">🌿 Tomatoes</div>
                      <div className="text-[12px] text-white/55 mt-0.5">Flowering · Growth priority</div>
                      <div className="mt-2.5 text-[11px] text-white/50 leading-relaxed">AI: Water promptly — soil is very dry and overheating detected.</div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-6 lg:mt-10">
        <Link to="/signup" className={classes.btnPrimary}>Get dashboard access →</Link>
      </div>
    </section>
  );
}

// ══════════════════ ABOUT ══════════════════
function About() {
  return (
    <section id="about" className="py-16 md:py-24 lg:py-[120px] px-4 sm:px-6 max-w-[1200px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
        <div className="reveal text-center md:text-left">
          <span className={`${classes.badge} mb-4 inline-flex`}>Our mission</span>
          <h2 className="font-extrabold tracking-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] mb-5">
            Built for farmers,<br/><span className="text-[#55BB33]">by farmers.</span>
          </h2>
          <p className="text-[15px] sm:text-[16px] text-[#192514]/60 leading-relaxed mb-4">
            SahlaFarm was born from a simple observation: modern agricultural tech is too fragmented, too expensive, and too complicated to set up.
          </p>
          <p className="text-[15px] sm:text-[16px] text-[#192514]/60 leading-relaxed mb-8 md:mb-6">
            We believe that every farmer deserves access to the tools that optimize water usage, prevent crop loss, and automate mundane tasks. By utilizing a local Home Assistant brain, your data stays yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="bg-[#55BB33]/10 p-5 rounded-2xl flex-1 text-center md:text-left">
              <div className="font-extrabold text-2xl text-[#192514] mb-1">100%</div>
              <div className="text-[13px] text-[#192514]/60">Local processing</div>
            </div>
            <div className="bg-[#ecad20]/10 p-5 rounded-2xl flex-1 text-center md:text-left">
              <div className="font-extrabold text-2xl text-[#192514] mb-1">0</div>
              <div className="text-[13px] text-[#192514]/60">Hidden cloud fees</div>
            </div>
          </div>
        </div>
        <div className="reveal relative w-full max-w-[400px] mx-auto md:max-w-none" style={{ animationDelay:"0.2s" }}>
          <div className="w-full pb-[100%] bg-gradient-to-br from-[#55BB33]/10 to-[#55BB33]/5 rounded-[32px] border border-[#55BB33]/20"/>
          <div className="absolute inset-5 bg-[#192514] rounded-3xl flex items-center justify-center overflow-hidden shadow-[0_20px_40px_rgba(25,37,20,0.2)]">
            <div className="absolute inset-0 opacity-50 bg-noise-pattern" />
            <Logo />
          </div>
        </div>
      </div>
    </section>
  );
}

// ══════════════════ CONTACT ══════════════════
function Contact() {
  return (
    <section id="contact" className="py-16 md:py-24 lg:py-[120px] px-4 sm:px-6 bg-[#192514] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(85,187,51,0.08)_0%,transparent_70%)] pointer-events-none"/>
      <div className="max-w-[600px] mx-auto text-center relative z-10 reveal">
        <span className="inline-flex items-center gap-1.5 bg-[#55BB33]/15 text-[#7edd55] text-[12px] sm:text-[13px] font-semibold px-3.5 py-1.5 rounded-full border border-[#55BB33]/30 tracking-wide mb-6">Early access</span>
        <h2 className="font-extrabold tracking-tight text-[32px] sm:text-[40px] md:text-[52px] leading-[1.1] text-white mb-4">
          Ready to grow<br/><span className="text-[#55BB33]">smarter?</span>
        </h2>
        <p className="text-[15px] sm:text-[17px] text-white/55 leading-relaxed mb-8 md:mb-10">Join the waitlist and be first to get your Sahla Box when we launch in your region.</p>
        
        <div className="flex flex-col sm:flex-row gap-3 max-w-[400px] mx-auto">
          <input type="email" placeholder="Email address" className="flex-1 px-5 py-3.5 sm:py-4 rounded-xl border border-white/10 bg-white/5 text-white outline-none text-[15px] font-poppins text-center sm:text-left w-full"/>
          <Link to="/signup" className={`${classes.btnPrimary} justify-center px-6 py-3.5 sm:py-4 rounded-xl w-full sm:w-auto`}>Join</Link>
        </div>
      </div>
    </section>
  );
}

// ══════════════════ FOOTER ══════════════════
function Footer() {
  return (
    <footer className="bg-[#192514] border-t border-white/5 py-8 md:py-10 px-4 sm:px-6">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6 md:gap-4">
        <div className="flex items-center gap-2.5">
          <Logo/>
          <span className="font-extrabold text-[18px] text-white tracking-tight">SahlaFarm</span>
        </div>
        <p className="text-[12px] sm:text-[13px] text-white/35 text-center">© 2025 SahlaFarm. Smart agriculture, simplified.</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          {["Privacy","Terms","Contact"].map(l => (
            <a key={l} href="#" className="text-[12px] sm:text-[13px] text-white/40 no-underline hover:text-white transition-colors">{l}</a>
          ))}
        </div>
      </div>
    </footer>
  );
}

// ══════════════════ APP / LANDING PAGE ══════════════════
export default function LandingPage() {
  // Inject the required custom keyframes once
  useEffect(() => {
    if (!document.getElementById('sahla-landing-styles')) {
      const style = document.createElement("style");
      style.id = 'sahla-landing-styles';
      style.innerHTML = customStyles;
      document.head.appendChild(style);
    }
    
    return () => { 
      const style = document.getElementById('sahla-landing-styles');
      if (style) document.head.removeChild(style); 
    };
  }, []);
  
  useReveal();

  return (
    <div className="font-['Poppins',sans-serif] bg-[#F5F7F2] text-[#192514] overflow-x-hidden">
      <Nav />
      <Hero />
      <Marquee />
      <Features />
      <How />
      <DashboardPreview />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}