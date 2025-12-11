import { getPieceDisplayName, customAssetPath } from '../ui/theme/CartoonTheme.js';
import { AvatarPresets } from '../ui/AvatarFactory.js';

// SpriteAdapter - returns generated avatars
export class SpriteAdapter {
  constructor(){
    this.cache = new Map();
    this.whiteSet = {
      king:   AvatarPresets.whiteKing,
      queen:  AvatarPresets.whiteQueen,
      rook:   AvatarPresets.whiteRook,
      bishop: AvatarPresets.whiteBishop,
      knight: AvatarPresets.whiteKnight,
      pawn:   AvatarPresets.whitePawn
    };
    this.blackSet = {
      king:   AvatarPresets.blackKing,
      queen:  AvatarPresets.blackQueen,
      rook:   AvatarPresets.blackRook,
      bishop: AvatarPresets.blackBishop,
      knight: AvatarPresets.blackKnight,
      pawn:   AvatarPresets.blackPawn
    };
  }
  // Attempt future custom asset override (not loading now, but path reserved)
  /** @param {{type:string,color:string}} piece */
  getSprite(piece){
    if(!piece) return '';
    const key = piece.color+':'+piece.type;
    if(this.cache.has(key)) return this.cache.get(key);
    const set = piece.color==='white'? this.whiteSet: this.blackSet;
    const gen = set[piece.type];
    const dataUrl = gen? gen(): AvatarPresets.traineePawn();
    this.cache.set(key, dataUrl);
    return dataUrl;
  }
  generateThemedSprite(piece){
    const name = encodeURIComponent(getPieceDisplayName(piece));
    const sideBg = piece.color==='white'? '%23f7f3e9':'%232b2f33';
    const sideStroke = piece.color==='white'? '%239c8f7a':'%23444';
    const txt = piece.color==='white'? '%23222222':'%23f5f5f5';
    const accent = piece.color==='white'? '%23d27d2c':'%23d2b42c';
    const base = [];
    // Base circle / plate
    base.push(`<circle cx='40' cy='42' r='34' fill='${sideBg}' stroke='${sideStroke}' stroke-width='4'/>`);
    // Piece-type specific glyph (simple shapes)
    switch(piece.type){
      case 'king':
        base.push(`<rect x='28' y='18' width='24' height='8' rx='2' fill='${accent}'/>`);
        base.push(`<rect x='34' y='10' width='12' height='8' rx='1' fill='${accent}'/>`);
        base.push(`<rect x='37' y='4' width='6' height='6' rx='1' fill='${accent}'/>`);
        break;
      case 'queen':
        base.push(`<circle cx='30' cy='18' r='6' fill='${accent}'/>`);
        base.push(`<circle cx='40' cy='12' r='6' fill='${accent}'/>`);
        base.push(`<circle cx='50' cy='18' r='6' fill='${accent}'/>`);
        base.push(`<rect x='28' y='24' width='24' height='6' rx='2' fill='${accent}'/>`);
        break;
      case 'rook':
        base.push(`<rect x='26' y='14' width='28' height='24' fill='${accent}' rx='2'/>`);
        base.push(`<rect x='26' y='12' width='6' height='6' fill='${accent}'/>`);
        base.push(`<rect x='35' y='12' width='6' height='6' fill='${accent}'/>`);
        base.push(`<rect x='44' y='12' width='6' height='6' fill='${accent}'/>`);
        break;
      case 'bishop':
        base.push(`<ellipse cx='40' cy='22' rx='10' ry='14' fill='${accent}'/>`);
        base.push(`<rect x='37' y='8' width='6' height='10' rx='2' fill='${accent}'/>`);
        base.push(`<circle cx='40' cy='6' r='4' fill='${accent}'/>`);
        break;
      case 'knight':
        base.push(`<path d='M30 38 L30 20 L40 10 L52 18 L46 20 L52 30 L40 38 Z' fill='${accent}' stroke='${sideStroke}' stroke-width='2' stroke-linejoin='round'/>`);
        base.push(`<circle cx='43' cy='19' r='2.5' fill='${txt}'/>`);
        break;
      case 'pawn':
      default:
        base.push(`<circle cx='40' cy='20' r='10' fill='${accent}'/>`);
        base.push(`<rect x='34' y='28' width='12' height='14' rx='4' fill='${accent}'/>`);
        break;
    }
    // Label (truncate to 5 chars for readability)
    const short = name.split('%20')[0].slice(0,5); // use first token
    base.push(`<text x='50%' y='66' font-family='system-ui,sans-serif' font-size='14' font-weight='600' text-anchor='middle' fill='${txt}'>${short}</text>`);
    const svg = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='80' height='80'>${base.join('')}</svg>`;
    return svg;
  }
}
