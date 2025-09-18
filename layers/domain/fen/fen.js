import { createEmptyBoard, setPiece, coordToIndex, createInitialPosition } from '../Board.js';
import { charToPiece, pieceToChar } from '../Piece.js';
import { Color } from '../types.js';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

/**
 * Parse a FEN string to a position object.
 * @param {string} fen
 * @returns {Object} position
 */
export function parseFEN(str){
  const parts = str.trim().split(/\s+/);
  if(parts.length < 6) throw new Error('Bad FEN field count');
  const [piecePlacement, active, castling, ep, halfmoveStr, fullmoveStr] = parts;
  const board = createEmptyBoard();
  const ranks = piecePlacement.split('/');
  if(ranks.length!==8) throw new Error('Bad FEN ranks');
  for(let r=0; r<8; r++){
    let file=0;
    for(const ch of ranks[7-r]){ // FEN rank 8..1, our rank index 7..0
      if(/\d/.test(ch)){ file += parseInt(ch,10); continue; }
      const piece = charToPiece(ch);
      if(!piece) throw new Error('Bad FEN piece '+ch);
      setPiece(board, r*8 + file, piece); file++;
    }
    if(file!==8) throw new Error('Bad FEN rank length');
  }
  const activeColor = active==='w'?Color.WHITE: active==='b'?Color.BLACK: (()=>{throw new Error('Bad active color');})();
  const castlingObj = { K:false, Q:false, k:false, q:false };
  if(castling!=='-') for(const c of castling) if(castlingObj.hasOwnProperty(c)) castlingObj[c]=true; else throw new Error('Bad castling field');
  let enPassant = null;
  if(ep !== '-' ){ const m = ep.match(/^[a-h][36]$/); if(!m) throw new Error('Bad ep square'); const file = ep.charCodeAt(0)-97; const rank = parseInt(ep[1],10)-1; enPassant = rank*8+file; }
  const halfmoveClock = parseInt(halfmoveStr,10); if(isNaN(halfmoveClock)||halfmoveClock<0) throw new Error('Bad halfmove');
  const fullmoveNumber = parseInt(fullmoveStr,10); if(isNaN(fullmoveNumber)||fullmoveNumber<1) throw new Error('Bad fullmove');
  return {
    board,
    activeColor,
    castling: castlingObj,
    enPassant,
    halfmoveClock,
    fullmoveNumber,
    history: [],
    repetition: new Map()
  };
}

/**
 * Serialize a position to FEN.
 * @param {Object} position
 * @returns {string}
 */
export function toFEN(position){
  let placement='';
  for(let r=7;r>=0;r--){
    let empty=0; for(let f=0;f<8;f++){ const p=position.board[r*8+f]; if(!p) empty++; else { if(empty){ placement+=empty; empty=0; } placement += pieceToChar(p); } }
    if(empty) placement+=empty; if(r>0) placement+='/';
  }
  const side = position.activeColor===Color.WHITE?'w':'b';
  const rights = ['K','Q','k','q'].filter(r=>position.castling[r]).join('')||'-';
  const ep = position.enPassant!=null? squareName(position.enPassant): '-';
  return `${placement} ${side} ${rights} ${ep} ${position.halfmoveClock} ${position.fullmoveNumber}`;
}

function squareName(i){ return 'abcdefgh'[i%8]+(Math.floor(i/8)+1); }

export { START_FEN };
