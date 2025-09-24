// app/app-i18n.js — dizionari UI + selettore lingua
import * as intl from './intl.js';

/* ===================== DIZIONARI ===================== */
function dictIT() {
  return {
    // Welcome / auth
    welcome_title: 'Benvenuto in Card Maker',
    welcome_text: 'Crea carte in stile Magic. Accedi per salvare nella tua Libreria Cloud, oppure entra come Ospite.',
    ph_email: 'Email',
    ph_password: 'Password',
    btn_login: 'Accedi',
    btn_signup: 'Registrati',
    btn_guest: 'Entra come ospite',
    welcome_dontshow: 'Non mostrare più',
    user_guest: 'Ospite',
    btn_logout: 'Esci',

    // Sezioni
    front_title: 'Fronte',
    back_title: 'Retro',
    saves_title: 'Salvataggi',
    export_title: 'Export',
    preview_title: 'Anteprima',
    cloud_title: 'Account & Cloud',

    // Titolo
    lbl_title: 'Titolo',
    ph_title: 'Nome incantesimo',
    lbl_title_font: 'Font titolo',
    opt_custom_font: 'Custom (upload)',
    lbl_upload_font: 'Carica font TTF/OTF',
    lbl_title_color: 'Colore titolo',
    lbl_title_size: 'Dimensione titolo',
    lbl_title_effect: 'Effetto titolo',
    lbl_title_shadow: 'Ombra titolo',
    opt_none: 'Nessuno',
    opt_foil_gold: 'Foil oro',
    opt_foil_silver: 'Foil argento',
    opt_foil_rainbow: 'Foil arcobaleno',

    // Effetti titolo premium
    opt_fx_celestial: 'Celestial (premium)',
    opt_fx_infernal: 'Infernal (premium)',
    opt_fx_obsidian: 'Obsidian (premium)',
    opt_fx_royal: 'Royal (premium)',
    opt_fx_starlight: 'Starlight (premium)',

    // Mana
    lbl_show_mana: 'Mostra mana',
    ph_mana: '{G}{U} o 2G',

    // Simbolo di classe
    lbl_class_symbol: 'Simbolo di classe',
    opt_database: 'Database',
    opt_upload_img: 'Carica immagine…',
    optgroup_base: 'Base',
    optgroup_expansion: 'Espansione',
    cls_warrior: 'Guerriero',
    cls_druid: 'Druido',
    cls_monk: 'Monaco',
    cls_wizard: 'Mago',
    cls_rogue: 'Ladro',
    cls_barbarian: 'Barbaro',
    cls_paladin: 'Paladino',
    cls_cleric: 'Chierico',
    cls_bard: 'Bardo',
    cls_ranger: 'Ranger',
    cls_sorcerer: 'Stregone',
    cls_warlock: 'Warlock',
    cls_artificer: 'Artefice',
    lbl_symbol_size: 'Dimensione simbolo',
    hint_drag_symbol: 'Trascina il simbolo sull’anteprima per spostarlo.',

    // ... (resto identico come avevi già)
  };
}

/* ——— dictEN, dictES, dictDE (li lasciamo invariati salvo cls_artificer già corretto) ——— */

/* ===================== REGISTRAZIONE ===================== */
intl.addLocale('it', dictIT());
intl.addLocale('en', dictEN());
intl.addLocale('es', dictES());
intl.addLocale('de', dictDE());

/* ===================== BRIDGE + EVENTI ===================== */
const __listeners = new Set();
const __origSetLocale = intl.setLocale;

function setLocaleAndNotify(lang) {
  __origSetLocale(lang);
  try { document.documentElement.setAttribute('lang', lang); } catch {}
  try { applyI18nToDom(); } catch {}
  try { window.dispatchEvent(new CustomEvent('i18n-changed', { detail: { lang } })); } catch {}
  __listeners.forEach(cb => { try { cb(lang); } catch {} });
}
intl.setLocale = setLocaleAndNotify;

/* ===================== SELETTORE LINGUA ===================== */
function hostForLangSelector(){
  return (
    document.querySelector('header .row') ||
    document.querySelector('header .toolbar') ||
    document.querySelector('header .topbar') ||
    document.querySelector('header') ||
    document.querySelector('#appHeader') ||
    document.body
  );
}
function ensureLanguageSelector(){
  const hdr = hostForLangSelector();
  if (!hdr) return;
  let sel = document.getElementById('lang');
  if (!sel){
    sel = document.createElement('select');
    sel.id = 'lang';
    sel.style.marginLeft = '10px';
    sel.innerHTML = `
      <option value="it">IT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="de">DE</option>`;
    hdr.appendChild(sel);
  }
  sel.value = intl.getLocale();
  sel.onchange = () => window.appI18n.setLocale(sel.value);
}

/* ===================== APPLY DOM ===================== */
function applyI18nToDom(){
  try { intl.translateDom(document); } catch {}
  try {
    // traduci anche le opzioni classi se presenti
    if (window.translateClassOptions) translateClassOptions();
  } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  const cur = intl.getLocale() || 'it';
  intl.setLocale(cur);
  document.documentElement.setAttribute('lang', cur);

  ensureLanguageSelector();
  applyI18nToDom();

  const hdr = hostForLangSelector();
  if (hdr){
    new MutationObserver(() => ensureLanguageSelector())
      .observe(hdr, { childList:true, subtree:true });
  }
});

window.appI18n = {
  refresh: applyI18nToDom,
  t: intl.t,
  setLocale(loc){
    if (!loc || loc === intl.getLocale()) return;
    intl.setLocale(loc);
    document.documentElement.setAttribute('lang', loc);
    applyI18nToDom();
    const sel = document.getElementById('lang');
    if (sel) sel.value = loc;
  }
};
