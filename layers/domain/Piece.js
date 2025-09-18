// Piece factory (stub) - TODO implement fully in step 2
import { PieceType, Color, ALL_PIECE_TYPES, ALL_COLORS } from './types.js';

/**
 * @typedef {Object} Piece
 * @property {PieceTypeValue} type
 * @property {ColorType} color
 */

export function validateType(type){
  if(!ALL_PIECE_TYPES.includes(type)) throw new Error('Invalid piece type '+type);
}
export function validateColor(color){
  if(!ALL_COLORS.includes(color)) throw new Error('Invalid color '+color);
}
/**
 * Create a piece (validated)
 * @param {PieceTypeValue} type
 * @param {ColorType} color
 * @returns {Piece}
 */
export function createPiece(type, color){
  validateType(type); validateColor(color); return { type, color };
}

/** Serialize a piece to single char (for FEN & hashing) */
export function pieceToChar(p){
  if(!p) return '';
  const map = { king:'k', queen:'q', rook:'r', bishop:'b', knight:'n', pawn:'p' };
  const c = map[p.type];
  return p.color === 'white' ? c.toUpperCase() : c;
}

/** Parse single FEN char to piece */
export function charToPiece(ch){
  const lower = ch.toLowerCase();
  const map = { k:'king', q:'queen', r:'rook', b:'bishop', n:'knight', p:'pawn' };
  const type = map[lower]; if(!type) return null;
  return createPiece(type, ch === lower ? 'black':'white');
}
