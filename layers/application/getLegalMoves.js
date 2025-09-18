// getLegalMoves (stub) - will delegate to domain move generation
// TODO implement fully in step 3
import { generatePseudoLegalMoves, filterLegalMoves } from '../domain/rules/generation.js';

/**
 * Get legal moves for a position.
 * @param {Object} position
 * @param {number=} fromSquare optional origin square filter
 * @returns {import('../domain/Move.js').Move[]}
 */
export function getLegalMoves(position, fromSquare){
  const pseudo = generatePseudoLegalMoves(position);
  const legal = filterLegalMoves(position, pseudo);
  return typeof fromSquare === 'number' ? legal.filter(m=>m.from===fromSquare) : legal;
}
