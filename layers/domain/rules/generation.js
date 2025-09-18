import { getPiece, coordToIndex, cloneBoard, positionKey } from '../Board.js';
import { createPiece } from '../Piece.js';
import { PieceType } from '../types.js';
import { isSquareAttacked } from './attacks.js';
import { createMove } from '../Move.js';

const KNIGHT_OFFSETS = [17,15,10,6,-17,-15,-10,-6];
const BISHOP_DIRS = [9,7,-9,-7];
const ROOK_DIRS = [8,-8,1,-1];
const QUEEN_DIRS = [...BISHOP_DIRS, ...ROOK_DIRS];

function onBoard(i){ return i>=0 && i<64; }
function fileOf(i){ return i%8; }
function rankOf(i){ return (i/8)|0; }
function sameFile(a,b){ return fileOf(a)===fileOf(b); }

/** Generate pseudo-legal moves (may leave own king in check). */
export function generatePseudoLegalMoves(position){
  const { board, activeColor, castling, enPassant } = position;
  const moves = [];
  for(let i=0;i<64;i++){
    const p = board[i]; if(!p || p.color!==activeColor) continue;
    switch(p.type){
      case PieceType.PAWN: genPawn(board, i, p, position, moves); break;
      case PieceType.KNIGHT: genKnight(board, i, p, moves); break;
      case PieceType.BISHOP: genSlider(board, i, p, BISHOP_DIRS, moves); break;
      case PieceType.ROOK: genSlider(board, i, p, ROOK_DIRS, moves); break;
      case PieceType.QUEEN: genSlider(board, i, p, QUEEN_DIRS, moves); break;
      case PieceType.KING: genKing(board, i, p, position, moves, castling); break;
    }
  }
  // En passant capture squares already included via pawn capture logic referencing enPassant square; mark them
  if(enPassant!=null){
    for(const m of moves){
      if(m.to === enPassant && board[m.from].type===PieceType.PAWN && fileOf(m.from)!==fileOf(m.to)){
        const dir = board[m.from].color==='white'? -8: 8; // captured pawn behind target
        if(!getPiece(board, m.to)) m.isEnPassant = true;
      }
    }
  }
  return moves;
}

