import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from 'react-i18next';

// ── Configuration (REPLACE TOKEN HERE) ────────────────────────────────────────
const HA_HOST = "raspberrypi.local:8123";
const ENTITY_ID = "camera.farm_camera_farm_camera_feed";
const HA_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2YjIyMDA4ZjAxNDM0MjEyYTk3YzM5ZTA1ZDc2ZTA4OSIsImlhdCI6MTc3NzQ5MTcxNCwiZXhwIjoyMDkyODUxNzE0fQ.JdNnageCDHSDeBS7YoCo_hjdn1JsTlZD43JqRQ03W9s"; 

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

const PlayIcon = ({ size = 25, color = "#192514" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <polygon points="5,3 19,12 5,21" />
  </svg>
);

const StopIcon = ({ size = 25, color = "white" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <rect x="4" y="4" width="16" height="16" rx="2" />
  </svg>
);

const CameraIcon = ({ size = 25, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 25 25" fill="none">
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

const TrashIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const DownloadIcon = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ChevronLeft = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#192514" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const ChevronRight = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#192514" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Responsive hook ───────────────────────────────────────────────────────────
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Corner brackets ───────────────────────────────────────────────────────────
const Corner = ({ pos, isMobile }) => {
  const border = isMobile ? "1px" : "4px";
  const size   = isMobile ? 20 : 80;
  const t = pos.includes("top")    ? 0 : "auto";
  const b = pos.includes("bottom") ? 0 : "auto";
  const l = pos.includes("left")   ? 0 : "auto";
  const r = pos.includes("right")  ? 0 : "auto";

  const borderRadius =
    pos === "top-left"     ? "40px 0 0 0" :
    pos === "top-right"    ? "0 40px 0 0" :
    pos === "bottom-left"  ? "0 0 0 40px" :
    pos === "bottom-right" ? "0 0 40px 0" : "0";

  return (
    <div style={{
      position: "absolute", top: t, bottom: b, left: l, right: r,
      width: size, height: size, zIndex: 2,
      borderRadius,
      borderTop:    pos.includes("top")    ? `${border} solid #55BB33` : "none",
      borderBottom: pos.includes("bottom") ? `${border} solid #55BB33` : "none",
      borderLeft:   pos.includes("left")   ? `${border} solid #55BB33` : "none",
      borderRight:  pos.includes("right")  ? `${border} solid #55BB33` : "none",
    }} />
  );
};

// ── Main component ────────────────────────────────────────────────────────────
export default function CamStream() {
  const isMobile = useIsMobile();
  const time     = useClock();
  const { t } = useTranslation();

  const [confirmDelete, setConfirmDelete] = useState(null); 
  const [streaming, setStreaming]     = useState(() => sessionStorage.getItem("camStreaming") === "true");

  useEffect(() => {
    sessionStorage.setItem("camStreaming", streaming);
  }, [streaming]);

  const [snapped, setSnapped]         = useState(false);
  const [snapFlash, setSnapFlash]     = useState(false);
  const [camError, setCamError]       = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingSnap, setPendingSnap] = useState(null);
  const [lightbox, setLightbox]       = useState(null);

  // ── NEW STATE: Holds our fetched camera frame
  const [imgSrc, setImgSrc] = useState(null); 

  const [gallery, setGallery] = useState(() => {
    if (typeof window !== "undefined") {
      const savedGallery = localStorage.getItem("camStreamGallery");
      if (savedGallery) {
        try {
          return JSON.parse(savedGallery);
        } catch (e) {
          console.error("Failed to load gallery data from local storage", e);
          return [];
        }
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("camStreamGallery", JSON.stringify(gallery));
    }
  }, [gallery]);

  const imgRef     = useRef(null);
  const canvasRef  = useRef(null);
  const galleryRef = useRef(null);
  const timerRef   = useRef(null);

  // ── Secure HTTP Fetching (Poller) ───────────────────────────────────────────
  useEffect(() => {
    if (!streaming) {
      if (timerRef.current) clearInterval(timerRef.current);
      setImgSrc(null);
      return;
    }

    setCamError("");

    const fetchFrame = async () => {
      try {
        const response = await fetch(`http://${HA_HOST}/api/camera_proxy/${ENTITY_ID}`, {
          headers: {
            "Authorization": `Bearer ${HA_TOKEN}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        
        setImgSrc((prevUrl) => {
          if (prevUrl) URL.revokeObjectURL(prevUrl); 
          return objectUrl;
        });
      } catch (err) {
        console.error(err);
        setCamError(t('camStream.status.errorConnection', 'Failed to connect to stream'));
      }
    };

    fetchFrame();
    timerRef.current = setInterval(fetchFrame, 500); // 2fps refresh rate

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [streaming, t]);

  // ── Camera ──
  const startCam = () => {
    setCamError("");
    setStreaming(true);
  };

  const stopStream = () => {
    setStreaming(false); 
    setCamError("");
  };

  const handleToggleStream = () => {
    if (streaming) stopStream();
    else startCam();
  };

  // ── Snapshot ──
  const handleSnapshot = () => {
    if (!streaming || !imgSrc) return;
    const img    = imgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;
    
    canvas.width  = 800; 
    canvas.height = 600; 
    
    try {
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      setPendingSnap(canvas.toDataURL("image/png"));
      setShowConfirm(true);
      setSnapFlash(true);
      setTimeout(() => setSnapFlash(false), 200);
    } catch (err) {
      setCamError(t('camStream.status.cors_snapshot', 'Failed to save image'));
      console.error(err);
    }
  };

  const handleConfirmSave = () => {
    const now = new Date();
    const entry = {
      id:      Date.now(),
      dataUrl: pendingSnap,
      time:    now.toTimeString().slice(0, 8),
      date:    now.toLocaleDateString("en-GB").replace(/\//g, "-"),
    };
    setGallery(prev => [entry, ...prev]);
    setShowConfirm(false);
    setPendingSnap(null);
    setSnapped(true);
    setTimeout(() => setSnapped(false), 2000);
    setTimeout(() => galleryRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);
  };

  const handleCancelSave = () => {
    setShowConfirm(false);
    setPendingSnap(null);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ type: "one", id });
  };

  const confirmDeleteAction = () => {
    if (confirmDelete.type === "all") {
      setGallery([]);
      setLightbox(null);
    } else {
      setGallery(prev => prev.filter(s => s.id !== confirmDelete.id));
      if (lightbox === confirmDelete.id) {
        const idx = gallery.findIndex(s => s.id === confirmDelete.id);
        const next = gallery[idx + 1] || gallery[idx - 1];
        setLightbox(next ? next.id : null);
      }
    }
    setConfirmDelete(null);
  };

  const handleDownload = (snap) => {
    const link = document.createElement("a");
    link.download = `snapshot-${snap.date}-${snap.time.replace(/:/g, "-")}.png`;
    link.href = snap.dataUrl;
    link.click();
  };

  useEffect(() => {
    if (!lightbox) return;
    const handler = (e) => {
      const idx = gallery.findIndex(s => s.id === lightbox);
      if (e.key === "ArrowLeft"  && idx < gallery.length - 1) setLightbox(gallery[idx + 1].id);
      if (e.key === "ArrowRight" && idx > 0)                  setLightbox(gallery[idx - 1].id);
      if (e.key === "Escape")                                 setLightbox(null);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [lightbox, gallery]);

  const iconSize = isMobile ? 10 : 15;

  // ── Confirm toast ─────────────────────────────────────────────────────────────
  function ConfirmToast({ onConfirm, onCancel }) {
    const { t } = useTranslation();
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[3px] p-4">
        <div className="bg-white md:px-7 md:py-5 px-5 py-3 flex flex-col justify-start items-start gap-4 font-newblack max-w-[540px] rounded-2xl p-5 sm:p-6 shadow-[0_10px_34px_rgba(0,0,0,0.28)]">
          <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>{t('camStream.modals.saveTitle', 'Save Snapshot?')}</h3>
          <p className="text-[#000000] md:text-[16px] text-[11px] ">
            {t('camStream.modals.saveDesc', 'Do you want to save this snapshot to your gallery?')}
          </p>
          <div className='mt-5 flex justify-end self-end gap-2'>
            <button
              type='button'
              className='rounded-lg px-4 py-2 text-sm font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
              onClick={onCancel}
            >
              {t('camStream.modals.cancel', 'Cancel')}
            </button>
            <button
              type='button'
              className='rounded-lg px-4 py-2 text-sm font-semibold text-white bg-[#57BD36] hover:bg-[#4ea531] transition-colors'
              onClick={onConfirm}
            >
              {t('camStream.modals.save', 'Save')}
            </button>
          </div>  
        </div>
      </div>
    );
  }

  function ConfirmDelete({ onConfirm, onCancel, type }) {
    const { t } = useTranslation();
    return (
      <div
        onClick={onCancel}
        style={{
          position: "fixed", inset: 0, zIndex: 999,
          backgroundColor: "rgba(0,0,0,0.55)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        <div
          onClick={e => e.stopPropagation()}
          className="bg-white rounded-xl md:px-8 w-fit md:py-6 px-5 py-4 flex flex-col items-start gap-4 font-newblack shadow-xl"
        >
          <h3 className='text-lg sm:text-xl font-bold text-[#192514]'>{type === "all"
              ? `${t('camStream.modals.deleteAllTitle', 'Delete All')}`
              : `${t('camStream.modals.deleteSingleTitle', 'Delete Image')}`
            }</h3>
          <p className="text-[#000000] md:text-[16px] text-[11px] ">
             {type === "all"
              ? `${t('camStream.modals.cannotRecoverThem', 'This action cannot be undone.')}`
              : `${t('camStream.modals.cannotRecoverIt', 'This action cannot be undone.')}`
            }
          </p>
          <div className="flex gap-3 self-end">
            <button
              onClick={onConfirm}
              className="bg-red-500 hover:bg-red-600 transition-colors border-none rounded-md
                md:px-4 md:py-2 px-3 py-1.5 text-white font-bold md:text-[14px] text-[11px] cursor-pointer"
            >
              {t('camStream.modals.deleteBtn', 'Delete')}
            </button>
            <button
              onClick={onCancel}
              className="bg-[#E8FFE0] hover:bg-[#D6F7CB] transition-colors border-none rounded-md
                md:px-4 md:py-2 px-3 py-1.5 text-[#192514] font-bold md:text-[14px] text-[11px] cursor-pointer"
            >
              {t('camStream.modals.cancel', 'Cancel')}
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-3 w-full font-newblack overflow-hidden px-3 sm:px-5">

      {/* ── Viewfinder ── */}
      <div className="relative w-full max-w-[680px] bg-[#0A1F0A] rounded-[40px] overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <Corner pos="top-left"     isMobile={isMobile} />
        <Corner pos="top-right"    isMobile={isMobile} />
        <Corner pos="bottom-left"  isMobile={isMobile} />
        <Corner pos="bottom-right" isMobile={isMobile} />

        {snapFlash && (
          <div style={{ position: "absolute", inset: 0, zIndex: 10, backgroundColor: "rgba(255,255,255,0.35)" }} />
        )}

        {showConfirm && <ConfirmToast onConfirm={handleConfirmSave} onCancel={handleCancelSave} />}

        {/* LIVE badge */}
        <div style={{ position: "absolute", top: 14, left: 14, zIndex: 3, display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 10, height: 10, borderRadius: "50%", backgroundColor: "#ff2222",
            boxShadow: streaming ? "0 0 8px 2px rgba(255,34,34,0.7)" : "none",
            animation: streaming ? "pulse 1.2s ease-in-out infinite" : "none",
          }} />
          <span style={{ color: "#ff2222", fontSize: isMobile ? 11 : 16, fontWeight: "bold", letterSpacing: 1 }}>
            {streaming ? t('camStream.status.live', 'LIVE') : t('camStream.status.off', 'OFFLINE')}
          </span>
        </div>

        {/* We only render the image tag if imgSrc is actively available */}
        {imgSrc && streaming && (
          <img
            ref={imgRef}
            src={imgSrc}
            style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", display: "block", zIndex: 1,
            }}
            alt="IP Webcam Stream"
            onError={() => {
              if (streaming) setCamError(`${t('camStream.status.errorConnection', 'Error connecting to stream')}`);
            }}
          />
        )}

        {/* Placeholder - Displays when OFF or when stream is LOADING */}
        {(!streaming || (streaming && !imgSrc)) && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 1,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <CameraIcon size={isMobile ? 32 : 52} color="#55BB33" />
            <span style={{ color: "#55BB33", fontSize: 13, opacity: 0.8 }}>

              {streaming && !imgSrc && !camError 
                ? t('camStream.status.connecting', 'Connecting to stream...') 
                : t('camStream.status.streamOffline', 'Stream Offline')}
            </span>
          </div>
        )}

        {/* Camera error */}
        {camError && (
          <div style={{
            position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
            backgroundColor: "rgba(255,0,0,0.15)", border: "1px solid #ff4444",
            borderRadius: 4, padding: "4px 12px", color: "#ff6666",
            fontSize: isMobile ? 9 : 11, zIndex: 4, whiteSpace: "nowrap",
          }}>
            {camError}
          </div>
        )}

        {/* Timestamp */}
        <div style={{
          position: "absolute", bottom: 14, left: 14, zIndex: 3,
          color: "#E8FFE0", fontSize: isMobile ? 10 : 15,
          fontWeight: "600", letterSpacing: 1, textShadow: "0 1px 4px rgba(0,0,0,0.8)",
        }}>
          {time}
        </div>

        {/* Saved toast */}
        {snapped && (
          <div className="absolute bottom-[14px] right-[14px] z-[3] bg-white
          rounded-lg px-[10px] py-1 text-[#55BB33] flex items-center gap-1.5
          text-[11px] md:text-[16px] font-semibold font-newblack">
            <CheckIcon size={isMobile ? 12 : 10} color="#55BB33" /> {t('camStream.gallery.savedToGallery', 'Saved!')}
          </div>
        )}

        <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }`}</style>
      </div>

      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* ── Controls ── */}
      <div className="flex gap-[10px] w-full">
        <button
          onClick={handleToggleStream}
          className="flex flex-grow-0 items-center justify-center gap-2 border-none
            rounded-md px-[10px] py-1 text-white font-semibold font-newblack
            cursor-pointer tracking-wide transition-colors duration-200
            text-[13px] md:text-[16px]"
          style={{ backgroundColor: streaming ? "#cc3333" : "#55BB33" }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = streaming ? "#aa2222" : "#3d9922"}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = streaming ? "#cc3333" : "#55BB33"}
        >
          {streaming
            ? <div className="flex justify-between items-center gap-[3px] md:gap-2"><StopIcon size={iconSize} color="white" />{t('camStream.controls.stopStream', 'Stop')}</div>
            : <div className="flex justify-between items-center gap-[3px] md:gap-2"><PlayIcon size={iconSize} color="white" /> {t('camStream.controls.startStream', 'Start')}</div>
          }
        </button>

        <button
          onClick={handleSnapshot}
          disabled={!streaming || !imgSrc}
          className={`flex flex-grow-0 items-center justify-center gap-[3px] md:gap-2 border-none
            rounded-md px-[10px] py-1 text-white font-semibold font-newblack
            tracking-wide transition-colors duration-200
            text-[13px] md:text-[16px]
            ${streaming && imgSrc ? "cursor-pointer" : "cursor-not-allowed opacity-40"}`}
          style={{ backgroundColor: "#55BB33" }}
          onMouseEnter={e => { if (streaming && imgSrc) e.currentTarget.style.backgroundColor = "#3d9922"; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#55BB33"; }}
        >
          <CameraIcon size={iconSize} color="white" /> {t('camStream.controls.takeSnapshot', 'Snapshot')}
        </button>
      </div>

      {/* ── Gallery ── */}
      {gallery.length > 0 && (
        <div ref={galleryRef}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] md:text-[16px] font-bold text-gray-600 font-newblack tracking-widest uppercase">
              {t('camStream.gallery.title', 'Gallery')} ({gallery.length})
            </span>
            <button
              onClick={() => setConfirmDelete({ type: "all" })}
              className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors md:text-[16px] uppercase text-[11px] font-bold font-newblack"
            >
              {t('camStream.gallery.clearAll', 'Clear All')}
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar" style={{ scrollSnapType: "x mandatory" }}>
            {gallery.map((snap) => (
              <div
                key={snap.id}
                style={{ scrollSnapAlign: "start", flexShrink: 0 }}
                className="relative group rounded-lg overflow-hidden border-2 border-[#C0C5D0] hover:border-[#55BB33] transition-all duration-200 cursor-pointer
                  w-[140px] md:w-[180px] lg:w-[220px]"
                onClick={() => setLightbox(snap.id)}
              >
                <img
                  src={snap.dataUrl}
                  alt={`snapshot ${snap.time}`}
                  className="w-full object-cover"
                  style={{ aspectRatio: "800/600", display: "block" }}
                />
                <div className="absolute bottom-0 left-0 right-0 px-1.5 py-1 bg-[rgba(0,0,0,0.55)]
                  text-[8px] md:text-[10px] text-[#E8FFE0] font-mono tracking-wide">
                  {snap.date} — {snap.time}
                </div>
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDownload(snap); }}
                    className="w-6 h-6 md:w-7 md:h-7 rounded flex items-center justify-center bg-[rgba(85,187,51,0.85)] hover:bg-[#55BB33] transition-colors"
                  >
                    <DownloadIcon size={isMobile ? 10 : 13} color="white" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(snap.id); }}
                    className="w-6 h-6 md:w-7 md:h-7 rounded flex items-center justify-center bg-[rgba(200,50,50,0.85)] hover:bg-red-600 transition-colors"
                  >
                    <TrashIcon size={isMobile ? 10 : 13} color="white" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ── Lightbox ── */}
          {lightbox && (() => {
            const snapIndex = gallery.findIndex(s => s.id === lightbox);
            const snap = gallery[snapIndex];
            if (!snap) return null;

            const hasPrev = snapIndex < gallery.length - 1;
            const hasNext = snapIndex > 0;

            return (
              <div
                className="flex-col gap-3 fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[3px] p-4"
              >
                <div className="relative flex items-center justify-center w-full max-w-[800px]">

                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(gallery[snapIndex + 1].id); }}
                    disabled={!hasPrev}
                    className="absolute -left-5 md:-left-7 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center
                      bg-white/90 shadow-lg hover:bg-white active:scale-95 transition-all
                      disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={isMobile ? 15 : 18} />
                  </button>

                  <img
                    src={snap.dataUrl}
                    alt="snapshot enlarged"
                    onClick={e => e.stopPropagation()}
                    className="max-w-[800px] max-h-[600px] rounded-[50px] shadow-[0_0_10px_2px_#5c5e5ba0] object-contain select-none"
                  />

                  <button
                    onClick={(e) => { e.stopPropagation(); setLightbox(gallery[snapIndex - 1].id); }}
                    disabled={!hasNext}
                    className="absolute -right-5 md:-right-7 z-10 w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center
                      bg-white/90 shadow-lg hover:bg-white active:scale-95 transition-all
                      disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={isMobile ? 15 : 18} />
                  </button>
                </div>

                <span className="text-white/55 text-[11px] md:text-[13px] font-newblack tabular-nums bg-white/10 rounded-full px-3 py-0.5">
                  {snapIndex + 1} / {gallery.length}
                </span>

                <div style={{ display: "flex", gap: 10 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => handleDownload(snap)}
                    className="bg-[#55BB33] border-none rounded-md px-4 py-2 text-white font-semibold md:text-[16px] text-[11px] cursor-pointer flex items-center gap-1.5 font-newblack hover:bg-[#3d9922] transition-colors duration-200"
                  >
                    <DownloadIcon size={isMobile ? 13 : 16} color="white" /> {t('camStream.gallery.download', 'Download')}
                  </button>
                  <button
                    onClick={() => handleDelete(snap.id)}
                    className="rounded-md px-4  py-2 text-white hover:bg-red-600 bg-red-500 font-semibold md:text-[16px] text-[11px] cursor-pointer flex items-center gap-1.5 font-newblack"
                  >
                    <TrashIcon size={isMobile ? 13 : 16} color="#ffffff" /> <span>{t('camStream.gallery.delete', 'Delete')}</span>
                  </button>
                  <button
                    type='button'
                    className='rounded-lg px-4 py-2 md:text-[16px] text-[11px] font-semibold text-[#192514] bg-[#E8ECE7] hover:bg-[#DDE3DC] transition-colors'
                    onClick={() => setLightbox(null)}
                  >
                    {t('camStream.gallery.close', 'Close')}
                  </button>
                </div>
                
                <span className="text-[#e8ffe0] text-[11px] md:text-[16px] opacity-70 font-newblack [text-shadow:0_1px_1px_rgba(0,0,0,0.1)]">
                  {t('camStream.gallery.capturedAt', 'Captured:')} {snap.date} — {snap.time}
                </span>
              </div>
            );
          })()}
        </div>
      )}

      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}</style>
      {/* ── Delete confirmation modal ── */}
      {confirmDelete && (
        <ConfirmDelete
          type={confirmDelete.type}
          onConfirm={confirmDeleteAction}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}