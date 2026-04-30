// src/pages/aiChat.jsx

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import UserBubble        from '../utilities/components/aiChat/UserBubble';
import AIBubble          from '../utilities/components/aiChat/AIBubble';
import ThinkingIndicator from '../utilities/components/aiChat/ThinkingIndicator';
import ChatInput         from '../utilities/components/aiChat/ChatInput';

import { parseMessageSegments } from '../utilities/functions/chatParser';
import { buildSystemPrompt, buildFarmContext } from '../utilities/functions/chatPrompts';

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

// ─── Stream URL (must match CamStream.jsx) ────────────────────────────────────
const CAM_STREAM_URL = "http://10.201.157.253:8080/video";

// ─── Keywords that indicate the user wants a farm/camera description ──────────
// Add more keywords here as needed (supports any language)
const DESCRIPTION_KEYWORDS = [
  // English
  'describe', 'picture', 'look', 'camera', 'see', 'show', 'image', 'photo', 'snapshot', 'view',
  // Arabic
  'صورة', 'صف', 'كيف يبدو', 'حالة', 'كاميرا', 'شاهد', 'أرني', 'انظر',
  // French
  'décrire', 'photo', 'image', 'voir', 'montrer', 'caméra',
];

// BUG FIX 2: guard against empty/undefined text before calling .toLowerCase()
function isDescriptionRequest(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return DESCRIPTION_KEYWORDS.some((kw) => lower.includes(kw));
}

// ─── Try to grab a still frame from the IP cam ───────────────────────────────
// Returns a processed file object on success, or null if offline / CORS blocked.
function tryGrabStreamSnapshot() {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";

    // Give the camera 4 s to respond before giving up
    const timeout = setTimeout(() => {
      img.src = "";
      resolve(null);
    }, 4000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement("canvas");
        canvas.width  = img.naturalWidth  || 800;
        canvas.height = img.naturalHeight || 600;
        canvas.getContext("2d").drawImage(img, 0, 0);
        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        resolve({ name: "cam-snapshot.jpg", type: "image/jpeg", isImage: true, isText: false, dataUrl });
      } catch {
        resolve(null); // tainted canvas (CORS) — skip silently
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      resolve(null); // stream offline — skip silently
    };

    img.src = CAM_STREAM_URL;
  });
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

