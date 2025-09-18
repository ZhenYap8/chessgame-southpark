import { test, expect } from '../../run.js';
import { parseFEN } from '../../../layers/domain/fen/fen.js';
import { makeMove } from '../../../layers/application/makeMove.js';

const FEN_PROMO = '4k3/4P3/8/8/8/8/8/4K3 w - - 0 1';

function idx(a){ return (a.charCodeAt(0)-97)+(parseInt(a[1])-1)*8; }

test('pawn promotion generates Promotion event and replaces piece', () => {
  let pos = parseFEN(FEN_PROMO);
  const { position: after, events } = makeMove(pos, 'e7e8q');
  expect(events.includes('Promotion')).toBe(true);
  expect(after.board[idx('e8')].type).toBe('queen');
});
