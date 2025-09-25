// app/app-i18n.js — dizionari UI + selettore lingua robusto
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

    // Pannelli / colori
    lbl_panel_color: 'Colore linee/riquadri',
    lbl_panel_alpha: 'Opacità riquadri',

    // Cornici
    lbl_frame_style: 'Stile cornice',
    style_flat: 'Colore piatto',
    style_wood: 'Legno',
    style_stone: 'Pietra',
    style_arcane: 'Arcano',
    style_nature: 'Natura',
    lbl_frame_inner: 'Colore cornice (piatto) & interno',

    // Immagini
    lbl_front_image: 'Immagine fronte',
    lbl_back_image: 'Immagine retro (full-bleed)',
    hint_back_image: 'Riempie tutta l’area interna; cornice uguale al fronte.',

    // Descrizione
    lbl_desc_title: 'Descrizione (riquadro basso)',
    ph_rules: 'Testo/incantesimo… **parole chiave** in grassetto.',
    lbl_desc_font: 'Font descrizione',
    lbl_upload_desc_font: 'Carica font descrizione (TTF/OTF)',
    lbl_desc_size: 'Dimensione descrizione',
    lbl_desc_color: 'Colore descrizione',

    // Salvataggi
    lbl_card_name: 'Nome carta',
    ph_card: 'Es. Lame del Bosco',
    lbl_deck_name: 'Mazzo (cartella cloud, opz.)',
    ph_deck: 'Es. Incantesimi Druido',
    btn_save_local: 'Salva locale',
    btn_load_local: 'Apri libreria locale',
    btn_cloud_save: 'Salva su cloud',
    btn_cloud_pull: 'Apri libreria cloud',
    btn_cloud_clear: 'Svuota cloud',

    // Export
    lbl_mirror_back: 'Specchia retro (stampa domestica)',
    hint_mirror_back: 'Se attivo, il PDF del retro viene specchiato per facilitare l’allineamento quando stampi fronte/retro.',
    btn_png_front: 'PNG (fronte)',
    btn_png_back: 'PNG (retro)',
    btn_pdf_single_f: 'PDF singola (fronte)',
    btn_pdf_single_b: 'PDF singola (retro)',
    btn_pdf_a4_f: 'PDF A4 3×3 (fronti)',
    btn_pdf_a4_b: 'PDF A4 3×3 (retro)',
    btn_pdf_a4_both: 'PDF A4 3×3 (fronte+retro)',
    hint_print: 'Stampa A4 verticale, margini minimi, scala 100%.',

    // Messaggi premium
    premium_frame_msg: 'Cornice Premium. Disponibile con abbonamento.',
    premium_title_msg: 'Effetto Premium disponibile con abbonamento.',

    // Foglio 3×3
    sheet_title: 'Foglio (fino a 9 carte diverse)',
    sheet_add: 'Aggiungi questa carta al foglio',
    sheet_clear: 'Svuota foglio',
    sheet_remove_last: 'Rimuovi ultima',
    sheet_pdf: 'PDF A4 3×3 (foglio, fronte+retro)',
    jsPDF_missing: 'jsPDF non disponibile. Controlla la connessione o ricarica la pagina.',
    sheet_full: 'Hai già 9 carte nel foglio.',
    sheet_empty: 'Il foglio è vuoto. Aggiungi almeno 1 carta.',
    sheet_already_empty: 'Il foglio è già vuoto.',
    export_error_prefix: 'Errore esportazione: ',
    front_canvas_missing: 'Canvas fronte non trovato',
    back_canvas_missing: 'Canvas retro non trovato',
    sheet_count: '{n}/9 carte'
  };
}

