import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../utilities/components/login/LanguageSwitcher";

const Logo = ({ size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 44 45" fill="none">
    <path d="M22.4877 23.6092C22.4877 23.6092 24.8105 19.3465 29.7453 18.3817C29.7453 18.3817 22.5846 15.3262 15.0848 18.3817C15.0848 18.3817 19.1489 18.8649 22.4877 23.6092Z" fill="#55BB33"/>
    <path d="M22.567 26.8841C22.567 26.8841 22.6389 27.4471 22.9781 27.5545C23.3173 27.6618 33.2353 28.7243 38.2068 18.1001C38.2068 18.1001 37.7105 17.6901 35.9692 19.0307C35.9692 19.0307 31.5512 23.9084 27.882 23.7083C27.882 23.7083 27.6824 23.0884 31.9462 21.0465C31.9462 21.0465 32.9548 20.2151 32.1033 19.9304C32.1033 19.9304 27.3476 21.1132 25.204 22.7305C25.204 22.7305 23.8972 23.2397 22.567 26.8858V26.8841Z" fill="#55BB33"/>
    <path d="M22.2733 26.8859C22.2733 26.8859 22.2014 27.4488 21.8622 27.5562C21.5231 27.6636 11.605 28.726 6.63354 18.1018C6.63354 18.1018 7.12981 17.6918 8.87116 19.0324C8.87116 19.0324 13.2891 23.9101 16.9583 23.71C16.9583 23.71 17.158 23.0901 12.8942 21.0482C12.8942 21.0482 11.8855 20.2169 12.7371 19.9321C12.7371 19.9321 17.4927 21.1149 19.6364 22.7322C19.6364 22.7322 20.9431 23.2414 22.2733 26.8875V26.8859Z" fill="#55BB33"/>
    <path d="M22.8401 17.0231C22.8401 17.0231 23.3554 11.698 20.8403 9.87417C18.3238 8.05195 13.179 9.33726 12.163 7.47925C12.163 7.47925 12.4214 18.9169 21.5333 16.2178C21.5333 16.2178 20.3235 11.7143 15.6794 10.6779C15.6794 10.6779 20.9416 11.0261 22.1867 17.0443L22.8401 17.0215V17.0231Z" fill="#55BB33"/>
  </svg>
);

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 40 }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: "#192514", marginBottom: 12, borderLeft: "4px solid #55BB33", paddingLeft: 14 }}>{title}</h2>
    <div style={{ fontSize: 15, color: "rgba(25,37,20,0.7)", lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function PrivacyPage() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  return (
    <div style={{ fontFamily: "Poppins, sans-serif", background: "#F5F7F2", minHeight: "100vh" }} dir={isArabic ? "rtl" : "ltr"}>
      {/* Nav */}
      <nav style={{ background: "rgba(245,247,242,0.97)", borderBottom: "1px solid rgba(25,37,20,0.08)", position: "sticky", top: 0, zIndex: 50, backdropFilter: "blur(20px)" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 72, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <Logo size={32} />
            <span style={{ fontWeight: 900, fontSize: 20, color: "#192514", letterSpacing: "-0.03em" }}>SahlaFarm</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <LanguageSwitcher compact />
            <Link to="/login" style={{ padding: "8px 20px", borderRadius: 999, border: "1.5px solid rgba(25,37,20,0.25)", color: "#192514", textDecoration: "none", fontWeight: 600, fontSize: 14 }}>Log in</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(85,187,51,0.15) 0%, transparent 70%)", padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 999, background: "rgba(85,187,51,0.12)", color: "#3a8a1e", border: "1px solid rgba(85,187,51,0.25)", marginBottom: 24, textTransform: "uppercase", letterSpacing: "0.06em" }}>
            🔐 Privacy Policy
          </span>
          <h1 style={{ fontSize: "clamp(32px,5vw,52px)", fontWeight: 900, color: "#192514", letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: 16 }}>
            Your privacy, protected.
          </h1>
          <p style={{ fontSize: 16, color: "rgba(25,37,20,0.6)", lineHeight: 1.8 }}>
            Last updated: May 2026 · We respect your data and keep this policy clear and human-readable.
          </p>
        </div>
      </section>

      {/* Content */}
      <main style={{ maxWidth: 780, margin: "0 auto", padding: "60px 24px 100px" }}>
        <Section title="1. What We Collect">
          <p>We collect information you provide when creating an account (name, email, farm details), sensor data transmitted by your SahlaFarm hardware, and usage data to improve the platform. We do <strong>not</strong> sell your data to third parties.</p>
        </Section>

        <Section title="2. How We Use Your Data">
          <p>Your data is used exclusively to deliver the SahlaFarm service: powering your dashboard, training AI recommendations specific to your farm, and sending you alerts. Aggregated, anonymised data may be used to improve the platform for all users.</p>
        </Section>

        <Section title="3. Data Storage & Security">
          <p>All data in transit is encrypted using TLS 1.3. Farm sensor data is stored on servers located in the EU. We apply industry-standard practices including role-based access control and regular security audits.</p>
        </Section>

        <Section title="4. Your Rights">
          <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at <strong>contact@sahlafarm.com</strong>. Account deletion removes all your farm data within 30 days.</p>
        </Section>

        <Section title="5. Cookies">
          <p>SahlaFarm uses session cookies for authentication and local-storage to remember your language preference. No third-party advertising cookies are used.</p>
        </Section>

        <Section title="6. Changes to This Policy">
          <p>We will notify you by email if we make material changes to this policy. Continued use of SahlaFarm after the effective date constitutes acceptance.</p>
        </Section>

        <Section title="7. Contact">
          <p>Questions about this policy? Email us at <strong>contact@sahlafarm.com</strong> or write to SahlaFarm, Algiers, Algeria.</p>
        </Section>
      </main>

      {/* Footer */}
      <footer style={{ background: "#192514", padding: "24px", textAlign: "center" }}>
        <p style={{ color: "rgba(245,247,242,0.4)", fontSize: 13, margin: 0 }}>© 2026 SahlaFarm · <Link to="/terms" style={{ color: "rgba(85,187,51,0.8)", textDecoration: "none" }}>Terms</Link> · <Link to="/" style={{ color: "rgba(85,187,51,0.8)", textDecoration: "none" }}>Home</Link></p>
      </footer>
    </div>
  );
}
