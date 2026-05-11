// src/pages/aiChat.jsx

import { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

import UserBubble        from '../utilities/components/aiChat/UserBubble';
import AIBubble          from '../utilities/components/aiChat/AIBubble';
import ThinkingIndicator from '../utilities/components/aiChat/ThinkingIndicator';
import ChatInput         from '../utilities/components/aiChat/ChatInput';

import { parseMessageSegments } from '../utilities/functions/chatParser';
import { buildSystemPrompt, buildFarmContext, buildLanguageInstruction } from '../utilities/functions/chatPrompts';
import { useHAStatus } from '../context/HAStatusContext';

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
import useFarmPreferences from '../context/FarmContext';
import useActuatorsState from '../hooks/useActuatorsState';
import usePersistentState from '../hooks/usePersistentState';
import useLiveState from '../hooks/useLiveState';
import { DASHBOARD_SENSOR_OPTIONS } from '../utilities/data/dashboardData';
import useHaCredentials from '../hooks/useHaCredentials';


const HA_ENTITY   = 'camera.farm_camera_farm_camera_feed';

// ─── Language helpers ─────────────────────────────────────────────────────────
function normalizeLanguage(lang) {
  if (!lang) return 'en';
  const code = lang.toLowerCase().split('-')[0];
  if (code === 'ar') return 'ar';
  if (code === 'fr') return 'fr';
  return 'en';
}

function langName(lang) {
  if (lang === 'ar') return 'Arabic';
  if (lang === 'fr') return 'French';
  return 'English';
}

// ─── Critical language rule injected into EVERY API call ─────────────────────
// This tells the model to write DIRECTLY in the target language — no translation,
// no mixing, no Chinese/other script contamination.
function criticalLangRule(lang) {
  const name = langName(lang);
  if (lang === 'ar') {
    return `CRITICAL — LANGUAGE ENFORCEMENT:
You MUST write your ENTIRE response exclusively in Arabic (العربية).
Do NOT write even a single word in English, French, Chinese, or any other language.
Do NOT translate your response — compose it directly and originally in Arabic.
Do NOT add any text in another language before, after, or inside your Arabic response.
If you are uncertain about a word, use a simple Arabic equivalent — never fall back to another script.`;
  }
  if (lang === 'fr') {
    return `CRITICAL — LANGUAGE ENFORCEMENT:
You MUST write your ENTIRE response exclusively in French (français).
Do NOT write even a single word in English, Arabic, Chinese, or any other language.
Do NOT translate your response — compose it directly and originally in French.
Do NOT add any text in another language before, after, or inside your French response.`;
  }
  return `CRITICAL — LANGUAGE ENFORCEMENT:
You MUST write your ENTIRE response exclusively in English.
Do NOT write even a single word in Arabic, French, Chinese, or any other language.
Do NOT translate your response — compose it directly and originally in English.`;
}

// ─── Varied offline responses (7 variants) ───────────────────────────────────
const OFFLINE_VARIANTS = {
  en: [
    "Your farm is currently offline, so I can't access any live sensor data or camera feeds. Once you reconnect to Home Assistant, I'll be able to give you full updates.\n\nIf you need help connecting, I'm here to assist you.",
    "It seems you're not connected to the farm right now. Without the Home Assistant link, I can't see your sensors, actuators, or alerts. Let's get you back online!\n\nIf you need help connecting, I'm here to assist you.",
    "I don't have a live connection to your farm at the moment. Please check your Home Assistant settings and reconnect so I can pull the latest data for you.\n\nIf you need help connecting, I'm here to assist you.",
    "The farm connection appears to be down. I won't be able to describe conditions or show camera snapshots until you restore the Home Assistant connection.\n\nIf you need help connecting, I'm here to assist you.",
    "You're disconnected from the farm. I can't retrieve any real-time information right now — but as soon as you reconnect, I'll have all your dashboard data ready.\n\nIf you need help connecting, I'm here to assist you.",
    "I can't reach your farm right now — the connection to Home Assistant is offline. This means no sensor readings, no camera view, and no alerts until you reconnect.\n\nIf you need help connecting, I'm here to assist you.",
    "Your farm dashboard is unreachable at the moment because the Home Assistant link is broken. Reconnect and I'll instantly pull all your live data and camera feeds.\n\nIf you need help connecting, I'm here to assist you.",
  ],
  ar: [
    "المزرعة غير متصلة حاليًا، لذا لا أستطيع الوصول إلى بيانات المستشعرات المباشرة أو تغذية الكاميرا. بمجرد إعادة الاتصال بـ Home Assistant، سأتمكن من تزويدك بالتحديثات الكاملة.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "يبدو أنك غير متصل بالمزرعة الآن. بدون رابط Home Assistant، لا أستطيع رؤية مستشعراتك أو المشغلات أو التنبيهات. دعنا نعيدك إلى الإنترنت!\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "ليس لدي اتصال مباشر بمزرعتك في الوقت الحالي. يرجى التحقق من إعدادات Home Assistant الخاصة بك وإعادة الاتصال حتى أتمكن من سحب أحدث البيانات لك.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "يبدو أن اتصال المزرعة معطّل. لن أتمكن من وصف الظروف أو إظهار لقطات الكاميرا حتى تستعيد اتصال Home Assistant.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "أنت غير متصل بالمزرعة. لا أستطيع استرداد أي معلومات في الوقت الفعلي الآن — ولكن بمجرد إعادة الاتصال، ستكون جميع بيانات لوحة المعلومات جاهزة لك.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "لا أستطيع الوصول إلى مزرعتك حاليًا لأن الاتصال بـ Home Assistant منقطع. هذا يعني عدم وجود قراءات للمستشعرات ولا عرض للكاميرا ولا تنبيهات حتى تعيد الاتصال.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
    "لوحة معلومات مزرعتك غير متاحة في الوقت الحالي لأن رابط Home Assistant معطّل. أعد الاتصال وسأسحب فورًا جميع بياناتك المباشرة وتغذيات الكاميرا.\n\nإذا احتجتَ مساعدة للاتصال، أنا هنا لأساعدك.",
  ],
  fr: [
    "Votre ferme est actuellement hors ligne, donc je ne peux pas accéder aux données des capteurs en direct ni aux flux de la caméra. Une fois que vous aurez reconnecté Home Assistant, je pourrai vous donner des mises à jour complètes.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "Il semble que vous ne soyez pas connecté à la ferme en ce moment. Sans le lien Home Assistant, je ne peux pas voir vos capteurs, actionneurs ou alertes. Reconnectons-nous !\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "Je n'ai pas de connexion en direct avec votre ferme pour le moment. Veuillez vérifier vos paramètres Home Assistant et vous reconnecter pour que je puisse récupérer les dernières données.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "La connexion à la ferme semble être coupée. Je ne pourrai pas décrire les conditions ni afficher les instantanés de la caméra tant que vous n'aurez pas restauré la connexion Home Assistant.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "Vous êtes déconnecté de la ferme. Je ne peux récupérer aucune information en temps réel pour l'instant — mais dès que vous serez reconnecté, toutes les données de votre tableau de bord seront prêtes.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "Je ne peux pas atteindre votre ferme pour le moment — la connexion à Home Assistant est hors ligne. Cela signifie aucune lecture de capteurs, aucune vue de la caméra et aucune alerte jusqu'à ce que vous reconnectiez.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
    "Votre tableau de bord de ferme est inaccessible en ce moment car le lien Home Assistant est rompu. Reconnectez-vous et je récupérerai instantanément toutes vos données en direct et vos flux de caméra.\n\nSi vous avez besoin d'aide pour vous connecter, je suis là pour vous assister.",
  ],
};

// ─── Concise guide steps ─────────────────────────────────────────────────────
const GUIDE_STEPS = {
  en: [
    "Let's get you reconnected. **Step 1:** Open Home Assistant in your browser and click on your **Profile** (bottom-left sidebar).\n\nWere you able to open your profile?",
    "**Step 2:** Scroll down to **Long-Lived Access Tokens**, click **Create Token**, name it (e.g. \"SAHLA\"), then **copy** the token immediately — you won't see it again.\n\nDid you copy the token?",
    "**Step 3:** Come back to this SAHLA app and open the **Settings** page from the menu.\n\nAre you on the Settings page?",
    "**Step 4:** Look for the **Home Assistant Connection** section in Settings.\n\nCan you see the connection section?",
    "**Step 5:** Paste the token you copied and enter your Home Assistant URL (for example: `http://raspberrypi.local:8123/`).\n\nDid you paste both the token and the URL?",
    "**Step 6:** Tap **Save**. The app will test the connection and the status should turn **Online** within a few seconds.\n\nDid it show Online?",
    "After saving, wait about 5–10 seconds for the status to update. If it still shows offline, double-check the URL and token for any extra spaces.\n\nIs the status Online now?",
  ],
  ar: [
    "دعنا نعيد الاتصال. **الخطوة ١:** افتح Home Assistant في المتصفح وانقر على **ملفك الشخصي** (الشريط الجانبي السفلي الأيسر).\n\nهل تمكنت من فتح ملفك الشخصي؟",
    "**الخطوة ٢:** مرر لأسفل إلى **رموز الوصول طويلة الأمد**، انقر على **إنشاء رمز**، سمِّه (مثلاً \"سهلة\")، ثم **انسخ** الرمز فورًا — لن تتمكن من رؤيته مرة أخرى.\n\nهل نسخت الرمز؟",
    "**الخطوة ٣:** عد إلى تطبيق سهلة وافتح صفحة **الإعدادات** من القائمة.\n\nهل أنت في صفحة الإعدادات؟",
    "**الخطوة ٤:** ابحث عن قسم **اتصال Home Assistant** في الإعدادات.\n\nهل تجد قسم الاتصال؟",
    "**الخطوة ٥:** الصق الرمز الذي نسخته وأدخل عنوان URL الخاص بـ Home Assistant (مثال: `http://raspberrypi.local:8123/`).\n\nهل لصقت الرمز وأدخلت العنوان؟",
    "**الخطوة ٦:** اضغط على **حفظ**. سيتم اختبار الاتصال ويجب أن تتغير الحالة إلى **متصل** خلال ثوانٍ قليلة.\n\nهل ظهرت حالة متصل؟",
    "بعد الحفظ، انتظر حوالي ٥–١٠ ثوانٍ حتى يتم تحديث الحالة. إذا كان لا يزال يظهر غير متصل، تحقق جيدًا من عنوان URL والرمز بحثًا عن أي مسافات إضافية.\n\nهل أصبحت الحالة متصل الآن؟",
  ],
  fr: [
    "Reconnectons votre ferme. **Étape 1 :** Ouvrez Home Assistant dans votre navigateur et cliquez sur votre **Profil** (barre latérale en bas à gauche).\n\nAvez-vous pu ouvrir votre profil ?",
    "**Étape 2 :** Faites défiler jusqu'à **Jetons d'accès à long terme**, cliquez sur **Créer un jeton**, nommez-le (par ex. \"SAHLA\"), puis **copiez** immédiatement le jeton — vous ne pourrez plus le voir.\n\nAvez-vous copié le jeton ?",
    "**Étape 3 :** Revenez dans l'application SAHLA et ouvrez la page **Paramètres** depuis le menu.\n\nÊtes-vous sur la page Paramètres ?",
    "**Étape 4 :** Recherchez la section **Connexion Home Assistant** dans les paramètres.\n\nPouvez-vous voir la section de connexion ?",
    "**Étape 5 :** Collez le jeton copié et saisissez votre URL Home Assistant (par ex. `http://raspberrypi.local:8123/`).\n\nAvez-vous collé le jeton et saisi l'URL ?",
    "**Étape 6 :** Appuyez sur **Enregistrer**. L'application testera la connexion et le statut devrait passer à **En ligne** en quelques secondes.\n\nLe statut affiche-t-il En ligne ?",
    "Après l'enregistrement, attendez environ 5 à 10 secondes pour que le statut se mette à jour. S'il affiche toujours hors ligne, vérifiez l'URL et le jeton pour d'éventuels espaces supplémentaires.\n\nLe statut est-il En ligne maintenant ?",
  ],
};

// ─── Detailed guide steps — used as context for the AI clarification call ─────
const GUIDE_STEPS_DETAILED = {
  en: [
    "Step 1 — Open Your Profile:\nOpen Home Assistant in your browser. Look at the bottom-left sidebar — you should see your username or a small person icon. Click on it. This opens your Profile page where you can manage personal settings and security tokens. If you don't see the sidebar, tap the menu icon (☰) at the top left to expand it first.",
    "Step 2 — Create a Long-Lived Token:\nOn your Profile page, scroll all the way to the bottom until you see a section called Long-Lived Access Tokens. Click the Create Token button. A popup will ask for a name — type anything you like, such as SAHLA or Farm App. Then click OK. A very long string of random letters and numbers will appear. Copy it immediately. Important: Once you close this popup, the token is gone forever and cannot be retrieved again.",
    "Step 3 — Open SAHLA Settings:\nSwitch back to this SAHLA app. Look at the navigation menu (usually at the bottom or side of the screen) and tap on Settings or the gear icon. This will open the settings page where you can configure external connections like Home Assistant.",
    "Step 4 — Find the Connection Section:\nOn the Settings page, scroll down slowly until you find a card or section titled Home Assistant Connection. It has two empty fields: one for the URL and one for the Token. This is exactly where you will paste the credentials you copied in Step 2.",
    "Step 5 — Paste Your Credentials:\nTap into the URL field and type your Home Assistant address exactly as you access it in your browser. It usually looks like this: http://raspberrypi.local:8123/ or http://192.168.1.100:8123/. Make sure to include http:// and the trailing slash. Then tap into the Token field and paste the long token you copied. Double-check that there are no extra spaces at the beginning or end.",
    "Step 6 — Save and Verify:\nTap the Save button. The app will send a test message to your Home Assistant to verify everything works. Wait 5–10 seconds. If successful, a green badge or the word Online will appear. If you see Offline or an error, check that your phone/computer is on the same Wi-Fi network as your Home Assistant.",
    "Troubleshooting:\n1. Same Network: Make sure your device and Home Assistant are on the same Wi-Fi network.\n2. URL Format: Check that the URL starts with http:// not https://.\n3. No Spaces: Verify there are no extra spaces before or after the token.\n4. Restart App: Close SAHLA completely and reopen it.\n5. Use IP Address: If raspberrypi.local doesn't work, try the actual IP address.",
  ],
  ar: [
    "الخطوة ١ — فتح الملف الشخصي:\nافتح Home Assistant في المتصفح. انظر إلى الشريط الجانبي السفلي الأيسر — ستجد اسم المستخدم أو أيقونة شخص صغيرة. انقر عليها. هذا يفتح صفحة ملفك الشخصي حيث يمكنك إدارة الإعدادات الشخصية ورموز الأمان. إذا لم ترَ الشريط الجانبي، انقر على أيقونة القائمة في الأعلى يسارًا لتوسيعه أولاً.",
    "الخطوة ٢ — إنشاء رمز وصول:\nفي صفحة ملفك الشخصي، مرر لأسفل تمامًا حتى ترى قسم رموز الوصول طويلة الأمد. انقر على إنشاء رمز. ستظهر نافذة تطلب اسمًا — اكتب أي اسم مثل سهلة. ثم انقر موافق. سيظهر نص طويل جدًا من حروف وأرقام. انسخه فورًا. تنبيه: بمجرد إغلاق هذه النافذة سيختفي الرمز إلى الأبد.",
    "الخطوة ٣ — فتح إعدادات سهلة:\nعد إلى تطبيق سهلة. انظر إلى قائمة التنقل وانقر على الإعدادات أو أيقونة الترس. هذا يفتح صفحة الإعدادات حيث يمكنك ضبط الاتصالات الخارجية مثل Home Assistant.",
    "الخطوة ٤ — البحث عن قسم الاتصال:\nفي صفحة الإعدادات، مرر لأسفل ببطء حتى تجد قسم اتصال Home Assistant. يحتوي على حقلين فارغين: أحدهما للعنوان URL والآخر للرمز. هنا بالضبط ستلصق بيانات الاعتماد التي نسختها في الخطوة ٢.",
    "الخطوة ٥ — لصق بيانات الاعتماد:\nانقر في حقل العنوان URL واكتب عنوان Home Assistant بالضبط. عادةً يبدو هكذا: http://raspberrypi.local:8123/ أو http://192.168.1.100:8123/. تأكد من تضمين http:// والشرطة المائلة في النهاية. ثم انقر في حقل الرمز والصق الرمز الطويل. تحقق من عدم وجود مسافات إضافية في البداية أو النهاية.",
    "الخطوة ٦ — الحفظ والتحقق:\nانقر على زر حفظ. سيرسل التطبيق رسالة اختبار إلى Home Assistant. انتظر ٥–١٠ ثوانٍ. إذا نجح الأمر ستظهر كلمة متصل. إذا ظهر غير متصل تحقق من أن هاتفك على نفس شبكة Wi-Fi الخاصة بـ Home Assistant.",
    "استكشاف الأخطاء:\n١. نفس الشبكة: تأكد من أن جهازك وHome Assistant على نفس شبكة Wi-Fi.\n٢. تنسيق العنوان: تحقق من أن العنوان يبدأ بـ http:// وليس https://.\n٣. بدون مسافات: تأكد من عدم وجود مسافات إضافية قبل أو بعد الرمز.\n٤. أعد التشغيل: أغلق تطبيق سهلة بالكامل وأعد فتحه.\n٥. استخدم عنوان IP: إذا كان raspberrypi.local لا يعمل جرب عنوان IP الفعلي.",
  ],
  fr: [
    "Étape 1 — Ouvrez votre profil :\nOuvrez Home Assistant dans votre navigateur. Regardez la barre latérale en bas à gauche — vous devriez voir votre nom d'utilisateur ou une petite icône de personne. Cliquez dessus. Cela ouvre votre page de profil. Si vous ne voyez pas la barre latérale, cliquez sur l'icône du menu en haut à gauche pour l'ouvrir.",
    "Étape 2 — Créez un jeton d'accès :\nSur votre page de profil, faites défiler jusqu'en bas jusqu'à voir la section Jetons d'accès à long terme. Cliquez sur Créer un jeton. Une fenêtre demandera un nom — tapez ce que vous voulez comme SAHLA. Puis cliquez sur OK. Une très longue chaîne de caractères apparaîtra. Copiez-la immédiatement. Important : une fois cette fenêtre fermée, le jeton disparaît pour toujours.",
    "Étape 3 — Ouvrez les paramètres SAHLA :\nRevenez à cette application SAHLA. Regardez le menu de navigation et appuyez sur Paramètres ou l'icône d'engrenage. Cela ouvre la page des paramètres où vous pouvez configurer les connexions externes.",
    "Étape 4 — Trouvez la section de connexion :\nSur la page des paramètres, faites défiler vers le bas jusqu'à trouver la section Connexion Home Assistant. Elle contient deux champs vides : un pour l'URL et un pour le Jeton. C'est exactement ici que vous collerez les identifiants copiés.",
    "Étape 5 — Collez vos identifiants :\nAppuyez dans le champ URL et tapez l'adresse de votre Home Assistant. Elle ressemble à ceci : http://raspberrypi.local:8123/ ou http://192.168.1.100:8123/. Assurez-vous d'inclure http:// et la barre oblique finale. Puis collez le long jeton. Vérifiez qu'il n'y a pas d'espaces supplémentaires au début ou à la fin.",
    "Étape 6 — Enregistrez et vérifiez :\nAppuyez sur Enregistrer. L'application enverra un message de test à Home Assistant. Attendez 5 à 10 secondes. Si c'est réussi, le mot En ligne apparaîtra. Si vous voyez Hors ligne, vérifiez que votre téléphone est sur le même réseau Wi-Fi que Home Assistant.",
    "Dépannage :\n1. Même réseau : Assurez-vous que votre appareil et Home Assistant sont sur le même réseau Wi-Fi.\n2. Format URL : Vérifiez que l'URL commence par http:// pas https://.\n3. Pas d'espaces : Vérifiez qu'il n'y a pas d'espaces supplémentaires avant ou après le jeton.\n4. Redémarrer : Fermez complètement l'application SAHLA et rouvrez-la.\n5. Utiliser l'IP : Si raspberrypi.local ne fonctionne pas, essayez l'adresse IP réelle.",
  ],
};

const CONNECTED_MSG = {
  en: "🎉 **Congratulations!** You are now connected to your farm.\n\nYou can now:\n• View the **live camera feed**\n• Explore the **dashboard** with real-time sensors\n• Access all **farm pages** and controls\n\nHow can I help you today?",
  ar: "🎉 **تهانينا!** أنت الآن متصل بمزرعتك.\n\nيمكنك الآن:\n• مشاهدة **البث المباشر للكاميرا**\n• استكشاف **لوحة المعلومات** مع المستشعرات في الوقت الفعلي\n• الوصول إلى جميع **صفحات المزرعة** وعناصر التحكم\n\nكيف يمكنني مساعدك اليوم؟",
  fr: "🎉 **Félicitations !** Vous êtes maintenant connecté à votre ferme.\n\nVous pouvez désormais :\n• Voir le **flux de la caméra en direct**\n• Explorer le **tableau de bord** avec les capteurs en temps réel\n• Accéder à toutes les **pages de la ferme** et aux contrôles\n\nComment puis-je vous aider aujourd'hui ?",
};

function getOfflineVariant(lang, index) {
  const list = OFFLINE_VARIANTS[lang] || OFFLINE_VARIANTS.en;
  return list[index % list.length];
}

function getGuideStep(lang, step) {
  const list = GUIDE_STEPS[lang] || GUIDE_STEPS.en;
  return list[Math.min(step, list.length - 1)];
}

function getGuideStepDetailed(lang, step) {
  const list = GUIDE_STEPS_DETAILED[lang] || GUIDE_STEPS_DETAILED.en;
  return list[Math.min(step, list.length - 1)];
}

function getConnectedMsg(lang) {
  return CONNECTED_MSG[lang] || CONNECTED_MSG.en;
}

// ─── Keywords that trigger auto-snapshot ─────────────────────────────────────
const SNAPSHOT_KEYWORDS_EN = [
  'camera', 'snapshot', 'based on image', 'based on photo', 'based on camera',
  'based on picture', 'from the camera', 'from the image', 'from the photo',
  'using the camera', 'show me the camera', 'what does the farm look like',
  'via camera', 'visual farm', 'farm visual', 'look at the farm', 'see the farm',
  'show the farm', 'view the farm', 'look', 'see', 'show', 'view', 'photo',
  'image', 'picture', 'visual',
];
const SNAPSHOT_KEYWORDS_AR = [
  'كاميرا', 'لقطة', 'صورة', 'الصورة', 'الكاميرا',
  'بناءً على الصورة', 'بناءً على الكاميرا', 'من الكاميرا', 'من الصورة',
  'باستخدام الكاميرا', 'أرني الكاميرا', 'أرني الصورة', 'أريني', 'أظهر',
  'كيف تبدو المزرعة', 'عبر الكاميرا', 'مرئية', 'منظر', 'انظر', 'شاهد',
];
const SNAPSHOT_KEYWORDS_FR = [
  'caméra', 'capture', 'image', 'photo', "basé sur l'image", "basé sur la caméra",
  'depuis la caméra', 'montre-moi la caméra', 'voir la ferme', 'regarde', 'voir',
  'montre', 'vue', 'visuel',
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

// ─── Grab snapshot from HA camera proxy ──────────────────────────────────────
async function tryGrabStreamSnapshot(haUrl, haToken) {
  console.log('[Snapshot] haUrl:', haUrl, '| haToken exists:', !!haToken);
  if (!haUrl || !haToken) {
    console.warn('[Snapshot] ABORTED — missing haUrl or haToken');
    return null;
  }
  const proxyUrl = `${haUrl.replace(/\/+$/, '')}/api/camera_proxy/${HA_ENTITY}`;
  console.log('[Snapshot] Fetching:', proxyUrl);
  try {
    const res = await fetch(proxyUrl, {
      headers: { Authorization: `Bearer ${haToken}` },
    });
    console.log('[Snapshot] Response status:', res.status, res.statusText);
    if (!res.ok) {
      console.warn('[Snapshot] FAILED — HTTP', res.status);
      return null;
    }
    const blob = await res.blob();
    console.log('[Snapshot] Blob size:', blob.size, 'type:', blob.type);
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.split(',')[1] ?? null;
        console.log('[Snapshot] Base64 length:', base64?.length ?? 0);
        resolve(base64);
      };
      reader.onerror = () => {
        console.warn('[Snapshot] FileReader error');
        resolve(null);
      };
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.error('[Snapshot] EXCEPTION:', err);
    return null;
  }
}

// ─── Compress image to base64 JPEG ───────────────────────────────────────────
function compressImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX; }
        else { width = Math.round((width * MAX) / height); height = MAX; }
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
      ? `[System Note: The user attached unsupported files: ${otherFiles.map((f) => f.name).join(', ')}. Politely inform the user you can only read image files and text (.txt) files.]`
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

