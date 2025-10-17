import GameEngine from "./logic/gameEngine.js";
import { GameObject } from "./logic/entity.js";

const viewWidth = 50;
const viewHeight = 25;
const mapWidth = 100;
const mapHeight = 100;

const engine = new GameEngine();
engine.setScene(mapWidth, mapHeight);
engine.setRenderer(viewWidth, viewHeight);

// Hier die gewünschte Tickrate einstellen:
engine.setTPS(60);

engine.setFrameUpdate((scene) => {
  scene.entities.length = 0;

  for (let i = 0; i < 100; i++) {
    const x = Math.floor(Math.random() * Math.max(1, scene.mapWidth - 3));
    const y = Math.floor(Math.random() * Math.max(1, scene.mapHeight - 3));
    engine.addGameObject(x, y, ["player"]);
  }
});

// Start
engine.gameLoop(0);
