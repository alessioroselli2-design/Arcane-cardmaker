// /app/esportazione.js — Export PNG & PDF (singolo, A4 3×3) + crop marks + mirror/offset retro
// Non richiede modifiche all'HTML. Se esistono certi input opzionali, li usa; altrimenti usa default.

// ================== Helper base ==================
const $ = (id) => document.getElementById(id);
function createPDF(orientation = 'portrait') {
  const { jsPDF } = (window.jspdf || {});
  if (!jsPDF) {
    alert('Libreria jsPDF non trovata. Controlla lo <script> jsPDF nel tuo index.html.');
    throw new Error('jsPDF missing');
  }
  return new jsPDF({
    orientation: orientation.startsWith('p') ? 'portrait' : 'landscape',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });
}
function getCanvases() {
  const front = $('cardFront');
  const back = $('cardBack');
  if (!front || !back) {
    alert('Canvas non trovati. Ricarica la pagina.');
    throw new Error('canvas missing');
  }
  return { front, back };
}
function downloadDataURL(dataURL, filename) {
  const a = document.createElement('a');
  a.href = dataURL;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
// Mirror orizzontale opzionale
function canvasToDataURL(canvas, { mirror = false } = {}) {
  if (!mirror) return canvas.toDataURL('image/png');
  const off = document.createElement('canvas');
  off.width = canvas.width; off.height = canvas.height;
  const ctx = off.getContext('2d');
  ctx.save(); ctx.translate(off.width, 0); ctx.scale(-1, 1);
  ctx.drawImage(canvas, 0, 0); ctx.restore();
  return off.toDataURL('image/png');
}

// ================== Impostazioni (con fallback) ==================
// Se metti questi controlli nell'HTML, verranno usati automaticamente.
// Altrimenti usiamo i default.
function readNumber(id, fallback) {
  const el = $(id);
  if (!el) return fallback;
  const v = parseFloat(el.value);
  return Number.isFinite(v) ? v : fallback;
}
function readCheckbox(id, fallback) {
  const el = $(id);
  return el ? !!el.checked : fallback;
}
function isMirrorBack() { return readCheckbox('mirrorBack', false); }

// Impostazioni di stampa (mm)
function getPrintSettings() {
  return {
    // dimensioni carta tipo TCG (trim) — NON cambiare a caso, tutta la griglia si basa su questi
    CARD_W: 63,
    CARD_H: 88,

    // griglia A4
    COLS: 3,
    ROWS: 3,
    GUTTER_X: readNumber('gutterX', 6),  // distanza orizzontale tra carte
    GUTTER_Y: readNumber('gutterY', 6),  // distanza verticale tra carte

    // crop marks
    CROP_MARKS: readCheckbox('cropMarks', true), // se non esiste il checkbox => crop attivi
    CROP_LEN: readNumber('cropLen', 4),          // lunghezza linea di taglio (mm)
    CROP_GAP: readNumber('cropGap', 2),          // dist. dal bordo trim al segno (mm)
    CROP_STROKE: 0.6,                            // spessore linea (mm)

    // offset retro per micro-registrazione (applicato SOLO alle pagine del retro)
    BACK_OFS_X: readNumber('backOffsetX', 0),    // mm: + sposta a destra, - a sinistra
    BACK_OFS_Y: readNumber('backOffsetY', 0),    // mm: + sposta in basso, - in alto
  };
}

// ================== Crop marks ==================
// Disegna croci agli angoli del rettangolo trim (x,y,w,h).
function drawCropMarks(pdf, x, y, w, h, cfg) {
  if (!cfg.CROP_MARKS) return;

  pdf.setDrawColor(90);   // grigio scuro (non 100% nero: più “tipografico”)
  pdf.setLineWidth(cfg.CROP_STROKE);

  const L = cfg.CROP_LEN;
  const G = cfg.CROP_GAP;

  // angolo in alto a sinistra
  // verticale
  pdf.line(x - G, y - L - G, x - G, y - G);
  // orizzontale
  pdf.line(x - L - G, y - G, x - G, y - G);

  // alto a destra
  pdf.line(x + w + G, y - L - G, x + w + G, y - G);
  pdf.line(x + w + G, y - G, x + w + L + G, y - G);

  // basso a sinistra
  pdf.line(x - G, y + h + G, x - G, y + h + L + G);
  pdf.line(x - L - G, y + h + G, x - G, y + h + G);

  // basso a destra
  pdf.line(x + w + G, y + h + G, x + w + G, y + h + L + G);
  pdf.line(x + w + G, y + h + G, x + w + L + G, y + h + G);
}

// ================== PNG ==================
function exportPNGFront() {
  const { front } = getCanvases();
  downloadDataURL(front.toDataURL('image/png'), 'card_front.png');
}
function exportPNGBack() {
  const { back } = getCanvases();
  const data = canvasToDataURL(back, { mirror: isMirrorBack() });
  downloadDataURL(data, 'card_back.png');
}

// ================== PDF — Singolo (centrato in A4) ==================
function exportPDFSingle({ side = 'front' } = {}) {
  const { front, back } = getCanvases();
  const pdf = createPDF('portrait');

  // A4 (mm)
  const PAGE_W = 210, PAGE_H = 297;

  // uso dimensione più grande per singola (ben visibile su A4)
  const CARD_W = 90, CARD_H = 120;

  const cfg = getPrintSettings();

  // centratura base
  let X = (PAGE_W - CARD_W) / 2;
  let Y = (PAGE_H - CARD_H) / 2;

  // offset retro (solo per back)
  if (side !== 'front') {
    X += cfg.BACK_OFS_X;
    Y += cfg.BACK_OFS_Y;
  }

  // immagine
  const dataURL = (side === 'front')
    ? front.toDataURL('image/png')
    : canvasToDataURL(back, { mirror: isMirrorBack() });

  pdf.addImage(dataURL, 'PNG', X, Y, CARD_W, CARD_H);

  // crop marks attorno al box trim
  drawCropMarks(pdf, X, Y, CARD_W, CARD_H, cfg);

  pdf.save(side === 'front' ? 'card_front.pdf' : 'card_back.pdf');
}

// ================== PDF — A4 3×3 (9 carte) ==================
function exportPDFA4({ side = 'front' } = {}) {
  const { front, back } = getCanvases();
  const pdf = createPDF('portrait');

  // A4
  const PAGE_W = 210, PAGE_H = 297;

  const cfg = getPrintSettings();
  const { CARD_W, CARD_H, COLS, ROWS, GUTTER_X, GUTTER_Y } = cfg;

  // calcolo centratura della griglia
  const totalW = COLS * CARD_W + (COLS - 1) * GUTTER_X;
  const totalH = ROWS * CARD_H + (ROWS - 1) * GUTTER_Y;
  const MARGIN_X = (PAGE_W - totalW) / 2;
  const MARGIN_Y = (PAGE_H - totalH) / 2;

  const mirror = isMirrorBack();
  const dataURL = (side === 'front')
    ? front.toDataURL('image/png')
    : canvasToDataURL(back, { mirror });

  // offset retro (si applica a tutta la pagina-retro)
  const baseOffsetX = (side === 'front') ? 0 : cfg.BACK_OFS_X;
  const baseOffsetY = (side === 'front') ? 0 : cfg.BACK_OFS_Y;

  let y = MARGIN_Y + baseOffsetY;
  for (let r = 0; r < ROWS; r++) {
    let x = MARGIN_X + baseOffsetX;
    for (let c = 0; c < COLS; c++) {
      pdf.addImage(dataURL, 'PNG', x, y, CARD_W, CARD_H);
      drawCropMarks(pdf, x, y, CARD_W, CARD_H, cfg);
      x += CARD_W + GUTTER_X;
    }
    y += CARD_H + GUTTER_Y;
  }

  pdf.save(side === 'front' ? 'cards_A4_front.pdf' : 'cards_A4_back.pdf');
}

// ================== PDF — A4 3×3 (fronte+retro) ==================
function exportPDFA4Both() {
  const { front, back } = getCanvases();
  const pdf = createPDF('portrait');

  // A4
  const PAGE_W = 210, PAGE_H = 297;

  const cfg = getPrintSettings();
  const { CARD_W, CARD_H, COLS, ROWS, GUTTER_X, GUTTER_Y } = cfg;

  // centratura griglia
  const totalW = COLS * CARD_W + (COLS - 1) * GUTTER_X;
  const totalH = ROWS * CARD_H + (ROWS - 1) * GUTTER_Y;
  const MARGIN_X = (PAGE_W - totalW) / 2;
  const MARGIN_Y = (PAGE_H - totalH) / 2;

  // Pagina 1 — Fronti
  let y = MARGIN_Y;
  const frontURL = front.toDataURL('image/png');
  for (let r = 0; r < ROWS; r++) {
    let x = MARGIN_X;
    for (let c = 0; c < COLS; c++) {
      pdf.addImage(frontURL, 'PNG', x, y, CARD_W, CARD_H);
      drawCropMarks(pdf, x, y, CARD_W, CARD_H, cfg);
      x += CARD_W + GUTTER_X;
    }
    y += CARD_H + GUTTER_Y;
  }

  // Pagina 2 — Retro (mirror + offset se richiesti)
  pdf.addPage('a4', 'portrait');
  const backURL = canvasToDataURL(back, { mirror: isMirrorBack() });

  y = MARGIN_Y + cfg.BACK_OFS_Y;
  for (let r = 0; r < ROWS; r++) {
    let x = MARGIN_X + cfg.BACK_OFS_X;
    for (let c = 0; c < COLS; c++) {
      pdf.addImage(backURL, 'PNG', x, y, CARD_W, CARD_H);
      drawCropMarks(pdf, x, y, CARD_W, CARD_H, cfg);
      x += CARD_W + GUTTER_X;
    }
    y += CARD_H + GUTTER_Y;
  }

  pdf.save('cards_A4_front+back.pdf');
}

// ================== Bind bottoni (come nel tuo index) ==================
function bindExportUI() {
  $('pngFront')?.addEventListener('click', exportPNGFront);
  $('pngBack')?.addEventListener('click', exportPNGBack);

  $('pdfSingleFront')?.addEventListener('click', () => exportPDFSingle({ side: 'front' }));
  $('pdfSingleBack')?.addEventListener('click', () => exportPDFSingle({ side: 'back' }));

  $('pdfA4Front')?.addEventListener('click', () => exportPDFA4({ side: 'front' }));
  $('pdfA4Back')?.addEventListener('click', () => exportPDFA4({ side: 'back' }));

  $('pdfA4Both')?.addEventListener('click', exportPDFA4Both);
}
if (document.readyState !== 'loading') bindExportUI();
else document.addEventListener('DOMContentLoaded', bindExportUI);
