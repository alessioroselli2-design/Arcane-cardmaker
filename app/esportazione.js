// /app/esportazione.js — Export PNG/PDF + Foglio 3×3 con carte diverse (front+back, crop marks)
import { frontPNG, backPNG } from './card.js';

const jsPDF = window.jspdf?.jsPDF;

// ==== UTIL ====
function mm(v){ return v; } // per chiarezza: usiamo già jsPDF in mm

function dataURLFromCanvas(url){
  // se è già dataURL, la ritorno così; altrimenti la uso direttamente
  return url;
}

// Crop marks (segni di taglio) attorno a ogni cella
function drawCropMarks(doc, x, y, w, h, len=3, off=1){
  // linee fuori dai bordi (offset = distanza dal bordo)
  const l = mm(len), o = mm(off);
  doc.setLineWidth(0.2);

  // top-left
  doc.line(x - o - l, y - o,     x - o,     y - o);
  doc.line(x - o,     y - o - l, x - o,     y - o);
  // top-right
  doc.line(x + w + o, y - o,     x + w + o + l, y - o);
  doc.line(x + w + o, y - o - l, x + w + o,     y - o);
  // bottom-left
  doc.line(x - o - l, y + h + o, x - o,         y + h + o);
  doc.line(x - o,     y + h + o, x - o,         y + h + o + l);
  // bottom-right
  doc.line(x + w + o, y + h + o, x + w + o + l, y + h + o);
  doc.line(x + w + o, y + h + o, x + w + o,     y + h + o + l);
}

// Calcola posizioni 3×3 su A4 (mm)
function layoutA4Grid3x3(cardW=63, cardH=88, gutterX=5, gutterY=5){
  const pageW = 210, pageH = 297;
  const totalW = cardW*3 + gutterX*2;
  const totalH = cardH*3 + gutterY*2;
  const marginX = (pageW - totalW)/2;
  const marginY = (pageH - totalH)/2;
  const cells = [];
  for (let r=0; r<3; r++){
    for (let c=0; c<3; c++){
      const x = marginX + c*(cardW + gutterX);
      const y = marginY + r*(cardH + gutterY);
      cells.push({x, y, w:cardW, h:cardH, r, c});
    }
  }
  return { pageW, pageH, marginX, marginY, cells };
}

// ==== EXPORT ESISTENTI ====
// (attacco agli ID già presenti nell'index, se esistono)
const $ = (id)=>document.getElementById(id);

function downloadDataUrl(dataUrl, filename){
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// PNG singoli
$('#pngFront')?.addEventListener('click',()=>{
  try {
    const url = frontPNG();
    downloadDataUrl(url, 'card-front.png');
  } catch(e){ alert('Errore PNG fronte: '+e); }
});
$('#pngBack')?.addEventListener('click',()=>{
  try {
    const url = backPNG();
    downloadDataUrl(url, 'card-back.png');
  } catch(e){ alert('Errore PNG retro: '+e); }
});

// PDF singola (fronte/retro) — stesso posizionamento della card intera
$('#pdfSingleFront')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells } = layoutA4Grid3x3(); // uso una cella per scalare bene
  const { w:cardW, h:cardH } = cells[0];
  const page = {w:210, h:297};

  const url = frontPNG();
  // centro la singola carta in pagina
  const x = (page.w - cardW)/2, y = (page.h - cardH)/2;
  doc.addImage(dataURLFromCanvas(url), 'PNG', x, y, cardW, cardH);
  doc.save('card-front.pdf');
});

$('#pdfSingleBack')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells } = layoutA4Grid3x3();
  const { w:cardW, h:cardH } = cells[0];
  const page = {w:210, h:297};

  const url = backPNG();
  const x = (page.w - cardW)/2, y = (page.h - cardH)/2;
  doc.addImage(dataURLFromCanvas(url), 'PNG', x, y, cardW, cardH);
  doc.save('card-back.pdf');
});

// PDF A4 3×3 (replica la stessa carta) — FRONTI
$('#pdfA4Front')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells } = layoutA4Grid3x3();
  const url = frontPNG();

  cells.forEach(cell=>{
    doc.addImage(dataURLFromCanvas(url), 'PNG', cell.x, cell.y, cell.w, cell.h);
    drawCropMarks(doc, cell.x, cell.y, cell.w, cell.h);
  });
  doc.save('a4-fronts-3x3.pdf');
});

