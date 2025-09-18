// makeMove use-case (stub) - orchestrates domain later
// TODO: Implement in step 3
import { algebraicToIndex } from '../domain/utils/coord.js';
import { generatePseudoLegalMoves, filterLegalMoves } from '../domain/rules/generation.js';
import { applyMove, evaluateStatus } from '../domain/rules/apply.js';
import { PieceType } from '../domain/types.js';

function parseInput(position, moveInput){
  if(typeof moveInput === 'string'){
    // Expect long algebraic like e2e4 or e7e8q
    const m = moveInput.trim().toLowerCase().match(/^([a-h][1-8])([a-h][1-8])([qrbn])?$/);
    if(!m) throw new Error('Bad move string');
    const from = algebraicToIndex(m[1]);
    const to = algebraicToIndex(m[2]);
    let promotion = undefined;
    if(m[3]){
      const map = { q:'queen', r:'rook', b:'bishop', n:'knight' };
      promotion = map[m[3]];
    }
    return { from, to, promotion };
  }
  if(typeof moveInput === 'object' && moveInput){
    return moveInput;
  }
  throw new Error('Unsupported move input');
}

/**
 * Apply a move input to a position (immutable) with domain events.
 * @param {Object} position
 * @param {string|{from:number,to:number,promotion?:string}} moveInput
 * @returns {{position:Object, events:string[], move:import('../domain/Move.js').Move}}
 */
export function makeMove(position, moveInput){
  const descriptor = parseInput(position, moveInput);
  const pseudo = generatePseudoLegalMoves(position);
  const legal = filterLegalMoves(position, pseudo);
  const move = legal.find(m=>m.from===descriptor.from && m.to===descriptor.to && (!descriptor.promotion || descriptor.promotion===m.promotion));
  if(!move) throw new Error('Illegal move');
  const next = applyMove(position, move);
  const events = ['MoveMade'];
  if(move.isCapture) events.push('Capture');
  if(move.promotion) events.push('Promotion');
  if(move.isCastle) events.push('Castle');
  // 50-move rule
  if(next.halfmoveClock >= 100) events.push('DrawBy50Move');
  // Threefold repetition
  const repKeyCounts = Array.from(next.repetition.values());
  const isThreefold = [...next.repetition.entries()].some(([k,v])=>v>=3);
  if(isThreefold) events.push('DrawByThreefold');
  // Status (check, mate, stalemate)
  const status = evaluateStatus(next);
  if(status.inCheck) events.push('Check');
  if(status.outcome==='checkmate') events.push('Checkmate');
  else if(status.outcome==='stalemate') events.push('Stalemate');
  return { position: next, events, move };
}
