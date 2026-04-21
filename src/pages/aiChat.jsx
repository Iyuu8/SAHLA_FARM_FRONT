// src/pages/aiChat.jsx

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

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

  // Compile the content of the attached .txt files
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIchat({
  recommendedAction,
}) {
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

  // AI chat is intentionally localStorage-backed in this simulation build.
  const [messages, setMessages] = usePersistentState(STORAGE_KEYS.chatHistory, []);
  const [responseMode, setResponseMode] = usePersistentState(`${STORAGE_KEYS.chatHistory}:mode`, 'Detailed');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationLimitReached, setConversationLimitReached] = useState(false);

  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // If localStorage contains malformed data or a previous save failed, keep UI usable.
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

  // Start a new chat from the shared App state.
  const handleClearChat = () => {
    if (window.confirm(CHAT_COPY.newChatConfirm)) {
      // Conversation reset clears all persisted messages for this chat thread.
      localStorage.removeItem(STORAGE_KEYS.chatHistory);
      setMessages([]);
      setConversationLimitReached(false);
    }
  };

  const farmProps = useMemo(() => ({
    crop,
    growthStage,
    mode,
    actuators,
    recommendedAction,
    displayUnits: {
      temperatureUnit,
      humidityUnit,
      soilMoistureUnit,
      lightIntensityUnit,
    },
  }), [
    actuators,
    crop,
    growthStage,
    humidityUnit,
    lightIntensityUnit,
    mode,
    recommendedAction,
    soilMoistureUnit,
    temperatureUnit,
  ]);

  const handleSend = useCallback(async (text, rawFiles) => {
    if (!text && rawFiles.length === 0) return;
    if (conversationLimitReached) return;

    setIsThinking(true);

    // ─── Process files *before* putting them into state ───
    const processedFiles = await Promise.all(rawFiles.map(async (f) => {
      // Handle Images
      if (f.type.startsWith('image/')) {
        try {
          const dataUrl = await compressImageToBase64(f);
          return { name: f.name, type: f.type, isImage: true, isText: false, dataUrl };
        } catch (e) {
          console.error("Image compression failed", e);
          return null;
        }
      } 
      // Handle Text Files (.txt)
      else if (f.type === 'text/plain' || f.name.endsWith('.txt')) {
        try {
          const textContent = await f.text(); // Extract the actual text from the file
          return { name: f.name, type: f.type, isImage: false, isText: true, textContent };
        } catch (e) {
          console.error("Text file read failed", e);
          return null;
        }
      }
      
      // Handle unsupported files
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
    const history = nextUserMessages.map((m) => ({ role: m.role, content: m.text }));

    try {
      const { content, hasImages } = await buildUserContent(text, validFiles, farmContext, modeInstruction);
      const model     = hasImages ? GROQ_VISION_MODEL : GROQ_MODEL;
      const maxTokens = responseMode === 'Concise' ? 200 : 800;

      let apiMessages = [];

      if (hasImages) {
        content[0].text = `[System Context: ${buildSystemPrompt()}]\n\n${content[0].text}`;
        apiMessages = [{ role: 'user', content: content }];
      } else {
        apiMessages = [
          { role: 'system', content: buildSystemPrompt() },
          ...history,
          { role: 'user', content }
        ];
      }

      let aiText = '';

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
            if (part.type === 'text') {
              return { text: part.text };
            } else if (part.type === 'image_url') {
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
            body: JSON.stringify({
              contents: [{ role: 'user', parts: geminiParts }]
            })
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

      const segs = parseMessageSegments(aiText);
      const nextAssistantMessages = [...nextUserMessages, { role: 'assistant', text: aiText, segments: segs }];
      if (persistConversation(nextAssistantMessages)) {
        setMessages(nextAssistantMessages);
      }

    } catch (err) {
      console.error("AI Chat Error:", err);
      const attemptedImage = validFiles && validFiles.some((f) => f.isImage);
      const errText = attemptedImage 
        ? CHAT_COPY.imageError
        : CHAT_COPY.genericError;

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
  }, [conversationLimitReached, farmProps, messages, persistConversation, responseMode, setMessages]);

  return (
    <div className="flex flex-col w-full h-full font-newblack overflow-hidden relative" style={{ background: '#F5F7F6' }}>
      {conversationLimitReached ? (
        <div className="mx-3 sm:mx-6 md:mx-12 lg:mx-20 mt-2 rounded-lg border border-[#C73030]/20 bg-[#FFF4F4] px-3 py-2 text-sm text-[#8B1C1C]">
          Reached conversation limit. Please open a new conversation to continue.
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
              {CHAT_COPY.welcomeHint}
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