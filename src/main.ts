import GameEngine from "./logic/gameEngine.js";

// Erstelle die Engine mit View-Größe (20x15 Zeichen) und Map-Größe (100x100 Zeichen)
const engine = new GameEngine(25, 50, 100, 100);
// Starte die Game-Loop (der Test läuft 60 Sekunden und gibt FPS aus)
//engine.gameLoop(0);

// Füge einige Entities hinzu
import { GameObject } from "./logic/entity.js";

const player = new GameObject(10, 10, ["player"]);
engine.addEntity(player);
