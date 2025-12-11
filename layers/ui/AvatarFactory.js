// ui/AvatarFactory.js
// Tiny generator for original South-Park-style inspired avatars (generic, non-infringing)
// Returns a data: URL you can use as an <img src>.

const SVG_NS = 'http://www.w3.org/2000/svg';
function svgToDataUrl(svg){
  const xml = new XMLSerializer().serializeToString(svg);
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(xml);
}
function circle(svg,cx,cy,r,fill,stroke=null,sw=0){ const el=document.createElementNS(SVG_NS,'circle'); el.setAttribute('cx',cx); el.setAttribute('cy',cy); el.setAttribute('r',r); el.setAttribute('fill',fill); if(stroke){ el.setAttribute('stroke',stroke); el.setAttribute('stroke-width',sw);} svg.appendChild(el); return el; }
function rect(svg,x,y,w,h,fill){ const el=document.createElementNS(SVG_NS,'rect'); el.setAttribute('x',x); el.setAttribute('y',y); el.setAttribute('width',w); el.setAttribute('height',h); el.setAttribute('fill',fill); svg.appendChild(el); return el; }
function path(svg,d,fill,stroke=null,sw=0){ const el=document.createElementNS(SVG_NS,'path'); el.setAttribute('d',d); el.setAttribute('fill',fill); if(stroke){ el.setAttribute('stroke',stroke); el.setAttribute('stroke-width',sw);} svg.appendChild(el); return el; }
function ellipse(svg,cx,cy,rx,ry,fill){ const el=document.createElementNS(SVG_NS,'ellipse'); el.setAttribute('cx',cx); el.setAttribute('cy',cy); el.setAttribute('rx',rx); el.setAttribute('ry',ry); el.setAttribute('fill',fill); svg.appendChild(el); return el; }

export function makeAvatar({
  size=96,
  skin='#F4D0A6',
  jacket='#E05A2A',
  hat=null,           // {type:'beanie'|'ushanka'|'cap'|'hood', color:'#hex', trim?:'#hex'}
  hair=null,          // {color:'#hex', style:'short'|'pigtails'|'moustache'}
  outline='#1f1f1f',
  eye='#000',
  bg='transparent',
  mouth='line',       // 'line' | 'smile' | 'open'
  badge=null,
  label=null,
  labelColor='#000'
}={}){
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('xmlns',SVG_NS); svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('width',size); svg.setAttribute('height',size);
  if(bg!=='transparent') circle(svg,50,50,50,bg);
  rect(svg,18,58,64,30,jacket); // torso
  if(label){
    const t = document.createElementNS(SVG_NS,'text');
    t.setAttribute('x','50'); t.setAttribute('y','78');
    t.setAttribute('text-anchor','middle'); t.setAttribute('fill',labelColor);
    t.setAttribute('font-family','sans-serif'); t.setAttribute('font-weight','900');
    t.setAttribute('font-size','14'); t.textContent = label;
    svg.appendChild(t);
  }
  if(badge) circle(svg,74,70,4,badge);
  rect(svg,43,58,14,7,skin); // neck
  circle(svg,50,42,22,skin,outline,.7); // head
  if(hair){
    if(hair.style==='short') ellipse(svg,50,28,22,12,hair.color);
    if(hair.style==='pigtails'){ ellipse(svg,50,28,22,12,hair.color); circle(svg,27,36,6,hair.color); circle(svg,73,36,6,hair.color);} 
    if(hair.style==='moustache') rect(svg,40,48,20,3,hair.color);
  }
  if(hat){
    if(hat.type==='beanie'){ ellipse(svg,50,24,23,10,hat.color); rect(svg,27,28,46,6,hat.trim??'#e6e6e6'); circle(svg,50,14,4.5,hat.trim??'#e6e6e6'); }
    if(hat.type==='ushanka'){ rect(svg,24,20,52,12,hat.color); rect(svg,24,32,10,12,hat.trim??'#2b2b2b'); rect(svg,66,32,10,12,hat.trim??'#2b2b2b'); }
    if(hat.type==='cap'){ ellipse(svg,50,25,22,10,hat.color); path(svg,'M28,26 C40,32 60,32 72,26 L72,31 L28,31 Z',hat.trim??'#2b2b2b'); }
    if(hat.type==='hood'){ ellipse(svg,50,36,26,22,hat.color); path(svg,'M24,60 L76,60 L80,80 L20,80 Z',hat.color); ellipse(svg,50,36,20,18,'#ffffff15'); }
  }
  ellipse(svg,42,42,6.5,6,'#fff'); ellipse(svg,58,42,6.5,6,'#fff'); circle(svg,42,43,1.7,eye); circle(svg,58,43,1.7,eye); // eyes
  if(mouth==='line') rect(svg,44,52,12,1.5,'#111');
  if(mouth==='smile') path(svg,'M40,52 Q50,57 60,52','none'), path(svg,'M40,52 Q50,57 60,52','#111');
  if(mouth==='open') ellipse(svg,50,53,4.2,3.5,'#111');
  rect(svg,49.2,58,1.6,30,'#1b1b1b2a'); // seam
  return svgToDataUrl(svg);
}

