// auth.js — login/ospite/logout + Libreria CLOUD realtime (salva / lista / carica / elimina)
import { snapshot, applySnap, frontPNG, backPNG } from './card.js';

const $  = id => document.getElementById(id);
const fb = () => window._fb || (() => { throw new Error('Firebase non inizializzato'); })();

// UI refs
const welcome        = $('welcome');
const userStatus     = $('userStatus');
const btnLogout      = $('btnLogout');
const cloudBox       = $('cloudLibrary');
const btnCloudSave   = $('btnCloudSave');
const btnCloudPull   = $('btnCloudPull');
const btnCloudClear  = $('btnCloudClear');

/* Helpers UI */
function setBusy(btn, text = 'Attendi…') {
  if (!btn) return () => {};
  const old = btn.textContent;
  btn.dataset.oldText = old;
  btn.disabled = true;
  btn.textContent = text;
  return () => { btn.disabled = false; btn.textContent = btn.dataset.oldText || old; };
}
function flash(btn, text = 'Fatto ✅') {
  if (!btn) return;
  const old = btn.textContent;
  btn.textContent = text;
  setTimeout(() => { btn.textContent = old; }, 1500);
}

function setAuthUI(user){
  const logged = !!user;
  if (btnLogout) btnLogout.style.display = logged ? '' : 'none';
  const cloudSection = document.querySelector('[data-auth="only"]');
  if (cloudSection) cloudSection.style.display = logged ? '' : 'none';

  if (userStatus){
    if (logged){
      // NON far sovrascrivere da app-i18n
      userStatus.removeAttribute('data-i18n');
      userStatus.textContent = user.email || 'Account';
    } else {
      // da guest torna traducibile
      userStatus.setAttribute('data-i18n','user_guest');
      userStatus.textContent = (window.intl?.t && window.intl.t('user_guest')) || 'Ospite';
    }
  }
}

/* Welcome / Accesso */
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
  }catch(err){ alert(err.message); }
});
btnLogout?.addEventListener('click', ()=>{
  const { auth, signOut } = fb();
  signOut(auth);
});

/* Firestore helpers */
function cardsCol(uid){
  const deck = ($('deckName')?.value || '').trim();
  const { db, collection } = fb();
  return deck ? collection(db, 'users', uid, 'decks', deck, 'cards')
              : collection(db, 'users', uid, 'cards');
}

/* Salvataggio CLOUD */
btnCloudSave?.addEventListener('click', async () => {
  const { auth, serverTimestamp, addDoc, setDoc, sRef, uploadString, getDownloadURL, st } = fb();
  const user = auth.currentUser;
  if (!user) return alert('Accedi prima.');

  const name = ($('cardName')?.value || 'Carta senza nome').trim();
  const deck = ($('deckName')?.value || '').trim() || null;

  const restore = setBusy(btnCloudSave, 'Salvataggio…');

  // Watchdog: sblocca comunque dopo 25s
  let kicked = false;
  const watchdog = setTimeout(() => {
    if (!kicked) { kicked = true; restore(); flash(btnCloudSave,'Pronto'); }
  }, 25000);

  try {
    const colRef = cardsCol(user.uid);
    const docRef = await addDoc(colRef, { owner:user.uid, name, deck, updatedAt: serverTimestamp() });

    const state     = snapshot(false);
    const dataFront = frontPNG();
    let   dataBack  = null; try { dataBack = backPNG(); } catch {}

    const basePath = docRef.path;
    const up = async (dataUrl, fileName) => {
      if (!dataUrl) return null;
      const ref = sRef(st, `${basePath}/${fileName}`);
      await uploadString(ref, dataUrl, 'data_url');
      return await getDownloadURL(ref);
    };
    const [urlFront, urlBack] = await Promise.allSettled([
      up(dataFront, 'front.png'),
      dataBack ? up(dataBack, 'back.png') : Promise.resolve(null)
    ]).then(r => r.map(x => x.status === 'fulfilled' ? x.value : null));

    await setDoc(docRef, {
      thumb: urlFront || null,
      state,
      assets: { front: urlFront || null, back: urlBack || null },
      updatedAt: serverTimestamp()
    }, { merge: true });

    if (!kicked) { clearTimeout(watchdog); restore(); flash(btnCloudSave, 'Salvato ✅'); }
  } catch (err) {
    alert('Errore salvataggio cloud: ' + err.message);
    if (!kicked) { clearTimeout(watchdog); restore(); }
  }
});

/* Lista realtime / carica / elimina */
let unsubscribeCloud = null;

