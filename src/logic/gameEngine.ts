import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { GameObject } from "./entity.js";

class GameEngine {
  private scene!: Scene;
  public renderer: Renderer;
  private lastTime = 0;
  private fps = 0;
  private startTime: number | undefined;
  private fpsSum = 0;
  private fpsCount = 0;

  private frameUpdate?: (scene: Scene, delta: number) => void;
  public setFrameUpdate(cb: (scene: Scene, delta: number) => void) {
    this.frameUpdate = cb;
  }

  constructor(viewWidth: number, viewHeight: number) {
    this.renderer = new Renderer(viewWidth, viewHeight);
  }

  public addEntity(entity: GameObject) {
    this.scene.add(entity);
  }

  public setScene(mapWidth: number, mapHeight: number) {
    this.scene = new Scene(mapWidth, mapHeight);
    this.scene.fillBackground(".");
  }

  private update(delta: number) {
    // Hook aus main.ts (z. B. Entities clearen/neu hinzufügen)
    if (this.frameUpdate) this.frameUpdate(this.scene, delta);
    // Normales Update der Entities
    this.scene.update(delta);
  }

  // Haupt-Render: Delegiere an Renderer
  private render(viewX: number, viewY: number) {
    this.renderer.render(this.scene, viewX, viewY);
    const fpsElement = document.getElementById("fps")! as HTMLElement;
    fpsElement.innerText = `FPS: ${this.fps.toFixed(2)} | Entities: ${this.scene.entities.length}`;
  }

  public gameLoop = (time: number) => {
    if (this.startTime === undefined) {
      this.startTime = time;
    }

    const delta = time - this.lastTime;
    if (delta > 0) {
      this.fps = 1000 / delta;
      this.fpsSum += this.fps;
      this.fpsCount++;
    }
    this.lastTime = time;

    this.update(delta);
    this.render(0, 0); // Beispiel-View-Position; anpassen je nach Kamera

    if (time - this.startTime >= 10000) {
      const averageFps = this.fpsSum / this.fpsCount;
      console.log(`Average FPS over last minute: ${averageFps.toFixed(2)}`);

      // Reset für nächste Minute
      this.startTime = time;
      this.fpsSum = 0;
      this.fpsCount = 0;
    }
    requestAnimationFrame(this.gameLoop);
  };
}

export default GameEngine;
