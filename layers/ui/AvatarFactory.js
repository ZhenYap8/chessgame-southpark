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
function path(svg,d,fill){ const el=document.createElementNS(SVG_NS,'path'); el.setAttribute('d',d); el.setAttribute('fill',fill); svg.appendChild(el); return el; }
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
}={}){
  const svg=document.createElementNS(SVG_NS,'svg');
  svg.setAttribute('xmlns',SVG_NS); svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('width',size); svg.setAttribute('height',size);
  if(bg!=='transparent') circle(svg,50,50,50,bg);
  rect(svg,18,58,64,30,jacket); // torso
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

export const AvatarPresets = {
  redBeanieKid: ()=> makeAvatar({ jacket:'#2b6cb0', hat:{type:'beanie', color:'#b91c1c', trim:'#e5a50a'}, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' }),
  greenUshankaKid: ()=> makeAvatar({ jacket:'#10b981', hat:{type:'ushanka', color:'#15803d', trim:'#0f5132'}, hair:{style:'short', color:'#3f3f3f'}, mouth:'smile' }),
  roundCapKid: ()=> makeAvatar({ jacket:'#ffce32', hat:{type:'cap', color:'#1f2937', trim:'#b91c1c'}, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' }),
  orangeHoodKid: ()=> makeAvatar({ jacket:'#d97706', hat:{type:'hood', color:'#f59e0b'}, hair:null, mouth:'open' }),
  pigtailsGirl: ()=> makeAvatar({ jacket:'#a78bfa', hat:{type:'beanie', color:'#111827', trim:'#e5e7eb'}, hair:{style:'pigtails', color:'#1f2937'}, mouth:'smile' }),
  moustacheDad: ()=> makeAvatar({ jacket:'#374151', hat:null, hair:{style:'moustache', color:'#2b2b2b'}, mouth:'line' }),
  chefHat: ()=> makeAvatar({ jacket:'#ef4444', hat:{type:'beanie', color:'#f5f5f5', trim:'#e5e7eb'}, hair:{style:'short', color:'#111'}, mouth:'smile' }),
  bookishBoy: ()=> makeAvatar({ jacket:'#22c55e', hat:null, hair:{style:'short', color:'#0f172a'}, mouth:'line', badge:'#111827' }),
  traineePawn: ()=> makeAvatar({ jacket:'#9ca3af', hat:null, hair:{style:'short', color:'#2b2b2b'}, mouth:'line' })
};
