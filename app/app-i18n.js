// /app/app-i18n.js — Dizionari + selettore lingua + localizzazione opzioni Premium
import * as intl from './intl.js';

/* =============== ITALIANO =============== */
intl.addLocale('it', {
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
  btn_logout: 'Esci',

  // Front
  front_title: 'Fronte',
  lbl_title: 'Titolo',
  ph_title: 'Nome incantesimo',
  lbl_title_font: 'Font titolo',
  opt_custom_font: 'Custom (upload)',
  lbl_upload_font: 'Carica font TTF/OTF',
  lbl_title_color: 'Colore titolo',
  lbl_title_size: 'Dimensione titolo',
  lbl_title_effect: 'Effetto titolo',
  lbl_title_shadow: 'Ombra titolo',
  lbl_show_mana: 'Mostra mana',
  ph_mana: '{G}{U} o 2G',

  // Title options
  opt_none: 'Nessuno',
  opt_foil_gold: 'Foil oro',
  opt_foil_silver: 'Foil argento',
  opt_foil_rainbow: 'Foil arcobaleno',

  // Title effects (premium)
  opt_fx_celestial: 'Celestial (premium)',
  opt_fx_infernal: 'Infernal (premium)',
  opt_fx_obsidian: 'Obsidian (premium)',
  opt_fx_royal: 'Royal (premium)',
  opt_fx_starlight: 'Starlight (premium)',
  premium_title_msg: 'Effetto Premium disponibile con abbonamento.',
  premium_frame_msg: 'Cornice Premium. Disponibile con abbonamento.',

  // Classi
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
  cls_artificer: 'Artificiere',
  lbl_symbol_size: 'Dimensione simbolo',
  hint_drag_symbol: 'Trascina il simbolo sull’anteprima per spostarlo.',

  // Frame
  lbl_panel_color: 'Colore linee/riquadri',
  lbl_panel_alpha: 'Opacità riquadri',
  lbl_frame_style: 'Stile cornice',
  style_flat: 'Colore piatto',
  style_wood: 'Legno',
  style_stone: 'Pietra',
  style_arcane: 'Arcano',
  style_nature: 'Natura',
  lbl_frame_inner: 'Colore cornice (piatto) & interno',

  // Premium frames (etichette)
  premium_group_label: 'Premium',
  frame_celestial: 'Celestial (premium)',
  frame_infernal: 'Infernal (premium)',
  frame_frost: 'Frost (premium)',
  frame_bloom: 'Bloom (premium)',
  frame_storm: 'Storm (premium)',
  frame_vampiric: 'Vampiric (premium)',
  frame_chronos: 'Chronos (premium)',
  premium_locked_tooltip: 'Disponibile con Premium',

  // Images & text
  lbl_front_image: 'Immagine fronte',
  lbl_desc_title: 'Descrizione (riquadro basso)',
  ph_rules: 'Testo/incantesimo… **parole chiave** in grassetto.',
  lbl_desc_font: 'Font descrizione',
  lbl_upload_desc_font: 'Carica font descrizione (TTF/OTF)',
  lbl_desc_size: 'Dimensione descrizione',
  lbl_desc_color: 'Colore descrizione',

  // Back
  back_title: 'Retro',
  lbl_back_image: 'Immagine retro (full-bleed)',
  hint_back_image: 'Riempie tutta l’area interna; cornice uguale al fronte.',

  // Saves / Cloud
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

  // Preview
  preview_title: 'Anteprima',
});

