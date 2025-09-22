// /app/esportazione.js — Export PNG/PDF + Foglio 3×3 (carte diverse) + crop marks
// Versione super-robusta per iPhone/Safari: nessun import, binding ridondante, download compatibile.

(function(){
  // ---------- UTIL ----------
  function $(id){ return document.getElementById(id); }

  function jsPDForAlert(){
    const PDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : null;
    if (!PDF) alert('jsPDF non disponibile. Controlla la connessione o ricarica la pagina.');
    return PDF;
  }

  // Download compatibile iOS: prova <a download>, se fallisce apri nuova scheda
  function downloadDataUrl(dataUrl, filename){
    try{
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename || 'download';
      // Su iOS spesso serve appendere al DOM
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{ try{ document.body.removeChild(a); }catch{} }, 0);
    }catch(e){
      // Fallback iOS: apri nuova scheda (l’utente potrà salvare)
      try{ window.open(dataUrl, '_blank'); }catch{}
    }
  }

  function mirrorEnabled(){ var el=$('mirrorBack'); return !!(el && el.checked); }

  // PNG direttamente dai canvas (niente import)
  function getFrontPNG(){
    const c = $('cardFront');
    if (!c) throw new Error('Canvas fronte non trovato');
    return c.toDataURL('image/png');
  }
  function getBackPNG(){
    const c = $('cardBack');
    if (!c) throw new Error('Canvas retro non trovato');
    return c.toDataURL('image/png');
  }

  // Segni di taglio
  function drawCropMarks(doc, x, y, w, h, len, off){
    len = (typeof len==='number')?len:3;
    off = (typeof off==='number')?off:1;
    doc.setLineWidth(0.2);
    // TL
    doc.line(x - off - len, y - off,         x - off,         y - off);
    doc.line(x - off,        y - off - len,  x - off,         y - off);
    // TR
    doc.line(x + w + off,    y - off,        x + w + off + len, y - off);
    doc.line(x + w + off,    y - off - len,  x + w + off,       y - off);
    // BL
    doc.line(x - off - len,  y + h + off,    x - off,           y + h + off);
    doc.line(x - off,        y + h + off,    x - off,           y + h + off + len);
    // BR
    doc.line(x + w + off,    y + h + off,    x + w + off + len, y + h + off);
    doc.line(x + w + off,    y + h + off,    x + w + off,       y + h + off + len);
  }

  // Layout A4 3×3
  function layoutA4Grid3x3(cardW, cardH, gutterX, gutterY){
    cardW = cardW||63; cardH = cardH||88;
    gutterX = gutterX||5; gutterY = gutterY||5;
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

  // ---------- CONFIG TIPOGRAFICA ----------
  const CARD_W = 63;   // mm
  const CARD_H = 88;   // mm
  const GUTTER_X = 5;  // mm
  const GUTTER_Y = 5;  // mm
  const CROP_LEN = 3;  // mm
  const CROP_OFF = 1;  // mm
  const BACK_OFFSET_X = 0; // micro-allineamento retro (mm)
  const BACK_OFFSET_Y = 0;

  // Foglio 3×3 (carte diverse)
  const sheet = [];
  function updateSheetCount(){
    var el = $('sheetCountHint');
    if (el) el.textContent = sheet.length + '/9';
  }

  // ---------- HANDLERS (delegati + bind diretto) ----------
  function handleClick(e){
    const id = e.target && e.target.id;
    if (!id) return;

    try{
      // PNG
      if (id==='pngFront'){
        downloadDataUrl(getFrontPNG(), 'card-front.png');
      } else if (id==='pngBack'){
        downloadDataUrl(getBackPNG(), 'card-back.png');
      }

      // PDF singola
      else if (id==='pdfSingleFront'){
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const cell = layoutA4Grid3x3().cells[0];
        const x = (210 - cell.w)/2, y = (297 - cell.h)/2;
        doc.addImage(getFrontPNG(), 'PNG', x, y, cell.w, cell.h);
        doc.save('card-front.pdf');
      } else if (id==='pdfSingleBack'){
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const cell = layoutA4Grid3x3().cells[0];
        const x = (210 - cell.w)/2, y = (297 - cell.h)/2;
        doc.addImage(getBackPNG(), 'PNG', x, y, cell.w, cell.h);
        doc.save('card-back.pdf');
      }

      // A4 3×3 — stessa carta
      else if (id==='pdfA4Front'){
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const { cells } = layoutA4Grid3x3();
        const f = getFrontPNG();
        cells.forEach(c=>{
          doc.addImage(f,'PNG',c.x,c.y,c.w,c.h);
          drawCropMarks(doc,c.x,c.y,c.w,c.h);
        });
        doc.save('a4-fronts-3x3.pdf');
      } else if (id==='pdfA4Back'){
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const { cells, pageW } = layoutA4Grid3x3();
        const b = getBackPNG();
        cells.forEach(c=>{
          const x = mirrorEnabled() ? (pageW - c.x - c.w) : c.x;
          doc.addImage(b,'PNG',x,c.y,c.w,c.h);
          drawCropMarks(doc,x,c.y,c.w,c.h);
        });
        doc.save('a4-backs-3x3.pdf');
      } else if (id==='pdfA4Both'){
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const { cells, pageW } = layoutA4Grid3x3();
        const f = getFrontPNG();
        const b = getBackPNG();

        // pag1: fronti
        cells.forEach(c=>{
          doc.addImage(f,'PNG',c.x,c.y,c.w,c.h);
          drawCropMarks(doc,c.x,c.y,c.w,c.h);
        });

        // pag2: retro
        doc.addPage();
        cells.forEach(c=>{
          const x = mirrorEnabled() ? (pageW - c.x - c.w) : c.x;
          doc.addImage(b,'PNG',x,c.y,c.w,c.h);
          drawCropMarks(doc,x,c.y,c.w,c.h);
        });

        doc.save('a4-both-3x3.pdf');
      }

      // FOGLIO 3×3 (carte diverse)
      else if (id==='sheetAdd'){
        if (sheet.length >= 9){ alert('Hai già 9 carte nel foglio.'); return; }
        sheet.push({ front:getFrontPNG(), back:getBackPNG() });
        updateSheetCount();
      } else if (id==='sheetClear'){
        sheet.length = 0; updateSheetCount();
      } else if (id==='sheetPDF'){
        if (sheet.length === 0){ alert('Il foglio è vuoto. Aggiungi almeno 1 carta.'); return; }
        const PDF = jsPDForAlert(); if(!PDF) return;
        const doc = new PDF({ unit:'mm', format:'a4' });
        const { cells, pageW } = layoutA4Grid3x3(CARD_W, CARD_H, GUTTER_X, GUTTER_Y);

        // pag1: fronti
        for (let i=0;i<cells.length;i++){
          const c = cells[i], it = sheet[i];
          if (!it) break;
          doc.addImage(it.front,'PNG',c.x,c.y,c.w,c.h);
          drawCropMarks(doc,c.x,c.y,c.w,c.h,CROP_LEN,CROP_OFF);
        }
        // pag2: retro
        doc.addPage();
        for (let i=0;i<cells.length;i++){
          const c = cells[i], it = sheet[i];
          if (!it) break;
          const x = (mirrorEnabled() ? (pageW - c.x - c.w) : c.x) + BACK_OFFSET_X;
          const y = c.y + BACK_OFFSET_Y;
          doc.addImage(it.back,'PNG',x,y,c.w,c.h);
          drawCropMarks(doc,x,y,c.w,c.h,CROP_LEN,CROP_OFF);
        }
        doc.save('a4-sheet-3x3-both.pdf');
      }
    }catch(err){
      alert('Errore export: ' + (err && err.message ? err.message : err));
    }
  }

  function bindExportHandlers(){
    // Delega globale (se i bottoni vengono re-renderizzati non perdiamo i listener)
    document.addEventListener('click', handleClick);

    // Bind diretto ai bottoni presenti (aiuta Safari vecchi)
    [
      'pngFront','pngBack',
      'pdfSingleFront','pdfSingleBack',
      'pdfA4Front','pdfA4Back','pdfA4Both',
      'sheetAdd','sheetClear','sheetPDF'
    ].forEach(id=>{
      const el = $(id);
      if (el) el.addEventListener('click', handleClick);
    });

    // Aggiorna contatore foglio
    updateSheetCount();
  }

  // Avvio sicuro
  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', bindExportHandlers);
  } else {
    bindExportHandlers();
  }
})();
