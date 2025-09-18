import { PieceType } from '../types.js';

// Validation & invariants (stub) - TODO detailed invariants later
/**
 * Validate a position object shape & invariants.
 * Ensures: exactly one white & one black king, no negative clocks, board length 64.
 * @param {Object} position
 * @throws {Error}
 */
export function validatePosition(position){
  if(!position) throw new Error('Position missing');
  if(!Array.isArray(position.board) || position.board.length!==64) throw new Error('Bad board');
  let whiteKings=0, blackKings=0;
  for(const p of position.board){
    if(!p) continue;
    if(p.type===PieceType.KING){ if(p.color==='white') whiteKings++; else blackKings++; }
  }
  if(whiteKings!==1 || blackKings!==1) throw new Error('Invalid king count');
  if(position.halfmoveClock<0 || position.fullmoveNumber<1) throw new Error('Invalid clocks');
  if(!position.castling) throw new Error('Missing castling rights');
  return true;
}
