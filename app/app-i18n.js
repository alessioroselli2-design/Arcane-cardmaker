// /app/app-i18n.js — dizionari UI + bridge i18n “lite” (non tocca #lang)
import * as intl from './intl.js';

/* ============== DIZIONARI ============== */
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

    // Effetti premium (fx-*)
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
    sheet_count: '{n}/9'
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
    sheet_count: '{n}/9'
  };
}

function dictES() {
  return {
    welcome_title: 'Bienvenido a Card Maker',
    welcome_text: 'Crea cartas estilo Magic. Inicia sesión para guardar en tu nube o entra como invitado.',
    ph_email: 'Correo',
    ph_password: 'Contraseña',
    btn_login: 'Entrar',
    btn_signup: 'Crear cuenta',
    btn_guest: 'Entrar como invitado',
    welcome_dontshow: 'No volver a mostrar',
    user_guest: 'Invitado',
    btn_logout: 'Salir',

    front_title: 'Frente',
    back_title: 'Reverso',
    saves_title: 'Guardados',
    export_title: 'Exportar',
    preview_title: 'Vista previa',
    cloud_title: 'Cuenta y Nube',

    lbl_title: 'Título',
    ph_title: 'Nombre del hechizo',
    lbl_title_font: 'Fuente del título',
    opt_custom_font: 'Personalizada (subir)',
    lbl_upload_font: 'Subir fuente TTF/OTF',
    lbl_title_color: 'Color del título',
    lbl_title_size: 'Tamaño del título',
    lbl_title_effect: 'Efecto del título',
    lbl_title_shadow: 'Sombra del título',
    opt_none: 'Ninguno',
    opt_foil_gold: 'Foil dorado',
    opt_foil_silver: 'Foil plateado',
    opt_foil_rainbow: 'Foil arcoíris',

    opt_fx_celestial: 'Celestial (premium)',
    opt_fx_infernal: 'Infernal (premium)',
    opt_fx_obsidian: 'Obsidian (premium)',
    opt_fx_royal: 'Royal (premium)',
    opt_fx_starlight: 'Starlight (premium)',

    lbl_show_mana: 'Mostrar maná',
    ph_mana: '{G}{U} o 2G',

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
    hint_drag_symbol: 'Arrastra el símbolo sobre la vista previa para moverlo.',

    lbl_panel_color: 'Color de líneas/cuadros',
    lbl_panel_alpha: 'Opacidad de cuadros',

    lbl_frame_style: 'Estilo del marco',
    style_flat: 'Color plano',
    style_wood: 'Madera',
    style_stone: 'Piedra',
    style_arcane: 'Arcano',
    style_nature: 'Naturaleza',
    lbl_frame_inner: 'Color del marco (plano) e interior',

    lbl_front_image: 'Imagen frontal',
    lbl_back_image: 'Imagen reverso (a sangre)',
    hint_back_image: 'Rellena el área interior; mismo marco que el frente.',

    lbl_desc_title: 'Descripción (cuadro inferior)',
    ph_rules: 'Texto de reglas… **palabras clave** en negrita.',
    lbl_desc_font: 'Fuente de descripción',
    lbl_upload_desc_font: 'Subir fuente de descripción (TTF/OTF)',
    lbl_desc_size: 'Tamaño descripción',
    lbl_desc_color: 'Color descripción',

    lbl_card_name: 'Nombre de la carta',
    ph_card: 'p. ej., Hojas del Bosque',
    lbl_deck_name: 'Mazo (carpeta nube, opc.)',
    ph_deck: 'p. ej., Hechizos Druida',
    btn_save_local: 'Guardar localmente',
    btn_load_local: 'Abrir biblioteca local',
    btn_cloud_save: 'Guardar en la nube',
    btn_cloud_pull: 'Abrir biblioteca nube',
    btn_cloud_clear: 'Vaciar nube',

    lbl_mirror_back: 'Espejar reverso (impresión en casa)',
    hint_mirror_back: 'Si está activo, el PDF del reverso se espeja para alinear frente y reverso.',
    btn_png_front: 'PNG (frente)',
    btn_png_back: 'PNG (reverso)',
    btn_pdf_single_f: 'PDF única (frente)',
    btn_pdf_single_b: 'PDF única (reverso)',
    btn_pdf_a4_f: 'A4 PDF 3×3 (frentes)',
    btn_pdf_a4_b: 'A4 PDF 3×3 (reversos)',
    btn_pdf_a4_both: 'A4 PDF 3×3 (frente+reverso)',
    hint_print: 'Imprime A4 vertical, márgenes mínimos, escala 100%.',

    premium_frame_msg: 'Marco Premium. Disponible con suscripción.',
    premium_title_msg: 'Efecto Premium disponible con suscripción.',

    sheet_title: 'Hoja (hasta 9 cartas distintas)',
    sheet_add: 'Añadir esta carta a la hoja',
    sheet_clear: 'Vaciar hoja',
    sheet_remove_last: 'Quitar última',
    sheet_pdf: 'PDF A4 3×3 (hoja, anverso+reverso)',
    jsPDF_missing: 'jsPDF no disponible. Revisa la conexión o recarga la página.',
    sheet_full: 'Ya tienes 9 cartas en la hoja.',
    sheet_empty: 'La hoja está vacía. Añade al menos 1 carta.',
    sheet_already_empty: 'La hoja ya está vacía.',
    export_error_prefix: 'Error de exportación: ',
    front_canvas_missing: 'Lienzo frontal no encontrado',
    back_canvas_missing: 'Lienzo trasero no encontrado',
    sheet_count: '{n}/9'
  };
}

