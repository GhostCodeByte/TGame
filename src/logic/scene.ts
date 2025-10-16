import { GameObject } from "./entity";

export class Scene {
  public entities: GameObject[] = [];
  public mapNumCharakterY: number;
  public mapNumCharakterX: number;
  public map: string[][];

  constructor(mapNumCharakterY: number, mapNumCharakterX: number) {
    this.mapNumCharakterY = mapNumCharakterY;
    this.mapNumCharakterX = mapNumCharakterX;
    this.map = Array.from({ length: this.mapNumCharakterY }, () =>
      Array(this.mapNumCharakterX).fill(""),
    );
  }

  add(entity: GameObject) {
    this.entities.push(entity);
  }

  public fillBackground(char: string) {
    for (let y = 0; y < this.mapNumCharakterY; y++) {
      for (let x = 0; x < this.mapNumCharakterX; x++) {
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
