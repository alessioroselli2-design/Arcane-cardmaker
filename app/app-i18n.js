// /app/app-i18n.js — Localizzazione completa IT/EN/ES/DE + fix selettore lingua
// - Popola tutte le stringhe UI (etichette + placeholder)
// - Include messaggi Premium (titolo & cornici)
// - Traduce anche le etichette delle cornici Premium iniettate da premium.js
// - Aggiunge selettore lingua ben visibile in <header> (senza rompere altro)

import * as intl from './intl.js';

// ===============================
// 1) Dizionari delle 4 lingue
// ===============================
const L = {
  it: {
    // Header / Welcome / Auth
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

    // Pannello front
    front_title: 'Fronte',
    lbl_title: 'Titolo',
    ph_title: 'Nome incantesimo',
    lbl_title_font: 'Font titolo',
    opt_custom_font: 'Custom (upload)',
    lbl_upload_font: 'Carica font TTF/OTF',
    lbl_title_color: 'Colore titolo',
    lbl_title_size: 'Dimensione titolo',
    lbl_title_effect: 'Effetto titolo',

    opt_none: 'Nessuno',
    opt_foil_gold: 'Foil oro',
    opt_foil_silver: 'Foil argento',
    opt_foil_rainbow: 'Foil arcobaleno',

    // Effetti Premium titolo (solo etichette; il gating è in card.js)
    opt_foil_celestial: 'Celestial (premium)',
    opt_foil_infernal:  'Infernal (premium)',
    opt_foil_obsidian:  'Obsidian (premium)',
    opt_foil_royal:     'Royal (premium)',
    opt_foil_starlight: 'Starlight (premium)',

    lbl_title_shadow: 'Ombra titolo',

    lbl_show_mana: 'Mostra mana',
    ph_mana: '{G}{U} o 2G',

    lbl_class_symbol: 'Simbolo di classe',
    opt_database: 'Database',
    opt_upload_img: 'Carica immagine…',

    optgroup_base: 'Base',
    cls_warrior: 'Guerriero',
    cls_druid: 'Druido',
    cls_monk: 'Monaco',
    cls_wizard: 'Mago',
    cls_rogue: 'Ladro',

    optgroup_expansion: 'Espansione',
    cls_barbarian: 'Barbaro',
    cls_paladin: 'Paladino',
    cls_cleric: 'Chierico',
    cls_bard: 'Bardo',
    cls_ranger: 'Ranger',
    cls_sorcerer: 'Stregone',
    cls_warlock: 'Warlock',
    cls_artificer: 'Artificiere',

    lbl_symbol_size: 'Dimensione simbolo',
    hint_drag_symbol: 'Trascina il simbolo sull’anteprima per spostarlo.',
    lbl_panel_color: 'Colore linee/riquadri',
    lbl_panel_alpha: 'Opacità riquadri',

    lbl_frame_style: 'Stile cornice',
    style_flat: 'Colore piatto',
    style_wood: 'Legno',
    style_stone: 'Pietra',
    style_arcane: 'Arcano',
    style_nature: 'Natura',

    lbl_frame_inner: 'Colore cornice (piatto) & interno',

    // Premium frames iniettate da premium.js → usate per tradurre le option
    frame_celestial: 'Celestial (Premium)',
    frame_infernal:  'Infernal (Premium)',
    frame_frost:     'Frost (Premium)',
    frame_bloom:     'Bloom (Premium)',
    frame_storm:     'Storm (Premium)',
    frame_vampiric:  'Vampiric (Premium)',
    frame_chronos:   'Chronos (Premium)',

    // Immagini & descrizione
    lbl_front_image: 'Immagine fronte',
    lbl_desc_title: 'Descrizione (riquadro basso)',
    ph_rules: 'Testo/incantesimo… **parole chiave** in grassetto.',
    lbl_desc_font: 'Font descrizione',
    lbl_upload_desc_font: 'Carica font descrizione (TTF/OTF)',
    lbl_desc_size: 'Dimensione descrizione',
    lbl_desc_color: 'Colore descrizione',

    // Retro
    back_title: 'Retro',
    lbl_back_image: 'Immagine retro (full-bleed)',
    hint_back_image: 'Riempie tutta l’area interna; cornice uguale al fronte.',

    // Salvataggi / Cloud
    saves_title: 'Salvataggi',
    lbl_card_name: 'Nome carta',
    ph_card: 'Es. Lame del Bosco',
    lbl_deck_name: 'Mazzo (cartella cloud, opz.)',
    ph_deck: 'Es. Incantesimi Druido',

    btn_save_local: 'Salva locale',
    btn_load_local: 'Apri libreria locale',
    cloud_title: 'Account & Cloud',
    btn_cloud_save: 'Salva su cloud',
    btn_cloud_pull: 'Apri libreria cloud',
    btn_cloud_clear: 'Svuota cloud',

    // Export
    export_title: 'Export',
    btn_png_front: 'PNG (fronte)',
    btn_png_back: 'PNG (retro)',
    btn_pdf_single_f: 'PDF singola (fronte)',
    btn_pdf_single_b: 'PDF singola (retro)',
    btn_pdf_a4_f: 'PDF A4 3×3 (fronti)',
    btn_pdf_a4_b: 'PDF A4 3×3 (retro)',
    btn_pdf_a4_both: 'PDF A4 3×3 (fronte+retro)',
    hint_print: 'Stampa A4 verticale, margini minimi, scala 100%.',

    // Preview
    preview_title: 'Anteprima',

    // Messaggi Premium (usati da card.js)
    premium_title_msg: 'Effetto Premium disponibile con abbonamento.',
    premium_frame_msg: 'Cornice Premium. Disponibile con abbonamento.',
  },

  en: {
    welcome_title: 'Welcome to Card Maker',
    welcome_text: 'Create Magic-style cards. Sign in to save to your Cloud Library, or continue as Guest.',
    ph_email: 'Email',
    ph_password: 'Password',
    btn_login: 'Log in',
    btn_signup: 'Sign up',
    btn_guest: 'Continue as guest',
    welcome_dontshow: 'Don’t show again',
    user_guest: 'Guest',
    btn_logout: 'Log out',

    front_title: 'Front',
    lbl_title: 'Title',
    ph_title: 'Spell name',
    lbl_title_font: 'Title font',
    opt_custom_font: 'Custom (upload)',
    lbl_upload_font: 'Upload TTF/OTF font',
    lbl_title_color: 'Title color',
    lbl_title_size: 'Title size',
    lbl_title_effect: 'Title effect',

    opt_none: 'None',
    opt_foil_gold: 'Gold foil',
    opt_foil_silver: 'Silver foil',
    opt_foil_rainbow: 'Rainbow foil',

    opt_foil_celestial: 'Celestial (premium)',
    opt_foil_infernal:  'Infernal (premium)',
    opt_foil_obsidian:  'Obsidian (premium)',
    opt_foil_royal:     'Royal (premium)',
    opt_foil_starlight: 'Starlight (premium)',

    lbl_title_shadow: 'Title shadow',

    lbl_show_mana: 'Show mana',
    ph_mana: '{G}{U} or 2G',

    lbl_class_symbol: 'Class symbol',
    opt_database: 'Database',
    opt_upload_img: 'Upload image…',

    optgroup_base: 'Base',
    cls_warrior: 'Warrior',
    cls_druid: 'Druid',
    cls_monk: 'Monk',
    cls_wizard: 'Wizard',
    cls_rogue: 'Rogue',

    optgroup_expansion: 'Expansion',
    cls_barbarian: 'Barbarian',
    cls_paladin: 'Paladin',
    cls_cleric: 'Cleric',
    cls_bard: 'Bard',
    cls_ranger: 'Ranger',
    cls_sorcerer: 'Sorcerer',
    cls_warlock: 'Warlock',
    cls_artificer: 'Artificer',

    lbl_symbol_size: 'Symbol size',
    hint_drag_symbol: 'Drag the symbol on the preview to move it.',
    lbl_panel_color: 'Lines/boxes color',
    lbl_panel_alpha: 'Boxes opacity',

    lbl_frame_style: 'Frame style',
    style_flat: 'Flat color',
    style_wood: 'Wood',
    style_stone: 'Stone',
    style_arcane: 'Arcane',
    style_nature: 'Nature',

    lbl_frame_inner: 'Frame (flat) & inner color',

    frame_celestial: 'Celestial (Premium)',
    frame_infernal:  'Infernal (Premium)',
    frame_frost:     'Frost (Premium)',
    frame_bloom:     'Bloom (Premium)',
    frame_storm:     'Storm (Premium)',
    frame_vampiric:  'Vampiric (Premium)',
    frame_chronos:   'Chronos (Premium)',

    lbl_front_image: 'Front image',
    lbl_desc_title: 'Description (bottom box)',
    ph_rules: 'Rules text… **keywords** in bold.',
    lbl_desc_font: 'Description font',
    lbl_upload_desc_font: 'Upload description font (TTF/OTF)',
    lbl_desc_size: 'Description size',
    lbl_desc_color: 'Description color',

    back_title: 'Back',
    lbl_back_image: 'Back image (full-bleed)',
    hint_back_image: 'Fills the inner area; same frame as front.',

    saves_title: 'Saves',
    lbl_card_name: 'Card name',
    ph_card: 'e.g. Forest Blades',
    lbl_deck_name: 'Deck (cloud folder, opt.)',
    ph_deck: 'e.g. Druid Spells',

    btn_save_local: 'Save locally',
    btn_load_local: 'Open local library',
    cloud_title: 'Account & Cloud',
    btn_cloud_save: 'Save to cloud',
    btn_cloud_pull: 'Open cloud library',
    btn_cloud_clear: 'Clear cloud',

    export_title: 'Export',
    btn_png_front: 'PNG (front)',
    btn_png_back: 'PNG (back)',
    btn_pdf_single_f: 'Single PDF (front)',
    btn_pdf_single_b: 'Single PDF (back)',
    btn_pdf_a4_f: 'A4 PDF 3×3 (fronts)',
    btn_pdf_a4_b: 'A4 PDF 3×3 (backs)',
    btn_pdf_a4_both: 'A4 PDF 3×3 (front+back)',
    hint_print: 'Print A4 portrait, minimal margins, scale 100%.',

    preview_title: 'Preview',

    premium_title_msg: 'Premium effect available with subscription.',
    premium_frame_msg: 'Premium frame. Available with subscription.',
  },

  es: {
    welcome_title: 'Bienvenido a Card Maker',
    welcome_text: 'Crea cartas al estilo Magic. Inicia sesión para guardar en tu Biblioteca en la Nube o entra como invitado.',
    ph_email: 'Correo',
    ph_password: 'Contraseña',
    btn_login: 'Iniciar sesión',
    btn_signup: 'Registrarse',
    btn_guest: 'Entrar como invitado',
    welcome_dontshow: 'No volver a mostrar',
    user_guest: 'Invitado',
    btn_logout: 'Cerrar sesión',

    front_title: 'Frente',
    lbl_title: 'Título',
    ph_title: 'Nombre del hechizo',
    lbl_title_font: 'Fuente del título',
    opt_custom_font: 'Personalizada (subir)',
    lbl_upload_font: 'Subir fuente TTF/OTF',
    lbl_title_color: 'Color del título',
    lbl_title_size: 'Tamaño del título',
    lbl_title_effect: 'Efecto del título',

    opt_none: 'Ninguno',
    opt_foil_gold: 'Foil dorado',
    opt_foil_silver: 'Foil plateado',
    opt_foil_rainbow: 'Foil arcoíris',

    opt_foil_celestial: 'Celestial (premium)',
    opt_foil_infernal:  'Infernal (premium)',
    opt_foil_obsidian:  'Obsidiana (premium)',
    opt_foil_royal:     'Real (premium)',
    opt_foil_starlight: 'Luz estelar (premium)',

    lbl_title_shadow: 'Sombra del título',

    lbl_show_mana: 'Mostrar maná',
    ph_mana: '{G}{U} o 2G',

    lbl_class_symbol: 'Símbolo de clase',
    opt_database: 'Base de datos',
    opt_upload_img: 'Subir imagen…',

    optgroup_base: 'Básico',
    cls_warrior: 'Guerrero',
    cls_druid: 'Druida',
    cls_monk: 'Monje',
    cls_wizard: 'Mago',
    cls_rogue: 'Pícaro',

    optgroup_expansion: 'Expansión',
    cls_barbarian: 'Bárbaro',
    cls_paladin: 'Paladín',
    cls_cleric: 'Clérigo',
    cls_bard: 'Bardo',
    cls_ranger: 'Explorador',
    cls_sorcerer: 'Hechicero',
    cls_warlock: 'Brujo',
    cls_artificer: 'Artífice',

    lbl_symbol_size: 'Tamaño del símbolo',
    hint_drag_symbol: 'Arrastra el símbolo en la vista previa para moverlo.',
    lbl_panel_color: 'Color de líneas/cajas',
    lbl_panel_alpha: 'Opacidad de las cajas',

    lbl_frame_style: 'Estilo del marco',
    style_flat: 'Color plano',
    style_wood: 'Madera',
    style_stone: 'Piedra',
    style_arcane: 'Arcano',
    style_nature: 'Naturaleza',

    lbl_frame_inner: 'Color del marco (plano) e interior',

    frame_celestial: 'Celestial (Premium)',
    frame_infernal:  'Infernal (Premium)',
    frame_frost:     'Escarcha (Premium)',
    frame_bloom:     'Florecer (Premium)',
    frame_storm:     'Tormenta (Premium)',
    frame_vampiric:  'Vampírico (Premium)',
    frame_chronos:   'Cronos (Premium)',

    lbl_front_image: 'Imagen del frente',
    lbl_desc_title: 'Descripción (caja inferior)',
    ph_rules: 'Texto de reglas… **palabras clave** en negrita.',
    lbl_desc_font: 'Fuente de descripción',
    lbl_upload_desc_font: 'Subir fuente de descripción (TTF/OTF)',
    lbl_desc_size: 'Tamaño de descripción',
    lbl_desc_color: 'Color de descripción',

    back_title: 'Reverso',
    lbl_back_image: 'Imagen del reverso (full-bleed)',
    hint_back_image: 'Rellena el área interna; mismo marco que el frente.',

    saves_title: 'Guardados',
    lbl_card_name: 'Nombre de la carta',
    ph_card: 'p. ej. Hojas del Bosque',
    lbl_deck_name: 'Mazo (carpeta nube, opc.)',
    ph_deck: 'p. ej. Hechizos de Druida',

    btn_save_local: 'Guardar localmente',
    btn_load_local: 'Abrir biblioteca local',
    cloud_title: 'Cuenta y Nube',
    btn_cloud_save: 'Guardar en la nube',
    btn_cloud_pull: 'Abrir biblioteca en la nube',
    btn_cloud_clear: 'Vaciar nube',

    export_title: 'Exportar',
    btn_png_front: 'PNG (frente)',
    btn_png_back: 'PNG (reverso)',
    btn_pdf_single_f: 'PDF individual (frente)',
    btn_pdf_single_b: 'PDF individual (reverso)',
    btn_pdf_a4_f: 'PDF A4 3×3 (frentes)',
    btn_pdf_a4_b: 'PDF A4 3×3 (reversos)',
    btn_pdf_a4_both: 'PDF A4 3×3 (frente+reverso)',
    hint_print: 'Imprime en A4 vertical, márgenes mínimos, escala 100%.',

    preview_title: 'Vista previa',

    premium_title_msg: 'Efecto Premium disponible con suscripción.',
    premium_frame_msg: 'Marco Premium. Disponible con suscripción.',
  },

  de: {
    welcome_title: 'Willkommen bei Card Maker',
    welcome_text: 'Erstelle Karten im Magic-Stil. Melde dich an, um in deiner Cloud-Bibliothek zu speichern, oder nutze den Gastmodus.',
    ph_email: 'E-Mail',
    ph_password: 'Passwort',
    btn_login: 'Anmelden',
    btn_signup: 'Registrieren',
    btn_guest: 'Als Gast fortfahren',
    welcome_dontshow: 'Nicht mehr anzeigen',
    user_guest: 'Gast',
    btn_logout: 'Abmelden',

    front_title: 'Vorderseite',
    lbl_title: 'Titel',
    ph_title: 'Zaubername',
    lbl_title_font: 'Titelschrift',
    opt_custom_font: 'Benutzerdefiniert (Upload)',
    lbl_upload_font: 'TTF/OTF-Schrift hochladen',
    lbl_title_color: 'Titelfarbe',
    lbl_title_size: 'Titelgröße',
    lbl_title_effect: 'Titel-Effekt',

    opt_none: 'Keiner',
    opt_foil_gold: 'Goldfolie',
    opt_foil_silver: 'Silberfolie',
    opt_foil_rainbow: 'Regenbogenfolie',

    opt_foil_celestial: 'Celestial (premium)',
    opt_foil_infernal:  'Infernal (premium)',
    opt_foil_obsidian:  'Obsidian (premium)',
    opt_foil_royal:     'Royal (premium)',
    opt_foil_starlight: 'Starlight (premium)',

    lbl_title_shadow: 'Titelschatten',

    lbl_show_mana: 'Mana anzeigen',
    ph_mana: '{G}{U} oder 2G',

    lbl_class_symbol: 'Klassensymbol',
    opt_database: 'Datenbank',
    opt_upload_img: 'Bild hochladen…',

    optgroup_base: 'Basis',
    cls_warrior: 'Krieger',
    cls_druid: 'Druide',
    cls_monk: 'Mönch',
    cls_wizard: 'Magier',
    cls_rogue: 'Schurke',

    optgroup_expansion: 'Erweiterung',
    cls_barbarian: 'Barbar',
    cls_paladin: 'Paladin',
    cls_cleric: 'Kleriker',
    cls_bard: 'Barde',
    cls_ranger: 'Waldläufer',
    cls_sorcerer: 'Hexenmeister',
    cls_warlock: 'Warlock',
    cls_artificer: 'Artificer',

    lbl_symbol_size: 'Symbolgröße',
    hint_drag_symbol: 'Ziehe das Symbol in der Vorschau, um es zu bewegen.',
    lbl_panel_color: 'Linien/Kästen-Farbe',
    lbl_panel_alpha: 'Kästen-Deckkraft',

    lbl_frame_style: 'Rahmenstil',
    style_flat: 'Vollfarbe',
    style_wood: 'Holz',
    style_stone: 'Stein',
    style_arcane: 'Arkan',
    style_nature: 'Natur',

    lbl_frame_inner: 'Rahmen (Vollfarbe) & Innenfarbe',

    frame_celestial: 'Celestial (Premium)',
    frame_infernal:  'Infernal (Premium)',
    frame_frost:     'Frost (Premium)',
    frame_bloom:     'Bloom (Premium)',
    frame_storm:     'Storm (Premium)',
    frame_vampiric:  'Vampiric (Premium)',
    frame_chronos:   'Chronos (Premium)',

    lbl_front_image: 'Vorderseiten-Bild',
    lbl_desc_title: 'Beschreibung (unteres Feld)',
    ph_rules: 'Regeltext… **Schlüsselwörter** fett.',
    lbl_desc_font: 'Beschreibungsschrift',
    lbl_upload_desc_font: 'Beschreibungsschrift hochladen (TTF/OTF)',
    lbl_desc_size: 'Beschreibung-Größe',
    lbl_desc_color: 'Beschreibung-Farbe',

    back_title: 'Rückseite',
    lbl_back_image: 'Rückseiten-Bild (randlos)',
    hint_back_image: 'Füllt den Innenbereich; gleicher Rahmen wie vorne.',

    saves_title: 'Speicherungen',
    lbl_card_name: 'Kartenname',
    ph_card: 'z. B. Waldklingen',
    lbl_deck_name: 'Deck (Cloud-Ordner, opt.)',
    ph_deck: 'z. B. Druidenzauber',

    btn_save_local: 'Lokal speichern',
    btn_load_local: 'Lokale Bibliothek öffnen',
    cloud_title: 'Konto & Cloud',
    btn_cloud_save: 'In Cloud speichern',
    btn_cloud_pull: 'Cloud-Bibliothek öffnen',
    btn_cloud_clear: 'Cloud leeren',

    export_title: 'Export',
    btn_png_front: 'PNG (Vorderseite)',
    btn_png_back: 'PNG (Rückseite)',
    btn_pdf_single_f: 'Einzel-PDF (Vorderseite)',
    btn_pdf_single_b: 'Einzel-PDF (Rückseite)',
    btn_pdf_a4_f: 'A4-PDF 3×3 (Vorderseiten)',
    btn_pdf_a4_b: 'A4-PDF 3×3 (Rückseiten)',
    btn_pdf_a4_both: 'A4-PDF 3×3 (vorn+hinten)',
    hint_print: 'A4 Hochformat, minimale Ränder, Maßstab 100 %.',

    preview_title: 'Vorschau',

    premium_title_msg: 'Premium-Effekt mit Abonnement verfügbar.',
    premium_frame_msg: 'Premium-Rahmen. Mit Abonnement verfügbar.',
  }
};

