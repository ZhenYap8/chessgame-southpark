// Chess domain types (enums)
export const Color = Object.freeze({ WHITE: 'white', BLACK: 'black' });
export const PieceType = Object.freeze({ KING:'king', QUEEN:'queen', ROOK:'rook', BISHOP:'bishop', KNIGHT:'knight', PAWN:'pawn' });

/** @typedef {'white'|'black'} ColorType */
/** @typedef {'king'|'queen'|'rook'|'bishop'|'knight'|'pawn'} PieceTypeValue */

export const ALL_COLORS = ['white','black'];
export const ALL_PIECE_TYPES = ['king','queen','rook','bishop','knight','pawn'];

export function opposite(color){ return color === Color.WHITE ? Color.BLACK : Color.WHITE; }
