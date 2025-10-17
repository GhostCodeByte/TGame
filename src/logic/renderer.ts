import { Scene } from "./scene.js";

export class Renderer {
  private charSize = 32;
  private viewWidth: number;
  private viewHeight: number;
  private canvas = document.getElementById("textCanvas") as HTMLCanvasElement;
  private ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private fpsElement = document.getElementById("fps")! as HTMLElement;

  constructor(viewWidth: number, viewHeight: number) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
  }

  public render(scene: Scene, viewX: number, viewY: number) {
    const { visibleMap, visibleEntities } = scene.getViewPort(
      viewX,
      viewY,
      this.viewWidth,
      this.viewHeight,
    );

    // Zeichne die Karte
    for (let y = 0; y < visibleMap.length; y++) {
      for (let x = 0; x < visibleMap[y].length; x++) {
        this.drawChar(x, y, visibleMap[y][x]);
      }
    }

    // Zeichne die Entities
    for (const entity of visibleEntities) {
      for (let i = 0; i < entity.getCurrentAsset().height; i++) {
        for (let j = 0; j < entity.getCurrentAsset().width; j++) {
          const c = entity.getCurrentAsset().shape[i][j];
          if (c !== " ") {
            this.drawChar(
              entity.mapCordX - viewX + j,
              entity.mapCordY - viewY + i,
              c,
            );
          }
        }
      }
    }
  }

  // Zeichnet ein einzelnes Zeichen
  private drawChar(viewCordx: number, viewCordy: number, charakter: string) {
    //Pixel Schwarz übermahlen
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(
      viewCordx * this.charSize,
      viewCordy * this.charSize,
      this.charSize,
      this.charSize,
    );

    // Schrift in Weiß drüber
    this.ctx.fillStyle = "white";
    this.ctx.font = `${this.charSize - 2}px 'IBM Plex Mono', monospace`;
    this.ctx.fillText(
      charakter,
      viewCordx * this.charSize,
      (viewCordy + 1) * this.charSize,
    );
  }

  public drawBackground(charakter: string) {
    for (let viewCordy = 0; viewCordy < this.viewWidth; viewCordy++) {
      for (let viewCordx = 0; viewCordx < this.viewHeight; viewCordx++) {
        this.drawChar(viewCordx, viewCordy, charakter);
      }
    }
  }
}
