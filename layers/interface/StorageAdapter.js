// StorageAdapter - localStorage implementation for persistence
export class StorageAdapter {
  constructor(key='sp-chess'){ this.key = key; }
  load(){ try { return localStorage.getItem(this.key); } catch { return null; } }
  save(fen){ try { localStorage.setItem(this.key, fen); } catch { /* ignore */ } }
}
