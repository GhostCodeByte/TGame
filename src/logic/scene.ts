import { GameObject } from "./entity";

export class Scene {
  public entities: GameObject[] = [];
  public mapWidth: number;
  public mapHeight: number;
  public map: string[][];

  constructor(mapWidth: number, mapHeight: number) {
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.map = Array.from({ length: this.mapHeight }, () =>
      Array(this.mapWidth).fill(""),
    );
  }

  add(entity: GameObject) {
    this.entities.push(entity);
  }

  public fillBackground(char: string) {
    for (let y = 0; y < this.mapHeight; y++) {
      for (let x = 0; x < this.mapWidth; x++) {
        this.map[y][x] = char;
      }
    }
  }

  update(delta: number) {
    for (const e of this.entities) e.update(delta);
  }

  getViewPort(viewX: number, viewY: number, viewW: number, viewH: number) {
    const visibleMap = [];
    for (let y = 0; y < viewH; y++) {
      visibleMap.push(this.map[viewY + y].slice(viewX, viewX + viewW));
    }
    const visibleEntities = this.entities.filter(
      (e) =>
        e.mapCordX >= viewX &&
        e.mapCordX < viewX + viewW &&
        e.mapCordY >= viewY &&
        e.mapCordY < viewY + viewH,
    );
    return { visibleMap, visibleEntities };
  }
}