// Registra le lingue
intl.addLocale('it', L.it);
intl.addLocale('en', L.en);
intl.addLocale('es', L.es);
intl.addLocale('de', L.de);

// ===============================
// 2) Applica traduzioni all’HTML
// ===============================
function applyI18nToDom() {
  // data-i18n (testo)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const txt = intl.t(key);
    if (txt != null) el.textContent = txt;
  });

  // data-i18n-ph (placeholder)
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    const txt = intl.t(key);
    if (txt != null) el.setAttribute('placeholder', txt);
  });

  // Traduci etichette Premium iniettate da premium.js (se presenti)
  translateInjectedPremiumFrames();
}

// Traduce le option dentro <optgroup data-premium="1"> secondo lingua
function translateInjectedPremiumFrames(){
  const og = document.querySelector('#frameStyle optgroup[data-premium="1"]');
  if (!og) return;
  og.querySelectorAll('option').forEach(opt => {
    // premium.js usa values: celestial | infernal | frost | bloom | storm | vampiric | chronos
    const v = (opt.value || '').toLowerCase();
    const mapKey = {
      celestial: 'frame_celestial',
      infernal:  'frame_infernal',
      frost:     'frame_frost',
      bloom:     'frame_bloom',
      storm:     'frame_storm',
      vampiric:  'frame_vampiric',
      chronos:   'frame_chronos'
    }[v];
    if (!mapKey) return;
    const base = intl.t(mapKey) || opt.textContent;
    // Mantieni l’icona 🔒 se presente
    const locked = opt.getAttribute('data-locked') === '1' || /🔒/.test(opt.textContent);
    opt.textContent = locked ? (base + ' 🔒') : base;
  });
}

