// /app/app-i18n.js — Dizionari UI + selettore lingua (IT/EN/ES/DE)

import { addLocale, setLocale, getLocale, translateDom, onChange } from './intl.js';

/* =========================
   Dizionari (IT / EN / ES / DE)
   ========================= */

addLocale('it', {
  // Welcome / Auth
  welcome_title: 'Benvenuto in Card Maker',
  welcome_text: 'Crea carte in stile Magic. Accedi per salvare nella tua Libreria Cloud, oppure entra come Ospite.',
  ph_email: 'Email',
  ph_password: 'Password',
  btn_login: 'Accedi',
  btn_signup: 'Registrati',
  btn_guest: 'Entra come ospite',
  welcome_dontshow: 'Non mostrare più',
  user_guest: 'Ospite',

  // Sezioni
  front_title: 'Fronte',
  back_title: 'Retro',
  saves_title: 'Salvataggi',
  export_title: 'Export',
  preview_title: 'Anteprima',
  cloud_title: 'Account & Cloud',

  // Titolo / Font
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
  // Titolo Premium (nel menu a tendina del titolo)
  opt_foil_celestial: 'Celestial (premium)',
  opt_foil_infernal: 'Infernal (premium)',
  opt_foil_obsidian: 'Obsidian (premium)',
  opt_foil_royal: 'Royal (premium)',
  opt_foil_starlight: 'Starlight (premium)',
  lbl_title_shadow: 'Ombra titolo',

  // Mana
  lbl_show_mana: 'Mostra mana',
  ph_mana: '{G}{U} o 2G',

  // Simboli di classe
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

  // Riquadri / Cornice
  lbl_panel_color: 'Colore linee/riquadri',
  lbl_panel_alpha: 'Opacità riquadri',
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
  btn_png_front: 'PNG (fronte)',
  btn_png_back: 'PNG (retro)',
  btn_pdf_single_f: 'PDF singola (fronte)',
  btn_pdf_single_b: 'PDF singola (retro)',
  btn_pdf_a4_f: 'PDF A4 3×3 (fronti)',
  btn_pdf_a4_b: 'PDF A4 3×3 (retro)',
  btn_pdf_a4_both: 'PDF A4 3×3 (fronte+retro)',
  hint_print: 'Stampa A4 verticale, margini minimi, scala 100%.',

  // Specchia retro (nuovo)
  lbl_mirror_back: 'Specchia retro',
  hint_mirror_back: 'Utile per allineare fronte/retro con stampanti domestiche.',

  // Messaggi Premium (usati in card.js)
  premium_title_msg: 'Effetto Premium disponibile con abbonamento.',
  premium_frame_msg: 'Cornice Premium. Disponibile con abbonamento.'
});

addLocale('en', {
  welcome_title: 'Welcome to Card Maker',
  welcome_text: 'Create Magic-style cards. Sign in to save to your Cloud Library, or continue as Guest.',
  ph_email: 'Email',
  ph_password: 'Password',
  btn_login: 'Sign in',
  btn_signup: 'Sign up',
  btn_guest: 'Continue as guest',
  welcome_dontshow: 'Don’t show again',
  user_guest: 'Guest',

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
  opt_none: 'None',
  opt_foil_gold: 'Gold foil',
  opt_foil_silver: 'Silver foil',
  opt_foil_rainbow: 'Rainbow foil',
  opt_foil_celestial: 'Celestial (premium)',
  opt_foil_infernal: 'Infernal (premium)',
  opt_foil_obsidian: 'Obsidian (premium)',
  opt_foil_royal: 'Royal (premium)',
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

  lbl_front_image: 'Front image',
  lbl_back_image: 'Back image (full-bleed)',
  hint_back_image: 'Fills the whole inner area; frame matches the front.',

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

  btn_png_front: 'PNG (front)',
  btn_png_back: 'PNG (back)',
  btn_pdf_single_f: 'Single PDF (front)',
  btn_pdf_single_b: 'Single PDF (back)',
  btn_pdf_a4_f: 'A4 PDF 3×3 (fronts)',
  btn_pdf_a4_b: 'A4 PDF 3×3 (backs)',
  btn_pdf_a4_both: 'A4 PDF 3×3 (front+back)',
  hint_print: 'Print A4 portrait, minimal margins, scale 100%.',

  lbl_mirror_back: 'Mirror back',
  hint_mirror_back: 'Helps align front/back on home printers.',

  premium_title_msg: 'Premium effect available with subscription.',
  premium_frame_msg: 'Premium frame. Available with subscription.'
});

