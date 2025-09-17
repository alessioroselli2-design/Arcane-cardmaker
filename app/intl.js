// /app/intl.js — mini i18n con fallback sicuro
// Supporta sia [data-i18n] (con data-i18n-type="placeholder") sia [data-i18n-ph] legacy.

const STORE_KEY = 'acm_locale';
let current = localStorage.getItem(STORE_KEY) || 'it';
const dicts = {};
const listeners = new Set();

// util
function safeGet(lang, key) {
  const d = dicts[lang] || {};
  return Object.prototype.hasOwnProperty.call(d, key) ? d[key] : undefined;
}
function saveOriginalOnce(el, type) {
  if (el.dataset.i18nOriginalSaved === '1') return;
  el.dataset.i18nOriginalSaved = '1';
  if (type === 'placeholder') el.dataset.i18nOriginal = el.getAttribute('placeholder') || '';
  else el.dataset.i18nOriginal = el.textContent || '';
}

// API
export function addLocale(lang, dictionary) { dicts[lang] = { ...(dicts[lang]||{}), ...(dictionary||{}) }; }
export function getLocale(){ return current; }
export function onChange(cb){ listeners.add(cb); return () => listeners.delete(cb); }
export function t(key, fallback){
  const v = safeGet(current, key);
  if (v !== undefined) return v;
  if (fallback !== undefined) return fallback;
  const it = safeGet('it', key);
  if (it !== undefined) return it;
  return '';
}
export function setLocale(lang){
  if (!lang || lang === current) return;
  current = lang;
  localStorage.setItem(STORE_KEY, current);
  translateDom();
  listeners.forEach(cb => { try{ cb(current); }catch{} });
}

// Traduzione DOM (supporta entrambe le sintassi)
export function translateDom(root=document){
  // 1) Nuova sintassi: [data-i18n] (+ opzionale data-i18n-type="placeholder")
  root.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    const type = (el.getAttribute('data-i18n-type') || 'text').toLowerCase();
    saveOriginalOnce(el, type);
    const val = safeGet(current, key);
    if (val === undefined){
      const orig = el.dataset.i18nOriginal ?? '';
      if (type === 'placeholder') el.setAttribute('placeholder', orig);
      else el.textContent = orig;
    } else {
      if (type === 'placeholder') el.setAttribute('placeholder', val);
      else el.textContent = val;
    }
  });

  // 2) Legacy: [data-i18n-ph] (placeholder)
  root.querySelectorAll('[data-i18n-ph]').forEach(el=>{
    const key = el.getAttribute('data-i18n-ph');
    saveOriginalOnce(el, 'placeholder');
    const val = safeGet(current, key);
    if (val === undefined){
      const orig = el.dataset.i18nOriginal ?? '';
      el.setAttribute('placeholder', orig);
    } else {
      el.setAttribute('placeholder', val);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => translateDom());