function dictDE() {
  return {
    welcome_title: 'Willkommen bei Card Maker',
    welcome_text: 'Erstelle Magic-ähnliche Karten. Melde dich an, um in der Cloud zu speichern, oder fahre als Gast fort.',
    ph_email: 'E-Mail',
    ph_password: 'Passwort',
    btn_login: 'Anmelden',
    btn_signup: 'Registrieren',
    btn_guest: 'Als Gast fortfahren',
    welcome_dontshow: 'Nicht mehr anzeigen',
    user_guest: 'Gast',
    btn_logout: 'Abmelden',

    front_title: 'Vorderseite',
    back_title: 'Rückseite',
    saves_title: 'Speicherungen',
    export_title: 'Export',
    preview_title: 'Vorschau',
    cloud_title: 'Konto & Cloud',

    lbl_title: 'Titel',
    ph_title: 'Zaubername',
    lbl_title_font: 'Titelschrift',
    opt_custom_font: 'Eigen (Upload)',
    lbl_upload_font: 'TTF/OTF-Schrift hochladen',
    lbl_title_color: 'Titelfarbe',
    lbl_title_size: 'Titelgröße',
    lbl_title_effect: 'Titel-Effekt',
    lbl_title_shadow: 'Titelschatten',
    opt_none: 'Keiner',
    opt_foil_gold: 'Goldfolie',
    opt_foil_silver: 'Silberfolie',
    opt_foil_rainbow: 'Regenbogenfolie',

    opt_fx_celestial: 'Celestial (Premium)',
    opt_fx_infernal: 'Infernal (Premium)',
    opt_fx_obsidian: 'Obsidian (Premium)',
    opt_fx_royal: 'Royal (Premium)',
    opt_fx_starlight: 'Starlight (Premium)',

    lbl_show_mana: 'Mana anzeigen',
    ph_mana: '{G}{U} oder 2G',

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
    cls_warlock: 'Warlock',
    cls_artificer: 'Konstrukteur',
    lbl_symbol_size: 'Symbolgröße',
    hint_drag_symbol: 'Ziehen Sie das Symbol in der Vorschau, um es zu verschieben.',

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
    hint_back_image: 'Füllt den Innenbereich; gleicher Rahmen wie vorne.',

    lbl_desc_title: 'Beschreibung (unteres Feld)',
    ph_rules: 'Regeltext… **Schlüsselwörter** fett.',
    lbl_desc_font: 'Beschreibungsschrift',
    lbl_upload_desc_font: 'Beschreibungsschrift hochladen (TTF/OTF)',
    lbl_desc_size: 'Beschreibung Größe',
    lbl_desc_color: 'Beschreibung Farbe',

    lbl_card_name: 'Kartenname',
    ph_card: 'z. B. Waldenklingen',
    lbl_deck_name: 'Deck (Cloud-Ordner, opt.)',
    ph_deck: 'z. B. Druidenzauber',
    btn_save_local: 'Lokal speichern',
    btn_load_local: 'Lokale Bibliothek öffnen',
    btn_cloud_save: 'In Cloud speichern',
    btn_cloud_pull: 'Cloud-Bibliothek öffnen',
    btn_cloud_clear: 'Cloud leeren',

    lbl_mirror_back: 'Rückseite spiegeln (Heimdruck)',
    hint_mirror_back: 'Wenn aktiv, wird das Rückseiten-PDF gespiegelt für leichteres Ausrichten.',
    btn_png_front: 'PNG (Front)',
    btn_png_back: 'PNG (Back)',
    btn_pdf_single_f: 'Einzel-PDF (Front)',
    btn_pdf_single_b: 'Einzel-PDF (Back)',
    btn_pdf_a4_f: 'A4 PDF 3×3 (Fronts)',
    btn_pdf_a4_b: 'A4 PDF 3×3 (Backs)',
    btn_pdf_a4_both: 'A4 PDF 3×3 (Front+Back)',
    hint_print: 'A4 hochkant, minimale Ränder, Maßstab 100 %.',

    premium_frame_msg: 'Premium-Rahmen. Mit Abo verfügbar.',
    premium_title_msg: 'Premium-Titeleffekt mit Abo verfügbar.',

    sheet_title: 'Bogen (bis zu 9 verschiedene Karten)',
    sheet_add: 'Diese Karte zum Bogen hinzufügen',
    sheet_clear: 'Bogen leeren',
    sheet_remove_last: 'Letzte entfernen',
    sheet_pdf: 'A4 PDF 3×3 (Bogen, Vorder- & Rückseite)',
    jsPDF_missing: 'jsPDF nicht verfügbar. Verbindung prüfen oder Seite neu laden.',
    sheet_full: 'Du hast bereits 9 Karten im Bogen.',
    sheet_empty: 'Der Bogen ist leer. Füge mindestens 1 Karte hinzu.',
    sheet_already_empty: 'Der Bogen ist bereits leer.',
    export_error_prefix: 'Exportfehler: ',
    front_canvas_missing: 'Vorderes Canvas nicht gefunden',
    back_canvas_missing: 'Hinteres Canvas nicht gefunden',
    sheet_count: '{n}/9'
  };
}

