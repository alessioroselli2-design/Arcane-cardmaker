// auth.js — accesso (login/registrazione/ospite) + libreria CLOUD (salva/lista/carica/elimina)

import { snapshot, applySnap, frontPNG, backPNG } from './card.js';

const $  = (id) => document.getElementById(id);
const fb = () => window._fb || (() => { throw new Error("Firebase non inizializzato (controlla firebase.js in index.html)"); })();

// Riferimenti UI
const welcome         = $('welcome');
const userStatus      = $('userStatus');
const btnLogout       = $('btnLogout');
const cloudBox        = $('cloudLibrary');
const btnCloudSave    = $('btnCloudSave');
const btnCloudPull    = $('btnCloudPull');
const btnCloudClear   = $('btnCloudClear');

// Stato UI in base all'autenticazione
function setAuthUI(user){
  const logged = !!user;
  if (btnLogout) btnLogout.style.display = logged ? '' : 'none';
  const cloudSection = document.querySelector('[data-auth="only"]');
  if (cloudSection) cloudSection.style.display = logged ? '' : 'none';
  if (userStatus) userStatus.textContent = logged ? (user.email || 'Account') : 'Ospite';
}

/* ========= Welcome / Accesso ========= */
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
    cloudLoad(true);
  }catch(err){ alert(err?.message || 'Errore di accesso'); }
});

$('btnSignup')?.addEventListener('click', async ()=>{
  const { auth, createUserWithEmailAndPassword } = fb();
  const e = $('email')?.value.trim(), p = $('password')?.value;
  if(!e || !p) return alert('Email e password richieste');
  try{
    await createUserWithEmailAndPassword(auth, e, p);
    if ($('dontShow')?.checked) localStorage.setItem('cm_hide_welcome','true');
    if (welcome) welcome.style.display = 'none';
    cloudLoad(true);
  }catch(err){ alert(err?.message || 'Errore di registrazione'); }
});

btnLogout?.addEventListener('click', ()=>{
  const { auth, signOut } = fb();
  signOut(auth);
});

// Watcher autenticazione
(function initAuthWatcher(){
  const { auth, onAuthStateChanged } = fb();
  onAuthStateChanged(auth, (u)=>{
    setAuthUI(u);
    if(!u){
      const hide = localStorage.getItem('cm_hide_welcome') === 'true';
      if (!hide && welcome) welcome.style.display = 'flex';
      if (cloudBox) { cloudBox.innerHTML = ''; cloudBox.style.display='none'; }
    }
  });
})();

/* ========= Helpers ========= */
function cardsCol(uid){
  const deck = ($('deckName')?.value || '').trim();
  const { db, collection } = fb();
  return deck ? collection(db, 'users', uid, 'decks', deck, 'cards')
              : collection(db, 'users', uid, 'cards');
}

/* ========= CLOUD: SALVA (prima Firestore, poi immagini se possibile) ========= */
btnCloudSave?.addEventListener('click', async ()=>{
  const { auth, serverTimestamp, doc, setDoc, sRef, uploadString, getDownloadURL, st } = fb();
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  const name = ($('cardName')?.value || 'Carta senza nome').trim();

  try{
    // 1) Salva SUBITO lo stato su Firestore (senza dipendere dallo Storage)
    const stateRaw = snapshot(false);
// rimuove undefined/funzioni/oggetti non serializzabili
const state = JSON.parse(JSON.stringify(stateRaw));
    const docRef = doc(cardsCol(user.uid)); // id auto
    await setDoc(docRef, {
      owner: user.uid,
      name,
      deck: ($('deckName')?.value||'').trim() || null,
      updatedAt: serverTimestamp(),
      thumb: null,
      state,
      assets: { front: null, back: null }
    });

    // 2) Prova a caricare le immagini su Storage (best effort: se fallisce, abbiamo già il doc)
    let urlFront = null, urlBack = null, urlThumb = null;
    try{
      const base = `users/${user.uid}/cards/${docRef.id}`;

      const dataFront = frontPNG();
      if (dataFront) {
        const refF = sRef(st, `${base}/front.png`);
        await uploadString(refF, dataFront, 'data_url');
        urlFront = await getDownloadURL(refF);
        urlThumb = urlFront;
      }

      try{
        const dataBack = typeof backPNG === 'function' ? backPNG() : null;
        if (dataBack) {
          const refB = sRef(st, `${base}/back.png`);
          await uploadString(refB, dataBack, 'data_url');
          urlBack = await getDownloadURL(refB);
        }
      }catch(e){ /* nessun retro: ok */ }
    }catch(e){
      console.warn('[cloudSave] Upload immagini saltato:', e?.code || e?.message || e);
    }

    // 3) Aggiorna il doc con gli URL se disponibili
    try{
      await setDoc(docRef, {
        updatedAt: serverTimestamp(),
        thumb: urlThumb || null,
        assets: { front: urlFront || null, back: urlBack || null }
      }, { merge: true });
    }catch(e){
      console.warn('[cloudSave] Update URL asset fallito:', e?.code || e?.message || e);
    }

    alert('Carta salvata su cloud ✅');
    await cloudLoad(true);

  }catch(err){
    console.error('[cloudSave] error', err);
    alert('Errore salvataggio cloud: ' + (err?.code || err?.message || err));
  }
});

