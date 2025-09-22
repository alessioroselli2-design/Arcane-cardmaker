// /app/esportazione.js — Export PNG/PDF + Foglio 3×3 con carte diverse (front+back, crop marks)

// ========= UTIL =========
const $ = id => document.getElementById(id);
function jsPDForAlert(){
  const PDF = window.jspdf?.jsPDF;
  if (!PDF) alert('jsPDF non disponibile: controlla la connessione o ricarica la pagina.');
  return PDF;
}
function dataURLFromCanvas(url){ return url; }
function downloadDataUrl(dataUrl, filename){
  const a = document.createElement('a');
  a.href = dataUrl; a.download = filename; a.click();
}
function mirrorEnabled(){ return $('#mirrorBack')?.checked === true; }

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
async function getPNGs(){
  // import dinamico: evita problemi di ordine di caricamento su iOS/Safari
  const mod = await import('./card.js');
  return { frontPNG: mod.frontPNG, backPNG: mod.backPNG };
}

function bindExportHandlers(){
  // PNG
  $('#pngFront')?.addEventListener('click', async ()=>{
    try { const {frontPNG} = await getPNGs(); downloadDataUrl(frontPNG(), 'card-front.png'); }
    catch(e){ alert('Errore PNG fronte: ' + (e?.message||e)); }
  });
  $('#pngBack')?.addEventListener('click', async ()=>{
    try { const {backPNG} = await getPNGs(); downloadDataUrl(backPNG(), 'card-back.png'); }
    catch(e){ alert('Errore PNG retro: ' + (e?.message||e)); }
  });

  // PDF singola (centrata)
  $('#pdfSingleFront')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const { frontPNG } = await getPNGs();
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { w, h } = layoutA4Grid3x3().cells[0];
    const x = (210 - w)/2, y = (297 - h)/2;
    doc.addImage(dataURLFromCanvas(frontPNG()), 'PNG', x, y, w, h);
    doc.save('card-front.pdf');
  });
  $('#pdfSingleBack')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const { backPNG } = await getPNGs();
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { w, h } = layoutA4Grid3x3().cells[0];
    const x = (210 - w)/2, y = (297 - h)/2;
    doc.addImage(dataURLFromCanvas(backPNG()), 'PNG', x, y, w, h);
    doc.save('card-back.pdf');
  });

  // A4 3×3 – stessa carta FRONTI
  $('#pdfA4Front')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const { frontPNG } = await getPNGs();
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells } = layoutA4Grid3x3();
    const fUrl = frontPNG();
    cells.forEach(cell=>{
      doc.addImage(dataURLFromCanvas(fUrl),'PNG',cell.x,cell.y,cell.w,cell.h);
      drawCropMarks(doc,cell.x,cell.y,cell.w,cell.h);
    });
    doc.save('a4-fronts-3x3.pdf');
  });

  // A4 3×3 – stessa carta RETRO
  $('#pdfA4Back')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const { backPNG } = await getPNGs();
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3();
    const bUrl = backPNG();
    cells.forEach(cell=>{
      const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
      doc.addImage(dataURLFromCanvas(bUrl),'PNG',xBack,cell.y,cell.w,cell.h);
      drawCropMarks(doc,xBack,cell.y,cell.w,cell.h);
    });
    doc.save('a4-backs-3x3.pdf');
  });

  // A4 3×3 – FRONT+BACK
  $('#pdfA4Both')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    const { frontPNG, backPNG } = await getPNGs();
    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3();

    // pagina 1: fronti
    const fUrl = frontPNG();
    cells.forEach(cell=>{
      doc.addImage(dataURLFromCanvas(fUrl),'PNG',cell.x,cell.y,cell.w,cell.h);
      drawCropMarks(doc,cell.x,cell.y,cell.w,cell.h);
    });

    // pagina 2: retro
    const bUrl = backPNG();
    doc.addPage();
    cells.forEach(cell=>{
      const xBack = mirrorEnabled() ? (pageW - cell.x - cell.w) : cell.x;
      doc.addImage(dataURLFromCanvas(bUrl),'PNG',xBack,cell.y,cell.w,cell.h);
      drawCropMarks(doc,xBack,cell.y,cell.w,cell.h);
    });

    doc.save('a4-both-3x3.pdf');
  });

  // ===== FOGLIO 3×3 (carte diverse) =====
  $('#sheetAdd')?.addEventListener('click', async ()=>{
    if (sheet.length >= 9){ alert('Hai già 9 carte nel foglio.'); return; }
    try{
      const { frontPNG, backPNG } = await getPNGs();
      sheet.push({ front: frontPNG(), back: backPNG() });
      updateSheetCount();
    }catch(e){
      alert('Errore nel catturare la carta: ' + (e?.message||e));
    }
  });

  $('#sheetClear')?.addEventListener('click',()=>{
    sheet.length = 0; updateSheetCount();
  });

  $('#sheetPDF')?.addEventListener('click', async ()=>{
    const PDF = jsPDForAlert(); if(!PDF) return;
    if (sheet.length === 0){ alert('Il foglio è vuoto. Aggiungi almeno 1 carta.'); return; }

    const doc = new PDF({ unit:'mm', format:'a4' });
    const { cells, pageW } = layoutA4Grid3x3(CARD_W, CARD_H, GUTTER_X, GUTTER_Y);

    // Pagina 1: FRONTI
    for (let i=0; i<cells.length; i++){
      const cell = cells[i];
      const item = sheet[i];
      if (!item) break;
      doc.addImage(dataURLFromCanvas(item.front),'PNG',cell.x,cell.y,cell.w,cell.h);
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
      doc.addImage(dataURLFromCanvas(item.back),'PNG',xBack,yBack,cell.w,cell.h);
      drawCropMarks(doc,xBack,yBack,cell.w,cell.h,CROP_LEN,CROP_OFF);
    }

    doc.save('a4-sheet-3x3-both.pdf');
  });

  updateSheetCount();
}

// Avvio sicuro (iPhone/Safari)
if (document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', bindExportHandlers);
} else {
  bindExportHandlers();
}
