import React from 'react';

const steps = [
  {
    id: 1,
    title: "Open Home Assistant in your browser",
    description:
      "Open your web browser and navigate to the Home Assistant address below. Make sure your device is connected to the same local network as the Raspberry Pi.",
    extra: (
      <div
        style={{
          background: "#192514", // Green-dark from SahlaFarm
          borderRadius: 12,
          padding: "12px 16px",
          marginTop: 12,
          display: "flex",
          alignItems: "center",
          gap: 10,
          border: "1px solid rgba(85,187,51,0.2)"
        }}
      >
        <span style={{ color: "#55BB33", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>URL</span>
        <code style={{ color: "#fff", fontSize: 14, fontFamily: "monospace" }}>
          http://raspberrypi.local:8123/
        </code>
      </div>
    ),
    image: null,
  },
  {
    id: 2,
    title: "Log in to your account",
    description:
      'Enter your username and password on the login screen, then click the Log in button. Check "Keep me logged in" if you want to stay connected.',
    image: "/LogIn.png",
  },
  {
    id: 3,
    title: "Go to your profile",
    description:
      "After logging in you will land on the Dashboard. Click your username at the bottom-left of the sidebar to open your profile page.",
    image: "/GoToProfile.png",
  },
  {
    id: 4,
    title: "Choose the Security tab",
    description:
      "In your profile page you will find two tabs: General and Security. Click on Security to proceed.",
    image: "/ChooseSecurityTab.png",
  },
  {
    id: 5,
    title: "Create a Long-Lived Access Token",
    description:
      'Scroll down to the "Long-lived access tokens" section. Click Create token, name it (e.g. sahlafarm), and copy the token immediately.',
    extra: (
      <div
        style={{
          margin: "12px 0 0",
          background: "rgba(236,173,32,0.1)", // Golden alpha
          border: "1px solid #ecad20",
          borderRadius: 12,
          padding: "12px 16px",
          fontSize: 13,
          color: "#462318", // Burnt cedar
          display: "flex",
          gap: 10
        }}
      >
        <span>⚠️</span>
        <p style={{ margin: 0 }}>
          <strong>The token is only displayed once.</strong> Copy it right away and paste it into the Settings page.
        </p>
      </div>
    ),
    image: "/LongLivedAccess.png",
  },
  {
    id: 6,
    title: "Finalize Connection in SahlaFarm",
    description:
      "Open the SahlaFarm web application and go to your Settings/Profile page. This is where you will link your farm's hardware to the dashboard.",
    image: "/SettingsPageFull.png", // <--- THIS WILL NOW RENDER FIRST
    extra: (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
        <div style={{ borderLeft: "4px solid #55BB33", paddingLeft: "16px" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#475569", lineHeight: 1.6 }}>
            Scroll down to the <strong>Home Assistant Connection</strong> section and click <strong>Edit</strong>. 
            The update card (shown below) will appear. Enter your URL, paste your token, and click <strong>Save</strong>.
          </p>
        </div>

        {/* THIS RENDERS SECOND: The specific action detail */}
        <div style={{ 
          borderRadius: 12, 
          overflow: "hidden", 
          border: "1px solid rgba(25,37,20,0.1)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)" 
        }}>
          <img 
            src="/ConnectionCard.png" 
            alt="Home Assistant Edit Card" 
            style={{ width: "100%", display: "block" }} 
          />
        </div>

        {/* Pro-Tip Box */}
        <div
          style={{
            background: "#f0fdf4",
            border: "1px solid #55BB33",
            borderRadius: 12,
            padding: "14px 18px",
            fontSize: 13,
            color: "#166534",
            display: "flex",
            alignItems: "center",
            gap: 12
          }}
        >
          <span style={{ fontSize: 18 }}>💡</span>
          <p style={{ margin: 0 }}>
            <strong>Pro Tip:</strong> Look for the connection status badge to turn <strong>green</strong>. 
            This confirms the web application is successfully receiving live data.
          </p>
        </div>
      </div>
    ),
  }
];

export default function HelpPage() {
  return (
    <div
      style={{
        margin: "0 auto",
        padding: "60px 24px 80px",
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#F5F7F2", 
        minHeight: "100vh"
      }}
    >
      {/* Back to Home Link */}
      <a href="/" style={{ color: "#192514", textDecoration: "none", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8, marginBottom: 32 }}>
        ← Return to Home
      </a>

      {/* Page header */}
      <div style={{ marginBottom: 56 }}>
        <span style={{ 
          background: "rgba(85,187,51,0.12)", 
          color: "#3a8a1e", 
          padding: "6px 14px", 
          borderRadius: 100, 
          fontSize: 12, 
          fontWeight: 700, 
          textTransform: "uppercase" 
        }}>
          Configuration Guide
        </span>
        <h1 style={{ margin: "16px 0 12px", fontSize: 32, fontWeight: 800, color: "#192514", letterSpacing: "-0.03em" }}>
          Connecting <span style={{ color: "#55BB33" }}>Home Assistant</span>
        </h1>
        <p style={{ margin: 0, fontSize: 16, color: "rgba(25,37,20,0.6)", lineHeight: 1.7 }}>
          Follow these steps to link your Raspberry Pi instance to the SahlaFarm dashboard.
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
            <h2 style={{ margin: "4px 0 8px", fontSize: 19, fontWeight: 700, color: "#192514" }}>
              {step.title}
            </h2>
            <p style={{ margin: 0, fontSize: 15, color: "rgba(25,37,20,0.7)", lineHeight: 1.6 }}>
              {step.description}
            </p>
            
            {/* 🛑 FIXED: step.image now renders BEFORE step.extra */}
            {step.image && (
              <div style={{ marginTop: 24, borderRadius: 16, overflow: "hidden", border: "1px solid rgba(25,37,20,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.05)" }}>
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