/* =============== ENGLISH =============== */
intl.addLocale('en', {
  welcome_title: 'Welcome to Card Maker',
  welcome_text: 'Create Magic-style cards. Log in to save in your Cloud Library, or enter as Guest.',
  ph_email: 'Email',
  ph_password: 'Password',
  btn_login: 'Login',
  btn_signup: 'Sign up',
  btn_guest: 'Enter as Guest',
  welcome_dontshow: 'Do not show again',
  user_guest: 'Guest',
  btn_logout: 'Logout',

  front_title: 'Front',
  lbl_title: 'Title',
  ph_title: 'Spell name',
  lbl_title_font: 'Title font',
  opt_custom_font: 'Custom (upload)',
  lbl_upload_font: 'Upload TTF/OTF',
  lbl_title_color: 'Title color',
  lbl_title_size: 'Title size',
  lbl_title_effect: 'Title effect',
  lbl_title_shadow: 'Title shadow',
  lbl_show_mana: 'Show mana',
  ph_mana: '{G}{U} or 2G',

  opt_none: 'None',
  opt_foil_gold: 'Gold foil',
  opt_foil_silver: 'Silver foil',
  opt_foil_rainbow: 'Rainbow foil',

  opt_fx_celestial: 'Celestial (premium)',
  opt_fx_infernal: 'Infernal (premium)',
  opt_fx_obsidian: 'Obsidian (premium)',
  opt_fx_royal: 'Royal (premium)',
  opt_fx_starlight: 'Starlight (premium)',
  premium_title_msg: 'Premium effect available with subscription.',
  premium_frame_msg: 'Premium frame. Available with subscription.',

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
  hint_drag_symbol: 'Drag the symbol on the preview to move it.',

  lbl_panel_color: 'Line/box color',
  lbl_panel_alpha: 'Box opacity',
  lbl_frame_style: 'Frame style',
  style_flat: 'Flat color',
  style_wood: 'Wood',
  style_stone: 'Stone',
  style_arcane: 'Arcane',
  style_nature: 'Nature',
  lbl_frame_inner: 'Frame color (flat) & inner',

  premium_group_label: 'Premium',
  frame_celestial: 'Celestial (premium)',
  frame_infernal: 'Infernal (premium)',
  frame_frost: 'Frost (premium)',
  frame_bloom: 'Bloom (premium)',
  frame_storm: 'Storm (premium)',
  frame_vampiric: 'Vampiric (premium)',
  frame_chronos: 'Chronos (premium)',
  premium_locked_tooltip: 'Available with Premium',

  lbl_front_image: 'Front image',
  lbl_desc_title: 'Description (bottom box)',
  ph_rules: 'Rules text… **keywords** in bold.',
  lbl_desc_font: 'Description font',
  lbl_upload_desc_font: 'Upload description font (TTF/OTF)',
  lbl_desc_size: 'Description size',
  lbl_desc_color: 'Description color',

  back_title: 'Back',
  lbl_back_image: 'Back image (full-bleed)',
  hint_back_image: 'Fills the entire inner area; same frame as front.',

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
  lbl_mirror_back: 'Mirror back (home printing)',
  hint_mirror_back: 'If enabled, the back PDF is mirrored to help alignment when printing double-sided.',
  btn_png_front: 'PNG (front)',
  btn_png_back: 'PNG (back)',
  btn_pdf_single_f: 'Single PDF (front)',
  btn_pdf_single_b: 'Single PDF (back)',
  btn_pdf_a4_f: 'A4 PDF 3×3 (fronts)',
  btn_pdf_a4_b: 'A4 PDF 3×3 (backs)',
  btn_pdf_a4_both: 'A4 PDF 3×3 (front+back)',
  hint_print: 'Print vertical A4, minimal margins, 100% scale.',

  preview_title: 'Preview',
});