export function makeHorse({
  size=96,
  coat='#d2b48c',
  mane='#8b4513',
  eye='#000',
  bg='transparent',
  label='N',
  labelColor='#000'
}={}){
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('xmlns',SVG_NS); svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('width',size); svg.setAttribute('height',size);
  if(bg!=='transparent') circle(svg,50,50,50,bg);
  
  // Neck/Body
  path(svg,'M30,90 L30,60 Q30,40 50,35 Q70,40 70,60 L70,90 Z', coat);
  
  // Label
  if(label){
    const t = document.createElementNS(SVG_NS,'text');
    t.setAttribute('x','50'); t.setAttribute('y','80');
    t.setAttribute('text-anchor','middle'); t.setAttribute('fill',labelColor);
    t.setAttribute('font-family','sans-serif'); t.setAttribute('font-weight','900');
    t.setAttribute('font-size','16'); t.textContent = label;
    svg.appendChild(t);
  }

  // Head
  ellipse(svg,50,35,18,22,coat);
  ellipse(svg,50,50,14,10,coat); // Snout
  
  // Ears
  path(svg,'M35,20 L40,5 L50,20 Z',coat);
  path(svg,'M65,20 L60,5 L50,20 Z',coat);

  // Mane
  path(svg,'M50,15 Q50,5 45,15',mane);
  path(svg,'M50,15 Q50,5 55,15',mane);
  
  // Eyes
  circle(svg,42,32,6,'#fff'); circle(svg,42,32,1.5,eye);
  circle(svg,58,32,6,'#fff'); circle(svg,58,32,1.5,eye);

  // Nostrils
  circle(svg,45,50,1.5,'#000');
  circle(svg,55,50,1.5,'#000');

  return svgToDataUrl(svg);
}

export const AvatarPresets = {
  redBeanieKid: ()=> makeAvatar({ jacket:'#2b6cb0', hat:{type:'beanie', color:'#b91c1c', trim:'#e5a50a'}, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' }),
  greenUshankaKid: ()=> makeAvatar({ jacket:'#10b981', hat:{type:'ushanka', color:'#15803d', trim:'#0f5132'}, hair:{style:'short', color:'#3f3f3f'}, mouth:'smile' }),
  roundCapKid: ()=> makeAvatar({ jacket:'#ffce32', hat:{type:'cap', color:'#1f2937', trim:'#b91c1c'}, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' }),
  orangeHoodKid: ()=> makeAvatar({ jacket:'#d97706', hat:{type:'hood', color:'#f59e0b'}, hair:null, mouth:'open' }),
  pigtailsGirl: ()=> makeAvatar({ jacket:'#a78bfa', hat:{type:'beanie', color:'#111827', trim:'#e5e7eb'}, hair:{style:'pigtails', color:'#1f2937'}, mouth:'smile' }),
  moustacheDad: ()=> makeAvatar({ jacket:'#374151', hat:null, hair:{style:'moustache', color:'#2b2b2b'}, mouth:'line' }),
  chefHat: ()=> makeAvatar({ jacket:'#ef4444', hat:{type:'beanie', color:'#f5f5f5', trim:'#e5e7eb'}, hair:{style:'short', color:'#111'}, mouth:'smile' }),
  bookishBoy: ()=> makeAvatar({ jacket:'#22c55e', hat:null, hair:{style:'short', color:'#0f172a'}, mouth:'line', badge:'#111827' }),
  traineePawn: ()=> makeAvatar({ jacket:'#9ca3af', hat:null, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' }),

  // White Team (Light clothing, dark text)
  whiteKing: ()=> makeAvatar({ jacket:'#e5e7eb', hat:{type:'ushanka', color:'#d1d5db', trim:'#60a5fa'}, hair:{style:'short', color:'#4b5563'}, mouth:'smile', label:'K', labelColor:'#111' }),
  whiteQueen: ()=> makeAvatar({ jacket:'#f3f4f6', hat:{type:'beanie', color:'#fca5a5', trim:'#fee2e2'}, hair:{style:'short', color:'#4b5563'}, mouth:'line', label:'Q', labelColor:'#111' }),
  whiteRook: ()=> makeAvatar({ jacket:'#e5e7eb', hat:{type:'beanie', color:'#ffffff', trim:'#9ca3af'}, hair:{style:'short', color:'#4b5563'}, mouth:'smile', label:'R', labelColor:'#111' }),
  whiteBishop: ()=> makeAvatar({ jacket:'#d1d5db', hat:null, hair:{style:'short', color:'#4b5563'}, mouth:'line', badge:'#3b82f6', label:'B', labelColor:'#111' }),
  whiteKnight: ()=> makeHorse({ coat:'#fdba74', mane:'#fff', label:'KN', labelColor:'#111' }),
  whitePawn: ()=> makeAvatar({ jacket:'#f3f4f6', hat:null, hair:{style:'short', color:'#9ca3af'}, mouth:'line', label:'P', labelColor:'#111' }),

  // Black Team (Dark clothing, light text)
  blackKing: ()=> makeAvatar({ jacket:'#1f2937', hat:{type:'cap', color:'#000000', trim:'#dc2626'}, hair:{style:'short', color:'#000000'}, mouth:'line', label:'K', labelColor:'#eee' }),
  blackQueen: ()=> makeAvatar({ jacket:'#374151', hat:{type:'beanie', color:'#111827', trim:'#4b5563'}, hair:{style:'pigtails', color:'#000000'}, mouth:'smile', label:'Q', labelColor:'#eee' }),
  blackRook: ()=> makeAvatar({ jacket:'#111827', hat:null, hair:{style:'moustache', color:'#000000'}, mouth:'line', label:'R', labelColor:'#eee' }),
  blackBishop: ()=> makeAvatar({ jacket:'#1f2937', hat:null, hair:{style:'short', color:'#000000'}, mouth:'line', badge:'#ef4444', label:'B', labelColor:'#eee' }),
  blackKnight: ()=> makeHorse({ coat:'#7c2d12', mane:'#000', label:'KN', labelColor:'#eee' }),
  blackPawn: ()=> makeAvatar({ jacket:'#374151', hat:null, hair:{style:'short', color:'#111827'}, mouth:'line', label:'P', labelColor:'#eee' })
};