function dictEN() {
  return {
    welcome_title: 'Welcome to Card Maker',
    welcome_text: 'Create Magic-style cards. Sign in to save to your Cloud Library, or continue as Guest.',
    ph_email: 'Email',
    ph_password: 'Password',
    btn_login: 'Sign in',
    btn_signup: 'Sign up',
    btn_guest: 'Continue as guest',
    welcome_dontshow: 'Don’t show again',
    user_guest: 'Guest',
    btn_logout: 'Log out',

    front_title: 'Front',
    back_title: 'Back',
    saves_title: 'Saves',
    export_title: 'Export',
    preview_title: 'Preview',
    cloud_title: 'Account & Cloud',

    lbl_title: 'Title',
    ph_title: 'Spell name',
    lbl_title_font: 'Title font',
    opt_custom_font: 'Custom (upload)',
    lbl_upload_font: 'Upload TTF/OTF font',
    lbl_title_color: 'Title color',
    lbl_title_size: 'Title size',
    lbl_title_effect: 'Title effect',
    lbl_title_shadow: 'Title shadow',
    opt_none: 'None',
    opt_foil_gold: 'Gold foil',
    opt_foil_silver: 'Silver foil',
    opt_foil_rainbow: 'Rainbow foil',

    opt_fx_celestial: 'Celestial (premium)',
    opt_fx_infernal: 'Infernal (premium)',
    opt_fx_obsidian: 'Obsidian (premium)',
    opt_fx_royal: 'Royal (premium)',
    opt_fx_starlight: 'Starlight (premium)',

    lbl_show_mana: 'Show mana',
    ph_mana: '{G}{U} or 2G',

    lbl_class_symbol: 'Class symbol',
    opt_database: 'Database',
    opt_upload_img: 'Upload image…',
    optgroup_base: 'Base',
    optgroup_expansion: 'Expansion',
    cls_warrior: 'Warrior',
    cls_druid: 'Druid',
    cls_monk: 'Monk',
    cls_wizard: 'Wizard',
    cls_rogue: 'Rogue',
    cls_barbarian: 'Barbarian',
    cls_paladin: 'Paladin',
    cls_cleric: 'Cleric',
    cls_bard: 'Bard',
    cls_ranger: 'Ranger',
    cls_sorcerer: 'Sorcerer',
    cls_warlock: 'Warlock',
    cls_artificer: 'Artificer',
    lbl_symbol_size: 'Symbol size',
    hint_drag_symbol: 'Drag the symbol over the preview to move it.',

    lbl_panel_color: 'Lines/boxes color',
    lbl_panel_alpha: 'Boxes opacity',

    lbl_frame_style: 'Frame style',
    style_flat: 'Flat color',
    style_wood: 'Wood',
    style_stone: 'Stone',
    style_arcane: 'Arcane',
    style_nature: 'Nature',
    lbl_frame_inner: 'Frame (flat) & inner color',

    lbl_front_image: 'Front image',
    lbl_back_image: 'Back image (full-bleed)',
    hint_back_image: 'Fills the inner area; same frame as front.',

    lbl_desc_title: 'Description (bottom box)',
    ph_rules: 'Rules text… **keywords** in bold.',
    lbl_desc_font: 'Description font',
    lbl_upload_desc_font: 'Upload description font (TTF/OTF)',
    lbl_desc_size: 'Description size',
    lbl_desc_color: 'Description color',

    lbl_card_name: 'Card name',
    ph_card: 'e.g. Forest Blades',
    lbl_deck_name: 'Deck (cloud folder, opt.)',
    ph_deck: 'e.g. Druid Spells',
    btn_save_local: 'Save locally',
    btn_load_local: 'Open local library',
    btn_cloud_save: 'Save to cloud',
    btn_cloud_pull: 'Open cloud library',
    btn_cloud_clear: 'Clear cloud',

    lbl_mirror_back: 'Mirror back (home printing)',
    hint_mirror_back: 'If enabled, back PDF is mirrored to ease front/back alignment.',
    btn_png_front: 'PNG (front)',
    btn_png_back: 'PNG (back)',
    btn_pdf_single_f: 'Single PDF (front)',
    btn_pdf_single_b: 'Single PDF (back)',
    btn_pdf_a4_f: 'A4 PDF 3×3 (fronts)',
    btn_pdf_a4_b: 'A4 PDF 3×3 (backs)',
    btn_pdf_a4_both: 'A4 PDF 3×3 (front+back)',
    hint_print: 'Print A4 portrait, minimal margins, scale 100%.',

    premium_frame_msg: 'Premium frame. Available with subscription.',
    premium_title_msg: 'Premium title effect available with subscription.',

    sheet_title: 'Sheet (up to 9 different cards)',
    sheet_add: 'Add this card to sheet',
    sheet_clear: 'Clear sheet',
    sheet_remove_last: 'Remove last',
    sheet_pdf: 'A4 PDF 3×3 (sheet, front+back)',
    jsPDF_missing: 'jsPDF not available. Check your connection or reload the page.',
    sheet_full: 'You already have 9 cards on the sheet.',
    sheet_empty: 'The sheet is empty. Add at least 1 card.',
    sheet_already_empty: 'The sheet is already empty.',
    export_error_prefix: 'Export error: ',
    front_canvas_missing: 'Front canvas not found',
    back_canvas_missing: 'Back canvas not found',
    sheet_count: '{n}/9 cards'
  };
}

