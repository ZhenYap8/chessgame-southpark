// ChessboardView (stub)
export class ChessboardView {
  constructor(root){ this.root = root; this.selected = null; }
  renderInitial(position, sprites){
    this.root.innerHTML = '';
    const frag = document.createDocumentFragment();
    for(let r=7;r>=0;r--){
      for(let f=0;f<8;f++){
        const i = r*8+f;
        const square = document.createElement('div');
        square.className = 'sq';
        square.dataset.index = i;
        square.tabIndex = -1;
        square.addEventListener('click', ()=>this.onSquareClick && this.onSquareClick(i));
        frag.appendChild(square);
      }
    }
    this.root.appendChild(frag);
    this.update(position, sprites);
  }
  setSelection(from, targets){
    this.clearSelection();
    this.selected = from;
    const fromEl = this.root.querySelector(`.sq[data-index='${from}']`);
    if(fromEl) fromEl.classList.add('selected');
    targets.forEach(t=>{
      const el = this.root.querySelector(`.sq[data-index='${t}']`);
      if(el) el.classList.add('legal-target');
    });
  }
  clearSelection(){
    this.selected = null;
    this.root.querySelectorAll('.selected, .legal-target').forEach(el=>el.classList.remove('selected','legal-target'));
  }
  update(position, sprites, opts={}){
    this.root.querySelectorAll('.sq').forEach(sq=>{ sq.innerHTML=''; sq.classList.remove('last-move'); });
    for(let i=0;i<64;i++){
      const piece = position.board[i];
      if(piece){
        const el = document.createElement('img');
        el.draggable = false;
        el.className = 'piece';
        el.alt = piece.color+' '+piece.type;
        el.src = sprites.getSprite(piece);
        const cell = this.root.querySelector(`.sq[data-index='${i}']`);
        if(cell) cell.appendChild(el);
      }
    }
    if(opts.lastMove){
      opts.lastMove.forEach(i=>{
        const cell = this.root.querySelector(`.sq[data-index='${i}']`);
        if(cell) cell.classList.add('last-move');
      });
    }
  }
  highlightSquares(indices, cssClass){ /* TODO */ }
}
