// src/pages/aiChat.jsx

import { useRef, useEffect, useCallback, useState } from 'react';
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
  GOOGLE_VISION_MODEL
} from '../utilities/data/chatConstants';

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
export default function AIchat({ crop, growthStage, mode, actuators, recommendedAction }) {
  
  // 1. Initialize state from LocalStorage
  const [messages, setMessages] = useState(() => {
    try {
      const savedChat = localStorage.getItem('sahla_chat_history');
      if (savedChat) {
        return JSON.parse(savedChat);
      }
    } catch (error) {
      console.error("Failed to load chat history:", error);
    }
    return [];
  });

  const [isThinking, setIsThinking]   = useState(false);
  const [responseMode, setResponseMode] = useState('Detailed');
  const bottomRef = useRef(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // 2. Sync state to LocalStorage every time messages change
  useEffect(() => {
    const savableMessages = messages.map(msg => ({
      role: msg.role,
      text: msg.text,
      segments: msg.segments,
      files: msg.files 
    }));
    
    localStorage.setItem('sahla_chat_history', JSON.stringify(savableMessages));
  }, [messages]);

  // 3. Clear Chat Function
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to start a new conversation?")) {
      setMessages([]);
      localStorage.removeItem('sahla_chat_history');
    }
  };

  const farmProps = { crop, growthStage, mode, actuators, recommendedAction };

  const handleSend = useCallback(async (text, rawFiles) => {
    if (!text && rawFiles.length === 0) return;

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

    setMessages((prev) => [...prev, { role: 'user', text, files: validFiles }]);

    const modeInstruction = responseMode === 'Concise'
      ? 'Keep your response brief — 2 to 3 sentences maximum.'
      : 'Structure your response clearly. Use bullet points or numbered lists when listing multiple items. Use paragraph breaks between distinct ideas.';

    const farmContext = buildFarmContext(farmProps);
    const history = messages.map((m) => ({ role: m.role, content: m.text }));

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
      setMessages((prev) => [...prev, { role: 'assistant', text: aiText, segments: segs }]);

    } catch (err) {
      console.error("AI Chat Error:", err);
      const attemptedImage = validFiles && validFiles.some((f) => f.isImage);
      const errText = attemptedImage 
        ? "⚠ Sorry, it seems I cannot process images now." 
        : "⚠ Sorry, it seems an error has occurred.";

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: errText, segments: parseMessageSegments(errText) },
      ]);
    } finally {
      setIsThinking(false);
    }
  }, [messages, responseMode, farmProps]);

  return (
    <div className="flex flex-col w-full min-h-screen font-newblack overflow-hidden relative" style={{ background: '#F5F7F6' }}>
      
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
              Ask me anything about your farm — sensors, actuators, irrigation, or crop advice.
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