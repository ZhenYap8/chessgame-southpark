// SidebarView (stub)
export class SidebarView {
  constructor(root){ this.root = root; }
  updateStatus(text){
    if(!this.statusEl){
      this.root.innerHTML = '';
      this.statusEl = document.createElement('div');
      this.statusEl.className = 'status';
      this.movesEl = document.createElement('ol');
      this.movesEl.className = 'moves';
      this.controlsEl = document.createElement('div');
      this.controlsEl.className = 'controls';
      const newBtn = document.createElement('button'); newBtn.textContent = 'New Game'; newBtn.addEventListener('click', ()=>this.onNewGame && this.onNewGame());
      this.controlsEl.appendChild(newBtn);
      this.root.append(this.statusEl, this.movesEl, this.controlsEl);
    }
    this.statusEl.textContent = text;
  }
  appendMove(notation){
    if(!this.movesEl) return;
    const li = document.createElement('li'); li.textContent = notation; this.movesEl.appendChild(li);
  }
  showPromotion(options, callback){ /* TODO via Modal later */ }
}
