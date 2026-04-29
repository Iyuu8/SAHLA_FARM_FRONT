// utils/normalizeArabic.js
export const normalizeArabic = (text) => {
  if (!text) return "";
  return text
    .replace(/[\u0610-\u061A\u064B-\u065F\u0670]/g, '') // remove tashkeel/diacritics
    .replace(/أ|إ|آ/g, 'ا')  // normalize alef forms
    .replace(/ة/g, 'ه')       // normalize taa marbuta
    .replace(/ى/g, 'ي')       // normalize alef maqsura
    .trim();
};