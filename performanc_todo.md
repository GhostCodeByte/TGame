# TGame Optimierungs-Checkliste

## ✅ Bereits implementiert

- [x] **requestAnimationFrame verwenden**
  - ✅ In `gameEngine.ts` korrekt implementiert
  - ✅ Nutzt `requestAnimationFrame(this.gameLoop)` für Animation-Loop

- [x] **Code profilieren**
  - ✅ FPS-Tracking implementiert
  - ✅ Durchschnitts-FPS wird alle 10 Sekunden geloggt
  - ✅ Entity-Count wird angezeigt

- [x] **Fixed Timestep für Updates**
  - ✅ TPS (Ticks Per Second) System implementiert
  - ✅ Akkumulator-Pattern für gleichmäßige Updates
  - ✅ Max-SubSteps Limiterung gegen Spirale des Todes

## ❌ Noch zu implementieren (Kritisch)

- [ ] **Draw-Calls minimieren - Dirty Rectangles**
  - ❌ **Aktuell:** Komplettes Canvas wird bei jedem Frame neu gezeichnet
  - ❌ **Problem:** In `renderer.ts` werden ALLE Zeichen neu gezeichnet (50x25 = 1250 Zeichen pro Frame)
  - 💡 **Lösung:** 
    - Buffer-System implementieren: Vorheriger Frame speichern
    - Nur geänderte Zeichen neu zeichnen
    - Besonders kritisch bei deinem Testcode (100 Entities werden jedes Frame neu erstellt!)

- [ ] **Code in Schleifen minimieren**
  - ❌ **Problem in `renderer.ts`:** 
    - Verschachtelte Loops mit `fillRect` und `fillText` Calls
    - Font-String wird in jedem `drawChar()` Call neu gesetzt
  - 💡 **Lösung:** 
    - Font nur einmal setzen (außerhalb der Schleife)
    - Zeichenoperationen batchen

- [ ] **Entity-Erstellung optimieren**
  - ❌ **Kritisches Problem in `main.ts`:**
    - 100 Entities werden JEDES FRAME gelöscht und neu erstellt
    - `scene.entities.length = 0` und dann 100x `addGameObject()`
  - 💡 **Lösung:** 
    - Object Pooling implementieren
    - Entities wiederverwenden statt neu erstellen
    - Nur Position updaten, nicht das ganze Objekt neu anlegen

## ⚠️ Noch zu implementieren (Wichtig)

- [ ] **Pixel Snapping**
  - ⚠️ **Aktuell:** Keine Rundung der Positionen
  - ⚠️ Entity-Positionen könnten Sub-Pixel-Werte haben (durch `velX`, `velY`)
  - 💡 **Lösung:** 
    - Positionen vor dem Rendern runden: `entity.mapCordX | 0`
    - Anti-Aliasing vermeiden

- [ ] **Character Buffer implementieren**
  - ⚠️ **Feature fehlt:** Kein Tracking welche Zeichen sich geändert haben
  - 💡 **Lösung:**
    ```typescript
    private previousFrame: string[][] = [];
    private currentFrame: string[][] = [];
    // Nur unterschiedliche Zeichen neu zeichnen
    ```

- [ ] **Canvas-Clear optimieren**
  - ⚠️ **Aktuell:** Jedes Zeichen wird einzeln mit schwarzem Rechteck übermalt
  - ⚠️ In `drawChar()`: `fillRect` für jedes einzelne Zeichen
  - 💡 **Lösung:** 
    - Canvas einmal komplett clearen (wenn kein Dirty Rectangle System)
    - Oder `clearRect()` für veränderte Bereiche

## 📊 Optionale Optimierungen

- [ ] **Mehrere Canvas-Layer verwenden**
  - 📝 Aktuell nur ein Canvas
  - 📝 Könnte sinnvoll sein für:
    - Statischer Hintergrund (map) auf eigenem Layer
    - Dynamische Entities auf separatem Layer
  - ⚠️ Bei ASCII weniger kritisch, aber könnte bei vielen statischen Elementen helfen

- [ ] **Viewport Culling verbessern**
  - ✅ Bereits implementiert in `scene.getViewPort()`
  - 📝 Aber: könnte effizienter sein (aktuell filtert alle Entities)
  - 💡 Optional: Spatial Partitioning (Quadtree) für viele Entities

## 🔧 Spezifische Code-Verbesserungen

### renderer.ts - Priorität HOCH
```typescript
// VORHER (Ineffizient):
private drawChar(viewCordx: number, viewCordy: number, charakter: string) {
  this.ctx.fillStyle = "black";
  this.ctx.fillRect(...);
  this.ctx.fillStyle = "white";
  this.ctx.font = `${this.charSize - 2}px ...`; // ❌ Jedes Mal neu!
  this.ctx.fillText(...);
}

// NACHHER (Optimiert):
constructor() {
  // Font einmal setzen
  this.ctx.font = `${this.charSize - 2}px 'IBM Plex Mono', monospace`;
  this.ctx.fillStyle = "white";
}

private drawChar(...) {
  // Nur wenn Zeichen sich geändert hat!
  if (this.hasChanged(x, y, char)) {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(...);
    this.ctx.fillStyle = "white";
    this.ctx.fillText(...);
  }
}
```

### main.ts - Priorität KRITISCH
```typescript
// VORHER (Sehr ineffizient):
engine.setFrameUpdate((scene) => {
  scene.entities.length = 0; // ❌ Alle löschen
  for (let i = 0; i < 100; i++) {
    engine.addGameObject(...); // ❌ 100 neue erstellen
  }
});

// NACHHER (Optimiert):
// Entities einmal erstellen
for (let i = 0; i < 100; i++) {
  engine.addGameObject(0, 0, ["player"]);
}

// Im Update nur Positionen ändern
engine.setFrameUpdate((scene) => {
  for (const entity of scene.entities) {
    entity.mapCordX = Math.floor(Math.random() * ...);
    entity.mapCordY = Math.floor(Math.random() * ...);
  }
});
```

## 📈 Erwartete Performance-Gewinne

1. **Dirty Rectangles:** 50-90% weniger Draw-Calls
2. **Object Pooling:** 80-95% weniger Garbage Collection
3. **Font-Caching:** 10-20% schnelleres Rendering
4. **Optimiertes Clearing:** 20-40% schnelleres Frame-Clear

## 🎯 Nächste Schritte (Priorisiert)

1. **SOFORT:** Entity-Pooling in `main.ts` implementieren
2. **SOFORT:** Font-String aus der Loop in `renderer.ts` entfernen
3. **HOCH:** Dirty Rectangle System implementieren
4. **MITTEL:** Canvas-Clear optimieren
5. **NIEDRIG:** Multiple Canvas Layer evaluieren

---

**Hinweis:** Dein aktueller Code funktioniert, aber das ständige Neu-Erstellen von 100 Entities pro Frame ist der größte Performance-Killer. Das solltest du zuerst beheben!