function renderCloudListFromSnapshot(qsnap){
  if (!cloudBox) return;
  cloudBox.style.display = 'block';
  if (qsnap.empty){ cloudBox.innerHTML = '<div class="muted">Nessuna carta sul cloud.</div>'; return; }

  const frag = document.createDocumentFragment();
  qsnap.forEach(d=>{
    const it = d.data();
    const row = document.createElement('div'); row.className = 'lib-row';

    const img = document.createElement('img'); img.className='lib-thumb';
    img.src = it.thumb || it.assets?.front || '';
    row.appendChild(img);

    const meta = document.createElement('div'); meta.className='lib-meta';
    const title = document.createElement('div'); title.className='lib-title';
    title.textContent = it.name || '(senza nome)';
    const sub = document.createElement('div'); sub.className='lib-sub';
    sub.textContent = it.deck ? `Cloud · ${it.deck}` : 'Cloud';
    meta.append(title, sub); row.appendChild(meta);

    const acts = document.createElement('div'); acts.className='lib-actions';

    const bLoad = document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
    bLoad.onclick = async ()=>{
      try{
        const st = it.state || {};
        if (it.assets?.front) st._imgFront = it.assets.front;
        if (it.assets?.back)  st._imgBack  = it.assets.back;
        await applySnap(st);
        alert('Carta caricata dalla cloud ✅');
      }catch(e){ alert('Impossibile caricare questa carta.'); }
    };

    const bDel = document.createElement('button'); bDel.className='btn danger'; bDel.textContent='Elimina';
    bDel.onclick = async ()=>{
      if(!confirm('Eliminare questa carta dal cloud?')) return;
      try{
        const { deleteDoc, sRef, deleteObject, st } = fb();
        bDel.disabled = true; bLoad.disabled = true; bDel.textContent = 'Elimino…';
        await deleteDoc(d.ref);
        const basePath = d.ref.path;
        Promise.allSettled([
          deleteObject(sRef(st, `${basePath}/front.png`)),
          deleteObject(sRef(st, `${basePath}/back.png`))
        ]).catch(()=>{});
      }catch(err){ alert('Eliminazione non riuscita.'); }
    };

    acts.append(bLoad, bDel); row.appendChild(acts); frag.appendChild(row);
  });
  cloudBox.innerHTML = ''; cloudBox.appendChild(frag);
}

async function cloudLoadOnce(){
  const { auth, query, orderBy, getDocs } = fb();
  const user = auth.currentUser; if(!user) return;
  cloudBox.style.display = 'block';
  cloudBox.innerHTML = '<div class="muted">Caricamento…</div>';
  const qref = orderBy ? fb().query(cardsCol(user.uid), orderBy('updatedAt','desc'))
                       : fb().query(cardsCol(user.uid));
  const snap = await getDocs(qref);
  renderCloudListFromSnapshot(snap);
}

btnCloudPull?.addEventListener('click', ()=>{
  const { auth, onSnapshot, query, orderBy } = fb();
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  if (unsubscribeCloud) { unsubscribeCloud(); unsubscribeCloud = null; }
  if (onSnapshot) {
    const qref = orderBy ? fb().query(cardsCol(user.uid), orderBy('updatedAt','desc'))
                         : fb().query(cardsCol(user.uid));
    cloudBox.style.display = 'block';
    cloudBox.innerHTML = '<div class="muted">In ascolto…</div>';
    unsubscribeCloud = onSnapshot(qref, renderCloudListFromSnapshot, ()=>{
      cloudBox.innerHTML = '<div class="muted">Errore realtime. Carico una volta…</div>';
      cloudLoadOnce();
    });
  } else {
    cloudLoadOnce();
  }
});

/* Svuota tutto */
btnCloudClear?.addEventListener('click', async ()=>{
  const { auth, getDocs, query, deleteDoc } = fb();
  const user = auth.currentUser; if(!user) return alert('Accedi prima.');
  if(!confirm('Eliminare TUTTE le carte in questa libreria?')) return;
  const qref = query(cardsCol(user.uid));
  const snap = await getDocs(qref);
  const jobs = []; snap.forEach(d => jobs.push(deleteDoc(d.ref)));
  await Promise.all(jobs);
  cloudBox.innerHTML = '<div class="muted">Libreria cloud vuota.</div>';
  cloudBox.style.display = 'block';
});

/* Watcher auth */
(function initAuthWatcher(){
  const { auth, onAuthStateChanged } = fb();
  onAuthStateChanged(auth, (u)=>{
    setAuthUI(u);
    if (!u) {
      if (unsubscribeCloud) { unsubscribeCloud(); unsubscribeCloud = null; }
      const hide = localStorage.getItem('cm_hide_welcome') === 'true';
      if (!hide && welcome) welcome.style.display = 'flex';
      if (cloudBox) { cloudBox.innerHTML=''; cloudBox.style.display='none'; }
    }
  });
})();
