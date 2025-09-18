// Modal (stub) - basic structure for future use (promotion, dialogs)
export class Modal {
  constructor(){
    this.el = document.createElement('div');
    this.el.className = 'modal hidden';
    this.el.innerHTML = `<div class="modal-backdrop"></div><div class="modal-content" role="dialog" aria-modal="true"></div>`;
    this.contentEl = this.el.querySelector('.modal-content');
    this.el.querySelector('.modal-backdrop').addEventListener('click', ()=>this.hide());
  }
  attach(root=document.body){ if(!this.el.isConnected) root.appendChild(this.el); }
  show(html){ this.contentEl.innerHTML = html; this.el.classList.remove('hidden'); }
  hide(){ this.el.classList.add('hidden'); }
}
