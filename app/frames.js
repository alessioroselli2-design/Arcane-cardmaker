// app/frames.js — foil/flat + procedurali base + SPECIAL (premium)

export const PREMIUM_STYLES = ['obsidian','dragonbone','celestial','abyssal'];

// ---------- FOIL ----------
export function makeFoilGradient(ctx, x, y, w, h, kind){
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  if (kind === 'gold'){
    g.addColorStop(0, '#fff8d0'); g.addColorStop(.5, '#d4af37'); g.addColorStop(1, '#fff8d0');
  } else if (kind === 'silver'){
    g.addColorStop(0, '#ffffff'); g.addColorStop(.5, '#c0c0c0'); g.addColorStop(1, '#ffffff');
  } else if (kind === 'rainbow'){
    g.addColorStop(0,'#ff0044'); g.addColorStop(.2,'#ffa500');
    g.addColorStop(.4,'#ffee55'); g.addColorStop(.6,'#44ff88');
    g.addColorStop(.8,'#5588ff'); g.addColorStop(1,'#8b00ff');
  } else {
    g.addColorStop(0, '#ddd'); g.addColorStop(1, '#bbb');
  }
  return g;
}

// ---------- BASE ----------
function woodFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#7a4a20'); g.addColorStop(.5, '#a06a35'); g.addColorStop(1, '#7a4a20');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .12; ctx.strokeStyle = '#2b180a';
  for (let i = 0; i < 6; i++){
    const yy = y + (i + 1) * (h / 7);
    ctx.beginPath();
    ctx.moveTo(x + 12, yy);
    ctx.bezierCurveTo(x + w*0.35, yy - 8, x + w*0.65, yy + 8, x + w - 12, yy);
    ctx.stroke();
  }
  ctx.restore();
}
function stoneFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#6e7684'); g.addColorStop(.5, '#8a92a1'); g.addColorStop(1, '#666f7d');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .15; ctx.strokeStyle = '#3b404a'; ctx.lineWidth = 2;
  for(let i=0;i<4;i++){
    const yy = y + (i+1)*(h/5);
    ctx.beginPath();
    ctx.moveTo(x + 10, yy);
    ctx.lineTo(x + w*0.25, yy + 6);
    ctx.lineTo(x + w*0.55, yy - 4);
    ctx.lineTo(x + w - 12, yy + 3);
    ctx.stroke();
  }
  ctx.restore();
}
function arcaneFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#2b1c3f'); g.addColorStop(.5, '#533d86'); g.addColorStop(1, '#1d284f');
  ctx.fillStyle = g; ctx.fill();
  const g2 = ctx.createLinearGradient(x, y, x + w, y);
  g2.addColorStop(0, 'rgba(255,255,255,.06)'); g2.addColorStop(.5, 'rgba(255,255,255,0)'); g2.addColorStop(1, 'rgba(255,255,255,.06)');
  ctx.fillStyle = g2; ctx.fillRect(x, y, w, h);
}
function natureFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#2c3f2e'); g.addColorStop(.5, '#3f5c42'); g.addColorStop(1, '#2a3a2b');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .1; ctx.fillStyle = '#d8f3c5';
  for(let i=0;i<24;i++){
    const rx = x + Math.random()*w, ry = y + Math.random()*h;
    const rw = 6 + Math.random()*18, rh = 4 + Math.random()*12;
    ctx.beginPath(); ctx.ellipse(rx, ry, rw, rh, Math.random()*Math.PI, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
function crystalFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#c9efff'); g.addColorStop(.5, '#a8dff5'); g.addColorStop(1, '#e7f8ff');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .28;
  for(let i=0;i<10;i++){
    const fx = x + Math.random()*w, fy = y + Math.random()*h;
    const fw = 30 + Math.random()*80, fh = 20 + Math.random()*60, ang = Math.random()*Math.PI;
    ctx.translate(fx, fy); ctx.rotate(ang);
    const gg = ctx.createLinearGradient(-fw/2, -fh/2, fw/2, fh/2);
    gg.addColorStop(0, 'rgba(255,255,255,.45)'); gg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gg; ctx.fillRect(-fw/2, -fh/2, fw, fh);
    ctx.setTransform(1,0,0,1,0,0);
  }
  ctx.restore();
}
function metalFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x + w, y);
  g.addColorStop(0, '#dcdcdc'); g.addColorStop(.5, '#b8b8b8'); g.addColorStop(1, '#ededed');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .10; ctx.strokeStyle = 'rgba(0,0,0,.35)';
  for(let i=0;i<w; i+=6){
    ctx.beginPath(); ctx.moveTo(x+i, y); ctx.lineTo(x+i - h*0.15, y + h); ctx.stroke();
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = .25; ctx.strokeStyle = 'rgba(50,50,50,.6)'; ctx.lineWidth = 2;
  const inset = 8; ctx.strokeRect(x+inset, y+inset, w-inset*2, h-inset*2); ctx.restore();
}
function parchmentFill(ctx, x, y, w, h){
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#f4ecd6'); g.addColorStop(.5, '#efe2c1'); g.addColorStop(1, '#f7f0db');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = '#d7c49a';
  for(let i=0;i<30;i++){
    const rx = x + Math.random()*w, ry = y + Math.random()*h;
    const r = 2 + Math.random()*8;
    ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
  ctx.save();
  const pad = 6;
  const g2 = ctx.createLinearGradient(x+pad, y+pad, x+w-pad, y+h-pad);
  g2.addColorStop(0, 'rgba(0,0,0,.04)'); g2.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.strokeStyle = g2; ctx.lineWidth = pad;
  ctx.strokeRect(x+pad, y+pad, w-pad*2, h-pad*2);
  ctx.restore();
}

// ---------- PREMIUM ----------
function obsidianFill(ctx, x, y, w, h){
  // nero lucido con venature violacee
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#0d0b12'); g.addColorStop(.5, '#171422'); g.addColorStop(1, '#0a0910');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .22;
  for(let i=0;i<8;i++){
    const fx = x + Math.random()*w, fy = y + Math.random()*h;
    const fw = 40 + Math.random()*90, fh = 10 + Math.random()*40, ang = Math.random()*Math.PI;
    ctx.translate(fx, fy); ctx.rotate(ang);
    const gg = ctx.createLinearGradient(-fw/2, -fh/2, fw/2, fh/2);
    gg.addColorStop(0, 'rgba(140,100,200,.25)'); gg.addColorStop(1, 'rgba(140,100,200,0)');
    ctx.fillStyle = gg; ctx.fillRect(-fw/2, -fh/2, fw, fh);
    ctx.setTransform(1,0,0,1,0,0);
  }
  ctx.restore();
}
function dragonboneFill(ctx, x, y, w, h){
  // avorio con screpolature e polvere dorata
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#f7f1df'); g.addColorStop(.5, '#efe3c8'); g.addColorStop(1, '#f9f4e6');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .22; ctx.strokeStyle = '#a8906a';
  for(let i=0;i<5;i++){
    const yy = y + (i+1)*(h/6);
    ctx.beginPath();
    ctx.moveTo(x + 12, yy);
    ctx.lineTo(x + w*0.35, yy - 4);
    ctx.lineTo(x + w*0.7,  yy + 6);
    ctx.lineTo(x + w - 12, yy - 2);
    ctx.stroke();
  }
  ctx.restore();
  ctx.save(); ctx.globalAlpha = .18; ctx.fillStyle = '#d6b878';
  for(let i=0;i<24;i++){
    const rx = x + Math.random()*w, ry = y + Math.random()*h;
    const r = 1 + Math.random()*2.5;
    ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
function celestialFill(ctx, x, y, w, h){
  // cielo stellato blu/azzurro con nebulose
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#121a3a'); g.addColorStop(.5, '#1c2f6a'); g.addColorStop(1, '#0e1433');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .25;
  for(let i=0;i<3;i++){
    const cx = x + Math.random()*w, cy = y + Math.random()*h;
    const r = 40 + Math.random()*90;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, 'rgba(120,160,255,.35)');
    rg.addColorStop(1, 'rgba(120,160,255,0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = .9; ctx.fillStyle = '#ffffff';
  for(let i=0;i<60;i++){
    const sx = x + Math.random()*w, sy = y + Math.random()*h;
    const sr = Math.random()<.1 ? 1.6 : 0.8;
    ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}
function abyssalFill(ctx, x, y, w, h){
  // viola/nero con bagliori rossi tipo "fiamme interne"
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#1a0f1f'); g.addColorStop(.5, '#2a0f2e'); g.addColorStop(1, '#0e0712');
  ctx.fillStyle = g; ctx.fill();
  ctx.save(); ctx.globalAlpha = .25;
  for(let i=0;i<8;i++){
    const cx = x + Math.random()*w, cy = y + Math.random()*h;
    const r = 20 + Math.random()*60;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    rg.addColorStop(0, 'rgba(255,64,64,.35)');
    rg.addColorStop(1, 'rgba(255,64,64,0)');
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI*2); ctx.fill();
  }
  ctx.restore();
}

// ---------- Disegno cornice esterna ----------
export function paintOuterFrame(ctx, rect, style, baseColor){
  const {x,y,w,h,r} = rect;

  // rounded path
  ctx.beginPath();
  const rr = (c,X,Y,W,H,R)=>{
    c.moveTo(X+R,Y);
    c.arcTo(X+W,Y,X+W,Y+H,R);
    c.arcTo(X+W,Y+H,X,Y+H,R);
    c.arcTo(X,Y+H,X,Y,R);
    c.arcTo(X,Y,X+W,Y,R);
    c.closePath();
  };
  rr(ctx,x,y,w,h,r);

  if (style && style.startsWith('foil-')){
    ctx.fillStyle = makeFoilGradient(ctx, x, y, w, h, style.replace('foil-',''));
    ctx.fill();
    return;
  }
  if (style === 'flat' || !style){
    ctx.fillStyle = baseColor || '#d8cfae';
    ctx.fill();
    return;
  }

  // procedurali
  ctx.save(); ctx.clip();
  if (style === 'wood')        woodFill(ctx, x, y, w, h);
  else if (style === 'stone')  stoneFill(ctx, x, y, w, h);
  else if (style === 'arcane') arcaneFill(ctx, x, y, w, h);
  else if (style === 'nature') natureFill(ctx, x, y, w, h);
  else if (style === 'crystal')  crystalFill(ctx, x, y, w, h);
  else if (style === 'metal')    metalFill(ctx, x, y, w, h);
  else if (style === 'parchment') parchmentFill(ctx, x, y, w, h);
  else if (style === 'obsidian')  obsidianFill(ctx, x, y, w, h);
  else if (style === 'dragonbone') dragonboneFill(ctx, x, y, w, h);
  else if (style === 'celestial')  celestialFill(ctx, x, y, w, h);
  else if (style === 'abyssal')    abyssalFill(ctx, x, y, w, h);
  else { ctx.fillStyle = baseColor || '#d8cfae'; ctx.fill(); }
  ctx.restore();

  // polish/bevel leggero
  ctx.save();
  const bevel = ctx.createLinearGradient(x, y, x, y + h);
  bevel.addColorStop(0, 'rgba(255,255,255,.18)');
  bevel.addColorStop(.5, 'rgba(255,255,255,0)');
  bevel.addColorStop(1, 'rgba(0,0,0,.12)');
  ctx.strokeStyle = bevel; ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();
}