addLocale('es', {
  welcome_title: 'Bienvenido a Card Maker',
  welcome_text: 'Crea cartas al estilo Magic. Inicia sesión para guardar en tu Biblioteca en la nube o entra como invitado.',
  ph_email: 'Correo',
  ph_password: 'Contraseña',
  btn_login: 'Entrar',
  btn_signup: 'Registrarse',
  btn_guest: 'Entrar como invitado',
  welcome_dontshow: 'No mostrar de nuevo',
  user_guest: 'Invitado',

  front_title: 'Anverso',
  back_title: 'Reverso',
  saves_title: 'Guardados',
  export_title: 'Exportar',
  preview_title: 'Vista previa',
  cloud_title: 'Cuenta y Nube',

  lbl_title: 'Título',
  ph_title: 'Nombre del hechizo',
  lbl_title_font: 'Fuente del título',
  opt_custom_font: 'Personalizada (subir)',
  lbl_upload_font: 'Sube fuente TTF/OTF',
  lbl_title_color: 'Color del título',
  lbl_title_size: 'Tamaño del título',
  lbl_title_effect: 'Efecto del título',
  opt_none: 'Ninguno',
  opt_foil_gold: 'Foil dorado',
  opt_foil_silver: 'Foil plateado',
  opt_foil_rainbow: 'Foil arcoíris',
  opt_foil_celestial: 'Celestial (premium)',
  opt_foil_infernal: 'Infernal (premium)',
  opt_foil_obsidian: 'Obsidian (premium)',
  opt_foil_royal: 'Royal (premium)',
  opt_foil_starlight: 'Starlight (premium)',
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

  lbl_panel_color: 'Color de líneas/cuadros',
  lbl_panel_alpha: 'Opacidad de cuadros',
  lbl_frame_style: 'Estilo del marco',
  style_flat: 'Color plano',
  style_wood: 'Madera',
  style_stone: 'Piedra',
  style_arcane: 'Arcano',
  style_nature: 'Naturaleza',
  lbl_frame_inner: 'Color del marco (plano) e interior',

  lbl_front_image: 'Imagen del anverso',
  lbl_back_image: 'Imagen del reverso (sangrado completo)',
  hint_back_image: 'Rellena toda el área interna; marco igual al anverso.',

  lbl_desc_title: 'Descripción (cuadro inferior)',
  ph_rules: 'Texto de reglas… **palabras clave** en negrita.',
  lbl_desc_font: 'Fuente de descripción',
  lbl_upload_desc_font: 'Sube fuente de descripción (TTF/OTF)',
  lbl_desc_size: 'Tamaño de descripción',
  lbl_desc_color: 'Color de descripción',

  lbl_card_name: 'Nombre de la carta',
  ph_card: 'p.ej. Hojas del Bosque',
  lbl_deck_name: 'Mazo (carpeta en la nube, opc.)',
  ph_deck: 'p.ej. Hechizos de Druida',
  btn_save_local: 'Guardar localmente',
  btn_load_local: 'Abrir biblioteca local',
  btn_cloud_save: 'Guardar en la nube',
  btn_cloud_pull: 'Abrir biblioteca en la nube',
  btn_cloud_clear: 'Vaciar nube',

  btn_png_front: 'PNG (anverso)',
  btn_png_back: 'PNG (reverso)',
  btn_pdf_single_f: 'PDF simple (anverso)',
  btn_pdf_single_b: 'PDF simple (reverso)',
  btn_pdf_a4_f: 'PDF A4 3×3 (anversos)',
  btn_pdf_a4_b: 'PDF A4 3×3 (reversos)',
  btn_pdf_a4_both: 'PDF A4 3×3 (anv.+rev.)',
  hint_print: 'Imprime A4 vertical, márgenes mínimos, escala 100%.',

  lbl_mirror_back: 'Espejar reverso',
  hint_mirror_back: 'Ayuda a alinear anverso/reverso en impresoras domésticas.',

  premium_title_msg: 'Efecto premium disponible con suscripción.',
  premium_frame_msg: 'Marco premium. Disponible con suscripción.'
});

