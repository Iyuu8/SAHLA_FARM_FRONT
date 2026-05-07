// src/pages/aiChat.jsx

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import UserBubble        from '../utilities/components/aiChat/UserBubble';
import AIBubble          from '../utilities/components/aiChat/AIBubble';
import ThinkingIndicator from '../utilities/components/aiChat/ThinkingIndicator';
import ChatInput         from '../utilities/components/aiChat/ChatInput';

import { parseMessageSegments } from '../utilities/functions/chatParser';
import { buildSystemPrompt, buildFarmContext, buildLanguageInstruction, normalizeLanguage } from '../utilities/functions/chatPrompts';

import {
  GROQ_API_KEY,
  GROQ_MODEL,
  GROQ_VISION_MODEL,
  GROQ_ENDPOINT,
  GOOGLE_API_KEY,
  GOOGLE_VISION_MODEL,
  CHAT_COPY,
} from '../utilities/data/chatConstants';
import { STORAGE_KEYS } from '../utilities/data/storageKeys';
import useFarmPreferences from '../hooks/useFarmPreferences';
import useActuatorsState from '../hooks/useActuatorsState';
import usePersistentState from '../hooks/usePersistentState';
import useLiveState from '../hooks/useLiveState';
import { DASHBOARD_SENSOR_OPTIONS } from '../utilities/data/dashboardData';

// ─── Home Assistant camera config (mirrors CamStream.jsx) ────────────────────
const HA_HOST     = 'raspberrypi.local:8123';
const HA_ENTITY   = 'camera.farm_camera_farm_camera_feed';
const HA_TOKEN    = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI2YjIyMDA4ZjAxNDM0MjEyYTk3YzM5ZTA1ZDc2ZTA4OSIsImlhdCI6MTc3NzQ5MTcxNCwiZXhwIjoyMDkyODUxNzE0fQ.JdNnageCDHSDeBS7YoCo_hjdn1JsTlZD43JqRQ03W9s';
const CAM_PROXY_URL = `http://${HA_HOST}/api/camera_proxy/${HA_ENTITY}`;

// ─── Keywords that trigger auto-snapshot ─────────────────────────────────────
const SNAPSHOT_KEYWORDS_EN = [
  'describe', 'picture', 'look', 'camera', 'see', 'show', 'image',
  'photo', 'snapshot', 'view', 'farm looks', 'what does', 'what is happening',
];
const SNAPSHOT_KEYWORDS_AR = [
  'صورة', 'صف', 'كيف يبدو', 'حالة', 'كاميرا', 'شاهد', 'أرني', 'انظر',
  'وصف', 'أظهر', 'ما الذي', 'كيف تبدو', 'ما يحدث',
];
const SNAPSHOT_KEYWORDS_FR = [
  'décrire', 'voir', 'montrer', 'caméra', 'image', 'photo', 'aperçu',
  'capture', 'regard', 'montre', 'décris', 'comment', 'quoi',
];
const ALL_SNAPSHOT_KEYWORDS = [
  ...SNAPSHOT_KEYWORDS_EN,
  ...SNAPSHOT_KEYWORDS_AR,
  ...SNAPSHOT_KEYWORDS_FR,
];

function containsCameraKeyword(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return ALL_SNAPSHOT_KEYWORDS.some((kw) => lower.includes(kw.toLowerCase()));
}

