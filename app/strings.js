// /app/strings.js — dizionari completi + selettore lingua
import * as intl from './intl.js';

const it = {
  // Welcome
  welcome_title: 'Benvenuto in Card Maker',
  welcome_text: 'Crea carte in stile Magic. Accedi per salvare nella tua Libreria Cloud, oppure entra come Ospite.',
  welcome_dontshow: 'Non mostrare più',
  ph_email: 'Email',
  ph_password: 'Password',
  btn_login: 'Accedi',
  btn_signup: 'Registrati',
  btn_guest: 'Entra come ospite',

  // Header
  user_guest: 'Ospite',
  btn_logout: 'Esci',

  // Pannello (Fronte)
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
  lbl_title_shadow: 'Ombra titolo',
  lbl_show_mana: 'Mostra mana',
  ph_mana: '{G}{U} o 2G',

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
  lbl_panel_color: 'Colore linee/riquadri',
  lbl_panel_alpha: 'Opacità riquadri',

  lbl_frame_style: 'Stile cornice',
  style_flat: 'Colore piatto',
  style_wood: 'Legno',
  style_stone: 'Pietra',
  style_arcane: 'Arcano',
  style_nature: 'Natura',
  lbl_frame_inner: 'Colore cornice (piatto) & interno',

  // Immagini/Descrizione
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

  // Salvataggi
  saves_title: 'Salvataggi',
  lbl_card_name: 'Nome carta',
  ph_card: 'Es. Lame del Bosco',
  lbl_deck_name: 'Mazzo (cartella cloud, opz.)',
  ph_deck: 'Es. Incantesimi Druido',

  // Bottoni local/cloud
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

  // Anteprima
  preview_title: 'Anteprima'
};

const en = {
  // Welcome
  welcome_title: 'Welcome to Card Maker',
  welcome_text: 'Create Magic-style cards. Sign in to save to your Cloud Library, or continue as Guest.',
  welcome_dontshow: 'Don’t show again',
  ph_email: 'Email',
  ph_password: 'Password',
  btn_login: 'Sign in',
  btn_signup: 'Sign up',
  btn_guest: 'Continue as guest',

  // Header
  user_guest: 'Guest',
  btn_logout: 'Sign out',

  // Panel (Front)
  front_title: 'Front',
  lbl_title: 'Title',
  ph_title: 'Spell name',
  lbl_title_font: 'Title font',
  opt_custom_font: 'Custom (upload)',
  lbl_upload_font: 'Upload TTF/OTF',
  lbl_title_color: 'Title color',
  lbl_title_size: 'Title size',
  lbl_title_effect: 'Title effect',
  opt_none: 'None',
  opt_foil_gold: 'Gold foil',
  opt_foil_silver: 'Silver foil',
  opt_foil_rainbow: 'Rainbow foil',
  lbl_title_shadow: 'Title shadow',
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
  hint_drag_symbol: 'Drag the symbol on the preview to move it.',
  lbl_panel_color: 'Lines/panels color',
  lbl_panel_alpha: 'Panels opacity',

  lbl_frame_style: 'Frame style',
  style_flat: 'Flat color',
  style_wood: 'Wood',
  style_stone: 'Stone',
  style_arcane: 'Arcane',
  style_nature: 'Nature',
  lbl_frame_inner: 'Frame (flat) & inner color',

  // Images/Description
  lbl_front_image: 'Front image',
  lbl_desc_title: 'Description (bottom box)',
  ph_rules: 'Rules text… **keywords** in bold.',
  lbl_desc_font: 'Description font',
  lbl_upload_desc_font: 'Upload description font (TTF/OTF)',
  lbl_desc_size: 'Description size',
  lbl_desc_color: 'Description color',

  // Back
  back_title: 'Back',
  lbl_back_image: 'Back image (full-bleed)',
  hint_back_image: 'Fills the inner area; same frame as front.',

  // Saves
  saves_title: 'Saves',
  lbl_card_name: 'Card name',
  ph_card: 'e.g. Forest Blades',
  lbl_deck_name: 'Deck (cloud folder, opt.)',
  ph_deck: 'e.g. Druid Spells',

  // Buttons local/cloud
  btn_save_local: 'Save locally',
  btn_load_local: 'Open local library',
  cloud_title: 'Account & Cloud',
  btn_cloud_save: 'Save to cloud',
  btn_cloud_pull: 'Open cloud library',
  btn_cloud_clear: 'Clear cloud',

  // Export
  export_title: 'Export',
  btn_png_front: 'PNG (front)',
  btn_png_back: 'PNG (back)',
  btn_pdf_single_f: 'Single PDF (front)',
  btn_pdf_single_b: 'Single PDF (back)',
  btn_pdf_a4_f: 'A4 PDF 3×3 (fronts)',
  btn_pdf_a4_b: 'A4 PDF 3×3 (backs)',
  btn_pdf_a4_both: 'A4 PDF 3×3 (front+back)',
  hint_print: 'Print on A4 portrait, minimal margins, 100% scale.',

  // Preview
  preview_title: 'Preview'
};

intl.addLocale('it', it);
intl.addLocale('en', en);

// Selettore lingua (se non esiste già)
(function ensureLangSelector(){
  const host = document.querySelector('header .row') || document.querySelector('header');
  if (!host || document.getElementById('lang')) return;
  const sel = document.createElement('select');
  sel.id = 'lang';
  sel.style.marginLeft = '10px';
  sel.style.padding = '4px 6px';
  sel.style.borderRadius = '8px';
  sel.innerHTML = `<option value="it">IT</option><option value="en">EN</option>`;
  sel.value = intl.getLocale();
  sel.addEventListener('change', ()=> intl.setLocale(sel.value));
  host.appendChild(sel);
})();

// Applica subito e al cambio lingua
intl.translateDom();
intl.onChange(()=> intl.translateDom());
