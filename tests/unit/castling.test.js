import { test, expect } from '../../run.js';
import { parseFEN } from '../../../layers/domain/fen/fen.js';
import { getLegalMoves } from '../../../layers/application/getLegalMoves.js';
import { makeMove } from '../../../layers/application/makeMove.js';

// Castling availability tests
// Position with only rooks & kings preserving rights: White can O-O-O, Black can O-O
const FEN_CASTLE = '4k2r/8/8/8/8/8/8/R3K3 w Qk - 0 1';

function sq(a){ return (a.charCodeAt(0)-97)+(parseInt(a[1])-1)*8; }

test('castling moves appear in legal move list', () => {
  let pos = parseFEN(FEN_CASTLE);
  const legal = getLegalMoves(pos, sq('e1'));
  expect(legal.some(m=>m.isCastle==='Q' && m.to===sq('c1'))).toBe(true);
  // Play O-O-O (e1c1)
  ({ position: pos } = makeMove(pos, 'e1c1'));
  // Black side: from e8 should have kingside castle
  const blackLegal = getLegalMoves(pos, sq('e8'));
  expect(blackLegal.some(m=>m.isCastle==='K' && m.to===sq('g8'))).toBe(true);
});
