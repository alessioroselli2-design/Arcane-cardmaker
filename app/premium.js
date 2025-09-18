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

  // 👉 La tua email
  const OWNER_EMAILS = [
    'ale.rose90@hotmail.it'
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

  // Cornici premium: inietta optgroup + gestisci lock
  function injectPremiumOptions(){
    const sel = document.getElementById('frameStyle');
    if (!sel) return;

    const prevValue = sel.value;
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
      const canon = value.startsWith('frame-') ? value : ('frame-' + value);
      const opt = document.createElement('option');
      opt.value = canon;
      opt.textContent = pro ? label : (label + ' 🔒');
      if (!pro) {
        opt.disabled = true;
        opt.setAttribute('data-locked','1');
        opt.title = 'Disponibile con Premium';
      }
      og.appendChild(opt);
    });

    if (!sel.dataset.premiumBound) {
      sel.addEventListener('change', ()=>{
        const o = sel.selectedOptions[0];
        if (o && o.getAttribute('data-locked') === '1'){
          alert('Questa cornice è Premium ✨');
          sel.value = 'flat';
          sel.dispatchEvent(new Event('input', {bubbles:true}));
          sel.dispatchEvent(new Event('change', {bubbles:true}));
        }
      });
      sel.dataset.premiumBound = '1';
    }

    if (prevValue) {
      const hasPrev = Array.from(sel.options).some(o => o.value === prevValue && !o.disabled);
      sel.value = hasPrev ? prevValue : 'flat';
    }
  }

  // ✅ NUOVO: effetti titolo premium — applica/riporta il lucchetto
  function gateTitleEffects(){
    const sel = document.getElementById('titleFoil');
    if (!sel) return;

    const prev = sel.value;
    const pro = isProUser();

    // cerca l'optgroup Premium dentro #titleFoil
    const og = Array.from(sel.querySelectorAll('optgroup'))
      .find(g => (g.getAttribute('label')||'').toLowerCase().includes('premium'));

    const opts = og ? Array.from(og.querySelectorAll('option')) : [];

    opts.forEach(opt=>{
      // rimuovi eventuale lucchetto precedente
      const base = opt.textContent.replace(/ ?🔒$/,'');
      if (pro){
        opt.disabled = false;
        opt.removeAttribute('data-locked');
        opt.textContent = base;
      } else {
        opt.disabled = true;
        opt.setAttribute('data-locked','1');
        opt.title = 'Disponibile con Premium';
        opt.textContent = base + ' 🔒';
      }
    });

    if (!sel.dataset.premiumBound){
      sel.addEventListener('change', ()=>{
        const o = sel.selectedOptions[0];
        if (o && o.getAttribute('data-locked') === '1'){
          alert('Questo effetto titolo è Premium ✨');
          sel.value = 'none';
          sel.dispatchEvent(new Event('input', {bubbles:true}));
          sel.dispatchEvent(new Event('change', {bubbles:true}));
        }
      });
      sel.dataset.premiumBound = '1';
    }

    // ripristina selezione se valida (altrimenti 'none')
    if (prev){
      const ok = Array.from(sel.options).some(o => o.value === prev && !o.disabled);
      sel.value = ok ? prev : 'none';
    }
  }

  // reinietta/gate quando cambia lo userStatus (login/logout)
  function observeUserStatus(){
    const status = document.getElementById('userStatus');
    if (!status) return;
    const mo = new MutationObserver(()=> setTimeout(()=>{
      injectPremiumOptions();
      gateTitleEffects();
    }, 80));
    mo.observe(status, {childList:true, subtree:true, characterData:true});
  }

  // esponi helper per te
  window.premium = {
    unlock(){ setLSPro(true); injectPremiumOptions(); gateTitleEffects(); alert('Premium attivato su questo dispositivo ✅'); },
    lock(){ setLSPro(false); injectPremiumOptions(); gateTitleEffects(); alert('Premium disattivato su questo dispositivo'); },
    isPro: isProUser
  };

  // avvio
  function ready(fn){ if (document.readyState!=='loading') fn(); else document.addEventListener('DOMContentLoaded', fn); }
  ready(()=>{ injectPremiumOptions(); gateTitleEffects(); observeUserStatus(); });
})();