// ─── Grab a snapshot from HA camera proxy → base64 JPEG ──────────────────────
async function tryGrabStreamSnapshot() {
  try {
    const res = await fetch(CAM_PROXY_URL, {
      headers: { Authorization: `Bearer ${HA_TOKEN}` },
    });
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // result is "data:image/jpeg;base64,..."
        const base64 = reader.result?.split(',')[1] ?? null;
        resolve(base64);
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// ─── Compress image to base64 JPEG (max 1024px, 85% quality) ─────────────────
function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else                { width  = Math.round((width * MAX) / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// ─── Build user content (Handles images, text files, and unsupported files) ──
async function buildUserContent(text, files, farmContext, modeInstruction) {
  const imageFiles = files.filter((f) => f.isImage);
  const textFiles = files.filter((f) => f.isText);
  const otherFiles = files.filter((f) => !f.isImage && !f.isText);

  const textFilesContent = textFiles.length > 0
    ? `[User attached Text Files]:\n${textFiles.map(f => `--- Start of ${f.name} ---\n${f.textContent}\n--- End of ${f.name} ---`).join('\n\n')}`
    : '';

  const textBlock = [
    farmContext,
    otherFiles.length > 0
      ? `[System Note: The user attached unsupported files: ${otherFiles.map((f) => f.name).join(', ')}. You MUST politely inform the user that you can only read image files and text (.txt) files, and you cannot see the contents of those unsupported files.]`
      : '',
    textFilesContent,
    `[Style: ${modeInstruction}]`,
    `Farmer's message: ${text || '(see attached files)'}`,
  ].filter(Boolean).join('\n\n');

  if (imageFiles.length === 0) {
    return { content: textBlock, hasImages: false };
  }

  const contentParts = [{ type: 'text', text: textBlock }];

  for (const img of imageFiles) {
    if (img.dataUrl) {
      contentParts.push({ type: 'image_url', image_url: { url: img.dataUrl } });
    }
  }

  return { content: contentParts, hasImages: true };
}

// ─── Build vision content for auto-snapshot path ──────────────────────────────
// Returns the messages array ready to send directly to the vision model.
function buildSnapshotMessages(systemPrompt, farmContext, modeInstruction, userText, snapshotBase64) {
  const textBlock = [
    farmContext,
    `[Style: ${modeInstruction}]`,
    `[TASK — TWO-PART RESPONSE]:
Part 1 — Visual Description: Carefully describe what you see in the attached farm camera image. Comment on the crop condition, visible equipment, lighting, soil, and any anomalies you observe visually.

Part 2 — Farm Data Report: Based EXCLUSIVELY on the farm sensor data provided in the context above (not the image), give a structured report of current sensor readings, actuator states, and any active alerts. Label this section clearly.

Farmer's message: ${userText || 'Describe the farm.'}`,
  ].filter(Boolean).join('\n\n');

  return [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `[System Context: ${systemPrompt}]\n\n${textBlock}`,
        },
        {
          type: 'image_url',
          image_url: { url: `data:image/jpeg;base64,${snapshotBase64}` },
        },
      ],
    },
  ];
}

// ─── Build camera-unavailable message (no API call) ──────────────────────────
function buildCameraUnavailablePrompt(farmContext, modeInstruction, userText) {
  return [
    farmContext,
    `[Style: ${modeInstruction}]`,
    `[TASK — TWO-PART RESPONSE]:
Part 1 — Camera Status: Inform the farmer politely that the farm camera is currently unavailable or offline. Do NOT speculate on what the farm looks like visually.

Part 2 — Farm Data Report: Based EXCLUSIVELY on the farm sensor data provided in the context above, give a structured report of current sensor readings, actuator states, and any active alerts. Label this section clearly.

Farmer's message: ${userText || 'Describe the farm.'}`,
  ].filter(Boolean).join('\n\n');
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIchat({
  recommendedAction,
}) {
  const { t, i18n } = useTranslation();

  // ─── Prompt 3: normalized language code ───────────────────────────────────
  const lang = normalizeLanguage(i18n.language);

  const {
    crop,
    growthStage,
    mode,
    temperatureUnit,
    humidityUnit,
    soilMoistureUnit,
    lightIntensityUnit,
  } = useFarmPreferences();

  const [actuators] = useActuatorsState();

  const {
    liveSensors,
    liveActuators,
    liveCrop,
    liveRecommendation,
    liveWarnings,
  } = useLiveState(DASHBOARD_SENSOR_OPTIONS);

  const [messages, setMessages] = usePersistentState(STORAGE_KEYS.chatHistory, []);
  const [responseMode, setResponseMode] = usePersistentState(`${STORAGE_KEYS.chatHistory}:mode`, 'Detailed');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationLimitReached, setConversationLimitReached] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!Array.isArray(messages)) {
      setMessages([]);
    }
  }, [messages, setMessages]);

  const persistConversation = useCallback((nextMessages) => {
    try {
      localStorage.setItem(STORAGE_KEYS.chatHistory, JSON.stringify(nextMessages));
      setConversationLimitReached(false);
      return true;
    } catch {
      setConversationLimitReached(true);
      return false;
    }
  }, []);

  const handleClearChat = () => {
    if (window.confirm(t('aiChat.newChatConfirm'))) {
      localStorage.removeItem(STORAGE_KEYS.chatHistory);
      setMessages([]);
      setConversationLimitReached(false);
    }
  };

  const farmProps = useMemo(() => {
    const mappedSensors = (liveSensors || []).map(sensor => ({
      type: sensor.id,
      value: sensor.currentValue,
      unit: sensor.unit,
    }));

    const sourceActuators = liveActuators || actuators;
    const mappedActuators = (sourceActuators || []).map(act => ({
      type: act.type,
      status: act.status,
      control_mode: act.control_mode || (act.mode === 'semi-auto' ? 'semi_auto' : 'auto'),
      run_at: act.run_at,
      run_until: act.run_until,
      duration_minutes: act.duration_minutes,
    }));

    const activeWarnings = (liveWarnings || []).filter(w => w.status === 'active');
    const cropType = liveCrop?.type ?? crop;
    const cropGrowthStage = liveCrop?.growth_stage ?? growthStage;
    const cropMode = liveCrop?.mode ?? mode;

    return {
      crop: cropType,
      growthStage: cropGrowthStage,
      mode: cropMode,
      actuators: mappedActuators,
      sensors: mappedSensors,
      warnings: activeWarnings,
      recommendedAction: liveRecommendation || recommendedAction,
      displayUnits: {
        temperatureUnit,
        humidityUnit,
        soilMoistureUnit,
        lightIntensityUnit,
      },
    };
  }, [
    liveSensors, liveActuators, actuators, liveWarnings, liveCrop,
    crop, growthStage, mode, liveRecommendation, recommendedAction,
    temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit,
  ]);

  const handleSend = useCallback(async (text, rawFiles) => {
    if (!text && rawFiles.length === 0) return;
    if (conversationLimitReached) return;

    setIsThinking(true);

    // ─── Process attached files ────────────────────────────────────────────
    const processedFiles = await Promise.all(rawFiles.map(async (f) => {
      if (f.type.startsWith('image/')) {
        try {
          const dataUrl = await compressImageToBase64(f);
          return { name: f.name, type: f.type, isImage: true, isText: false, dataUrl };
        } catch (e) {
          console.error("Image compression failed", e);
          return null;
        }
      } else if (f.type === 'text/plain' || f.name.endsWith('.txt')) {
        try {
          const textContent = await f.text();
          return { name: f.name, type: f.type, isImage: false, isText: true, textContent };
        } catch (e) {
          console.error("Text file read failed", e);
          return null;
        }
      }
      return { name: f.name, type: f.type, isImage: false, isText: false };
    }));

    const validFiles = processedFiles.filter(Boolean);

    const nextUserMessages = [...messages, { role: 'user', text, files: validFiles }];
    if (!persistConversation(nextUserMessages)) {
      setIsThinking(false);
      return;
    }
    setMessages(nextUserMessages);

    const modeInstruction = responseMode === 'Concise'
      ? CHAT_COPY.conciseModeInstruction
      : CHAT_COPY.detailedModeInstruction;

    const farmContext = buildFarmContext(farmProps);

    // ─── Prompt 3: pass lang to buildSystemPrompt ──────────────────────────
    const systemPrompt = buildSystemPrompt(lang);

    try {
      let aiText = '';

      // ─── Prompt 1: Auto-snapshot path ─────────────────────────────────────
      // Trigger only when: user has no manually attached image files AND text contains camera keywords
      const userAttachedImages = validFiles.some((f) => f.isImage);
      const wantsCameraView = !userAttachedImages && containsCameraKeyword(text);

      if (wantsCameraView) {
        // Try to grab a live frame from HA
        const snapshotBase64 = await tryGrabStreamSnapshot();

        if (snapshotBase64) {
          // ── Stream ON + snapshot succeeded: vision model with two-part prompt ──
          const snapshotMessages = buildSnapshotMessages(
            systemPrompt, farmContext, modeInstruction, text, snapshotBase64
          );

          try {
            const res = await fetch(GROQ_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: GROQ_VISION_MODEL,
                messages: snapshotMessages,
                max_tokens: responseMode === 'Concise' ? 300 : 900,
                temperature: 0.65,
              }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
            aiText = data.choices?.[0]?.message?.content || 'No response received.';
          } catch (groqErr) {
            // Fallback to Google Gemini for vision
            console.warn('Groq Vision failed on auto-snapshot, falling back to Gemini…', groqErr);
            const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_VISION_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
            const geminiParts = [
              { text: snapshotMessages[0].content[0].text },
              { inline_data: { mime_type: 'image/jpeg', data: snapshotBase64 } },
            ];
            const geminiRes = await fetch(geminiEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ role: 'user', parts: geminiParts }] }),
            });
            const geminiData = await geminiRes.json();
            if (!geminiRes.ok || geminiData.error) {
              throw new Error(`Gemini fallback failed: ${geminiData.error?.message || geminiRes.status}`);
            }
            aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from Gemini.';
          }

        } else {
          // ── Stream OFF or snapshot failed: text-only with camera-unavailable prompt ──
          const cameraUnavailableContent = buildCameraUnavailablePrompt(
            farmContext, modeInstruction, text
          );
          const apiMessages = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: cameraUnavailableContent },
          ];
          const res = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: GROQ_MODEL,
              messages: apiMessages,
              max_tokens: responseMode === 'Concise' ? 300 : 900,
              temperature: 0.65,
            }),
          });
          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
          aiText = data.choices?.[0]?.message?.content || 'No response received.';
        }

      } else {
        // ─── Normal (non-camera) path — unchanged logic ──────────────────────
        const history = nextUserMessages.map((m) => ({ role: m.role, content: m.text }));
        const { content, hasImages } = await buildUserContent(text, validFiles, farmContext, modeInstruction);
        const model     = hasImages ? GROQ_VISION_MODEL : GROQ_MODEL;
        const maxTokens = responseMode === 'Concise' ? 200 : 800;

        let apiMessages = [];

        if (hasImages) {
          content[0].text = `[System Context: ${systemPrompt}]\n\n${content[0].text}`;
          apiMessages = [{ role: 'user', content: content }];
        } else {
          apiMessages = [
            { role: 'system', content: systemPrompt },
            ...history,
            { role: 'user', content }
          ];
        }

        try {
          const res = await fetch(GROQ_ENDPOINT, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({ model, messages: apiMessages, max_tokens: maxTokens, temperature: 0.65 }),
          });

          const data = await res.json();
          if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
          aiText = data.choices?.[0]?.message?.content || 'No response received.';
        } catch (groqError) {
          if (hasImages) {
            console.warn('Groq Vision failed, falling back to Google Gemini...', groqError);
            const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_VISION_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
            const geminiParts = content.map(part => {
              if (part.type === 'text') return { text: part.text };
              if (part.type === 'image_url') {
                return {
                  inline_data: {
                    mime_type: 'image/jpeg',
                    data: part.image_url.url.split(',')[1]
                  }
                };
              }
              return null;
            }).filter(Boolean);

            const geminiRes = await fetch(geminiEndpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ contents: [{ role: 'user', parts: geminiParts }] })
            });
            const geminiData = await geminiRes.json();
            if (!geminiRes.ok || geminiData.error) {
              throw new Error(`Google Gemini Fallback failed: ${geminiData.error?.message || geminiRes.status}`);
            }
            aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from Gemini.';
          } else {
            throw groqError;
          }
        }
      }

      // ─── Persist AI response ───────────────────────────────────────────────
      const segs = parseMessageSegments(aiText);
      const nextAssistantMessages = [...nextUserMessages, { role: 'assistant', text: aiText, segments: segs }];
      if (persistConversation(nextAssistantMessages)) {
        setMessages(nextAssistantMessages);
      }

    } catch (err) {
      console.error("AI Chat Error:", err);
      const attemptedImage = validFiles && validFiles.some((f) => f.isImage);
      const errText = attemptedImage
        ? t('aiChat.imageError')
        : t('aiChat.genericError');

      const nextErrorMessages = [
        ...nextUserMessages,
        { role: 'assistant', text: errText, segments: parseMessageSegments(errText) },
      ];
      if (persistConversation(nextErrorMessages)) {
        setMessages(nextErrorMessages);
      }
    } finally {
      setIsThinking(false);
    }
  }, [conversationLimitReached, farmProps, lang, messages, persistConversation, responseMode, setMessages, t]);

  return (
    <div className="flex flex-col w-full h-full font-newblack overflow-hidden relative" style={{ background: '#F5F7F6' }}>
      {conversationLimitReached ? (
        <div className="mx-3 sm:mx-6 md:mx-12 lg:mx-20 mt-2 rounded-lg border border-[#C73030]/20 bg-[#FFF4F4] px-3 py-2 text-sm text-[#8B1C1C]">
          {t('aiChat.limitReached')}
        </div>
      ) : null}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-12 lg:px-20 py-6 flex flex-col gap-6 pt-16">

        {messages.length === 0 && !isThinking && (
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center flex-1 gap-4 text-center select-none"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#D6F7CB' }}>
              <img src="/logo_sahla.svg" alt="SAHLA" className="w-11 h-11 object-contain" />
            </div>
            <p className="text-base font-medium max-w-xs" style={{ color: 'rgba(25,37,20,0.45)' }}>
              {t('aiChat.welcomeHint')}
            </p>
          </motion.div>
        )}

        {messages.map((msg, i) =>
          msg.role === 'user'
            ? <UserBubble key={i} message={msg} />
            : <AIBubble   key={i} segments={msg.segments || parseMessageSegments(msg.text)} />
        )}

        <AnimatePresence>
          {isThinking && (
            <motion.div key="thinking" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <ThinkingIndicator />
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      <ChatInput
        onSend={handleSend}
        onNewChat={handleClearChat}
        isThinking={isThinking}
        responseMode={responseMode}
        setResponseMode={setResponseMode}
        hasMessages={messages.length > 0}
      />
    </div>
  );
}