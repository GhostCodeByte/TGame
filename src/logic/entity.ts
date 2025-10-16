import entity from "../assets/entity.json" assert { type: "json" };

type Asset = {
  name: string;
  width: number;
  height: number;
  shape: string[][];
};

const assets: Record<string, Asset> = entity as Record<string, Asset>;

export class GameObject {
  mapCordX: number;
  mapCordY: number;
  assetNames: string[];
  currentAssetIndex: number = 0;

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
    // Bewegung, Physik, AI etc.
  }
}
