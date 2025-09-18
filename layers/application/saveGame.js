// saveGame (stub)
import { toFEN } from '../domain/fen/fen.js';
/**
 * Save current position using a storage port.
 * @param {Object} position
 * @param {{save:(fen:string)=>void}} storagePort
 */
export function saveGame(position, storagePort){
  if(!storagePort || typeof storagePort.save !== 'function') throw new Error('Invalid storage port');
  const fen = toFEN(position);
  storagePort.save(fen);
  return fen;
}
