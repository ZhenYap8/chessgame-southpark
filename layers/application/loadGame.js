// loadGame (stub)
import { parseFEN } from '../domain/fen/fen.js';
/**
 * Load saved game from storage port.
 * @param {{load:()=>string|null}} storagePort
 * @returns {Object|null}
 */
export function loadGame(storagePort){
  if(!storagePort || typeof storagePort.load !== 'function') throw new Error('Invalid storage port');
  const fen = storagePort.load();
  if(!fen) return null;
  return parseFEN(fen);
}