addLocale('de', {
  welcome_title: 'Willkommen bei Card Maker',
  welcome_text: 'Erstelle Magic-artige Karten. Melde dich an, um in deiner Cloud-Bibliothek zu speichern, oder nutze den Gastmodus.',
  ph_email: 'E-Mail',
  ph_password: 'Passwort',
  btn_login: 'Anmelden',
  btn_signup: 'Registrieren',
  btn_guest: 'Als Gast fortfahren',
  welcome_dontshow: 'Nicht mehr anzeigen',
  user_guest: 'Gast',

  front_title: 'Vorderseite',
  back_title: 'Rückseite',
  saves_title: 'Speicherungen',
  export_title: 'Export',
  preview_title: 'Vorschau',
  cloud_title: 'Konto & Cloud',

  lbl_title: 'Titel',
  ph_title: 'Zaubername',
  lbl_title_font: 'Titelschrift',
  opt_custom_font: 'Benutzerdefiniert (Upload)',
  lbl_upload_font: 'TTF/OTF-Schrift hochladen',
  lbl_title_color: 'Titelfarbe',
  lbl_title_size: 'Titelgröße',
  lbl_title_effect: 'Titel-Effekt',
  opt_none: 'Keiner',
  opt_foil_gold: 'Gold-Foil',
  opt_foil_silver: 'Silber-Foil',
  opt_foil_rainbow: 'Regenbogen-Foil',
  opt_foil_celestial: 'Celestial (Premium)',
  opt_foil_infernal: 'Infernal (Premium)',
  opt_foil_obsidian: 'Obsidian (Premium)',
  opt_foil_royal: 'Royal (Premium)',
  opt_foil_starlight: 'Starlight (Premium)',
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
  cls_wizard: 'Zauberer',
  cls_rogue: 'Schurke',
  optgroup_expansion: 'Erweiterung',
  cls_barbarian: 'Barbar',
  cls_paladin: 'Paladin',
  cls_cleric: 'Kleriker',
  cls_bard: 'Barde',
  cls_ranger: 'Waldläufer',
  cls_sorcerer: 'Hexenmeister',
  cls_warlock: 'Warlock',
  cls_artificer: 'Konstrukteur',
  lbl_symbol_size: 'Symbolgröße',
  hint_drag_symbol: 'Ziehe das Symbol in der Vorschau, um es zu verschieben.',

  lbl_panel_color: 'Linien/Kästchen-Farbe',
  lbl_panel_alpha: 'Kästchen-Deckkraft',
  lbl_frame_style: 'Rahmenstil',
  style_flat: 'Vollfarbe',
  style_wood: 'Holz',
  style_stone: 'Stein',
  style_arcane: 'Arkan',
  style_nature: 'Natur',
  lbl_frame_inner: 'Rahmen (Vollfarbe) & Innenfarbe',

  lbl_front_image: 'Bild Vorderseite',
  lbl_back_image: 'Bild Rückseite (randlos)',
  hint_back_image: 'Füllt den gesamten Innenbereich; Rahmen wie vorn.',

  lbl_desc_title: 'Beschreibung (unteres Feld)',
  ph_rules: 'Regeltext… **Schlüsselwörter** fett.',
  lbl_desc_font: 'Beschreibungsschrift',
  lbl_upload_desc_font: 'Beschreibungsschrift hochladen (TTF/OTF)',
  lbl_desc_size: 'Beschreibung Schriftgröße',
  lbl_desc_color: 'Beschreibung Farbe',

  lbl_card_name: 'Kartenname',
  ph_card: 'z. B. Waldbklingen',
  lbl_deck_name: 'Deck (Cloud-Ordner, opt.)',
  ph_deck: 'z. B. Druidenzauber',
  btn_save_local: 'Lokal speichern',
  btn_load_local: 'Lokale Bibliothek öffnen',
  btn_cloud_save: 'In Cloud speichern',
  btn_cloud_pull: 'Cloud-Bibliothek öffnen',
  btn_cloud_clear: 'Cloud leeren',

  btn_png_front: 'PNG (Vorderseite)',
  btn_png_back: 'PNG (Rückseite)',
  btn_pdf_single_f: 'Einzel-PDF (Vorderseite)',
  btn_pdf_single_b: 'Einzel-PDF (Rückseite)',
  btn_pdf_a4_f: 'A4-PDF 3×3 (Vorderseiten)',
  btn_pdf_a4_b: 'A4-PDF 3×3 (Rückseiten)',
  btn_pdf_a4_both: 'A4-PDF 3×3 (vorne+hinten)',
  hint_print: 'A4 hoch, minimale Ränder, Maßstab 100 %.',

  lbl_mirror_back: 'Rückseite spiegeln',
  hint_mirror_back: 'Hilft, Vorder-/Rückseite mit Heimdruckern auszurichten.',

  premium_title_msg: 'Premium-Effekt mit Abo verfügbar.',
  premium_frame_msg: 'Premium-Rahmen. Mit Abo verfügbar.'
});

/* =========================
   Selettore lingua + bootstrap
   ========================= */

// Crea (se non esiste) il selettore lingua in header
function ensureLangSelector() {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  if (document.getElementById('lang')) return;

  const row = hdr.querySelector('.row') || hdr;
  const sel = document.createElement('select');
  sel.id = 'lang';
  sel.style.marginLeft = '10px';
  sel.style.padding = '4px 6px';
  sel.style.borderRadius = '8px';

  sel.innerHTML = `
    <option value="it">IT</option>
    <option value="en">EN</option>
    <option value="es">ES</option>
    <option value="de">DE</option>
  `;
  row.appendChild(sel);
  sel.value = getLocale();
  sel.addEventListener('change', () => setLocale(sel.value));
}

// Se non c’è locale salvato, prova da browser (it/en/es/de)
function autoDetectLocale() {
  const stored = getLocale();
  if (stored) return; // intl.js già legge da LS
  const nav = (navigator.language || 'en').toLowerCase();
  const pick = nav.startsWith('it') ? 'it' :
               nav.startsWith('es') ? 'es' :
               nav.startsWith('de') ? 'de' : 'en';
  setLocale(pick);
}

// Applica traduzione DOM ogni volta che cambia lingua
onChange(() => translateDom());

// Avvio
document.addEventListener('DOMContentLoaded', () => {
  ensureLangSelector();
  // translateDom() viene già richiamato da intl.js su DOMContentLoaded
});