// PDF A4 3×3 (replica la stessa carta) — RETRO
$('#pdfA4Back')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells, pageW } = layoutA4Grid3x3();
  const url = backPNG();

  // Retro specchiato per allineamento (inverte le colonne)
  cells.forEach(cell=>{
    const mirroredX = pageW - cell.x - cell.w; // specchio orizzontale
    doc.addImage(dataURLFromCanvas(url), 'PNG', mirroredX, cell.y, cell.w, cell.h);
    drawCropMarks(doc, mirroredX, cell.y, cell.w, cell.h);
  });

  doc.save('a4-backs-3x3.pdf');
});

// PDF A4 3×3 (fronte+retro della stessa carta)
$('#pdfA4Both')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells, pageW } = layoutA4Grid3x3();
  const fUrl = frontPNG();
  const bUrl = backPNG();

  // page 1: fronti
  cells.forEach(cell=>{
    doc.addImage(dataURLFromCanvas(fUrl), 'PNG', cell.x, cell.y, cell.w, cell.h);
    drawCropMarks(doc, cell.x, cell.y, cell.w, cell.h);
  });

  // page 2: retro (specchiati)
  doc.addPage();
  cells.forEach(cell=>{
    const mirroredX = pageW - cell.x - cell.w;
    doc.addImage(dataURLFromCanvas(bUrl), 'PNG', mirroredX, cell.y, cell.w, cell.h);
    drawCropMarks(doc, mirroredX, cell.y, cell.w, cell.h);
  });

  doc.save('a4-both-3x3.pdf');
});


// ==== N U O V O  —  F O G L I O  3 × 3  (carte diverse) ====

// Config “tipografica” (puoi modificare se vuoi)
const CARD_W = 63;     // mm (formato tipo Magic 63×88)
const CARD_H = 88;     // mm
const GUTTER_X = 5;    // mm tra colonne
const GUTTER_Y = 5;    // mm tra righe
const CROP_LEN = 3;    // mm lunghezza segni di taglio
const CROP_OFF = 1;    // mm offset segni

// Offset retro per micro-allineamento (se serve)
/** Se noti uno shift in stampa, puoi provare a mettere 0.5 o 1.0 */
const BACK_OFFSET_X = 0;   // mm
const BACK_OFFSET_Y = 0;   // mm

// Foglio: max 9 slot {front, back}
const sheet = [];
function updateSheetCount(){
  const el = document.getElementById('sheetCountHint');
  if (el) el.textContent = `${sheet.length}/9`;
}

// Aggiungi carta corrente (fronte+retro) allo sheet
$('#sheetAdd')?.addEventListener('click',()=>{
  if (sheet.length >= 9){
    alert('Hai già 9 carte nel foglio.');
    return;
  }
  try{
    const f = frontPNG();
    const b = backPNG();
    sheet.push({ front:f, back:b });
    updateSheetCount();
  }catch(e){
    alert('Errore nel catturare la carta: '+e?.message||e);
  }
});

// Svuota foglio
$('#sheetClear')?.addEventListener('click',()=>{
  sheet.length = 0;
  updateSheetCount();
});

// PDF A4 3×3 di TUTTE le carte nello sheet (fino a 9), fronte+retro
$('#sheetPDF')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  if(sheet.length === 0){ alert('Il foglio è vuoto. Aggiungi almeno 1 carta.'); return; }

  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells, pageW } = layoutA4Grid3x3(CARD_W, CARD_H, GUTTER_X, GUTTER_Y);

  // --- Pagina 1: FRONTI ---
  for (let i=0; i<cells.length; i++){
    const cell = cells[i];
    const item = sheet[i];
    if (!item) break;
    doc.addImage(dataURLFromCanvas(item.front), 'PNG', cell.x, cell.y, cell.w, cell.h);
    drawCropMarks(doc, cell.x, cell.y, cell.w, cell.h, CROP_LEN, CROP_OFF);
  }

  // --- Pagina 2: RETRO (specchiati + micro-offset) ---
  doc.addPage();
  for (let i=0; i<cells.length; i++){
    const cell = cells[i];
    const item = sheet[i];
    if (!item) break;
    const mirroredX = pageW - cell.x - cell.w + BACK_OFFSET_X;
    const y = cell.y + BACK_OFFSET_Y;
    doc.addImage(dataURLFromCanvas(item.back), 'PNG', mirroredX, y, cell.w, cell.h);
    drawCropMarks(doc, mirroredX, y, cell.w, cell.h, CROP_LEN, CROP_OFF);
  }

  doc.save('a4-sheet-3x3-both.pdf');
});

// all’avvio, mostra 0/9
updateSheetCount();