/* =============== ESPAÑOL =============== */
intl.addLocale('es', {
  welcome_title: 'Bienvenido a Card Maker',
  welcome_text: 'Crea cartas estilo Magic. Inicia sesión para guardar en tu Biblioteca Cloud o entra como invitado.',
  ph_email: 'Correo electrónico',
  ph_password: 'Contraseña',
  btn_login: 'Iniciar sesión',
  btn_signup: 'Registrarse',
  btn_guest: 'Entrar como invitado',
  welcome_dontshow: 'No mostrar más',
  user_guest: 'Invitado',
  btn_logout: 'Salir',

  front_title: 'Frente',
  lbl_title: 'Título',
  ph_title: 'Nombre del hechizo',
  lbl_title_font: 'Fuente del título',
  opt_custom_font: 'Personalizada (subir)',
  lbl_upload_font: 'Subir TTF/OTF',
  lbl_title_color: 'Color del título',
  lbl_title_size: 'Tamaño del título',
  lbl_title_effect: 'Efecto del título',
  lbl_title_shadow: 'Sombra del título',
  lbl_show_mana: 'Mostrar maná',
  ph_mana: '{G}{U} o 2G',

  opt_none: 'Ninguno',
  opt_foil_gold: 'Foil dorado',
  opt_foil_silver: 'Foil plateado',
  opt_foil_rainbow: 'Foil arcoíris',

  opt_fx_celestial: 'Celestial (premium)',
  opt_fx_infernal: 'Infernal (premium)',
  opt_fx_obsidian: 'Obsidiana (premium)',
  opt_fx_royal: 'Real (premium)',
  opt_fx_starlight: 'Luz estelar (premium)',
  premium_title_msg: 'Efecto Premium disponible con suscripción.',
  premium_frame_msg: 'Marco Premium. Disponible con suscripción.',

  lbl_class_symbol: 'Símbolo de clase',
  opt_database: 'Base de datos',
  opt_upload_img: 'Subir imagen…',
  optgroup_base: 'Básico',
  optgroup_expansion: 'Expansión',
  cls_warrior: 'Guerrero',
  cls_druid: 'Druida',
  cls_monk: 'Monje',
  cls_wizard: 'Mago',
  cls_rogue: 'Pícaro',
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
  lbl_frame_style: 'Estilo de marco',
  style_flat: 'Color plano',
  style_wood: 'Madera',
  style_stone: 'Piedra',
  style_arcane: 'Arcano',
  style_nature: 'Naturaleza',
  lbl_frame_inner: 'Color del marco (plano) e interior',

  premium_group_label: 'Premium',
  frame_celestial: 'Celestial (premium)',
  frame_infernal: 'Infernal (premium)',
  frame_frost: 'Frost (premium)',
  frame_bloom: 'Bloom (premium)',
  frame_storm: 'Storm (premium)',
  frame_vampiric: 'Vampírico (premium)',
  frame_chronos: 'Chronos (premium)',
  premium_locked_tooltip: 'Disponible con Premium',

  lbl_front_image: 'Imagen frente',
  lbl_desc_title: 'Descripción (cuadro inferior)',
  ph_rules: 'Texto/reglas… **palabras clave** en negrita.',
  lbl_desc_font: 'Fuente de la descripción',
  lbl_upload_desc_font: 'Subir fuente (TTF/OTF)',
  lbl_desc_size: 'Tamaño de la descripción',
  lbl_desc_color: 'Color de la descripción',

  back_title: 'Reverso',
  lbl_back_image: 'Imagen reverso (full-bleed)',
  hint_back_image: 'Rellena toda el área interna; mismo marco que el frente.',

  saves_title: 'Guardados',
  lbl_card_name: 'Nombre de la carta',
  ph_card: 'Ej. Espadas del Bosque',
  lbl_deck_name: 'Mazo (carpeta cloud, opc.)',
  ph_deck: 'Ej. Hechizos de Druida',
  btn_save_local: 'Guardar local',
  btn_load_local: 'Abrir biblioteca local',
  cloud_title: 'Cuenta y Cloud',
  btn_cloud_save: 'Guardar en cloud',
  btn_cloud_pull: 'Abrir biblioteca cloud',
  btn_cloud_clear: 'Vaciar cloud',

  export_title: 'Exportar',
  lbl_mirror_back: 'Reflejar reverso (impresión en casa)',
  hint_mirror_back: 'Si está activado, el PDF del reverso se refleja para facilitar la alineación al imprimir a doble cara.',
  btn_png_front: 'PNG (frente)',
  btn_png_back: 'PNG (reverso)',
  btn_pdf_single_f: 'PDF simple (frente)',
  btn_pdf_single_b: 'PDF simple (reverso)',
  btn_pdf_a4_f: 'PDF A4 3×3 (frentes)',
  btn_pdf_a4_b: 'PDF A4 3×3 (reversos)',
  btn_pdf_a4_both: 'PDF A4 3×3 (frente+reverso)',
  hint_print: 'Imprime en A4 vertical, márgenes mínimos, escala 100%.',

  preview_title: 'Vista previa',
});

