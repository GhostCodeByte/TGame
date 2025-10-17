import { Scene } from "./scene.js";
import { Renderer } from "./renderer.js";

class GameEngine {
  private scene!: Scene;
  public renderer!: Renderer;

  private lastTime = 0;
  private startTime: number | undefined;
  private fps = 0;
  private fpsSum = 0;
  private fpsCount = 0;

  private tps!: number;
  private tickIntervalMs = 1000 / this.tps;
  private accumulator = 0;
  private maxSubSteps = 5;

  private frameUpdate?: (scene: Scene, delta: number) => void;

  public setFrameUpdate(cb: (scene: Scene, delta: number) => void) {
    this.frameUpdate = cb;
  }

  public setTPS(tps: number) {
    this.tps = Math.max(1, tps);
    this.tickIntervalMs = 1000 / this.tps;
  }

  public setScene(mapWidth: number, mapHeight: number) {
    this.scene = new Scene(mapWidth, mapHeight);
    this.scene.fillBackground(".");
  }

  public setRenderer(viewWidth: number, viewHeight: number) {
    this.renderer = new Renderer(viewWidth, viewHeight);
  }

  public addGameObject(
    mapCordX: number,
    mapCordY: number,
    assetNames: string[] = [],
  ) {
    this.scene.addGameObject(mapCordX, mapCordY, assetNames);
  }

  private update(delta: number) {
    if (this.frameUpdate) this.frameUpdate(this.scene, delta);
    this.scene.update(delta);
  }

  private render(viewX: number, viewY: number) {
    this.renderer.render(this.scene, viewX, viewY);
    const fpsElement = document.getElementById("fps")! as HTMLElement;
    fpsElement.innerText = `FPS: ${String(this.fps).padStart(2, "0")} | Entities: ${this.scene.entities.length}`;
  }

  public gameLoop = (time: number) => {
    if (this.startTime === undefined) {
      this.startTime = time;
      this.lastTime = time;
    }

    // Zeit seit letztem Frame
    let frameDelta = time - this.lastTime;
    this.lastTime = time;

    // FPS-Messung
    if (frameDelta > 0) {
      this.fps = Math.floor(1000 / frameDelta);
      this.fpsSum += this.fps;
      this.fpsCount++;
    }

    // Akkumuliere Zeit für Fixed-Update, clamping gegen riesige Sprünge
    frameDelta = Math.min(frameDelta, 250); // max 250ms pro Frame anrechnen
    this.accumulator += frameDelta;

    // Führe Updates in festen Schritten aus (TPS)
    let steps = 0;
    while (
      this.accumulator >= this.tickIntervalMs &&
      steps < this.maxSubSteps
    ) {
      this.update(this.tickIntervalMs);
      this.accumulator -= this.tickIntervalMs;
      steps++;
    }

    // Render so oft wie möglich (max FPS)
    this.render(0, 0);

    // Optional: Durchschnitts-FPS regelmäßig loggen (hier alle 10s)
    if (time - this.startTime >= 10000) {
      const averageFps = Math.floor(this.fpsSum / Math.max(1, this.fpsCount));
      console.log(`Average FPS (10s): ${averageFps}`);
      this.startTime = time;
      this.fpsSum = 0;
      this.fpsCount = 0;
    }

    requestAnimationFrame(this.gameLoop);
  };
}
export default GameEngine;
