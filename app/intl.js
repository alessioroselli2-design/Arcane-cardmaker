// app/intl.js — Stub multilingua semplice e sicuro
// Non dipende da nulla, non rompe la UI se non lo importi.

const KEY = 'acm_locale';
let _locale = localStorage.getItem(KEY) || 'it';
const _listeners = new Set();

// Dizionari minimi (puoi espandere)
const STRINGS = {
  it: {
    app_name: 'Arcane CardMaker',
    title: 'Titolo',
    description: 'Descrizione',
    save_cloud: 'Salva su cloud',
    export: 'Esporta',
  },
  en: {
    app_name: 'Arcane CardMaker',
    title: 'Title',
    description: 'Description',
    save_cloud: 'Save to cloud',
    export: 'Export',
  }
};

// API
export function getLocale(){ return _locale; }

export function setLocale(loc){
  if (!STRINGS[loc]) return false;
  _locale = loc;
  localStorage.setItem(KEY, loc);
  _listeners.forEach(fn => { try{ fn(loc); }catch{} });
  return true;
}

export function addLocale(loc, dict){
  STRINGS[loc] = { ...(STRINGS[loc]||{}), ...(dict||{}) };
}

export function t(key, fallback=''){
  const dict = STRINGS[_locale] || {};
  return (key in dict) ? dict[key] : (fallback || key);
}

export function onChange(cb){
  if (typeof cb === 'function') _listeners.add(cb);
  return () => _listeners.delete(cb);
}

// opzionale: esporta anche il dizionario grezzo (utile per debug)
export const strings = STRINGS;