/* ========= CLOUD: LISTA / CARICA / ELIMINA ========= */
btnCloudPull?.addEventListener('click', ()=> cloudLoad(true));

async function cloudLoad(scrollInto=true){
  const { auth, query, orderBy, getDocs, doc, deleteDoc, st, sRef, deleteObject } = fb();
  const user = auth.currentUser;
  if(!cloudBox) return;

  cloudBox.style.display='block';

  if(!user){
    cloudBox.innerHTML = '<div class="muted">Accedi per vedere la libreria cloud.</div>';
    return;
  }

  cloudBox.innerHTML = '<div class="muted">Caricamento…</div>';

  try{
    const qref = orderBy ? fb().query(cardsCol(user.uid), orderBy('updatedAt','desc'))
                         : fb().query(cardsCol(user.uid));
    const snap = await getDocs(qref);

    if (snap.empty){
      cloudBox.innerHTML = '<div class="muted">Nessuna carta sul cloud.</div>';
      return;
    }

    const frag = document.createDocumentFragment();
    snap.forEach(d=>{
      const it = d.data();
      const row = document.createElement('div'); row.className='lib-row';

      const img = document.createElement('img'); img.className='lib-thumb';
      img.src = it.thumb || it.assets?.front || ''; row.appendChild(img);

      const meta = document.createElement('div'); meta.className='lib-meta';
      const title = document.createElement('div'); title.className='lib-title';
      title.textContent = it.name || '(senza nome)';
      const sub = document.createElement('div'); sub.className='lib-sub';
      sub.textContent = it.deck ? `Cloud · ${it.deck}` : 'Cloud';
      meta.append(title, sub); row.appendChild(meta);

      const acts = document.createElement('div'); acts.className='lib-actions';

      const bLoad = document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
      bLoad.onclick = ()=>{
        const st = it.state || {};
        if (it.assets?.front) st._imgFront = it.assets.front;
        if (it.assets?.back)  st._imgBack  = it.assets.back;
        try{ applySnap(st); alert('Carta caricata dalla cloud ✅'); }
        catch(e){ console.error(e); alert('Impossibile caricare questa carta.'); }
      };

      const bDel = document.createElement('button'); bDel.className='btn danger'; bDel.textContent='Elimina';
      bDel.onclick = async ()=>{
        if(!confirm('Eliminare questa carta dal cloud?')) return;
        // Elimina documento
        await deleteDoc(doc(cardsCol(user.uid), d.id));
        // Elimina asset su Storage (se presenti)
        try{
          const base = `users/${user.uid}/cards/${d.id}`;
          await Promise.all([
            deleteObject(sRef(st, `${base}/front.png`)).catch(()=>{}),
            deleteObject(sRef(st, `${base}/back.png`)).catch(()=>{})
          ]);
        }catch{}
        row.remove();
      };

      acts.append(bLoad, bDel);
      row.appendChild(acts);
      frag.appendChild(row);
    });

    cloudBox.innerHTML = '';
    cloudBox.appendChild(frag);
    if (scrollInto) cloudBox.scrollIntoView({behavior:'smooth', block:'start'});

  }catch(err){
    console.error('[cloudLoad] error', err);
    cloudBox.innerHTML = '<div class="muted">Errore nel caricamento della libreria cloud.</div>';
    alert('Errore libreria cloud: ' + (err?.code || err?.message || err));
  }
}

/* (opzionale) svuota tutto */
btnCloudClear?.addEventListener('click', async ()=>{
  const { auth, getDocs, query, deleteDoc } = fb();
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  if(!confirm('Eliminare TUTTE le carte in questa libreria?')) return;
  const qref = query(cardsCol(user.uid));
  const snap = await getDocs(qref);
  const jobs = [];
  snap.forEach(d => jobs.push(deleteDoc(d.ref)));
  await Promise.all(jobs);
  cloudBox.innerHTML = '<div class="muted">Libreria cloud vuota.</div>';
  cloudBox.style.display='block';
});

/* ========= Welcome al primo avvio (forzabile con ?welcome=1) ========= */
(function(){
  const el = document.getElementById('welcome');
  if (!el) return;
  const p = new URLSearchParams(location.search);
  const force = p.get('welcome') === '1';
  const hide  = localStorage.getItem('cm_hide_welcome') === 'true';
  if (force) { localStorage.removeItem('cm_hide_welcome'); el.style.display = 'flex'; return; }
  if (hide) el.style.display = 'none';
  else      el.style.display = 'flex';
})();
