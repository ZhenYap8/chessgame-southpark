// App main entry (stub) - wires controller & views
import { GameController } from '../interface/GameController.js';
import { StorageAdapter } from '../interface/StorageAdapter.js';
import { AudioAdapter } from '../interface/AudioAdapter.js';
import { SpriteAdapter } from '../interface/SpriteAdapter.js';
import { ChessboardView } from './ui/ChessboardView.js';
import { SidebarView } from './ui/SidebarView.js';

const BOARD_ID = 'board-root';
const SIDEBAR_ID = 'sidebar-root';

window.addEventListener('DOMContentLoaded', () => {
  const boardRoot = document.getElementById(BOARD_ID);
  const sidebarRoot = document.getElementById(SIDEBAR_ID);
  const controller = new GameController({
    boardView: new ChessboardView(boardRoot),
    sidebarView: new SidebarView(sidebarRoot),
    storage: new StorageAdapter(),
    audio: new AudioAdapter(),
    sprites: new SpriteAdapter()
  });
  controller.init();
});