// ─── Build snapshot messages (with language enforcement) ──────────────────────
function buildSnapshotMessages(systemPrompt, farmContext, modeInstruction, userText, snapshotBase64, lang) {
  const textBlock = [
    farmContext,
    `[Style: ${modeInstruction}]`,
    criticalLangRule(lang),
    `[TASK — TWO-PART RESPONSE]:
Part 1 — Visual Description: Carefully describe what you see in the attached farm camera image. Comment on crop condition, equipment, lighting, soil, and any anomalies.

Part 2 — Farm Data Report: Based EXCLUSIVELY on the farm sensor data provided above (not the image), give a structured report of current sensor readings, actuator states, and any active alerts.

Farmer's message: ${userText || 'Describe the farm.'}`,
  ].filter(Boolean).join('\n\n');

  return [
    {
      role: 'user',
      content: [
        { type: 'text', text: `[System Context: ${systemPrompt}]\n\n${textBlock}` },
        { type: 'image_url', image_url: { url: `data:image/jpeg;base64,${snapshotBase64}` } },
      ],
    },
  ];
}

// ─── Build camera-unavailable prompt ─────────────────────────────────────────
function buildCameraUnavailablePrompt(farmContext, modeInstruction, userText) {
  return [
    farmContext,
    `[Style: ${modeInstruction}]`,
    `[TASK — TWO-PART RESPONSE]:
Part 1 — Camera Status: Inform the farmer politely that the farm camera is currently unavailable or offline. Do NOT speculate on what the farm looks like visually.

Part 2 — Farm Data Report: Based EXCLUSIVELY on the farm sensor data provided above, give a structured report of current sensor readings, actuator states, and any active alerts.

Farmer's message: ${userText || 'Describe the farm.'}`,
  ].filter(Boolean).join('\n\n');
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function AIchat({ recommendedAction }) {
  const { haUrl, haToken, isHaOnline, loading } = useHaCredentials();
  const { t, i18n } = useTranslation();
  const { haStatus, haLoading } = useHAStatus();
  const lang = normalizeLanguage(i18n.language);

  const {
    crop, growthStage, mode,
    temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit,
  } = useFarmPreferences();

  const [actuators] = useActuatorsState();

  const {
    liveSensors, liveActuators, liveCrop,
    liveRecommendation, liveWarnings,
  } = useLiveState(DASHBOARD_SENSOR_OPTIONS);

  const [messages, setMessages] = usePersistentState(STORAGE_KEYS.chatHistory, []);
  const [responseMode, setResponseMode] = usePersistentState(`${STORAGE_KEYS.chatHistory}:mode`, 'Detailed');
  const [isThinking, setIsThinking] = useState(false);
  const [conversationLimitReached, setConversationLimitReached] = useState(false);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  // lang is stored on guideRef so language switches mid-guide don't break steps
  const guideRef    = useRef({ active: false, step: 0, lang: 'en' });
  const wasOfflineRef = useRef(false);
  const messagesRef   = useRef(messages);
  const isSendingRef  = useRef(false);

  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (!Array.isArray(messages)) setMessages([]);
  }, [messages, setMessages]);

  // ─── persistConversation ──────────────────────────────────────────────────
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

  // ─── Auto-congratulate when coming back online ────────────────────────────
  useEffect(() => {
    if (haStatus === 'online' && wasOfflineRef.current) {
      wasOfflineRef.current = false;
      guideRef.current = { active: false, step: 0, lang: 'en' };
      const msg = getConnectedMsg(lang);
      const segs = parseMessageSegments(msg);
      const next = [...messagesRef.current, { role: 'assistant', text: msg, segments: segs }];
      if (persistConversation(next)) setMessages(next);
    } else if (haStatus !== 'online') {
      wasOfflineRef.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haStatus, lang]);

  // ─── Clear chat ───────────────────────────────────────────────────────────
  const handleClearChat = useCallback(() => {
    if (window.confirm(t('aiChat.newChatConfirm'))) {
      localStorage.removeItem(STORAGE_KEYS.chatHistory);
      setMessages([]);
      setConversationLimitReached(false);
      guideRef.current = { active: false, step: 0, lang: 'en' };
      wasOfflineRef.current = false;
    }
  }, [t, setMessages]);

  // ─── Farm props ───────────────────────────────────────────────────────────
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
    return {
      crop: liveCrop?.type ?? crop,
      growthStage: liveCrop?.growth_stage ?? growthStage,
      mode: liveCrop?.mode ?? mode,
      actuators: mappedActuators,
      sensors: mappedSensors,
      warnings: activeWarnings,
      recommendedAction: liveRecommendation || recommendedAction,
      displayUnits: { temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit },
    };
  }, [
    liveSensors, liveActuators, actuators, liveWarnings, liveCrop,
    crop, growthStage, mode, liveRecommendation, recommendedAction,
    temperatureUnit, humidityUnit, soilMoistureUnit, lightIntensityUnit,
  ]);

  // ─── handleSend ───────────────────────────────────────────────────────────
  const handleSend = useCallback(async (text, rawFiles) => {
    if (!text && rawFiles.length === 0) return;
    if (conversationLimitReached) return;
    if (haLoading) return;
    if (isSendingRef.current) return;

    isSendingRef.current = true;

    try {
      // ═══════════════════════════════════════════════════════════════════
      // OFFLINE GUARD
      // ═══════════════════════════════════════════════════════════════════
      if (haStatus !== 'online') {
        const lowerText = (text || '').toLowerCase();

        // Intent: user wants to connect — specific phrases only
        const isConnectIntent = [
          'how to connect', 'how do i connect', 'setup', 'reconnect', 'configuration',
          'how to link', 'get online', 'back online',
          // Arabic — specific, NOT bare اتصال
          'كيف أتصل', 'كيف اتصل', 'كيفية الاتصال', 'ربط التطبيق', 'إعداد الاتصال',
          'إعادة الاتصال', 'كيف أربط', 'كيف أوصل', 'طريقة الاتصال',
          // French
          'comment se connecter', 'comment connecter', 'reconnecter',
          'comment lier', 'rétablir la connexion',
        ].some(k => lowerText.includes(k));

        // Intent: user completed the current step
        const isNext = [
          'next step', 'done', 'did it', 'finished', 'i saved', 'i did it',
          'go on', 'proceed', 'move on', "i've done", 'i have done',
          'i completed', 'all done', 'it worked', "it's working",
          'فعلتها', 'انتهيت', 'حفظت', 'تابع', 'استمر',
          'الخطوة التالية', 'تم الحفظ', 'نجح', 'يعمل الآن',
          "c'est fait", "j'ai terminé", "j'ai enregistré",
          'ça a marché', 'étape suivante', 'ça fonctionne',
        ].some(k => lowerText.includes(k));

        // Intent: user wants clarification or more explanation
        const isClarification = [
          'yes', 'yeah', 'yep', 'ok', 'okay',
          'نعم', 'حسناً', 'حسنا', 'اوكي', 'أوكي',
          'oui', 'ouais', "d'accord",
          'explain', 'clarify', "don't understand", "didn't understand",
          'do not understand', 'more explanation', 'more detail', 'more details',
          'deeply', 'in detail', 'elaborate', 'what do you mean',
          'repeat', 'say again', 'not clear', 'confused',
          'detail', 'details', 'deeper', 'slow down', 'tell me more',
          'i dont get', 'i do not get', "i don't get",
          'i didnt get', "i didn't get", 'need more',
          'شرح', 'أوضح', 'لم أفهم', 'لا أفهم', 'تفصيل',
          'بالتفصيل', 'أعمق', 'أكثر تفصيلاً', 'أعيد',
          'غير واضح', 'محتار', 'بطيء', 'أبطأ', 'ما فهمت',
          'ما فهمتش', 'اشرح', 'وضح', 'توضيح', 'المزيد',
          'تفاصيل اكثر', 'تفاصيل أكثر', 'مزيد من التوضيح',
          'expliquer', 'clarifier', 'je ne comprends pas',
          'plus de détails', 'en détail', 'approfondir',
          'répéter', 'pas clair', 'confus', 'plus lent',
          'reformuler', "je n'ai pas compris", 'expliquez',
          "plus d'explication", 'encore', 'davantage',
        ].some(k => lowerText.includes(k));

        const nextUserMessages = [
          ...messages,
          { role: 'user', text: text || '(files attached)', files: [] },
        ];

        let responseText = '';

        if (isConnectIntent) {
          // Start guide, lock language to current lang
          guideRef.current = { active: true, step: 0, lang };
          responseText = getGuideStep(lang, 0);
          const segs = parseMessageSegments(responseText);
          const nextMessages = [...nextUserMessages, { role: 'assistant', text: responseText, segments: segs }];
          if (persistConversation(nextMessages)) setMessages(nextMessages);
          return;

        } else if (guideRef.current.active) {
          const guideLang = guideRef.current.lang;
          const currentStep = guideRef.current.step;
          const guideSteps = GUIDE_STEPS[guideLang] || GUIDE_STEPS.en;

          // Advance only on unambiguous completion — clarification takes priority
          if (isNext && !isClarification) {
            const nextStep = currentStep + 1;
            if (nextStep >= guideSteps.length) {
              responseText = getGuideStepDetailed(guideLang, currentStep);
            } else {
              guideRef.current.step = nextStep;
              responseText = getGuideStep(guideLang, nextStep);
            }
            const segs = parseMessageSegments(responseText);
            const nextMessages = [...nextUserMessages, { role: 'assistant', text: responseText, segments: segs }];
            if (persistConversation(nextMessages)) setMessages(nextMessages);
            return;
          }

          // Clarification OR ambiguous — call AI to explain current step
          // AI writes directly in guideLang — no translation
          setIsThinking(true);
          const currentStepText = getGuideStepDetailed(guideLang, currentStep);
          const currentStepShort = getGuideStep(guideLang, currentStep);
          const gLangName = langName(guideLang);
          try {
            const res = await fetch(GROQ_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                  {
                    role: 'system',
                    content: `${criticalLangRule(guideLang)}

You are a friendly assistant helping a farmer connect their SAHLA app to Home Assistant.
The farmer is currently on this step:

${currentStepText}

Your rules:
1. Write your ENTIRE response exclusively in ${gLangName}. Not even one word in another language. No Chinese. No English mixed in Arabic responses.
2. If the farmer's message is a question or request for clarification about this step, answer it clearly and in simple language. Break it into small sub-steps if needed.
3. After your explanation, always end with a short confirmation question asking if the farmer was able to do it (in ${gLangName}).
4. If the farmer's message is completely unrelated to this step, politely tell them you can only help with the current step right now, and remind them of the step briefly.
5. Do NOT move to the next step. Do NOT mention the next step.
6. Do NOT translate your response — compose it originally in ${gLangName}.`,
                  },
                  { role: 'user', content: text || currentStepShort },
                ],
                max_tokens: 500,
                temperature: 0.5,
              }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
            responseText = data.choices?.[0]?.message?.content || currentStepText;
          } catch (err) {
            console.error('Guide clarification API error:', err);
            responseText = currentStepText;
          } finally {
            setIsThinking(false);
          }

          const segs = parseMessageSegments(responseText);
          const nextMessages = [...nextUserMessages, { role: 'assistant', text: responseText, segments: segs }];
          if (persistConversation(nextMessages)) setMessages(nextMessages);
          return;

        } else {
          // Not in guide — varied offline message
          const assistantCount = messages.filter(m => m.role === 'assistant').length;
          responseText = getOfflineVariant(lang, assistantCount);
          const segs = parseMessageSegments(responseText);
          const nextMessages = [...nextUserMessages, { role: 'assistant', text: responseText, segments: segs }];
          if (persistConversation(nextMessages)) setMessages(nextMessages);
          return;
        }
      }

      // ═══════════════════════════════════════════════════════════════════
      // NORMAL ONLINE FLOW
      // ═══════════════════════════════════════════════════════════════════
      setIsThinking(true);

      const processedFiles = await Promise.all(rawFiles.map(async (f) => {
        if (f.type.startsWith('image/')) {
          try {
            const dataUrl = await compressImageToBase64(f);
            return { name: f.name, type: f.type, isImage: true, isText: false, dataUrl };
          } catch (e) {
            console.error('Image compression failed', e);
            return null;
          }
        } else if (f.type === 'text/plain' || f.name.endsWith('.txt')) {
          try {
            const textContent = await f.text();
            return { name: f.name, type: f.type, isImage: false, isText: true, textContent };
          } catch (e) {
            console.error('Text file read failed', e);
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
      const systemPrompt = buildSystemPrompt(lang);

      try {
        let aiText = '';

        const userAttachedImages = validFiles.some((f) => f.isImage);
        const wantsCameraView = !userAttachedImages && containsCameraKeyword(text);

        if (wantsCameraView) {
          const snapshotBase64 = await tryGrabStreamSnapshot(haUrl, haToken);

          if (snapshotBase64) {
            const snapshotMessages = buildSnapshotMessages(
              systemPrompt, farmContext, modeInstruction, text, snapshotBase64, lang
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
                  temperature: 0.55,
                }),
              });
              const data = await res.json();
              if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
              aiText = data.choices?.[0]?.message?.content || 'No response received.';
            } catch (groqErr) {
              console.warn('Groq Vision failed on snapshot, falling back to Gemini…', groqErr);
              const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_VISION_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
              const gLangName = langName(lang);
              const geminiParts = [
                { text: snapshotMessages[0].content[0].text },
                { inline_data: { mime_type: 'image/jpeg', data: snapshotBase64 } },
                { text: `CRITICAL: Respond ONLY in ${gLangName}. Do not use any other language. Do not translate. Write directly in ${gLangName}.` },
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
            // Camera unavailable
            const cameraUnavailableContent = buildCameraUnavailablePrompt(farmContext, modeInstruction, text);
            const apiMessages = [
              { role: 'system', content: systemPrompt },
              { role: 'system', content: criticalLangRule(lang) },
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
                temperature: 0.55,
              }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
            aiText = data.choices?.[0]?.message?.content || 'No response received.';
          }

        } else {
          // Text or user-attached image
          const { content, hasImages } = await buildUserContent(text, validFiles, farmContext, modeInstruction);
          const model = hasImages ? GROQ_VISION_MODEL : GROQ_MODEL;
          const maxTokens = responseMode === 'Concise' ? 200 : 800;

          // Build clean history — filter out messages with no text content
          const history = nextUserMessages
            .filter((m) => m.text)
            .map((m) => ({ role: m.role, content: m.text }));

          let apiMessages = [];

          if (hasImages) {
            // For image messages: include recent text-only history for context
            const imageHistory = nextUserMessages
              .slice(0, -1)
              .filter((m) => m.text && !m.files?.some((f) => f.isImage))
              .slice(-6)
              .map((m) => ({ role: m.role, content: m.text }));

            content[0].text = `[System Context: ${systemPrompt}]\n\n${criticalLangRule(lang)}\n\n${content[0].text}`;
            apiMessages = [
              ...imageHistory,
              { role: 'user', content },
            ];
          } else {
            apiMessages = [
              { role: 'system', content: systemPrompt },
              ...history,
              // Language enforcement injected right before the user turn
              { role: 'system', content: criticalLangRule(lang) },
              { role: 'user', content },
            ];
          }

          try {
            const res = await fetch(GROQ_ENDPOINT, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`,
              },
              body: JSON.stringify({ model, messages: apiMessages, max_tokens: maxTokens, temperature: 0.55 }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error?.message || `API error ${res.status}`);
            aiText = data.choices?.[0]?.message?.content || 'No response received.';
          } catch (groqError) {
            if (hasImages) {
              console.warn('Groq Vision failed, falling back to Google Gemini...', groqError);
              const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GOOGLE_VISION_MODEL}:generateContent?key=${GOOGLE_API_KEY}`;
              const gLangName = langName(lang);
              const geminiParts = [
                ...content.map(part => {
                  if (part.type === 'text') return { text: part.text };
                  if (part.type === 'image_url') {
                    return {
                      inline_data: {
                        mime_type: 'image/jpeg',
                        data: part.image_url.url.split(',')[1],
                      },
                    };
                  }
                  return null;
                }).filter(Boolean),
                { text: `CRITICAL: Respond ONLY in ${gLangName}. Do not use any other language. Do not translate. Write directly in ${gLangName}.` },
              ];
              const geminiRes = await fetch(geminiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ role: 'user', parts: geminiParts }] }),
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

        const segs = parseMessageSegments(aiText);
        const nextAssistantMessages = [...nextUserMessages, { role: 'assistant', text: aiText, segments: segs }];
        if (persistConversation(nextAssistantMessages)) setMessages(nextAssistantMessages);

      } catch (err) {
        console.error('AI Chat Error:', err);
        const attemptedImage = validFiles?.some((f) => f.isImage);
        const errText = attemptedImage ? t('aiChat.imageError') : t('aiChat.genericError');
        const nextErrorMessages = [
          ...nextUserMessages,
          { role: 'assistant', text: errText, segments: parseMessageSegments(errText) },
        ];
        if (persistConversation(nextErrorMessages)) setMessages(nextErrorMessages);
      } finally {
        setIsThinking(false);
      }

    } finally {
      isSendingRef.current = false;
    }
  }, [
    conversationLimitReached, farmProps, haLoading, haStatus,
    lang, messages, persistConversation,
    responseMode, setMessages, t,
  ]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col w-full h-full font-newblack overflow-hidden relative" style={{ background: '#F5F7F6' }}>

      {conversationLimitReached ? (
        <div className="mx-3 sm:mx-6 md:mx-12 lg:mx-20 mt-2 rounded-lg border border-[#C73030]/20 bg-[#FFF4F4] px-3 py-2 text-sm text-[#8B1C1C] flex items-center justify-between gap-2">
          <span>{t('aiChat.limitReached')}</span>
          <button
            onClick={handleClearChat}
            className="shrink-0 text-xs font-semibold underline hover:opacity-70 transition-opacity"
          >
            {t('aiChat.newChat', { defaultValue: 'New Chat' })}
          </button>
        </div>
      ) : null}

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
            : <AIBubble key={i} segments={msg.segments || parseMessageSegments(msg.text)} />
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