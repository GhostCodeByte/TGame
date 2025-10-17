import GameEngine from "./logic/gameEngine.js";
import { GameObject } from "./logic/entity.js";

// Canvas: 1600x800, charSize 32 -> 50x25 Zeichen
const viewWidth = 50;
const viewHeight = 25;

// Map kann größer sein als der Viewport
const mapWidth = 100;
const mapHeight = 100;
const engine = new GameEngine(viewWidth, viewHeight);
engine.setScene(mapWidth, mapHeight);
// Pro Frame: Entities löschen und 30 neue Player zufällig setzen
engine.setFrameUpdate((scene) => {
  // Clear
  scene.entities.length = 0;

  // Player-Asset ist 3x3 (aus entity.json); damit in Bounds bleiben:
  const aw = 3;
  const ah = 3;

  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * Math.max(1, scene.mapWidth - aw));
    const y = Math.floor(Math.random() * Math.max(1, scene.mapHeight - ah));
    scene.add(new GameObject(x, y, ["player"]));
  }
});

// Start: läuft 60s und loggt den Durchschnitts-FPS in die Konsole
engine.gameLoop(0);
