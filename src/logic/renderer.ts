import { Scene } from "./scene.js";

export class Renderer {
  private charSize = 32;
  private viewWidth: number;
  private viewHeight: number;
  private canvas = document.getElementById("textCanvas") as HTMLCanvasElement;
  private ctx = this.canvas.getContext("2d") as CanvasRenderingContext2D;
  private fpsElement = document.getElementById("fps")! as HTMLElement;
  private bufferOld: string[][];
  private bufferNew: string[][];

  constructor(viewWidth: number, viewHeight: number) {
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
    this.bufferOld = Array(viewHeight).fill(null).map(() => Array(viewWidth).fill(""));
    this.bufferNew = this.bufferOld
    
  }

  public render(scene: Scene, viewX: number, viewY: number) {
    const { visibleMap, visibleEntities } = scene.getViewPort(
      viewX,
      viewY,
      this.viewWidth,
      this.viewHeight,
    );
    //Der alte frame wird in bufferOld geschrieben
    this.bufferOld = this.bufferNew

    //schreibe die map in den Buffer
    for (let y = 0; y < visibleMap.length; y++) {
      for (let x = 0; x < visibleMap[y].length; x++) {
        this.bufferNew[y][x] = visibleMap[y][x];
      }
    }

    //schreibe Entitys in den Buffer
    for (const entity of visibleEntities) {
      for (let i = 0; i < entity.getCurrentAsset().height; i++) {
        for (let j = 0; j < entity.getCurrentAsset().width; j++) {
          const c = entity.getCurrentAsset().shape[i][j];
          if (c !== " ") {
            this.bufferNew[entity.mapCordY - viewY + j][entity.mapCordX - viewX + i] = c
          }
        }
      }
    }

    //schreibe aus dem buffer was sich geändert hat auf den screen
    for (let y = 0; y < visibleMap.length; y++) {
      for (let x = 0; x < visibleMap[y].length; x++) {
        if (this.bufferNew[y][x] !== this.bufferOld[y][x]) {
          this.drawChar(x, y, this.bufferNew[y][x])
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
