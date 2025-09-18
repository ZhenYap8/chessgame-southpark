import { getPiece } from '../Board.js';
import { PieceType } from '../types.js';

// Replace previous implementation with accurate sliding logic
const DIRS_BISHOP = [9,7,-9,-7];
const DIRS_ROOK = [8,-8,1,-1];
const DIRS_KNIGHT = [17,15,10,6,-17,-15,-10,-6];

function onBoard(i){ return i>=0 && i<64; }
function fileOf(i){ return i%8; }
function rankOf(i){ return (i/8)|0; }
function stepValid(prev,next,delta){
  // Prevent wrap across files for horizontal/diagonal moves
  const pf = fileOf(prev), nf=fileOf(next);
  if(Math.abs(nf-pf)>2) return false; // large jump => wrapped
  // For single-step directions, ensure consistent delta behaviour already handled by loop
  return true;
}

/** Determine if a square is attacked by a color. */
export function isSquareAttacked(position, target, byColor){
  const { board } = position;
  // Pawns
  const dir = byColor==='white'?1:-1; // rank direction
  for(const df of [-1,1]){
    const f = fileOf(target)+df; if(f<0||f>7) continue;
    const r = rankOf(target)-dir; if(r<0||r>7) continue;
    const idx = r*8+f;
    const p = getPiece(board, idx);
    if(p && p.color===byColor && p.type===PieceType.PAWN) return true;
  }
  // Knights
  for(const o of DIRS_KNIGHT){
    const s = target + o; if(!onBoard(s)) continue;
    if(Math.abs(fileOf(s)-fileOf(target))>2) continue;
    const p = getPiece(board, s);
    if(p && p.color===byColor && p.type===PieceType.KNIGHT) return true;
  }
  // Bishops / Queens
  for(const d of DIRS_BISHOP){ let sq=target+d, prev=target; while(onBoard(sq) && stepValid(prev,sq,d)){ const p=getPiece(board,sq); if(p){ if(p.color===byColor && (p.type===PieceType.BISHOP||p.type===PieceType.QUEEN)) return true; break;} prev=sq; sq+=d; } }
  // Rooks / Queens
  for(const d of DIRS_ROOK){ let sq=target+d, prev=target; while(onBoard(sq) && stepValid(prev,sq,d)){ const p=getPiece(board,sq); if(p){ if(p.color===byColor && (p.type===PieceType.ROOK||p.type===PieceType.QUEEN)) return true; break;} prev=sq; sq+=d; } }
  // King
  for(let dr=-1;dr<=1;dr++) for(let df=-1;df<=1;df++){ if(dr||df){ const r=rankOf(target)+dr; const f=fileOf(target)+df; if(r>=0&&r<8&&f>=0&&f<8){ const idx=r*8+f; const p=getPiece(board, idx); if(p && p.color===byColor && p.type===PieceType.KING) return true; }}}
  return false;
}
