// auth.js — Login/Ospite/Logout + Libreria Cloud (Firestore+Storage) con SALVATAGGIO COMPLETO + debug

import { snapshot, applySnap, frontPNG, backPNG } from './card.js';

// Firebase (modulare)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, serverTimestamp, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref as sRef, uploadString, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

/* ==== TUA CONFIG FIREBASE ==== */
const firebaseConfig = {
  apiKey: "AIzaSyC2yGBahkZpzd4bRsIHThpUHTl1TtpSwKI",
  authDomain: "cardmaker-15cf5.firebaseapp.com",
  projectId: "cardmaker-15cf5",
  storageBucket: "cardmaker-15cf5.firebasestorage.app",
  messagingSenderId: "782546269609",
  appId: "1:782546269609:web:934c5740d007558bb900b8",
  measurementId: "G-W68B78G600"
};
/* ================================= */

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const st   = getStorage(app);

const $ = id => document.getElementById(id);
const welcome    = $('welcome');
const userStatus = $('userStatus');
const btnLogout  = $('btnLogout');
const cloudBox   = $('cloudLibrary');

function setAuthUI(user){
  const logged = !!user;
  if(btnLogout) btnLogout.style.display = logged ? '' : 'none';
  const cloudSection = document.querySelector('[data-auth="only"]');
  if (cloudSection) cloudSection.style.display = logged ? '' : 'none';
  if (userStatus) userStatus.textContent = logged ? (user.email || 'Utente') : 'Ospite';
}

/* ====== Welcome / Accesso ====== */
$('btnGuest')?.addEventListener('click', ()=>{
  if ($('dontShow')?.checked) localStorage.setItem('cm_hide_welcome','true');
  if (welcome) welcome.style.display = 'none';
});
$('btnLogin')?.addEventListener('click', async ()=>{
  const e = $('email')?.value.trim(), p = $('password')?.value;
  if(!e || !p) return alert('Email e password richieste');
  try{
    await signInWithEmailAndPassword(auth, e, p);
    if ($('dontShow')?.checked) localStorage.setItem('cm_hide_welcome','true');
    if (welcome) welcome.style.display = 'none';
    cloudPull(true);
  }catch(err){ alert(err.message); }
});
$('btnSignup')?.addEventListener('click', async ()=>{
  const e = $('email')?.value.trim(), p = $('password')?.value;
  if(!e || !p) return alert('Email e password richieste');
  try{
    await createUserWithEmailAndPassword(auth, e, p);
    if ($('dontShow')?.checked) localStorage.setItem('cm_hide_welcome','true');
    if (welcome) welcome.style.display = 'none';
    cloudPull(true);
  }catch(err){ alert(err.message); }
});
btnLogout?.addEventListener('click', ()=>signOut(auth));

onAuthStateChanged(auth, (u)=>{
  setAuthUI(u);
  if(!u){
    const hide = localStorage.getItem('cm_hide_welcome') === 'true';
    if (!hide && welcome) welcome.style.display = 'flex';
    if (cloudBox) cloudBox.innerHTML = '';
  }
});

/* ====== SALVA SU CLOUD (stato completo + asset) ====== */
$('btnCloudSave')?.addEventListener('click', async ()=>{
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  const cardName = ($('cardName')?.value || 'Carta senza nome').trim();
  const deck     = ($('deckName')?.value || '').trim();

  try{
    console.log('[cloudSave] start');
    // Stato COMPLETO senza base64 (evita limite 1MiB)
    const dataStateOnly = snapshot(false);

    // Thumb dal fronte
    const thumbDataURL = frontPNG();

    // Documento + percorsi Storage
    const docRef = doc(collection(db, 'users', user.uid, 'cards'));
    const base   = `users/${user.uid}/cards/${docRef.id}`;

    // Helper upload dataURL -> Storage
    const up = async (dataUrl, path) => {
      if(!dataUrl) return null;
      const ref = sRef(st, path);
      await uploadString(ref, dataUrl, 'data_url');
      return await getDownloadURL(ref);
    };

    // PNG fronte/retro generati dai canvas
    const urlFront = await up(frontPNG(), `${base}/front.png`);
    let urlBack = null;
    try { urlBack = await up(backPNG(), `${base}/back.png`); } catch{}

    // Simbolo custom (se la tua app mantiene un dataURL nel tuo state, caricalo qui)
    let urlClass = null;
    // Esempio (decommenta se salvi _imgClass in snapshot(false)):
    // if (dataStateOnly._imgClass) urlClass = await up(dataStateOnly._imgClass, `${base}/class.png`);

    const urlThumb = await up(thumbDataURL, `${base}/thumb.png`);

    // Documento Firestore: owner + stato completo + asset
    const payload = {
      owner: user.uid,               // <--- aggiunto per tracciabilità/filtri
      name: cardName,
      deck,
      updatedAt: serverTimestamp(),
      thumb: urlThumb,
      state: dataStateOnly,          // definizione completa della carta (senza blob)
      assets: { front: urlFront, back: urlBack, class: urlClass } // file su Storage
    };

    await setDoc(docRef, payload);
    console.log('[cloudSave] done:', docRef.id);

    alert('Carta salvata su cloud ✅');
    await cloudPull(true);
  }catch(err){
    console.error('[cloudSave] error', err);
    alert('Errore salvataggio cloud: ' + err.message);
  }
});

