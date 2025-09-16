// app/frames.js — riempimenti cornici (flat/foil) + stili procedurali (wood/stone/arcane/nature)

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

function woodFill(ctx, x, y, w, h){
  // legno: gradient caldo + leggere “venature” traslucide
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#7a4a20');
  g.addColorStop(.5, '#a06a35');
  g.addColorStop(1, '#7a4a20');
  ctx.fillStyle = g;
  ctx.fill();

  // venature semplici
  ctx.save();
  ctx.globalAlpha = .12;
  ctx.strokeStyle = '#2b180a';
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
  // pietra: gradient freddo + “spaccature” leggere
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#6e7684');
  g.addColorStop(.5, '#8a92a1');
  g.addColorStop(1, '#666f7d');
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = .15;
  ctx.strokeStyle = '#3b404a';
  ctx.lineWidth = 2;
  // crepe semplici
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
  // arcano: viola/blu con bagliori diagonali
  const g = ctx.createLinearGradient(x, y, x + w, y + h);
  g.addColorStop(0, '#2b1c3f');
  g.addColorStop(.5, '#533d86');
  g.addColorStop(1, '#1d284f');
  ctx.fillStyle = g;
  ctx.fill();

  // bagliori
  const g2 = ctx.createLinearGradient(x, y, x + w, y);
  g2.addColorStop(0, 'rgba(255,255,255,.06)');
  g2.addColorStop(.5, 'rgba(255,255,255,0)');
  g2.addColorStop(1, 'rgba(255,255,255,.06)');
  ctx.fillStyle = g2;
  ctx.fillRect(x, y, w, h);
}

function natureFill(ctx, x, y, w, h){
  // natura: verdi/muschio + macchie chiare
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, '#2c3f2e');
  g.addColorStop(.5, '#3f5c42');
  g.addColorStop(1, '#2a3a2b');
  ctx.fillStyle = g;
  ctx.fill();

  ctx.save();
  ctx.globalAlpha = .1;
  ctx.fillStyle = '#d8f3c5';
  for(let i=0;i<24;i++){
    const rx = x + Math.random()*w;
    const ry = y + Math.random()*h;
    const rw = 6 + Math.random()*18;
    const rh = 4 + Math.random()*12;
    ctx.beginPath();
    ctx.ellipse(rx, ry, rw, rh, Math.random()*Math.PI, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();
}

/**
 * Disegna la cornice esterna (rounded rect + fill) in base allo stile.
 * @param {CanvasRenderingContext2D} ctx
 * @param {{x:number,y:number,w:number,h:number,r:number}} rect
 * @param {'flat'|'foil-gold'|'foil-silver'|'foil-rainbow'|'wood'|'stone'|'arcane'|'nature'} style
 * @param {string} baseColor colore base per 'flat'
 */
export function paintOuterFrame(ctx, rect, style, baseColor){
  const {x,y,w,h,r} = rect;
  // path rounded rect
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

  // FOIL / FLAT / PROCEDURALE
  if (style && style.startsWith('foil-')){
    const kind = style.replace('foil-','');
    ctx.fillStyle = makeFoilGradient(ctx, x, y, w, h, kind);
    ctx.fill();
    return;
  }
  if (style === 'flat' || !style){
    ctx.fillStyle = baseColor || '#d8cfae';
    ctx.fill();
    return;
  }

  // procedural styles
  ctx.save();
  ctx.clip();
  if (style === 'wood')      woodFill(ctx, x, y, w, h);
  else if (style === 'stone')  stoneFill(ctx, x, y, w, h);
  else if (style === 'arcane') arcaneFill(ctx, x, y, w, h);
  else if (style === 'nature') natureFill(ctx, x, y, w, h);
  else {
    ctx.fillStyle = baseColor || '#d8cfae';
    ctx.fill();
  }
  ctx.restore();
}
