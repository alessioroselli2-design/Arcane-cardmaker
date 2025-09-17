// app/share.js — Stub condivisione (Web Share API se disponibile) + util canvas
// Sicuro: se l’API non c’è, fa fallback (copia link)

export function canSystemShare(){
  return !!(navigator.share);
}

export async function shareCard({ title='Arcane CardMaker', text='', url='', files=[] } = {}){
  try{
    if (navigator.share){
      // Se il dispositivo supporta anche file (alcuni mobile)
      if (files.length && navigator.canShare && navigator.canShare({ files })){
        await navigator.share({ title, text, url, files });
      } else {
        await navigator.share({ title, text, url });
      }
      return { ok: true, method: 'web-share' };
    }
  }catch(e){
    return { ok:false, error:e?.message||'share_failed' };
  }

  // Fallback: copia link negli appunti se presente
  try{
    if (url && navigator.clipboard){
      await navigator.clipboard.writeText(url);
      alert('Link copiato negli appunti!');
      return { ok:true, method:'clipboard' };
    }
  }catch{}

  alert('Condivisione non supportata su questo dispositivo.');
  return { ok:false, method:'none' };
}

// Utility: genera Blob/immagine social da un canvas (se vuoi)
// Se canvas manca, restituisce null senza rompere
export function canvasToBlob(canvas, type='image/png', quality=0.92){
  return new Promise(res => {
    if (!canvas || !canvas.toBlob) return res(null);
    canvas.toBlob(b => res(b), type, quality);
  });
}

// Utility: crea un file immagine da canvas (se supportato)
export async function canvasToFile(canvas, filename='card.png', type='image/png'){
  const blob = await canvasToBlob(canvas, type);
  if (!blob) return null;
  try{
    return new File([blob], filename, { type });
  }catch{
    // Safari vecchi non hanno File constructor → fallback non fatale
    return null;
  }
}