/* =============== DEUTSCH =============== */
intl.addLocale('de', {
  welcome_title: 'Willkommen bei Card Maker',
  welcome_text: 'Erstelle Karten im Magic-Stil. Melde dich an, um in deiner Cloud-Bibliothek zu speichern, oder als Gast eintreten.',
  ph_email: 'E-Mail',
  ph_password: 'Passwort',
  btn_login: 'Anmelden',
  btn_signup: 'Registrieren',
  btn_guest: 'Als Gast eintreten',
  welcome_dontshow: 'Nicht mehr anzeigen',
  user_guest: 'Gast',
  btn_logout: 'Abmelden',

  front_title: 'Vorderseite',
  lbl_title: 'Titel',
  ph_title: 'Zaubername',
  lbl_title_font: 'Titelschrift',
  opt_custom_font: 'Benutzerdefiniert (Upload)',
  lbl_upload_font: 'TTF/OTF hochladen',
  lbl_title_color: 'Titelfarbe',
  lbl_title_size: 'Titelgröße',
  lbl_title_effect: 'Titel-Effekt',
  lbl_title_shadow: 'Titelschatten',
  lbl_show_mana: 'Mana anzeigen',
  ph_mana: '{G}{U} oder 2G',

  opt_none: 'Keiner',
  opt_foil_gold: 'Goldfolie',
  opt_foil_silver: 'Silberfolie',
  opt_foil_rainbow: 'Regenbogenfolie',

  opt_fx_celestial: 'Himmlisch (Premium)',
  opt_fx_infernal: 'Infernalisch (Premium)',
  opt_fx_obsidian: 'Obsidian (Premium)',
  opt_fx_royal: 'Royal (Premium)',
  opt_fx_starlight: 'Sternenlicht (Premium)',
  premium_title_msg: 'Premium-Effekt mit Abonnement verfügbar.',
  premium_frame_msg: 'Premium-Rahmen. Mit Abonnement verfügbar.',

  lbl_class_symbol: 'Klassensymbol',
  opt_database: 'Datenbank',
  opt_upload_img: 'Bild hochladen…',
  optgroup_base: 'Basis',
  optgroup_expansion: 'Erweiterung',
  cls_warrior: 'Krieger',
  cls_druid: 'Druide',
  cls_monk: 'Mönch',
  cls_wizard: 'Zauberer',
  cls_rogue: 'Schurke',
  cls_barbarian: 'Barbar',
  cls_paladin: 'Paladin',
  cls_cleric: 'Kleriker',
  cls_bard: 'Barde',
  cls_ranger: 'Waldläufer',
  cls_sorcerer: 'Hexenmeister',
  cls_warlock: 'Beschwörer',
  cls_artificer: 'Konstrukteur',
  lbl_symbol_size: 'Symbolgröße',
  hint_drag_symbol: 'Ziehen Sie das Symbol in der Vorschau, um es zu verschieben.',

  lbl_panel_color: 'Linien-/Kastenfarbe',
  lbl_panel_alpha: 'Kasten-Deckkraft',
  lbl_frame_style: 'Rahmenstil',
  style_flat: 'Flachfarbe',
  style_wood: 'Holz',
  style_stone: 'Stein',
  style_arcane: 'Arkan',
  style_nature: 'Natur',
  lbl_frame_inner: 'Rahmenfarbe (flach) & Innenbereich',

  premium_group_label: 'Premium',
  frame_celestial: 'Himmlisch (Premium)',
  frame_infernal: 'Infernalisch (Premium)',
  frame_frost: 'Frost (Premium)',
  frame_bloom: 'Bloom (Premium)',
  frame_storm: 'Sturm (Premium)',
  frame_vampiric: 'Vampirisch (Premium)',
  frame_chronos: 'Chronos (Premium)',
  premium_locked_tooltip: 'Mit Premium verfügbar',

  lbl_front_image: 'Vorderseiten-Bild',
  lbl_desc_title: 'Beschreibung (unteres Feld)',
  ph_rules: 'Regeltext… **Schlüsselwörter** fett.',
  lbl_desc_font: 'Beschreibungsschrift',
  lbl_upload_desc_font: 'Beschreibungsschrift hochladen (TTF/OTF)',
  lbl_desc_size: 'Beschreibungsschriftgröße',
  lbl_desc_color: 'Beschreibungstextfarbe',

  back_title: 'Rückseite',
  lbl_back_image: 'Rückseiten-Bild (randlos)',
  hint_back_image: 'Füllt den gesamten Innenbereich; gleicher Rahmen wie vorn.',

  saves_title: 'Speicherungen',
  lbl_card_name: 'Kartenname',
  ph_card: 'z. B. Waldenklingen',
  lbl_deck_name: 'Deck (Cloud-Ordner, opt.)',
  ph_deck: 'z. B. Druidenzauber',
  btn_save_local: 'Lokal speichern',
  btn_load_local: 'Lokale Bibliothek öffnen',
  cloud_title: 'Konto & Cloud',
  btn_cloud_save: 'In Cloud speichern',
  btn_cloud_pull: 'Cloud-Bibliothek öffnen',
  btn_cloud_clear: 'Cloud leeren',

  export_title: 'Export',
  lbl_mirror_back: 'Rückseite spiegeln (Heimdruck)',
  hint_mirror_back: 'Wenn aktiviert, wird die Rückseite gespiegelt, um das Ausrichten beim Duplexdruck zu erleichtern.',
  btn_png_front: 'PNG (Vorderseite)',
  btn_png_back: 'PNG (Rückseite)',
  btn_pdf_single_f: 'Einzel-PDF (Vorderseite)',
  btn_pdf_single_b: 'Einzel-PDF (Rückseite)',
  btn_pdf_a4_f: 'A4-PDF 3×3 (Vorderseiten)',
  btn_pdf_a4_b: 'A4-PDF 3×3 (Rückseiten)',
  btn_pdf_a4_both: 'A4-PDF 3×3 (vorn+hinten)',
  hint_print: 'A4 hoch, minimale Ränder, 100 % Skalierung.',

  preview_title: 'Vorschau',
});

