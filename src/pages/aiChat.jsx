import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import UserBubble        from '../utilities/components/aiChat/UserBubble';
import AIBubble          from '../utilities/components/aiChat/AIBubble';
import ThinkingIndicator from '../utilities/components/aiChat/ThinkingIndicator';
import ChatInput         from '../utilities/components/aiChat/ChatInput';
import { parseMessageSegments } from '../utilities/components/aiChat/chatParser';
import { buildSystemPrompt, buildFarmContext } from '../utilities/components/aiChat/chatPrompts';
import {
  GROQ_API_KEY,
  GROQ_MODEL,
  GROQ_VISION_MODEL,
  GROQ_ENDPOINT,
} from '../utilities/components/aiChat/chatConstants';

// ─── Compress + encode image to base64 JPEG ───────────────────────────────────
// Groq vision requires images under ~4MB. We resize to max 1024px and compress.
function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else                { width = Math.round((width * MAX) / height);  height = MAX; }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);

      URL.revokeObjectURL(url);
      // Compress to JPEG at 85% quality
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

// ─── Build user content (handles images via vision) ───────────────────────────
async function buildUserContent(text, files, farmContext, modeInstruction) {
  const imageFiles = files.filter((f) => f.type.startsWith('image/'));
  const otherFiles = files.filter((f) => !f.type.startsWith('image/'));

  const textBlock = [
    farmContext,
    otherFiles.length > 0
      ? `[User attached non-image files: ${otherFiles.map((f) => f.name).join(', ')} — you cannot read these directly, acknowledge them politely]`
      : '',
    `[Style: ${modeInstruction}]`,
    `Farmer's message: ${text || '(see attached image — please describe and analyse it in the context of the farm)'}`,
  ].filter(Boolean).join('\n\n');

  if (imageFiles.length === 0) {
    return { content: textBlock, hasImages: false };
  }

  // Vision: array of content parts
  const contentParts = [{ type: 'text', text: textBlock }];

  for (const img of imageFiles) {
    try {
      const dataUrl = await compressImageToBase64(img);
      contentParts.push({ type: 'image_url', image_url: { url: dataUrl } });
    } catch {
      // If compression fails, skip the image and note it in text
      contentParts[0].text += `\n[Note: image "${img.name}" could not be processed]`;
    }
  }

  return { content: contentParts, hasImages: true };
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIchat({ crop, growthStage, mode, actuators, recommendedAction }) {
  const [messages, setMessages]       = useState([]);
  const [isThinking, setIsThinking]   = useState(false);
  const [responseMode, setResponseMode] = useState('Detailed');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const farmProps = { crop, growthStage, mode, actuators, recommendedAction };

  const handleSend = useCallback(async (text, files) => {
    if (!text && files.length === 0) return;

    setMessages((prev) => [...prev, { role: 'user', text, files }]);
    setIsThinking(true);

    const modeInstruction = responseMode === 'Concise'
      ? 'Keep your response brief — 2 to 3 sentences maximum.'
      : 'Structure your response clearly. Use bullet points or numbered lists when listing multiple items. Use paragraph breaks between distinct ideas.';

    const farmContext = buildFarmContext(farmProps);

    // Text-only history for multi-turn context
    const history = messages.map((m) => ({ role: m.role, content: m.text }));

    try {
      const { content, hasImages } = await buildUserContent(text, files, farmContext, modeInstruction);

      const model     = hasImages ? GROQ_VISION_MODEL : GROQ_MODEL;
      const maxTokens = responseMode === 'Concise' ? 200 : 800;

      let apiMessages = [];

      if (hasImages) {
        // FIX: Groq Vision models reject 'system' roles. 
        // `content[0]` is guaranteed to be the text object. We prepend the system instructions directly into it.
        content[0].text = `[System Context: ${buildSystemPrompt()}]\n\n${content[0].text}`;
        
        apiMessages = [
          { role: 'user', content: content } // Notice there is no 'system' role passed here!
        ];
      } else {
        // Standard text payload safely handles the system role and chat history
        apiMessages = [
          { role: 'system', content: buildSystemPrompt() },
          ...history,
          { role: 'user', content }
        ];
      }

      const res = await fetch(GROQ_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({ model, messages: apiMessages, max_tokens: maxTokens, temperature: 0.65 }),
      });

      const data = await res.json();

      // Expose API errors clearly instead of swallowing them
      if (!res.ok || data.error) {
        const errMsg = data.error?.message || `API error ${res.status}`;
        throw new Error(errMsg);
      }

      const aiText = data.choices?.[0]?.message?.content || 'No response received.';
      const segs   = parseMessageSegments(aiText);
      setMessages((prev) => [...prev, { role: 'assistant', text: aiText, segments: segs }]);

    } catch (err) {
      const errText = `⚠ ${err.message || 'Connection error. Please try again.'}`;
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: errText, segments: parseMessageSegments(errText) },
      ]);
    } finally {
      setIsThinking(false);
    }
  }, [messages, responseMode, farmProps]);

  return (
    <div className="flex flex-col w-full h-full font-newblack overflow-hidden" style={{ background: '#F5F7F6' }}>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-3 sm:px-6 md:px-12 lg:px-20 py-6 flex flex-col gap-6">

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
        isThinking={isThinking}
        responseMode={responseMode}
        setResponseMode={setResponseMode}
      />
    </div>
  );
}