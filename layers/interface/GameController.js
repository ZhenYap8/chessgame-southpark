// GameController (stub) - mediates UI and application use-cases
// TODO: fill with real orchestration in later steps
import { makeMove } from '../application/makeMove.js';
import { getLegalMoves } from '../application/getLegalMoves.js';
import { resetGame } from '../application/resetGame.js';
import { indexToAlgebraic } from '../domain/utils/coord.js';

export class GameController {
  constructor({ boardView, sidebarView, storage, audio, sprites }){
    this.boardView = boardView; this.sidebarView = sidebarView; this.storage = storage; this.audio = audio; this.sprites = sprites;
    this.position = null; // TODO real position shape
  }
  init(){
    this.position = resetGame();
    this.selected = null;
    this.boardView.onSquareClick = (i)=>this.handleSquareClick(i);
    this.boardView.renderInitial(this.position, this.sprites);
    this.sidebarView.onNewGame = ()=>this.newGame();
    this.sidebarView.updateStatus('White to move');
  }
  handleSquareClick(i){
    const piece = this.position.board[i];
    if(this.selected==null){
      if(piece && piece.color===this.position.activeColor){
        this.selected = i;
        const legalFrom = getLegalMoves(this.position, i).map(m=>m.to);
        this.boardView.setSelection(i, legalFrom);
      }
      return;
    }
    if(this.selected === i){ // deselect
      this.selected = null; this.boardView.clearSelection(); return;
    }
    // Attempt move
    const moveStr = indexToAlgebraic(this.selected)+indexToAlgebraic(i)+(this.promotionChoice||'');
    try {
      const { position, events } = makeMove(this.position, moveStr);
      this.position = position;
      this.boardView.update(this.position, this.sprites, { lastMove:[this.selected,i] });
      this.sidebarView.appendMove(moveStr);
      if(events.includes('Checkmate')) this.sidebarView.updateStatus('Checkmate');
      else if(events.includes('Stalemate')) this.sidebarView.updateStatus('Stalemate');
      else this.sidebarView.updateStatus((this.position.activeColor==='white'?'White':'Black')+' to move'+(events.includes('Check')?' (check)':''));
      this.audio.play(events.includes('Capture')?'Capture': 'MoveMade');
    } catch(e){ /* illegal target */ }
    this.selected = null; this.boardView.clearSelection();
  }
  handleDrop(from,to){ /* TODO drop handling */ }
  handlePromotion(choice){ /* TODO */ }
  newGame(){
    this.position = resetGame();
    this.selected = null;
    this.boardView.update(this.position, this.sprites);
    this.sidebarView.updateStatus('White to move');
  }
  undo(){ /* optional */ }
}