// ===============================
// 3) Selettore lingua visibile
// ===============================
function ensureLanguageSelector(){
  const hdr = document.querySelector('header');
  if (!hdr) return;

  const row = hdr.querySelector('.row') || hdr;
  let sel = document.getElementById('lang');

  if (!sel) {
    sel = document.createElement('select');
    sel.id = 'lang';
    sel.setAttribute('aria-label','Language');

    // Stile per migliorare leggibilità (contrasto/bordi)
    Object.assign(sel.style, {
      marginLeft: '10px',
      padding: '6px 10px',
      borderRadius: '8px',
      border: '1px solid rgba(120,120,120,0.9)',
      background: 'rgba(255,255,255,0.95)',
      color: '#111',
      fontSize: '14px',
      outline: 'none'
    });

    sel.innerHTML = `
      <option value="it">IT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="de">DE</option>
    `;
    row.appendChild(sel);

    sel.addEventListener('change', () => {
      intl.setLocale(sel.value);
      // Riapplica testi e premium labels
      applyI18nToDom();
    });
  }

  // Set valore iniziale
  sel.value = intl.getLocale();
}

// ===============================
// 4) Boot
// ===============================
function ready(fn){ if (document.readyState !== 'loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }

ready(() => {
  // Assicurati che una lingua sia impostata (default IT)
  const cur = intl.getLocale();
  if (!cur) intl.setLocale('it');

  ensureLanguageSelector();
  applyI18nToDom();

  // Se premium.js inietta dopo, ritraduci quando cambia lo userStatus
  const status = document.getElementById('userStatus');
  if (status) {
    const mo = new MutationObserver(() => setTimeout(() => {
      translateInjectedPremiumFrames();
    }, 80));
    mo.observe(status, {childList:true, subtree:true, characterData:true});
  }
});

// In caso altri moduli vogliano forzare refresh (es. dopo UI dinamica)
window.appI18n = { refresh: applyI18nToDom };