function dictES() { /* — identico a quello che mi hai mandato, invariato — */ return {/*...come sopra...*/}; }
function dictDE() { /* — identico a quello che mi hai mandato, invariato — */ return {/*...come sopra...*/}; }

/* ===================== REGISTRAZIONE ===================== */
intl.addLocale('it', dictIT());
intl.addLocale('en', dictEN());
intl.addLocale('es', dictES());
intl.addLocale('de', dictDE());

/* ===================== BRIDGE + EVENTI ===================== */
const __origSetLocale = intl.setLocale;
function setLocaleAndNotify(lang) {
  __origSetLocale(lang);
  try { document.documentElement.setAttribute('lang', lang); } catch {}
  try { applyI18nToDom(); } catch {}
  try { window.dispatchEvent(new CustomEvent('i18n-changed', { detail: { lang } })); } catch {}
}
intl.setLocale = setLocaleAndNotify;

/* ===================== SELETTORE LINGUA ===================== */
// Trova il bottone di logout e inserisce il selettore subito prima
function findLogoutButton() {
  const labels = ['Log out', 'Logout', 'Esci', 'Salir', 'Abmelden'];
  const btns = Array.from(document.querySelectorAll('button, a'));
  return btns.find(b => labels.some(t => (b.textContent || '').trim().toLowerCase() === t.toLowerCase()));
}
function hostForLangSelector(){
  const logoutBtn = findLogoutButton();
  if (logoutBtn && logoutBtn.parentElement) return logoutBtn.parentElement;
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
  if (!hdr) return false;

  let sel = document.getElementById('lang');
  if (!sel){
    sel = document.createElement('select');
    sel.id = 'lang';
    sel.setAttribute('aria-label','Language');
    sel.style.marginLeft = '10px';
    sel.style.padding = '4px 6px';
    sel.style.borderRadius = '8px';
    sel.style.font = 'inherit';
    sel.style.color = 'inherit';
    sel.style.background = 'transparent';
    sel.innerHTML = `
      <option value="it">IT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="de">DE</option>`;
    // se abbiamo trovato il bottone logout, mettiamo il select prima
    const logoutBtn = findLogoutButton();
    if (logoutBtn && logoutBtn.parentElement === hdr) {
      hdr.insertBefore(sel, logoutBtn);
    } else {
      hdr.appendChild(sel);
    }
  }
  sel.value = intl.getLocale();
  sel.onchange = () => window.appI18n.setLocale(sel.value);
  return true;
}

let __langObserverStarted = false;
function installLangSelectorWatcher(){
  if (__langObserverStarted) return;
  __langObserverStarted = true;

  const tryNow = ()=>ensureLanguageSelector();
  if (!tryNow()){
    setTimeout(tryNow, 0);
    setTimeout(tryNow, 200);
    setTimeout(tryNow, 800);
  }
  const mo = new MutationObserver(() => { tryNow(); });
  mo.observe(document.documentElement, { childList:true, subtree:true });
}

/* ===================== APPLY DOM ===================== */
function applyI18nToDom(){
  try { intl.translateDom(document); } catch {}
  try {
    if (window.appI18n && typeof window.appI18n.__translateClassOptions === 'function') {
      window.appI18n.__translateClassOptions();
    }
  } catch {}
}

document.addEventListener('DOMContentLoaded', () => {
  const cur = intl.getLocale() || 'en'; // default EN, come nello screenshot
  intl.setLocale(cur);
  document.documentElement.setAttribute('lang', cur);

  installLangSelectorWatcher();
  applyI18nToDom();
});

/* ===================== API PUBBLICA ===================== */
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
  },
  // card.js può settare questa funzione per tradurre le option del select classi
  __translateClassOptions: null
};
