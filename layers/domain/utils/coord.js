// Coordinate helpers
export function indexToAlgebraic(i){ const f=i%8, r=Math.floor(i/8); return 'abcdefgh'[f]+(r+1); }
export function algebraicToIndex(str){
  if(!/^([a-h][1-8])$/.test(str)) throw new Error('Bad square '+str);
  const f=str.charCodeAt(0)-97; const r=parseInt(str[1],10)-1; return r*8+f;
}