/* ============== REGISTRAZIONE ============== */
intl.addLocale('it', dictIT());
intl.addLocale('en', dictEN());
intl.addLocale('es', dictES());
intl.addLocale('de', dictDE());

/* ============== BRIDGE + EVENTO ============== */
// Avvolge setLocale per aggiornare <html lang>, tradurre il DOM ed emettere i18n-changed
const __origSetLocale = intl.setLocale;
function setLocaleAndNotify(lang) {
  __origSetLocale(lang);
  try { document.documentElement.setAttribute('lang', lang); } catch {}
  try { applyI18nToDom(); } catch {}
  try { window.dispatchEvent(new CustomEvent('i18n-changed', { detail: { lang } })); } catch {}
}
intl.setLocale = setLocaleAndNotify;

/* ============== APPLY DOM ============== */
function applyI18nToDom(){
  try { intl.translateDom(document); } catch {}
  // Bridge opzionale: traduce le option del select classi (#clazz) se card.js lo espone
  try {
    if (window.appI18n && typeof window.appI18n.__translateClassOptions === 'function') {
      window.appI18n.__translateClassOptions();
    }
  } catch {}
}

/* ============== AVVIO ============== */
document.addEventListener('DOMContentLoaded', () => {
  // 1) prova da localStorage, poi fallback al valore interno di intl, poi 'it'
  let cur = 'it';
  try { cur = localStorage.getItem('acm_locale') || intl.getLocale() || 'it'; } catch { cur = intl.getLocale() || 'it'; }
  intl.setLocale(cur);
  try { document.documentElement.setAttribute('lang', cur); } catch {}
  applyI18nToDom();
});

/* ============== API PUBBLICA ============== */
window.appI18n = {
  refresh: applyI18nToDom,
  t: intl.t,
  setLocale(loc){
    if (!loc || loc === intl.getLocale()) return;
    // NB: non tocchiamo il selettore #lang qui; lo gestisce l’index
    intl.setLocale(loc);
    try { document.documentElement.setAttribute('lang', loc); } catch {}
    applyI18nToDom();
  },
  // card.js può impostare qui un hook per tradurre le option del select classi
  __translateClassOptions: null
};