function genPawn(board, i, piece, position, moves){
  const dir = piece.color==='white'? 8 : -8; // forward delta
  const one = i + dir; if(onBoard(one) && !getPiece(board, one)){
    maybeAddPawnAdvance(i, one, piece, moves);
    const startRank = piece.color==='white'?1:6;
    if(rankOf(i)===startRank){
      const two = one + dir;
      if(onBoard(two) && !getPiece(board, two)) moves.push(createMove(i, two, {}));
    }
  }
  // captures
  for(const df of [-1,1]){
    const f = fileOf(i)+df; if(f<0||f>7) continue;
    const target = i + dir + df; if(!onBoard(target)) continue;
    const tp = getPiece(board, target);
    if(tp && tp.color!==piece.color){ maybeAddPawnCapture(i, target, piece, moves, true); }
    else if(position.enPassant===target){ // ep target square
      const mv = createMove(i, target, { isCapture:true }); mv.isEnPassant=true; moves.push(mv); }
  }
}
function maybeAddPawnAdvance(from,to,piece,moves){
  const promRank = piece.color==='white'?7:0;
  if(rankOf(to)===promRank){
    for(const pt of [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT]) moves.push(createMove(from,to,{promotion:pt}));
  } else moves.push(createMove(from,to,{}));
}
function maybeAddPawnCapture(from,to,piece,moves,isCapture){
  const promRank = piece.color==='white'?7:0;
  if(rankOf(to)===promRank){
    for(const pt of [PieceType.QUEEN, PieceType.ROOK, PieceType.BISHOP, PieceType.KNIGHT]) moves.push(createMove(from,to,{promotion:pt,isCapture:true}));
  } else moves.push(createMove(from,to,{isCapture}));
}
function genKnight(board,i,p,moves){
  for(const o of KNIGHT_OFFSETS){ const t=i+o; if(!onBoard(t)) continue; if(Math.abs(fileOf(t)-fileOf(i))>2) continue; const tp=getPiece(board,t); if(!tp||tp.color!==p.color) moves.push(createMove(i,t,{isCapture:!!tp})); }
}
function genSlider(board,i,p,dirs,moves){
  for(const d of dirs){ let sq=i+d; while(onBoard(sq) && Math.abs(fileOf(sq)-fileOf(sq-d))<=2){ const tp=getPiece(board,sq); if(tp){ if(tp.color!==p.color) moves.push(createMove(i,sq,{isCapture:true})); break; } else moves.push(createMove(i,sq,{})); sq+=d; } }
}
function genKing(board,i,p,position,moves,castling){
  for(let dr=-1;dr<=1;dr++) for(let df=-1;df<=1;df++){ if(dr||df){ const r=rankOf(i)+dr; const f=fileOf(i)+df; if(r>=0&&r<8&&f>=0&&f<8){ const t=r*8+f; const tp=getPiece(board,t); if(!tp||tp.color!==p.color) moves.push(createMove(i,t,{isCapture:!!tp})); }}}
  // Castling
  if(p.color==='white'){
    if(castling.K && !getPiece(board,5) && !getPiece(board,6) && !isSquareAttacked(position,4,'black') && !isSquareAttacked(position,5,'black') && !isSquareAttacked(position,6,'black')) moves.push(createMove(i,6,{isCastle:'K'}));
    if(castling.Q && !getPiece(board,3) && !getPiece(board,2) && !getPiece(board,1) && !isSquareAttacked(position,4,'black') && !isSquareAttacked(position,3,'black') && !isSquareAttacked(position,2,'black')) moves.push(createMove(i,2,{isCastle:'Q'}));
  } else {
    if(castling.k && !getPiece(board,61) && !getPiece(board,62) && !isSquareAttacked(position,60,'white') && !isSquareAttacked(position,61,'white') && !isSquareAttacked(position,62,'white')) moves.push(createMove(i,62,{isCastle:'K'}));
    if(castling.q && !getPiece(board,59) && !getPiece(board,58) && !getPiece(board,57) && !isSquareAttacked(position,60,'white') && !isSquareAttacked(position,59,'white') && !isSquareAttacked(position,58,'white')) moves.push(createMove(i,58,{isCastle:'Q'}));
  }
}

/** Filter to legal moves (own king not left in check). */
export function filterLegalMoves(position, moves){
  const legal = [];
  for(const m of moves){
    const next = applyPseudo(position, m);
    const kingSq = findKing(next.board, position.activeColor); // after move, side to move switches, so check old color's king via next state inactive color? Actually must ensure original side's king not in check in new position.
    if(!isSquareAttacked(next, kingSq, next.activeColor)) legal.push(m);
  }
  return legal;
}
function findKing(board, color){ for(let i=0;i<64;i++){ const p=board[i]; if(p && p.color===color && p.type===PieceType.KING) return i; } return -1; }

function applyPseudo(position, move){
  const { board } = position; const nextBoard = cloneBoard(board);
  const piece = board[move.from];
  // Remove captured piece
  if(move.isEnPassant){
    const capSq = piece.color==='white'? move.to-8 : move.to+8; nextBoard[capSq]=null;
  }
  if(move.isCastle){
    if(move.isCastle==='K'){
      if(piece.color==='white'){ nextBoard[5]=nextBoard[7]; nextBoard[7]=null; }
      else { nextBoard[61]=nextBoard[63]; nextBoard[63]=null; }
    } else {
      if(piece.color==='white'){ nextBoard[3]=nextBoard[0]; nextBoard[0]=null; }
      else { nextBoard[59]=nextBoard[56]; nextBoard[56]=null; }
    }
  }
  nextBoard[move.to] = move.promotion ? createPiece(move.promotion, piece.color) : piece;
  nextBoard[move.from] = null;
  return { ...position, board: nextBoard, activeColor: position.activeColor==='white'?'black':'white' };
}
