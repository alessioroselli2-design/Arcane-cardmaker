// /app/esportazione.js — Export PNG/PDF + Foglio 3×3 (carte diverse) + crop marks
// Versione super-robusta per iPhone/Safari: nessun import, binding ridondante, download compatibile.
// Ora con messaggi e contatore localizzati (IT/EN/ES/DE) via window.intl se disponibile.

(function(){
  // ---------- i18n (soft) ----------
  // Prova a leggere da window.intl, altrimenti usa fallback qui sotto.
  const FALLBACK = {
    it: {
      jsPDF_missing: 'jsPDF non disponibile. Controlla la connessione o ricarica la pagina.',
      sheet_full: 'Hai già 9 carte nel foglio.',
      sheet_empty: 'Il foglio è vuoto. Aggiungi almeno 1 carta.',
      export_error_prefix: 'Errore esportazione: ',
      front_canvas_missing: 'Canvas fronte non trovato',
      back_canvas_missing: 'Canvas retro non trovato',
      sheet_count: '{n}/9 carte'
    },
    en: {
      jsPDF_missing: 'jsPDF not available. Check your connection or reload the page.',
      sheet_full: 'You already have 9 cards on the sheet.',
      sheet_empty: 'The sheet is empty. Add at least 1 card.',
      export_error_prefix: 'Export error: ',
      front_canvas_missing: 'Front canvas not found',
      back_canvas_missing: 'Back canvas not found',
      sheet_count: '{n}/9 cards'
    },
    es: {
      jsPDF_missing: 'jsPDF no disponible. Revisa la conexión o recarga la página.',
      sheet_full: 'Ya tienes 9 cartas en la hoja.',
      sheet_empty: 'La hoja está vacía. Añade al menos 1 carta.',
      export_error_prefix: 'Error de exportación: ',
      front_canvas_missing: 'Lienzo frontal no encontrado',
      back_canvas_missing: 'Lienzo trasero no encontrado',
      sheet_count: '{n}/9 cartas'
    },
    de: {
      jsPDF_missing: 'jsPDF nicht verfügbar. Prüfe die Verbindung oder lade die Seite neu.',
      sheet_full: 'Du hast bereits 9 Karten im Bogen.',
      sheet_empty: 'Der Bogen ist leer. Füge mindestens 1 Karte hinzu.',
      export_error_prefix: 'Exportfehler: ',
      front_canvas_missing: 'Vorderes Canvas nicht gefunden',
      back_canvas_missing: 'Hinteres Canvas nicht gefunden',
      sheet_count: '{n}/9 Karten'
    }
  };

  function getLang(){
    try{
      const cur = (window.intl && window.intl.getLocale && window.intl.getLocale()) || 'it';
      return (['it','en','es','de'].includes(cur)) ? cur : 'it';
    }catch{ return 'it'; }
  }
  function tt(key, fallback, params){
    // prova window.intl
    let s;
    try{ s = window.intl && window.intl.t && window.intl.t(key); }catch{}
    if (!s || s === '') {
      const lang = getLang();
      s = (FALLBACK[lang] && FALLBACK[lang][key]) || fallback || '';
    }
    if (params && typeof s === 'string'){
      Object.keys(params).forEach(k=>{
        s = s.replace(new RegExp(`\\{${k}\\}`,'g'), String(params[k]));
      });
    }
    return s;
  }

  // ---------- UTIL ----------
  function $(id){ return document.getElementById(id); }

  function jsPDForAlert(){
    const PDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : null;
    if (!PDF) alert(tt('jsPDF_missing', FALLBACK.it.jsPDF_missing));
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
    if (!c) throw new Error(tt('front_canvas_missing', FALLBACK.it.front_canvas_missing));
    return c.toDataURL('image/png');
  }
  function getBackPNG(){
    const c = $('cardBack');
    if (!c) throw new Error(tt('back_canvas_missing', FALLBACK.it.back_canvas_missing));
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
    if (el) el.textContent = tt('sheet_count', FALLBACK.it.sheet_count, { n: sheet.length });
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
        if (sheet.length >= 9){ alert(tt('sheet_full', FALLBACK.it.sheet_full)); return; }
        sheet.push({ front:getFrontPNG(), back:getBackPNG() });
        updateSheetCount();
      } else if (id==='sheetClear'){
        sheet.length = 0; updateSheetCount();
      } else if (id==='sheetPDF'){
        if (sheet.length === 0){ alert(tt('sheet_empty', FALLBACK.it.sheet_empty)); return; }
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
      alert(tt('export_error_prefix', FALLBACK.it.export_error_prefix) + (err && err.message ? err.message : err));
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