// ─── Build user content ───────────────────────────────────────────────────────
// BUG FIX 3: `userText` and `injectedNote` are kept separate.
// `injectedNote` is placed at the top of the block; `userText` fills only the
// "Farmer's message" line — so that line appears exactly once, never duplicated.
async function buildUserContent(userText, injectedNote, files, farmContext, modeInstruction, isVisionRequest = false) {
  const imageFiles = files.filter((f) => f.isImage);
  const textFiles  = files.filter((f) => f.isText);
  const otherFiles = files.filter((f) => !f.isImage && !f.isText);

  const textFilesContent = textFiles.length > 0
    ? `[User attached Text Files]:\n${textFiles.map(f => `--- Start of ${f.name} ---\n${f.textContent}\n--- End of ${f.name} ---`).join('\n\n')}`
    : '';

  // When a camera image is present, override the "use only when relevant" label
  // so the AI treats sensor data as MANDATORY, not optional.
  const farmContextBlock = isVisionRequest
    ? farmContext.replace(
        '[SILENT FARM CONTEXT — USE ONLY WHEN RELEVANT, DO NOT RECITE IN FULL]',
        '[MANDATORY FARM CONTEXT — YOU MUST USE ALL VALUES BELOW IN PART 2 OF YOUR RESPONSE]'
      )
    : farmContext;

  const textBlock = [
    injectedNote,                          // language + camera instruction at the very top
    farmContextBlock,
    otherFiles.length > 0
      ? `[System Note: The user attached unsupported files: ${otherFiles.map((f) => f.name).join(', ')}. You MUST politely inform the user that you can only read image files and text (.txt) files, and you cannot see the contents of those unsupported files.]`
      : '',
    textFilesContent,
    `[Style: ${modeInstruction}]`,
    `Farmer's message: ${userText || '(see attached files)'}`,  // uses raw userText, appears once
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIchat({ recommendedAction }) {
  const { t, i18n } = useTranslation();

  const {
    crop, growthStage, mode,
    temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit,
  } = useFarmPreferences();

  const [actuators] = useActuatorsState();

  const [messages, setMessages]         = usePersistentState(STORAGE_KEYS.chatHistory, []);
  const [responseMode, setResponseMode] = usePersistentState(`${STORAGE_KEYS.chatHistory}:mode`, 'Detailed');
  const [isThinking, setIsThinking]     = useState(false);
  const [conversationLimitReached, setConversationLimitReached] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!Array.isArray(messages)) setMessages([]);
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

  const farmProps = useMemo(() => ({
    crop, growthStage, mode, actuators, recommendedAction,
    displayUnits: { temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit },
  }), [actuators, crop, growthStage, humidityUnit, lightIntensityUnit, mode, recommendedAction, soilMoistureUnit, temperatureUnit]);

  const handleSend = useCallback(async (text, rawFiles) => {
    if (!text && rawFiles.length === 0) return;
    if (conversationLimitReached) return;

    setIsThinking(true);

    const lang = i18n.language;

    // ─── Step 1: Detect intent FIRST before any network calls ─────────────
    const wantsDescription = isDescriptionRequest(text);

    // ─── Step 2: Grab snapshot ONLY when user asked for a description ──────
    const [camSnapshot, ...processedRest] = await Promise.all([
      wantsDescription ? tryGrabStreamSnapshot() : Promise.resolve(null),
      ...rawFiles.map(async (f) => {
        if (f.type.startsWith('image/')) {
          try {
            const dataUrl = await compressImageToBase64(f);
            return { name: f.name, type: f.type, isImage: true, isText: false, dataUrl };
          } catch (e) { console.error("Image compression failed", e); return null; }
        } else if (f.type === 'text/plain' || f.name.endsWith('.txt')) {
          try {
            const textContent = await f.text();
            return { name: f.name, type: f.type, isImage: false, isText: true, textContent };
          } catch (e) { console.error("Text file read failed", e); return null; }
        }
        return { name: f.name, type: f.type, isImage: false, isText: false };
      }),
    ]);

    const validFiles = [
      ...(camSnapshot ? [camSnapshot] : []),
      ...processedRest.filter(Boolean),
    ];

    // ─── Step 3: Save user message to UI history ───────────────────────────
    const nextUserMessages = [...messages, { role: 'user', text, files: validFiles }];
    if (!persistConversation(nextUserMessages)) { setIsThinking(false); return; }
    setMessages(nextUserMessages);

    // ─── Step 4: Build language + formatting injection ─────────────────────
    // Kept as a standalone block — passed separately into buildUserContent so
    // it never gets concatenated with the "Farmer's message" line (Bug Fix 3).
    let injectedNote = `[CRITICAL INSTRUCTION: Your ENTIRE response MUST be written in the language with ISO code '${lang}'. Translate ALL text — section headers, sensor names, introductory phrases, everything — into '${lang}'. Do NOT produce any English text unless it is a specific technical unit (e.g. °C, %, lux).]`;

    if (wantsDescription) {
      const formattingInstruction = `
Your response MUST follow this exact two-part structure (ALL headers translated into '${lang}'):

PART 1 — Visual Description (from the image only):
Describe only what you visually observe in the attached photo (colors, plant appearance, greenhouse structure, lighting, etc.). Do NOT derive any sensor values or farm status from the image.

PART 2 — Farm Data (from the sensor context above, NOT from the image):
Use ONLY the farm context data provided above (ignore the image entirely for this part). Present it under these sections:
- **Current Farm Status**: (mode, crop, growth stage, time, weather)
- **Sensor Readings**: (soil moisture, temperature, humidity, light intensity — use the exact values from the farm context)
- **Actuator Status**: (pump and fan states, modes, schedules)
- **Alerts and Recommendations**: (active alerts and actionable advice)

CRITICAL: The sensor values and farm status in Part 2 MUST come exclusively from the farm context data, never inferred or estimated from the image.`;

      if (camSnapshot) {
        injectedNote += `\n\n[System Note: A real-time camera snapshot of the farm is attached. The image is provided SOLELY for visual description purposes. The farm sensor data and status information in the farm context above is always the authoritative source — do not override or ignore it based on anything you see in the image.${formattingInstruction}]`;
      } else {
        injectedNote += `\n\n[System Note: The farm camera is currently OFFLINE. Begin your response by politely informing the user the camera is unavailable. Then proceed directly to Part 2 using the farm context data provided above.${formattingInstruction}]`;
      }
    }

    // ─── Step 5: Build API payload ─────────────────────────────────────────
    const modeInstruction = responseMode === 'Concise'
      ? CHAT_COPY.conciseModeInstruction
      : CHAT_COPY.detailedModeInstruction;

    const farmContext = buildFarmContext(farmProps);

    // BUG FIX 1: history is built from `messages` (the state BEFORE this send),
    // NOT from `nextUserMessages` — otherwise the new user message is sent twice.
    const history = messages.map((m) => ({ role: m.role, content: m.text }));

    try {
      // Pass raw `text` and `injectedNote` as separate args — no duplication possible.
      const { content, hasImages } = await buildUserContent(
        text, injectedNote, validFiles, farmContext, modeInstruction, wantsDescription
      );

      const model     = hasImages ? GROQ_VISION_MODEL : GROQ_MODEL;
      const maxTokens = responseMode === 'Concise' ? 200 : 800;

      let apiMessages = [];
      if (hasImages) {
        // Vision models don't support a separate system role — prepend to first text part
        content[0].text = `[System Context: ${buildSystemPrompt({ hasCamSnapshot: !!camSnapshot, language: lang })}]\n\n${content[0].text}`;
        apiMessages = [{ role: 'user', content }];
      } else {
        apiMessages = [
          { role: 'system', content: buildSystemPrompt({ hasCamSnapshot: false, language: lang }) },
          ...history,
          { role: 'user', content },
        ];
      }

      let aiText = '';

      // ─── Primary: Groq ─────────────────────────────────────────────────
      try {
        const res = await fetch(GROQ_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${GROQ_API_KEY}` },
          body: JSON.stringify({ model, messages: apiMessages, max_tokens: maxTokens, temperature: 0.65 }),
        });
        const data = await res.json();
        if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
        aiText = data.choices?.[0]?.message?.content || 'No response received.';

      } catch (groqError) {
        // ─── Fallback: Google Gemini (ALL Groq failures incl. rate limits) ─
        console.warn('Groq failed, falling back to Google Gemini...', groqError);

        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_VISION_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;

        let geminiParts;
        if (hasImages) {
          // Vision request — map multipart content array
          geminiParts = content.map(part => {
            if (part.type === 'text')      return { text: part.text };
            if (part.type === 'image_url') return { inline_data: { mime_type: 'image/jpeg', data: part.image_url.url.split(',')[1] } };
            return null;
          }).filter(Boolean);
        } else {
          // Text-only request — flatten system prompt + history + current message
          const systemText = buildSystemPrompt({ hasCamSnapshot: false, language: lang });
          const historyText = history.map(m => `[${m.role}]: ${m.content}`).join('\n');
          const userText = typeof content === 'string' ? content : (content[0]?.text ?? '');
          geminiParts = [{ text: `${systemText}\n\n${historyText}\n\n[user]: ${userText}` }];
        }

        const geminiRes = await fetch(geminiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ role: 'user', parts: geminiParts }] }),
        });
        const geminiData = await geminiRes.json();
        if (!geminiRes.ok || geminiData.error) throw new Error(`Google Gemini Fallback failed: ${geminiData.error?.message || geminiRes.status}`);
        aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No response received from Gemini.';
      }

      // ─── Step 6: Persist assistant reply ──────────────────────────────
      const segs = parseMessageSegments(aiText);
      const nextAssistantMessages = [...nextUserMessages, { role: 'assistant', text: aiText, segments: segs }];
      if (persistConversation(nextAssistantMessages)) setMessages(nextAssistantMessages);

    } catch (err) {
      console.error("AI Chat Error:", err);
      const attemptedImage = validFiles.some((f) => f.isImage);
      const errText = attemptedImage ? t('aiChat.imageError') : t('aiChat.genericError');
      const nextErrorMessages = [...nextUserMessages, { role: 'assistant', text: errText, segments: parseMessageSegments(errText) }];
      if (persistConversation(nextErrorMessages)) setMessages(nextErrorMessages);
    } finally {
      setIsThinking(false);
    }
  }, [conversationLimitReached, farmProps, messages, persistConversation, responseMode, setMessages, t, i18n.language]);

  return (
    <div className="flex flex-col w-full h-full font-newblack overflow-hidden relative" style={{ background: '#F5F7F6' }}>
      {conversationLimitReached && (
        <div className="mx-3 sm:mx-4 md:mx-6 mt-2 rounded-lg border border-[#C73030]/20 bg-[#FFF4F4] px-3 py-2 text-sm text-[#8B1C1C]">
          {t('aiChat.limitReached')}
        </div>
      )}

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-4 md:px-6 py-6 flex flex-col gap-6 pt-16">

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