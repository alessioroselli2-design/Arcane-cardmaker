// auth.js — Login/Ospite/Logout + Libreria Cloud usando window._fb (nessuna init qui)

import { snapshot, applySnap, frontPNG, backPNG } from './card.js';

const $ = id => document.getElementById(id);

const welcome    = $('welcome');
const userStatus = $('userStatus');
const btnLogout  = $('btnLogout');
const cloudBox   = $('cloudLibrary');

function fb() {
  if (!window._fb) throw new Error("Firebase non inizializzato (manca firebase.js o ordine script).");
  return window._fb;
}

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
  const { auth, signInWithEmailAndPassword } = fb();
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
  const { auth, createUserWithEmailAndPassword } = fb();
  const e = $('email')?.value.trim(), p = $('password')?.value;
  if(!e || !p) return alert('Email e password richieste');
  try{
    await createUserWithEmailAndPassword(auth, e, p);
    if ($('dontShow')?.checked) localStorage.setItem('cm_hide_welcome','true');
    if (welcome) welcome.style.display = 'none';
    cloudPull(true);
  }catch(err){ alert(err.message); }
});
btnLogout?.addEventListener('click', ()=>{
  const { auth, signOut } = fb();
  signOut(auth);
});

// stato auth
(function initAuthWatcher(){
  const { auth, onAuthStateChanged } = fb();
  onAuthStateChanged(auth, (u)=>{
    setAuthUI(u);
    if(!u){
      const hide = localStorage.getItem('cm_hide_welcome') === 'true';
      if (!hide && welcome) welcome.style.display = 'flex';
      if (cloudBox) cloudBox.innerHTML = '';
    }
  });
})();

/* ====== SALVA SU CLOUD (stato completo + asset) ====== */
$('btnCloudSave')?.addEventListener('click', async ()=>{
  const { auth, db, st, serverTimestamp, collection, doc, setDoc, sRef, uploadString, getDownloadURL } = fb();
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  const cardName = ($('cardName')?.value || 'Carta senza nome').trim();
  const deck     = ($('deckName')?.value || '').trim();

  try{
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

    // Simbolo custom (se in futuro salvi un dataURL dedicato nel tuo state, caricalo qui)
    let urlClass = null;

    const urlThumb = await up(thumbDataURL, `${base}/thumb.png`);

    // Documento Firestore: owner + stato completo + asset
    const payload = {
      owner: user.uid,
      name: cardName,
      deck,
      updatedAt: serverTimestamp(),
      thumb: urlThumb,
      state: dataStateOnly,
      assets: { front: urlFront, back: urlBack, class: urlClass }
    };

    await setDoc(docRef, payload);
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
  const { auth, db, collection, query, orderBy, getDocs, doc, deleteDoc, st, sRef, deleteObject } = fb();
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

    if (snap.empty){
      cloudBox.innerHTML = '<div class="tag">Nessuna carta nel cloud. Salva su cloud per vederla qui.</div>';
      if(openPanel) scrollIntoViewSmooth(cloudBox);
      return;
    }

    cloudBox.innerHTML = '';
    snap.forEach(d=>{
      const it = d.data();
      const row = document.createElement('div'); row.className='cardRow';

      // Thumb o immagine fronte
      const img = document.createElement('img');
      img.src = it.thumb || it.assets?.front || '';

      const meta = document.createElement('div'); meta.className='meta';
      meta.innerHTML = `<div><strong>${it.name || '(senza nome)'}</strong> ${it.deck?`<span class="tag">• ${it.deck}</span>`:''}</div>`;

      const acts = document.createElement('div');
      acts.style.display='flex'; acts.style.flexDirection='column'; acts.style.gap='6px';

      // Carica: ricostruisci dallo stato completo + asset
      const bLoad = document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
      bLoad.onclick = async ()=>{
        const cardState = it.state || {};
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
