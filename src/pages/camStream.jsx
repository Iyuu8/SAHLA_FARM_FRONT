import { useState, useEffect, useRef } from "react";

// ── Live clock ────────────────────────────────────────────────────────────────
function useClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const fmt = () => new Date().toTimeString().slice(0, 8);
    setTime(fmt());
    const id = setInterval(() => setTime(fmt()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}
const PlayIcon = ({ size = 14, color = "#192514" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const CameraIcon = ({ size = 25, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M23.9583 19.7917C23.9583 20.3442 23.7388 20.8741 23.3481 21.2648C22.9574 21.6555 22.4275 21.875 21.875 21.875H3.125C2.57246 21.875 2.04256 21.6555 1.65186 21.2648C1.26116 20.8741 1.04166 20.3442 1.04166 19.7917V8.33333C1.04166 7.7808 1.26116 7.25089 1.65186 6.86019C2.04256 6.46949 2.57246 6.25 3.125 6.25H7.29166L9.375 3.125H15.625L17.7083 6.25H21.875C22.4275 6.25 22.9574 6.46949 23.3481 6.86019C23.7388 7.25089 23.9583 7.7808 23.9583 8.33333V19.7917Z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
    <path
      d="M12.5 17.7083C14.8012 17.7083 16.6667 15.8429 16.6667 13.5417C16.6667 11.2405 14.8012 9.375 12.5 9.375C10.1988 9.375 8.33333 11.2405 8.33333 13.5417C8.33333 15.8429 10.1988 17.7083 12.5 17.7083Z"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
    />
  </svg>
);
// ── Corner brackets ───────────────────────────────────────────────────────────
const Corner = ({ pos }) => {
  const size = 40;
  const t = pos.includes("top")    ? 0 : "auto";
  const b = pos.includes("bottom") ? 0 : "auto";
  const l = pos.includes("left")   ? 0 : "auto";
  const r = pos.includes("right")  ? 0 : "auto";
 
  const borderTop    = pos.includes("top")    ? `1px solid #55BB33` : "none";
  const borderBottom = pos.includes("bottom") ? `1px solid #55BB33` : "none";
  const borderLeft   = pos.includes("left")   ? `1px solid #55BB33` : "none";
  const borderRight  = pos.includes("right")  ? `1px solid #55BB33` : "none";
 
  return (
    <div style={{
      position: "absolute", top: t, bottom: b, left: l, right: r,
      width: size, height: size,
      borderTop, borderBottom, borderLeft, borderRight,
    }} />
  );
};
export default function CamStream() {
  const time = useClock();
  const [streaming, setStreaming]   = useState(false);
  const [snapped, setSnapped]       = useState(false);
  const [snapFlash, setSnapFlash]   = useState(false);
 
  const handleSnapshot = () => {
    setSnapFlash(true);
    setSnapped(true);
    setTimeout(() => setSnapFlash(false), 200);
    setTimeout(() => setSnapped(false), 2000);
  };
 
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: 12,
      width: "100%",
      fontFamily: "'Courier New', monospace",
    }}>
 
      {/* ── Viewfinder ── */}
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "16/9",
        backgroundColor: "#0A1F0A",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid #1a3d1a",
      }}>
 
        {/* Corner brackets */}
        <Corner pos="top-left"     />
        <Corner pos="top-right"    />
        <Corner pos="bottom-left"  />
        <Corner pos="bottom-right" />
 
        {/* Snapshot flash */}
        {snapFlash && (
          <div style={{
            position: "absolute", inset: 0,
            backgroundColor: "rgba(255,255,255,0.25)",
            zIndex: 10,
          }} />
        )}
 
        {/* LIVE badge */}
        <div style={{
          position: "absolute", top: 14, left: 14,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%",
            backgroundColor: streaming ? "#ff2222" : "#ff2222",
            boxShadow: streaming ? "0 0 8px 2px rgba(255,34,34,0.7)" : "none",
            animation: streaming ? "pulse 1.2s ease-in-out infinite" : "none",
          }} />
          <span style={{ color: "#ff2222", fontSize: 16, fontWeight: "bold", letterSpacing: 1 }}>
            Live
          </span>
        </div>
 
        {/* No-camera placeholder */}
        {!streaming && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            gap: 8,
          }}>
            <CameraIcon size={52} color="#55BB33" />
            <span style={{ color: "#55BB33", fontSize: 13, opacity: 0.8 }}>no camera</span>
          </div>
        )}
 
        {/* Timestamp */}
        <div style={{
          position: "absolute", bottom: 14, left: 14,
          color: "#E8FFE0",
          fontSize: 15,
          fontWeight: "600",
          letterSpacing: 1,
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}>
          {time}
        </div>
 
        {/* Snapshot saved toast */}
        {snapped && !snapFlash && (
          <div style={{
            position: "absolute", bottom: 14, right: 14,
            backgroundColor: "rgba(85,187,51,0.2)",
            border: "1px solid #55BB33",
            borderRadius: 4,
            padding: "4px 10px",
            color: "#55BB33",
            fontSize: 11,
          }}>
            snapshot saved
          </div>
        )}
 
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.3; }
          }
        `}</style>
      </div>
 
      {/* ── Controls ── */}
      <div style={{ display: "flex", gap: 10 }}>
 
        {/* Start / Stop stream */}
        <button
          onClick={() => setStreaming(s => !s)}
          className="flex items-center gap-2 bg-[#55BB33] border-none
           rounded-md px-[18px] py-2 text-white text-2xl font-semibold
           font-newblack cursor-pointer tracking-wide transition-colors duration-200
          hover:bg-[#3F8806] text-[16px] md:text-[24px]"
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3d9922"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#55BB33"}
        >
          <PlayIcon size={15} color="white"/>
          {streaming ? "stop stream" : "start stream"}
        </button>
 
        {/* Take snapshot */}
        <button
          onClick={handleSnapshot}
          className="flex items-center gap-2 bg-[#55BB33] border-none
           rounded-md px-[18px] py-2 text-white text-2xl font-semibold
           font-newblack cursor-pointer tracking-wide transition-colors duration-200
          hover:bg-[#3F8806] text-[16px] md:text-[24px]"
          onMouseEnter={e => e.currentTarget.style.backgroundColor = "#3d9922"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = "#55BB33"}
        >
          <CameraIcon size={15} color="white" />
          take snapshot
        </button>
 
      </div>
    </div>
  );
}
