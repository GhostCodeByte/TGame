import entity from "../assets/entity.json" assert { type: "json" };

type Asset = {
  name: string;
  width: number;
  height: number;
  shape: string[][];
};

const assets: Record<string, Asset> = entity as Record<string, Asset>;

export class GameObject {
  assetNames: string[];
  currentAssetIndex: number = 0;

  mapCordX: number;
  mapCordY: number;

  velX: number = 0;
  velY: number = 0;

  accelerationX: number = 0;
  accelerationY: number = 0;

  mass: number = 1;
  friction: number = 0.1;

  constructor(mapCordX: number, mapCordY: number, assetNames: string[] = []) {
    this.mapCordX = mapCordX;
    this.mapCordY = mapCordY;
    this.assetNames = assetNames;
  }

  getCurrentAsset(): Asset {
    const name = this.assetNames[this.currentAssetIndex];
    return assets[name];
  }

  update(delta: number) {
    this.velX += this.accelerationX * delta;
    this.velY += this.accelerationY * delta;

    // Apply friction
    this.velX *= 1 - this.friction;
    this.velY *= 1 - this.friction;
  }
}