/* ====== LIBRERIA CLOUD ====== */
$('btnCloudPull')?.addEventListener('click', ()=> cloudPull(true));

async function cloudPull(openPanel=false){
  console.log('[cloudPull] start');
  const user = auth.currentUser;
  if(!cloudBox) return;
  if(!user){
    cloudBox.innerHTML = '<div class="tag">Accedi per vedere la tua libreria cloud.</div>';
    return;
  }

  cloudBox.innerHTML = '<div class="tag">Carico libreria…</div>';

  try{
    const qref = query(collection(db,'users',user.uid,'cards'), orderBy('updatedAt','desc'));
    const snap = await getDocs(qref);
    console.log('[cloudPull] docs:', snap.size);

    if (snap.empty){
      cloudBox.innerHTML = '<div class="tag">Nessuna carta nel cloud. Salva su cloud per vederla qui.</div>';
      if(openPanel) scrollIntoViewSmooth(cloudBox);
      return;
    }

    cloudBox.innerHTML = '';
    snap.forEach(d=>{
      const it = d.data();
      const row = document.createElement('div'); row.className='cardRow';

      // Thumb o immagine fronte se manca la thumb
      const img = document.createElement('img');
      img.src = it.thumb || it.assets?.front || '';

      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `<div><strong>${it.name || '(senza nome)'}</strong> ${it.deck?`<span class="tag">• ${it.deck}</span>`:''}</div>`;

      const acts = document.createElement('div');
      acts.style.display='flex'; acts.style.flexDirection='column'; acts.style.gap='6px';

      // Carica: ricostruisci dallo stato completo + asset
      const bLoad = document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
      bLoad.onclick = async ()=>{
        console.log('[cloudLoad] load doc', d.id);
        const cardState = it.state || {};
        // collega asset (se esistono) per ricaricare immagini dal cloud
        if (it.assets?.front) cardState._imgFront = it.assets.front;
        if (it.assets?.back)  cardState._imgBack  = it.assets.back;
        if (it.assets?.class) cardState._imgClass = it.assets.class;

        applySnap(cardState);

        const nameField = $('cardName'); const deckField = $('deckName');
        if(nameField) nameField.value = it.name || '';
        if(deckField) deckField.value = it.deck || '';

        alert('Carta caricata dalla libreria cloud ✅');
      };

      // Elimina: rimuove doc + (opzionale) file associati
      const bDel = document.createElement('button'); bDel.className='btn'; bDel.textContent='Elimina';
      bDel.onclick = async ()=>{
        if(!confirm('Eliminare questa carta dal cloud?')) return;
        await deleteDoc(doc(collection(db,'users',user.uid,'cards'), d.id));
        try{
          const base = `users/${user.uid}/cards/${d.id}`;
          const del = async path => { try{ await deleteObject(sRef(st, path)); }catch{} };
          await Promise.all([
            del(`${base}/front.png`),
            del(`${base}/back.png`),
            del(`${base}/thumb.png`),
            del(`${base}/class.png`)
          ]);
        }catch{}
        cloudPull(false);
      };

      acts.appendChild(bLoad); acts.appendChild(bDel);
      row.appendChild(img); row.appendChild(meta); row.appendChild(acts);
      cloudBox.appendChild(row);
    });

    if(openPanel) scrollIntoViewSmooth(cloudBox);
  }catch(err){
    console.error('[cloudPull] error', err);
    cloudBox.innerHTML = '<div class="tag">Errore nel caricamento della libreria.</div>';
    alert('Errore libreria cloud: ' + err.message);
  }
}

function scrollIntoViewSmooth(el){
  try{ el.scrollIntoView({behavior:'smooth', block:'start'}); }catch{}
}

/* ====== Mostra welcome a avvio (se non nascosto) ====== */
(function(){
  const p = new URLSearchParams(location.search);
  const force = p.get('welcome') === '1';
  const hide  = localStorage.getItem('cm_hide_welcome') === 'true';
  if (force){ localStorage.removeItem('cm_hide_welcome'); if (welcome) welcome.style.display='flex'; }
  else if (hide){ if (welcome) welcome.style.display='none'; }
  else { if (welcome) welcome.style.display='flex'; }
})();
