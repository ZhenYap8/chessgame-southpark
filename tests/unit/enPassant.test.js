import { test, expect } from '../../run.js';
import { parseFEN } from '../../../layers/domain/fen/fen.js';
import { getLegalMoves } from '../../../layers/application/getLegalMoves.js';
import { makeMove } from '../../../layers/application/makeMove.js';
import { toFEN } from '../../../layers/domain/fen/fen.js';

// En passant legal example: after e2e4 d7d5 e4e5 c7c5, white can dxc6 ep if a pawn existed etc.
// Use a simpler constructed FEN: White pawn on e5, black pawn on d5, black to move plays d5-d4 enabling ep? Actually need typical pattern.
// We'll set position: white pawn e5 (file e rank5 -> e5 = e4? FEN ranks), black pawn d5, black to move just advanced pawn from d7 to d5 so ep square is d6 (not correct). Easier: Use known EP scenario after 1.e4 c5 2.d4 cxd4 3.c3 dxc3 4.Nxc3 (skip). For brevity build direct.
// We'll craft: White: king e1, pawn e5; Black: king e8, pawn d7. Side to move black, no ep. Black plays d7d5 => creates ep square d6; then white can exd6 ep.

function algebraicToIndex(a){ return (a.charCodeAt(0)-97) + (parseInt(a[1])-1)*8; }

const FEN_EP_START = '4k3/3p4/8/4P3/8/8/8/4K3 b - - 0 1';

test('en passant creation and capture', () => {
  let pos = parseFEN(FEN_EP_START);
  // Black plays d7d5
  ({ position: pos } = makeMove(pos, 'd7d5'));
  expect(pos.enPassant).toBe(algebraicToIndex('d6'));
  // White legal moves should include e5d6 (en passant capture)
  const moves = getLegalMoves(pos).filter(m=>m.from===algebraicToIndex('e5'));
  expect(moves.some(m=>m.to===algebraicToIndex('d6') && m.isEnPassant)).toBe(true);
  // Execute ep
  ({ position: pos } = makeMove(pos, 'e5d6'));
  // Captured pawn should be removed (from d5 square)
  expect(pos.board[algebraicToIndex('d5')]).toBe(null);
});

const FEN_EP_ILLEGAL = '4k3/8/3p4/4P3/8/8/8/4K3 b - - 0 1'; // pawn on d6 blocks scenario

test('en passant not available when square occupied', () => {
  let pos = parseFEN(FEN_EP_ILLEGAL);
  ({ position: pos } = makeMove(pos, 'd6d5'));
  expect(pos.enPassant).toBe(null);
});
