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

// ==== HELPERS ====
const $ = (id)=>document.getElementById(id);

function downloadDataUrl(dataUrl, filename){
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

// Rileva se “Specchia retro” è attivo
function mirrorEnabled(){
  return document.getElementById('mirrorBack')?.checked === true;
}

// ==== EXPORT ESISTENTI ====

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

// PDF singola (fronte)
$('#pdfSingleFront')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells } = layoutA4Grid3x3();
  const { w:cardW, h:cardH } = cells[0];
  const page = {w:210, h:297};

  const url = frontPNG();
  const x = (page.w - cardW)/2, y = (page.h - cardH)/2;
  doc.addImage(dataURLFromCanvas(url), 'PNG', x, y, cardW, cardH);
  doc.save('card-front.pdf');
});

// PDF singola (retro)
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

// PDF A4 3×3 (fronti uguali)
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

// PDF A4 3×3 (retro uguali)
$('#pdfA4Back')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells, pageW } = layoutA4Grid3x3();
  const url = backPNG();

  cells.forEach(cell=>{
    const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
    doc.addImage(dataURLFromCanvas(url), 'PNG', xBack, cell.y, cell.w, cell.h);
    drawCropMarks(doc, xBack, cell.y, cell.w, cell.h);
  });

  doc.save('a4-backs-3x3.pdf');
});

// PDF A4 3×3 (fronte+retro uguali)
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

  // page 2: retro
  doc.addPage();
  cells.forEach(cell=>{
    const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
    doc.addImage(dataURLFromCanvas(bUrl), 'PNG', xBack, cell.y, cell.w, cell.h);
    drawCropMarks(doc, xBack, cell.y, cell.w, cell.h);
  });

  doc.save('a4-both-3x3.pdf');
});

// ==== NUOVO: Foglio 3×3 con carte diverse ====

// Config tipografica
const CARD_W = 63; const CARD_H = 88;
const GUTTER_X = 5, GUTTER_Y = 5;
const CROP_LEN = 3, CROP_OFF = 1;
const BACK_OFFSET_X = 0, BACK_OFFSET_Y = 0;

const sheet = [];
function updateSheetCount(){
  const el = document.getElementById('sheetCountHint');
  if (el) el.textContent = `${sheet.length}/9`;
}

$('#sheetAdd')?.addEventListener('click',()=>{
  if (sheet.length >= 9){
    alert('Hai già 9 carte nel foglio.');
    return;
  }
  try{
    sheet.push({ front:frontPNG(), back:backPNG() });
    updateSheetCount();
  }catch(e){
    alert('Errore nel catturare la carta: '+(e?.message||e));
  }
});

$('#sheetClear')?.addEventListener('click',()=>{
  sheet.length = 0;
  updateSheetCount();
});

$('#sheetPDF')?.addEventListener('click',()=>{
  if(!jsPDF){ alert('jsPDF non disponibile'); return; }
  if(sheet.length === 0){ alert('Il foglio è vuoto.'); return; }

  const doc = new jsPDF({ unit:'mm', format:'a4' });
  const { cells, pageW } = layoutA4Grid3x3(CARD_W, CARD_H, GUTTER_X, GUTTER_Y);

  // page 1: fronti
  for (let i=0; i<cells.length; i++){
    const cell = cells[i], item = sheet[i];
    if (!item) break;
    doc.addImage(dataURLFromCanvas(item.front), 'PNG', cell.x, cell.y, cell.w, cell.h);
    drawCropMarks(doc, cell.x, cell.y, cell.w, cell.h, CROP_LEN, CROP_OFF);
  }

  // page 2: retro
  doc.addPage();
  for (let i=0; i<cells.length; i++){
    const cell = cells[i], item = sheet[i];
    if (!item) break;
    const xBase = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
    const x = xBase + BACK_OFFSET_X;
    const y = cell.y + BACK_OFFSET_Y;
    doc.addImage(dataURLFromCanvas(item.back), 'PNG', x, y, cell.w, cell.h);
    drawCropMarks(doc, x, y, cell.w, cell.h, CROP_LEN, CROP_OFF);
  }

  doc.save('a4-sheet-3x3-both.pdf');
});

updateSheetCount();
