// loadFen (stub)
import { parseFEN } from '../domain/fen/fen.js';
/**
 * Load a FEN string into a position.
 * @param {string} fen
 * @returns {Object} position
 */
export function loadFen(fen){
  // TODO validate after parse
  return parseFEN(fen);
}
