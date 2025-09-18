// Board representation (stub) - TODO full logic in step 2
import { createPiece, pieceToChar } from './Piece.js';
import { PieceType, Color } from './types.js';

/** Create empty 64 array */
export function createEmptyBoard(){ return new Array(64).fill(null); }
export function indexToCoord(i){ return { file: i % 8, rank: Math.floor(i/8) }; }
export function coordToIndex(file, rank){ return rank*8 + file; }
export function cloneBoard(board){ return board.slice(); }
export function getPiece(board, i){ return board[i]; }
export function setPiece(board, i, p){ board[i] = p; }

function placeBackRank(board, rank, color){
  const order = [PieceType.ROOK, PieceType.KNIGHT, PieceType.BISHOP, PieceType.QUEEN, PieceType.KING, PieceType.BISHOP, PieceType.KNIGHT, PieceType.ROOK];
  for(let f=0; f<8; f++) setPiece(board, coordToIndex(f, rank), createPiece(order[f], color));
}

export function setupInitialBoard(){
  const b = createEmptyBoard();
  placeBackRank(b, 0, Color.WHITE);
  for(let f=0; f<8; f++) setPiece(b, coordToIndex(f,1), createPiece(PieceType.PAWN, Color.WHITE));
  placeBackRank(b, 7, Color.BLACK);
  for(let f=0; f<8; f++) setPiece(b, coordToIndex(f,6), createPiece(PieceType.PAWN, Color.BLACK));
  return b;
}

export function createInitialPosition(){
  const board = setupInitialBoard();
  return finalizePosition({
    board,
    activeColor: Color.WHITE,
    castling: { K:true, Q:true, k:true, q:true },
    enPassant: null,
    halfmoveClock: 0,
    fullmoveNumber: 1,
    history: [],
    repetition: new Map()
  });
}

export function clonePosition(pos){
  return {
    board: cloneBoard(pos.board),
    activeColor: pos.activeColor,
    castling: { ...pos.castling },
    enPassant: pos.enPassant,
    halfmoveClock: pos.halfmoveClock,
    fullmoveNumber: pos.fullmoveNumber,
    history: pos.history.slice(),
    repetition: new Map(pos.repetition)
  };
}

export function positionKey(pos){
  let s='';
  for(let i=0;i<64;i++) s+=pieceToChar(pos.board[i])||'.';
  s+=' '+pos.activeColor+' ';
  const rights = ['K','Q','k','q'].filter(r=>pos.castling[r]).join('')||'-';
  s+=rights+' ';
  s+= pos.enPassant!=null?pos.enPassant:'-';
  return s;
}

export function finalizePosition(pos){
  const key = positionKey(pos);
  pos.history.push(key);
  pos.repetition.set(key, (pos.repetition.get(key)||0)+1);
  return pos;
}
