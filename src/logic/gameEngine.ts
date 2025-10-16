import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";
import { GameObject } from "./entity.js";

class GameEngine {
  private scene: Scene;
  private renderer: Renderer;
  private lastTime = 0;
  private fps = 0;
  private startTime: number | undefined;
  private fpsSum = 0;
  private fpsCount = 0;

  constructor(
    viewHeight: number,
    viewWidth: number,
    mapWidth: number,
    mapHeight: number,
  ) {
    this.scene = new Scene(mapHeight, mapWidth); // Erstelle Scene mit Karte
    this.scene.fillBackground("."); // Fülle Hintergrund mit Standardcharakter
    this.renderer = new Renderer(viewHeight, viewWidth);
    this.renderer.render(this.scene, 0, 0);
  }

  // Füge Entities zur Scene hinzu (statt direkt in Engine)
  public addEntity(entity: GameObject) {
    this.scene.add(entity);
  }

  // Haupt-Update: Delegiere an Scene
  private update(delta: number) {
    this.scene.update(delta);
  }

  // Haupt-Render: Delegiere an Renderer
  private render(viewX: number, viewY: number) {
    this.renderer.render(this.scene, viewX, viewY);
    // FPS-Anzeige (falls noch gewünscht – könnte in Renderer verschoben werden)
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

    if (time - this.startTime >= 60000) {
      const averageFps = this.fpsSum / this.fpsCount;
      console.log(`Average FPS over 60 seconds: ${averageFps.toFixed(2)}`);
      return;
    }

    requestAnimationFrame(this.gameLoop);
  };
}

export default GameEngine;