/* ===== Helper: localizza le opzioni Premium iniettate da premium.js ===== */
function localizePremiumFrames() {
  const sel = document.getElementById('frameStyle');
  if (!sel) return;

  const og = sel.querySelector('optgroup[data-premium="1"]');
  if (og) {
    // etichetta optgroup
    og.setAttribute('label', intl.t('premium_group_label') || 'Premium');
    // singole option
    [...og.querySelectorAll('option')].forEach(o => {
      const base = (o.value || '').toLowerCase();
      const locked = o.hasAttribute('data-locked') || o.disabled;
      const mapKey = {
        celestial: 'frame_celestial',
        infernal: 'frame_infernal',
        frost: 'frame_frost',
        bloom: 'frame_bloom',
        storm: 'frame_storm',
        vampiric: 'frame_vampiric',
        chronos: 'frame_chronos',
      }[base];
      if (mapKey) {
        let label = intl.t(mapKey) || o.textContent || '';
        if (locked) label = label + ' 🔒';
        o.textContent = label;
        if (locked) o.title = intl.t('premium_locked_tooltip') || o.title || '';
      }
    });
  }
}

/* ===== Inserisce il selettore lingua in <header> e collega i18n ===== */
function ensureLangSelector() {
  const hdr = document.querySelector('header');
  if (!hdr) return;
  const row = hdr.querySelector('.row') || hdr;

  let sel = document.getElementById('lang');
  if (!sel) {
    sel = document.createElement('select');
    sel.id = 'lang';
    sel.style.marginLeft = '10px';
    sel.style.padding = '4px 6px';
    sel.style.borderRadius = '8px';
    sel.innerHTML = `
      <option value="it">IT</option>
      <option value="en">EN</option>
      <option value="es">ES</option>
      <option value="de">DE</option>`;
    row.appendChild(sel);
  }
  const cur = intl.getLocale();
  sel.value = ['it','en','es','de'].includes(cur) ? cur : 'it';

  sel.onchange = () => intl.setLocale(sel.value);
}

/* ===== Avvio ===== */
document.addEventListener('DOMContentLoaded', () => {
  ensureLangSelector();
  localizePremiumFrames();
});

// Rilocalizza quando cambia lingua
intl.onChange(() => {
  // intl.translateDom() viene già chiamato da intl.setLocale internamente
  ensureLangSelector();
  localizePremiumFrames();
});

// Se premium.js inietta/aggiorna dopo
const observer = new MutationObserver(() => localizePremiumFrames());
document.addEventListener('DOMContentLoaded', () => {
  const sel = document.getElementById('frameStyle');
  if (sel) observer.observe(sel, { childList: true, subtree: true });
});
