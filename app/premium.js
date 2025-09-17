// /app/premium.js — Gating UI cornici Premium (lock 🔒 + sblocco owner/device)
// Funziona senza modificare index.html o card.js

(function(){
  /* ========== Config ========== */
  const PREMIUM_FRAMES = [
    { value:'celestial', label:'Celestial (Premium)' },
    { value:'infernal',  label:'Infernal (Premium)'  },
    { value:'frost',     label:'Frost (Premium)'     },
    { value:'bloom',     label:'Bloom (Premium)'     },
    { value:'storm',     label:'Storm (Premium)'     },
    { value:'vampiric',  label:'Vampiric (Premium)'  },
    { value:'chronos',   label:'Chronos (Premium)'   }
  ];

  // 👉 Metti qui la TUA email (quella con cui fai login)
  const OWNER_EMAILS = [
    'tuo@email.com'
  ];

  const LS_KEY = 'acm_pro';

  /* ========== Helpers PRO ========== */
  function getQueryFlag() {
    try { return new URLSearchParams(location.search).get('pro') === '1'; }
    catch { return false; }
  }
  function setLSPro(val){ try{ localStorage.setItem(LS_KEY, val ? '1' : '0'); }catch{} }
  function getLSPro(){ try{ return localStorage.getItem(LS_KEY) === '1'; }catch{ return false; } }

  function getCurrentEmail(){
    const el = document.getElementById('userStatus');
    const txt = (el?.textContent || '').trim();
    const m = txt.match(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i);
    return m ? m[0].toLowerCase() : null;
  }
  function isOwner(email){
    if (!email) return false;
    return OWNER_EMAILS.map(x=>x.toLowerCase()).includes(email.toLowerCase());
  }
  function isProUser(){
    if (getLSPro()) return true;
    return isOwner(getCurrentEmail());
  }

  // Attiva via ?pro=1 una volta su questo device
  if (getQueryFlag()){
    setLSPro(true);
    try {
      const url = new URL(location.href);
      url.searchParams.delete('pro');
      history.replaceState(null, '', url.toString());
    } catch {}
  }

  /* ========== UI: inject & lock ========== */
  function injectPremiumOptions(){
    const sel = document.getElementById('frameStyle');
    if (!sel) return;

    // crea/aggiorna optgroup Premium
    let og = sel.querySelector('optgroup[data-premium="1"]');
    if (!og){
      og = document.createElement('optgroup');
      og.setAttribute('label', 'Premium');
      og.setAttribute('data-premium', '1');
      sel.appendChild(og);
    } else {
      og.innerHTML = '';
    }

    const pro = isProUser();

    PREMIUM_FRAMES.forEach(({value,label})=>{
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = pro ? label : (label + ' 🔒');
      if (!pro) {
        opt.disabled = true;
        opt.setAttribute('data-locked','1');
        opt.title = 'Disponibile con Premium';
      }
      og.appendChild(opt);
    });

    // blocca selezioni locked e ripristina a flat
    sel.addEventListener('change', ()=>{
      const o = sel.selectedOptions[0];
      if (o && o.getAttribute('data-locked') === '1'){
        alert('Questa cornice è Premium ✨');
        sel.value = 'flat';
        sel.dispatchEvent(new Event('input', {bubbles:true}));
        sel.dispatchEvent(new Event('change', {bubbles:true}));
      }
    });
  }

  // reinietta quando cambia lo userStatus (login/logout)
  function observeUserStatus(){
    const status = document.getElementById('userStatus');
    if (!status) return;
    const mo = new MutationObserver(()=> setTimeout(injectPremiumOptions, 80));
    mo.observe(status, {childList:true, subtree:true, characterData:true});
  }

  // esponi helper per te
  window.premium = {
    unlock(){ setLSPro(true); injectPremiumOptions(); alert('Premium attivato su questo dispositivo ✅'); },
    lock(){ setLSPro(false); injectPremiumOptions(); alert('Premium disattivato su questo dispositivo'); },
    isPro: isProUser
  };

  // avvio
  function ready(fn){ if (document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(()=>{ injectPremiumOptions(); observeUserStatus(); });
})();
