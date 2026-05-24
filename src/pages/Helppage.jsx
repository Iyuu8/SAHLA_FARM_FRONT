import React from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../utilities/components/login/LanguageSwitcher';

export default function HelpPage() {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  const steps = [
    {
      id: 1,
      title: t('help_step1_title'),
      description: t('help_step1_desc'),
      extra: (
        <div
          className='font-newblack'
          style={{
            background: "#192514",
            borderRadius: 12,
            padding: "12px 16px",
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 10,
            border: "1px solid rgba(85,187,51,0.2)"
          }}
        >
          <span className='font-newblack' style={{ color: "#55BB33", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>{t('help_url_label')}</span>
          <code className='font-newblack' style={{ color: "#fff", fontSize: 14 }}>
            http://raspberrypi.local:8123/
          </code>
        </div>
      ),
      image: null,
    },
    {
      id: 2,
      title: t('help_step2_title'),
      description: t('help_step2_desc'),
      image: "/LogIn.png",
    },
    {
      id: 3,
      title: t('help_step3_title'),
      description: t('help_step3_desc'),
      image: "/GoToProfile.png",
    },
    {
      id: 4,
      title: t('help_step4_title'),
      description: t('help_step4_desc'),
      image: "/ChooseSecurityTab.png",
    },
    {
      id: 5,
      title: t('help_step5_title'),
      description: t('help_step5_desc'),
      extra: (
        <div
          style={{
            margin: "12px 0 0",
            background: "rgba(236,173,32,0.1)",
            border: "1px solid #ecad20",
            borderRadius: 12,
            padding: "12px 16px",
            fontSize: 13,
            color: "#462318",
            display: "flex",
            gap: 10
          }}
        >
          <span>⚠️</span>
          <p className='font-newblack' style={{ margin: 0 }}>
            <strong className='font-newblack'>{t('help_step5_warning_bold')}</strong> {t('help_step5_warning_text')}
          </p>
        </div>
      ),
      image: "/LongLivedAccess.png",
    },
    {
      id: 6,
      title: t('help_step6_title'),
      description: t('help_step6_desc'),
      image: "/SettingsPageFull.png",
      extra: (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
          <div style={{ borderLeft: "4px solid #55BB33", paddingLeft: "16px" }}>
            <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
              {t('help_step6_extra_p1')} <strong>{t('help_step6_extra_p1_strong1')}</strong> {t('help_step6_extra_p1_cont')} <strong>{t('help_step6_extra_p1_strong2')}</strong>.
              {t('help_step6_extra_p2')} <strong>{t('help_step6_extra_p2_strong')}</strong>.
            </p>
          </div>
          <div style={{
            borderRadius: 12,
            overflow: "hidden",
            border: "1px solid rgba(25,37,20,0.1)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)"
          }}>
            <img src="/ConnectionCard.png" alt={t('help_step6_img_alt')} style={{ width: "100%", display: "block" }} />
          </div>
          <div style={{
            background: "#f0fdf4",
            border: "1px solid #55BB33",
            borderRadius: 12,
            padding: "14px 18px",
            fontSize: 13,
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}>
            <span style={{ fontSize: 18 }}>💡</span>
            <p className='font-newblack' style={{ margin: 0 }}>
              <strong className='font-newblack'>{t('help_pro_tip_title')}</strong> {t('help_pro_tip_text1')} <strong className='font-newblack'>{t('help_pro_tip_color')}</strong>.
              {t('help_pro_tip_text2')}
            </p>
          </div>
        </div>
      ),
    }
  ];

  return (
    <div
      className='font-newblack'
      style={{
        margin: "0 auto",
        padding: "60px 24px 80px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#F5F7F2",
        minHeight: "100vh"
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      {/* Top bar: back link + language switcher */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <a href="/" style={{ color: "#192514", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          {isArabic ? "→" : "←"} {t('help_return_home')}
        </a>
        <LanguageSwitcher compact className="" />
      </div>

      {/* Page header */}
      <div className='font-newblack' style={{ marginBottom: 56 }}>
        <span className='font-newblack' style={{
          background: "rgba(85,187,51,0.12)",
          color: "#3a8a1e",
          padding: "6px 14px",
          borderRadius: 100,
          fontSize: 12,
          fontWeight: 700,
          textTransform: "uppercase"
        }}>
          {t('help_header_badge')}
        </span>
        <h1 className='font-newblack' style={{ margin: "16px 0 12px", fontSize: 32, fontWeight: 800, color: "#192514", letterSpacing: "-0.03em" }}>
          {t('help_header_title')} <span className='font-newblack' style={{ color: "#55BB33" }}>{t('help_header_title_span')}</span>
        </h1>
        <p className='font-newblack' style={{ margin: 0, fontSize: 16, color: "rgba(25,37,20,0.6)", lineHeight: 1.7 }}>
          {t('help_header_desc')}
        </p>
      </div>

      {/* Steps list */}
      {steps.map((step, i) => (
        <div key={step.id} style={{ display: "flex", gap: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 44, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: "50%",
              background: "#55BB33", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 14, zIndex: 2,
              boxShadow: "0 4px 10px rgba(85,187,51,0.3)"
            }}>
              {step.id}
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 2, flex: 1, background: "linear-gradient(to bottom, #55BB33, #e2e8f0)", margin: "4px 0" }} />
            )}
          </div>

          <div style={{ paddingLeft: 24, paddingBottom: i < steps.length - 1 ? 56 : 0, flex: 1 }}>
            <h2 className='font-newblack' style={{ margin: "4px 0 8px", fontSize: 19, fontWeight: 700, color: "#192514" }}>
              {step.title}
            </h2>
            <p className='font-newblack' style={{ margin: 0, fontSize: 15, color: "rgba(25,37,20,0.7)", lineHeight: 1.6 }}>
              {step.description}
            </p>
            {step.image && (
              <div className='font-newblack' style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(25,37,20,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
                <img src={step.image} alt={step.title} style={{ width: "100%", display: "block" }} />
              </div>
            )}
            {step.extra && step.extra}
          </div>
        </div>
      ))}
    </div>
  );
}