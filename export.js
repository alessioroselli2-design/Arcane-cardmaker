import { drawFront, drawBack, frontPNG, backPNG, state, snapshot } from './card.js';

// bottoni
const $=id=>document.getElementById(id);
$('pngFront').onclick=()=>{ drawFront(); download(frontPNG(),'carta-front.png'); };
$('pngBack').onclick =()=>{ drawBack();  download(backPNG(),'carta-back.png'); };

$('pdfSingleFront').onclick=()=>singlePDF(frontPNG(),'carta-front.pdf');
$('pdfSingleBack').onclick =()=>singlePDF(backPNG(),'carta-back.pdf');

$('pdfA4Front').onclick =()=>gridPDF(frontPNG(), null, 'carte-fronti.pdf', false);
$('pdfA4Back').onclick  =()=>gridPDF(null, backPNG(), 'carte-retro.pdf',  false);
$('pdfA4Both').onclick  =()=>gridPDF(frontPNG(), backPNG(), 'carte-fronte-retro.pdf', true);

// JSON locali
$('exportJson').onclick=()=>{ const payload={meta:{app:'ACM',v:14},data:snapshot(true)}; const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'}); download(URL.createObjectURL(blob),(document.getElementById('cardName').value||'carta')+'.json'); };
document.getElementById('importJson').addEventListener('change',e=>{
  import('./card.js').then(m=>{
    const f=e.target.files?.[0]; if(!f)return; const r=new FileReader(); r.onload=()=>{ try{ const p=JSON.parse(r.result); m.applySnap(p.data); document.getElementById('cardName').value=p.data?.title||'Carta importata'; alert('Import OK'); }catch{ alert('JSON non valido'); } }; r.readAsText(f);
  });
});

// Salvataggi locali
const KEY='acm_cards_v14';
const getSaved=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'[]')}catch{return[]}};
const setSaved=a=>localStorage.setItem(KEY,JSON.stringify(a));
document.getElementById('saveLocal').onclick=()=>{
  const name=(document.getElementById('cardName').value||'Carta').trim();
  const arr=getSaved(); const data=snapshot(true);
  const c=document.createElement('canvas'); c.width=150;c.height=210; const g=c.getContext('2d');
  const img=new Image(); img.onload=()=>{ g.drawImage(img,0,0,150,210); const thumb=c.toDataURL('image/png'); const time=Date.now(); const i=arr.findIndex(x=>x.name===name); if(i>=0) arr[i]={name,data,thumb,time}; else arr.push({name,data,thumb,time}); setSaved(arr); alert('Salvata localmente!'); };
  img.src=frontPNG();
};
document.getElementById('loadLocal').onclick=()=>{
  import('./card.js').then(m=>{
    const arr=getSaved(); if(!arr.length) return alert('Nessuna carta salvata'); const names=arr.map((x,i)=>`${i+1}) ${x.name}`); const pick=prompt('Quale carta?\n'+names.join('\n')); const idx=(parseInt(pick||'',10)-1); if(isNaN(idx)||idx<0||idx>=arr.length) return; m.applySnap(arr[idx].data); document.getElementById('cardName').value=arr[idx].name;
  });
};

function download(url, name){ const a=document.createElement('a'); a.href=url; a.download=name; a.click(); }

function singlePDF(png, name){
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:[69,94]}); doc.addImage(png,'PNG',0,0,69,94); doc.save(name);
}

function gridPDF(pngFrontData, pngBackData, name, both){
  const {jsPDF}=window.jspdf; const doc=new jsPDF({unit:'mm',format:'a4'});
  const W=63,H=88, Xs=[10,10+W+10,10+2*(W+10)], Ys=[10,10+H+10,10+2*(H+10)];
  if(pngFrontData){
    for(let i=0;i<3;i++)for(let j=0;j<3;j++) doc.addImage(pngFrontData,'PNG', Xs[j], Ys[i], W, H);
  }
  if(both){ doc.addPage(); }
  if(pngBackData){
    for(let i=0;i<3;i++)for(let j=0;j<3;j++) doc.addImage(pngBackData,'PNG', Xs[j], Ys[i], W, H);
  }
  doc.save(name);
}
