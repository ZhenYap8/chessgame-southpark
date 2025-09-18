// Neutral cartoon archetype theme (formerly SouthParkTheme)
export const cartoonPieceNames = {
  white: { king:'Strategist', queen:'Leader', rook:'Guardian', bishop:'Advisor', knight:'Scout', pawn:'Trainee' },
  black: { king:'Challenger', queen:'Commander', rook:'Sentinel', bishop:'Scholar', knight:'Rider', pawn:'Cadet' }
};
export function getPieceDisplayName(piece){
  if(!piece) return '';
  return cartoonPieceNames[piece.color]?.[piece.type] || piece.type;
}
export function customAssetPath(piece){
  return `assets/theme/cartoon/${piece.color}_${piece.type}.svg`;
}
