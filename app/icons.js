// app/icons.js — set di icone fantasy (migliorate ma con gli stessi "key" di prima)

export const ICONS = {
  guerriero: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <linearGradient id='gSword' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#f7f7f7'/><stop offset='1' stop-color='#c9c9c9'/>
    </linearGradient>
  </defs>
  <rect x='18' y='18' width='64' height='64' rx='12' fill='none' stroke='#23262b' stroke-width='3'/>
  <path d='M30 64 l22 -22 l6 6 l-22 22 z' fill='#8f6a3a' stroke='#23262b' stroke-width='2'/>
  <path d='M54 26 l20 20 l-18 18 l-20 -20 z' fill='url(#gSword)' stroke='#23262b' stroke-width='2'/>
  <circle cx='64' cy='36' r='3' fill='#23262b'/>
</svg>`,

  druido: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <radialGradient id='gLeaf' cx='0.5' cy='0.3' r='0.8'>
      <stop offset='0' stop-color='#a8f3a8'/><stop offset='1' stop-color='#4a8b4a'/>
    </radialGradient>
  </defs>
  <path d='M50 10 C24 36,22 64,50 92 C78 64,76 36,50 10 Z' fill='url(#gLeaf)' stroke='#1f4a1c' stroke-width='3'/>
  <path d='M50 90 C48 66,46 46,48 26' stroke='#1f4a1c' stroke-width='3' fill='none'/>
  <path d='M36 42 c10 2 18 -2 24 -8' stroke='#1f4a1c' stroke-width='2' fill='none'/>
</svg>`,

  monaco: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='30' fill='none' stroke='#caa96b' stroke-width='6'/>
  <path d='M50 18 v64' stroke='#caa96b' stroke-width='6'/>
  <path d='M35 42 h30' stroke='#caa96b' stroke-width='4' opacity='.7'/>
</svg>`,

  mago: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <defs>
    <linearGradient id='gHat' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#7fc0ff'/><stop offset='1' stop-color='#2a69d1'/>
    </linearGradient>
  </defs>
  <path d='M50 14 l26 48 h-52 z' fill='url(#gHat)' stroke='#173b75' stroke-width='3'/>
  <circle cx='50' cy='64' r='5' fill='#fff' stroke='#173b75' stroke-width='2'/>
  <path d='M22 66 h56' stroke='#173b75' stroke-width='3'/>
</svg>`,

  ladro: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <rect x='18' y='32' width='64' height='32' rx='8' fill='#1e1e1e' stroke='#333' stroke-width='3'/>
  <path d='M18 44 h64' stroke='#666' stroke-width='3'/>
  <circle cx='36' cy='48' r='5' fill='#ddd'/><circle cx='64' cy='48' r='5' fill='#ddd'/>
  <path d='M72 70 l8 8' stroke='#1e1e1e' stroke-width='6' stroke-linecap='round'/>
</svg>`,

  barbaro: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M24 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
  <path d='M58 24 h18 v52 h-18 z' fill='#8c3f22' stroke='#3e1f10' stroke-width='3'/>
  <rect x='46' y='18' width='8' height='64' fill='#5b371f' stroke='#2c170c' stroke-width='2'/>
  <path d='M28 30 l10 0 0 12 -10 0 z M62 30 l10 0 0 12 -10 0 z' fill='#c89b72' opacity='.35'/>
</svg>`,

  paladino: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M20 20 h60 v26 c0 26 -30 38 -30 38 s-30 -12 -30 -38 z'
        fill='#e6dfb8' stroke='#8a7b45' stroke-width='3'/>
  <path d='M50 26 v40' stroke='#8a7b45' stroke-width='3'/>
  <path d='M38 46 h24' stroke='#8a7b45' stroke-width='3'/>
</svg>`,

  chierico: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='28' fill='#efe8d8' stroke='#876' stroke-width='3'/>
  <path d='M48 28 h4 v18 h18 v4 h-18 v18 h-4 v-18 h-18 v-4 h18 z' fill='#876'/>
</svg>`,

  bardo: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M32 20 c40 0 40 60 0 60' fill='none' stroke='#b46ec9' stroke-width='6'/>
  <circle cx='56' cy='48' r='6' fill='#fff' stroke='#7c3a93' stroke-width='2'/>
  <path d='M58 30 q10 6 14 0' stroke='#b46ec9' stroke-width='3' fill='none'/>
</svg>`,

  ranger: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M22 78 l56 -56' stroke='#2f7d2b' stroke-width='6' stroke-linecap='round'/>
  <path d='M70 22 l12 -6 -6 12 z' fill='#2f7d2b'/>
  <path d='M26 70 q12 -8 20 -2' stroke='#5aa34f' stroke-width='3' fill='none'/>
</svg>`,

  stregone: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='24' fill='none' stroke='#90c9ff' stroke-width='4'/>
  <path d='M50 26 v10 M50 64 v10 M26 50 h10 M64 50 h10' stroke='#90c9ff' stroke-width='3'/>
  <circle cx='50' cy='50' r='6' fill='#90c9ff'/>
</svg>`,

  warlock: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <path d='M50 14 l16 22 -16 48 -16 -48 z' fill='#7d4bb3' stroke='#3e2560' stroke-width='3'/>
  <circle cx='50' cy='40' r='7' fill='#c7a3ff' stroke='#3e2560' stroke-width='2'/>
</svg>`,

  artefice: `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
  <circle cx='50' cy='50' r='26' fill='#b9c3ce' stroke='#3a4a5a' stroke-width='3'/>
  <path d='M50 22 v10 M50 68 v10 M22 50 h10 M68 50 h10 M33 33 l7 7 M67 67 l7 7 M33 67 l7 -7 M67 33 l7 -7'
        stroke='#3a4a5a' stroke-width='3'/>
  <path d='M50 32 l14 4 -8 8 z' fill='#3a4a5a'/>
</svg>`
};
