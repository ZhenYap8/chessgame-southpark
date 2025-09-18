import { clonePosition, finalizePosition, positionKey } from '../Board.js';
import { createPiece } from '../Piece.js';
import { PieceType } from '../types.js';
import { generatePseudoLegalMoves, filterLegalMoves } from './generation.js';
import { isSquareAttacked } from './attacks.js';

function findKing(board,color){ for(let i=0;i<64;i++){ const p=board[i]; if(p && p.color===color && p.type===PieceType.KING) return i; } return -1; }

/** Apply a legal move immutably.
 * Updates: board, activeColor, castling rights, enPassant, clocks, repetition.
 * @param {Object} position
 * @param {import('../Move.js').Move} move
 * @returns {Object} newPosition
 */
export function applyMove(position, move){
  const next = clonePosition(position);
  const piece = next.board[move.from];
  const targetPiece = next.board[move.to];
  // Halfmove clock reset conditions
  if(piece.type===PieceType.PAWN || targetPiece || move.isEnPassant) next.halfmoveClock = 0; else next.halfmoveClock++;
  // Move piece basics
  if(move.isEnPassant){
    const capSq = piece.color==='white'? move.to-8 : move.to+8;
    next.board[capSq] = null;
  }
  if(move.isCastle){
    if(move.isCastle==='K'){
      if(piece.color==='white'){ next.board[5]=next.board[7]; next.board[7]=null; }
      else { next.board[61]=next.board[63]; next.board[63]=null; }
    } else {
      if(piece.color==='white'){ next.board[3]=next.board[0]; next.board[0]=null; }
      else { next.board[59]=next.board[56]; next.board[56]=null; }
    }
  }
  next.board[move.to] = move.promotion ? createPiece(move.promotion, piece.color) : piece;
  next.board[move.from] = null;
  // Castling rights update
  if(piece.type===PieceType.KING){
    if(piece.color==='white'){ next.castling.K=false; next.castling.Q=false; }
    else { next.castling.k=false; next.castling.q=false; }
  }
  if(piece.type===PieceType.ROOK){
    if(move.from===0) next.castling.Q=false;
    if(move.from===7) next.castling.K=false;
    if(move.from===56) next.castling.q=false;
    if(move.from===63) next.castling.k=false;
  }
  // Captured rook removes rights
  if(targetPiece && targetPiece.type===PieceType.ROOK){
    if(move.to===0) next.castling.Q=false;
    if(move.to===7) next.castling.K=false;
    if(move.to===56) next.castling.q=false;
    if(move.to===63) next.castling.k=false;
  }
  if(move.isEnPassant){ // captured pawn behind target square not a rook, ignore
  }
  // En passant target square
  if(piece.type===PieceType.PAWN && Math.abs(move.to - move.from)===16){
    const epFile = move.from%8; const epRank = piece.color==='white'?2:5; // square the pawn passes over
    next.enPassant = epRank*8 + epFile;
  } else next.enPassant = null;
  // Active color & fullmove
  next.activeColor = position.activeColor==='white' ? 'black':'white';
  if(next.activeColor==='white') next.fullmoveNumber++;
  // Repetition key update
  const key = positionKey(next); // (piece placement + side + castling + ep)
  next.history.push(key);
  next.repetition.set(key, (next.repetition.get(key)||0)+1);
  return next;
}

/** Determine game status after move. */
export function evaluateStatus(position){
  const moves = filterLegalMoves(position, generatePseudoLegalMoves(position));
  const oppColor = position.activeColor; // side to move is opponent of last mover
  const kingSq = findKing(position.board, oppColor);
  const inCheck = isSquareAttacked(position, kingSq, oppColor==='white'?'black':'white');
  let status = { moves, inCheck, outcome:null };
  if(moves.length===0){
    status.outcome = inCheck? 'checkmate':'stalemate';
  }
  return status;
}
