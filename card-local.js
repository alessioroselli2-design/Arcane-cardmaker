// card-local.js — libreria locale: salva / lista / carica / elimina (niente JSON)

import { snapshot, applySnap, frontPNG } from './card.js';

const $ = s => document.querySelector(s);
const box = $('#localLibrary');
const btnSave = $('#saveLocal');
const btnOpen = $('#loadLocal');

const LS_KEY = 'acm_local_cards_v1';

function readAll(){
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '{}'); }
  catch { return {}; }
}
function writeAll(map){
  localStorage.setItem(LS_KEY, JSON.stringify(map));
}

function saveLocal(){
  const name = ($('#cardName')?.value || $('#title')?.value || '').trim() || `Carta ${new Date().toLocaleString()}`;
  const map = readAll();
  const state = snapshot(false); // stato completo (senza blob)
  let thumb = '';
  try{ thumb = frontPNG(); }catch{}
  map[name] = { name, savedAt: Date.now(), state, thumb };
  writeAll(map);
  alert('Salvato in locale ✅');
}

function renderLocalList(){
  const map = readAll();
  const items = Object.values(map).sort((a,b)=> (b.savedAt||0)-(a.savedAt||0));
  box.style.display = 'block';
  if (!items.length){
    box.innerHTML = '<div class="muted">Nessun salvataggio locale.</div>';
    return;
  }
  const frag = document.createDocumentFragment();
  items.forEach(it=>{
    const row = document.createElement('div'); row.className='lib-row';

    const img = document.createElement('img'); img.className='lib-thumb'; img.src = it.thumb || ''; row.appendChild(img);

    const meta = document.createElement('div'); meta.className='lib-meta';
    const t = document.createElement('div'); t.className='lib-title'; t.textContent = it.name || 'Senza nome';
    const sub = document.createElement('div'); sub.className='lib-sub'; sub.textContent = new Date(it.savedAt||Date.now()).toLocaleString();
    meta.append(t, sub); row.appendChild(meta);

    const acts = document.createElement('div'); acts.className='lib-actions';

    const bLoad = document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
    bLoad.onclick = ()=>{ try{ applySnap(it.state || {}); alert('Carta caricata dal locale ✅'); }catch(e){ console.error(e); alert('Impossibile caricare.'); } };

    const bDel = document.createElement('button'); bDel.className='btn danger'; bDel.textContent='Elimina';
    bDel.onclick = ()=>{
      if(!confirm('Eliminare questo salvataggio locale?')) return;
      const map2 = readAll(); delete map2[it.name]; writeAll(map2); renderLocalList();
    };

    acts.append(bLoad, bDel);
    row.appendChild(acts);
    frag.appendChild(row);
  });
  box.innerHTML = ''; box.appendChild(frag);
}

// Eventi UI
btnSave?.addEventListener('click', (e)=>{ e.preventDefault(); saveLocal(); });
btnOpen?.addEventListener('click', (e)=>{ e.preventDefault(); renderLocalList(); });
