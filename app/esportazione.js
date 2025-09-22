// /app/esportazione.js — Export PNG/PDF + Foglio 3×3 con carte diverse (front+back, crop marks)
// Versione “a prova di iPhone”: nessun import; PNG presi direttamente dai canvas.

// ========= UTIL =========
const $ = id => document.getElementById(id);
function jsPDForAlert(){
  const PDF = window.jspdf?.jsPDF;
  if (!PDF) alert('jsPDF non disponibile: controlla la connessione o ricarica la pagina.');
  return PDF;
}
function downloadDataUrl(dataUrl, filename){
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename; a.click();
}
function mirrorEnabled(){ return $('#mirrorBack')?.checked === true; }

// Prende i PNG direttamente dai canvas
function getFrontPNG(){
  const c = $('#cardFront');
  if (!c) throw new Error('Canvas fronte non trovato');
  return c.toDataURL('image/png');
}
function getBackPNG(){
  const c = $('#cardBack');
  if (!c) throw new Error('Canvas retro non trovato');
  return c.toDataURL('image/png');
}

// Segni di taglio
function drawCropMarks(doc, x, y, w, h, len=3, off=1){
  const l = len, o = off;
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

// Layout A4 3×3
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

// ========= CONFIG “TIPOGRAFICA” =========
const CARD_W = 63;     // mm
const CARD_H = 88;     // mm
const GUTTER_X = 5;    // mm
const GUTTER_Y = 5;    // mm
const CROP_LEN = 3;    // mm
const CROP_OFF = 1;    // mm
const BACK_OFFSET_X = 0;   // mm
const BACK_OFFSET_Y = 0;   // mm

// Foglio 3×3 (carte diverse)
const sheet = [];
function updateSheetCount(){
  const el = $('#sheetCountHint');
  if (el) el.textContent = `${sheet.length}/9`;
}

// ========= HANDLERS =========
function bindExportHandlers(){
  // PNG
  $('#pngFront')?.addEventListener('click', ()=>{
    try { downloadDataUrl(getFrontPNG(), 'card-front.png'); }
    catch(e){ alert('Errore PNG fronte: ' + (e?.message||e)); }
  });
  $('#pngBack')?.addEventListener('click', ()=>{
    try { downloadDataUrl(getBackPNG(), 'card-back.png'); }
    catch(e){ alert('Errore PNG retro: ' + (e?.message||e)); }
  });

  // PDF singola (centrata)
  $('#pdfSingleFront')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { w, h } = layoutA4Grid3x3().cells[0];
    const x = (210 - w)/2, y = (297 - h)/2;
    doc.addImage(getFrontPNG(), 'PNG', x, y, w, h);
    doc.save('card-front.pdf');
  });
  $('#pdfSingleBack')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { w, h } = layoutA4Grid3x3().cells[0];
    const x = (210 - w)/2, y = (297 - h)/2;
    doc.addImage(getBackPNG(), 'PNG', x, y, w, h);
    doc.save('card-back.pdf');
  });

  // A4 3×3 – stessa carta FRONTI
  $('#pdfA4Front')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells } = layoutA4Grid3x3();
    const fUrl = getFrontPNG();
    cells.forEach(cell=>{
      doc.addImage(fUrl,'PNG',cell.x,cell.y,cell.w,cell.h);
      drawCropMarks(doc,cell.x,cell.y,cell.w,cell.h);
    });
    doc.save('a4-fronts-3x3.pdf');
  });

  // A4 3×3 – stessa carta RETRO
  $('#pdfA4Back')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3();
    const bUrl = getBackPNG();
    cells.forEach(cell=>{
      const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
      doc.addImage(bUrl,'PNG',xBack,cell.y,cell.w,cell.h);
      drawCropMarks(doc,xBack,cell.y,cell.w,cell.h);
    });
    doc.save('a4-backs-3x3.pdf');
  });

  // A4 3×3 – FRONT+BACK
  $('#pdfA4Both')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3();

    // pagina 1: fronti
    const fUrl = getFrontPNG();
    cells.forEach(cell=>{
      doc.addImage(fUrl,'PNG',cell.x,cell.y,cell.w,cell.h);
      drawCropMarks(doc,cell.x,cell.y,cell.w,cell.h);
    });

    // pagina 2: retro
    const bUrl = getBackPNG();
    doc.addPage();
    cells.forEach(cell=>{
      const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
      doc.addImage(bUrl,'PNG',xBack,cell.y,cell.w,cell.h);
      drawCropMarks(doc,xBack,cell.y,cell.w,cell.h);
    });

    doc.save('a4-both-3x3.pdf');
  });

  // ===== FOGLIO 3×3 (carte diverse) =====
  $('#sheetAdd')?.addEventListener('click', ()=>{
    if (sheet.length >= 9){ alert('Hai già 9 carte nel foglio.'); return; }
    try{
      sheet.push({ front: getFrontPNG(), back: getBackPNG() });
      updateSheetCount();
    }catch(e){
      alert('Errore nel catturare la carta: ' + (e?.message||e));
    }
  });

  $('#sheetClear')?.addEventListener('click',()=>{
    sheet.length = 0; updateSheetCount();
  });

  $('#sheetPDF')?.addEventListener('click', ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    if (sheet.length === 0){ alert('Il foglio è vuoto. Aggiungi almeno 1 carta.'); return; }

    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3(CARD_W, CARD_H, GUTTER_X, GUTTER_Y);

    // Pagina 1: FRONTI
    for (let i=0; i<cells.length; i++){
      const cell = cells[i];
      const item = sheet[i];
      if (!item) break;
      doc.addImage(item.front,'PNG',cell.x,cell.y,cell.w,cell.h);
      drawCropMarks(doc,cell.x,cell.y,cell.w,cell.h,CROP_LEN,CROP_OFF);
    }

    // Pagina 2: RETRO (specchiati + micro-offset)
    doc.addPage();
    for (let i=0; i<cells.length; i++){
      const cell = cells[i];
      const item = sheet[i];
      if (!item) break;
      const xBack = (mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x) + BACK_OFFSET_X;
      const yBack = cell.y + BACK_OFFSET_Y;
      doc.addImage(item.back,'PNG',xBack,yBack,cell.w,cell.h);
      drawCropMarks(doc,xBack,yBack,cell.w,cell.h,CROP_LEN,CROP_OFF);
    }

    doc.save('a4-sheet-3x3-both.pdf');
  });

  // contatore iniziale
  updateSheetCount();
}

// Avvio sicuro (iPhone/Safari)
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', bindExportHandlers);
} else {
  bindExportHandlers();
}
