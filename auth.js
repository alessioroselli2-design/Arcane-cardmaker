import { snapshot, applySnap, frontPNG } from './card.js';

// Firebase (modulare)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { getFirestore, serverTimestamp, collection, doc, setDoc, getDocs, query, orderBy, deleteDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import { getStorage, ref as sRef, uploadString, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-storage.js";

// --- TUA CONFIG ---
const firebaseConfig = {
  apiKey: "AIzaSyC2yGBahkZpzd4bRsIHThpUHTl1TtpSwKI",
  authDomain: "cardmaker-15cf5.firebaseapp.com",
  projectId: "cardmaker-15cf5",
  storageBucket: "cardmaker-15cf5.firebasestorage.app",
  messagingSenderId: "782546269609",
  appId: "1:782546269609:web:934c5740d007558bb900b8",
  measurementId: "G-W68B78G600"
};
// -------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);
const st   = getStorage(app);

const $=id=>document.getElementById(id);
const welcome = $('welcome');
const userStatus = $('userStatus');

function setAuthUI(user){
  const logged=!!user;
  $('btnLogout').style.display = logged ? '' : 'none';
  const cloudPanel = document.querySelector('[data-auth="only"]');
  if(cloudPanel) cloudPanel.style.display = logged ? '' : 'none';
  userStatus.textContent = logged ? (user.email||'Utente') : 'Ospite';
}

// Welcome modal
$('btnGuest').onclick=()=>{ if($('dontShow').checked) localStorage.setItem('cm_hide_welcome','true'); welcome.style.display='none'; };
$('btnLogin').onclick=async()=>{ const e=$('email').value.trim(), p=$('password').value; if(!e||!p) return alert('Email e password richieste'); try{ await signInWithEmailAndPassword(auth,e,p); if($('dontShow').checked) localStorage.setItem('cm_hide_welcome','true'); welcome.style.display='none'; }catch(err){ alert(err.message); } };
$('btnSignup').onclick=async()=>{ const e=$('email').value.trim(), p=$('password').value; if(!e||!p) return alert('Email e password richieste'); try{ await createUserWithEmailAndPassword(auth,e,p); if($('dontShow').checked) localStorage.setItem('cm_hide_welcome','true'); welcome.style.display='none'; }catch(err){ alert(err.message); } };
$('btnLogout').onclick=()=>signOut(auth);

onAuthStateChanged(auth,(u)=>{ setAuthUI(u); if(!u){ // se non autenticato, riapri welcome se non nascosto
  const flag=localStorage.getItem('cm_hide_welcome'); if(flag!=='true') welcome.style.display='flex';
}});

// Cloud: salva
$('btnCloudSave').onclick=async()=>{
  const user=auth.currentUser; if(!user) return alert('Accedi prima.');
  const cardName=($('cardName').value||'Carta senza nome').trim();
  const deck=($('deckName').value||'').trim();
  const data = snapshot(true);
  // crea thumb dal fronte
  const thumb = frontPNG();
  const docRef = doc(collection(db, 'users', user.uid, 'cards')); // nuovo id
  const base = `users/${user.uid}/cards/${docRef.id}`;
  // carica immagini (se presenti) su Storage
  const up = async (dataUrl, path) => {
    if(!dataUrl) return null;
    const ref=sRef(st,path); await uploadString(ref,dataUrl,'data_url'); return await getDownloadURL(ref);
  };
  const urlFront = await up(data._imgFront, `${base}/front.png`);
  const urlBack  = await up(data._imgBack,  `${base}/back.png`);
  const urlClass = (data.classSource==='upload') ? await up(data._imgClass, `${base}/class.png`) : null;
  // carica thumb
  const urlThumb = await up(thumb, `${base}/thumb.png`);

  const payload = {
    name: cardName, deck,
    updatedAt: serverTimestamp(),
    thumb: urlThumb,
    data: { ...data, _imgFront:urlFront||null, _imgBack:urlBack||null, _imgClass:urlClass||null }
  };
  await setDoc(docRef, payload);
  alert('Salvata su cloud!');
  cloudPull(); // aggiorna elenco
};

// Cloud: ricarica libreria
$('btnCloudPull').onclick=cloudPull;
async function cloudPull(){
  const user=auth.currentUser; if(!user){ $('cloudLibrary').innerHTML=''; return; }
  const box=$('cloudLibrary'); box.innerHTML='Carico…';
  const qref=query(collection(db,'users',user.uid,'cards'), orderBy('updatedAt','desc'));
  const snap=await getDocs(qref);
  box.innerHTML='';
  snap.forEach(d=>{
    const it=d.data();
    const row=document.createElement('div'); row.className='cardRow';
    const img=document.createElement('img'); img.src=it.thumb||'';
    const meta=document.createElement('div'); meta.className='meta';
    meta.innerHTML=`<div><strong>${it.name||'(senza nome)'}</strong> ${it.deck?`<span class="tag">• ${it.deck}</span>`:''}</div>`;
    const acts=document.createElement('div'); acts.style.display='flex'; acts.style.flexDirection='column'; acts.style.gap='6px';
    const bLoad=document.createElement('button'); bLoad.className='btn'; bLoad.textContent='Carica';
    const bDel=document.createElement('button'); bDel.className='btn'; bDel.textContent='Elimina';
    bLoad.onclick=()=>{ applySnap(it.data); $('cardName').value=it.name||''; $('deckName').value=it.deck||''; };
    bDel.onclick=async()=>{ if(!confirm('Eliminare questa carta dal cloud?')) return; await deleteDoc(doc(db,'users',user.uid,'cards',d.id)); cloudPull(); };
    acts.appendChild(bLoad); acts.appendChild(bDel);
    row.appendChild(img); row.appendChild(meta); row.appendChild(acts);
    box.appendChild(row);
  });
}

// mostra welcome se non nascosto
(function(){
  const p=new URLSearchParams(location.search);
  const force=p.get('welcome')==='1';
  const flag=localStorage.getItem('cm_hide_welcome');
  if(force){ localStorage.removeItem('cm_hide_welcome'); welcome.style.display='flex'; }
  else if(flag==='true'){ welcome.style.display='none'; }
  else welcome.style.display='flex';
})();
