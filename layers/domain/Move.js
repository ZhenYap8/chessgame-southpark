// Move structure (stub)
/**
 * @typedef {Object} Move
 * @property {number} from  // 0-63
 * @property {number} to    // 0-63
 * @property {import('./types.js').PieceTypeValue=} promotion
 * @property {boolean=} isCapture
 * @property {'K'|'Q'=} isCastle
 * @property {boolean=} isEnPassant
 */

/** Create a move object */
export function createMove(from, to, extras={}){ return { from, to, ...extras }; }
