# Game Engine Implementierungs-Checkliste
*Für dein TypeScript/Bun-Projekt*

---

## 1. PHYSIK-SYSTEM

### 1.1 Gravitation & Beschleunigung
- [ ] **Gravity implementieren**
  - **Datei**: `src/logic/physics/GravitySystem.ts` (neue Datei)
  - **Code-Struktur**:
    ```typescript
    export const GRAVITY = 9.81; // m/s² pro Sekunde
    // In GameObject.update() anwenden:
    this.accelerationY += GRAVITY * delta;
    ```
  - **Info**: Gravity sollte nur auf Objekte wirken, die `hasGravity: boolean = true` haben
  - **Ressource**: 
    - YouTube: "2D Game Physics Tutorial - Gravity"
    - MDN: "Animation Timing" (für deltaTime-Konzept)

### 1.2 Collision Detection
- [ ] **AABB Collision Detection (Axis-Aligned Bounding Box)**
  - **Datei**: `src/logic/physics/CollisionDetector.ts` (neue Datei)
  - **Funktion**:
    ```typescript
    static checkAABB(obj1: GameObject, obj2: GameObject): boolean {
      return obj1.mapCordX < obj2.mapCordX + obj2.width &&
             obj1.mapCordX + obj1.width > obj2.mapCordX &&
             obj1.mapCordY < obj2.mapCordY + obj2.height &&
             obj1.mapCordY + obj1.height > obj2.mapCordY;
    }
    ```
  - **Änderungen**: GameObject braucht `width` und `height` Properties
  - **Ressource**: 
    - MDN Web Docs: "2D collision detection"
    - Game Dev Tutorials: "Bounding Box Collision"

- [ ] **Collision Response (Impuls-basiert)**
  - **Datei**: `src/logic/physics/CollisionResolver.ts` (neue Datei)
  - **Aufgaben**:
    - Objekte trennen (nicht überlappend)
    - Velocities austauschen bei elastischen Kollisionen
    - Bounce/Restitution berechnen
  - **Änderungen**: GameObject braucht `restitution: number = 0.8` (Elastizität)
  - **Ressource**: "Rigid Body Physics - Collision Response" YouTube

### 1.3 Velocity & Movement
- [ ] **Velocity in GameObject.update() korrekt integrieren**
  - **Datei**: Bereits in `src/logic/entity.ts` vorhanden
  - **Änderungen nötig**:
    ```typescript
    this.mapCordX += this.velX * delta;
    this.mapCordY += this.velY * delta;
    ```
  - **Problem**: Momentan wird Position nicht aktualisiert!

### 1.4 Drag/Friction System
- [ ] **Wind Resistance & Fluid Friction**
  - **Datei**: `src/logic/physics/DragSystem.ts` (neue Datei)
  - **Formel**: `drag = 0.5 * dragCoefficient * velocity²`
  - **GameObject-Properties**: `dragCoefficient: number = 0.1`
  - **Ressource**: "Aerodynamic Drag in Game Physics"

---

## 2. INPUT & STEUERUNG

### 2.1 Keyboard Input System
- [ ] **Input Manager erstellen**
  - **Datei**: `src/logic/input/InputManager.ts` (neue Datei)
  - **Features**:
    - `isKeyPressed(key: string): boolean`
    - `onKeyDown(key: string, callback: () => void)`
    - `onKeyUp(key: string, callback: () => void)`
  - **Implementierung**: Event Listener auf `keydown` / `keyup`
  - **Ressource**: MDN Web Docs - "KeyboardEvent"

### 2.2 Player Control System
- [ ] **PlayerController Klasse**
  - **Datei**: `src/logic/controllers/PlayerController.ts` (neue Datei)
  - **Features**:
    - WASD/Arrow Keys für Bewegung
    - Space zum Springen
    - Beschleunigung statt direkte Velocity-Änderung
  - **Integration**: In `gameEngine.setFrameUpdate()` verwenden
  - **Code-Beispiel**:
    ```typescript
    if (inputManager.isKeyPressed('w')) {
      player.accelerationY = -5;
    }
    ```

### 2.3 Mouse Input (optional)
- [ ] **Mouse Tracking**
  - **Datei**: `src/logic/input/MouseManager.ts` (neue Datei)
  - **Features**: Position, Clicks, Drag-Events
  - **Ressource**: MDN - "MouseEvent"

---

## 3. COLLISION SYSTEM (Integration)

### 3.1 Collision Manager
- [ ] **Zentrale Collision Verwaltung**
  - **Datei**: `src/logic/physics/CollisionManager.ts` (neue Datei)
  - **Aufgaben**:
    - Alle Paare von Objekten prüfen (O(n²))
    - Kollisionen sammeln
    - Resolver aufrufen
  - **Performance-Warnung**: Bei 100+ Objekten sollte räumliche Partitionierung verwendet werden

### 3.2 Räumliche Optimierung (später)
- [ ] **Quad Tree oder Grid**
  - **Datei**: `src/logic/physics/SpatialPartition.ts` (für später)
  - **Ziel**: Nur nahe Objekte prüfen
  - **Ressource**: "Game Engine Architecture - Spatial Partitioning"

### 3.3 Collision Tags & Layer
- [ ] **Collision Filtering**
  - **GameObject-Property**: `collisionLayer: number = 1`
  - **Features**: Bestimme welche Objekte miteinander kollidieren
  - **Beispiel**: Player kollidiert mit Walls, aber nicht mit anderen Players

---

## 4. ANIMATION & RENDERING

### 4.1 Sprite Animation
- [ ] **Frame-basierte Animation**
  - **Datei**: `src/logic/animation/Animator.ts` (neue Datei)
  - **Features**:
    - Animation zwischen Asset-Frames
    - Animation Speed kontrollierbar
    - Animation Loops (einmalig oder wiederholt)
  - **GameObject-Change**: `currentAssetIndex` durch Animator verwalten

### 4.2 Movement Animation
- [ ] **Richtung-basierte Sprites**
  - **Änderung**: Assets für verschiedene Richtungen (up, down, left, right)
  - **Logic**: Basierend auf Velocity das richtige Asset anzeigen

### 4.3 Particle System
- [ ] **Particle Emitter** (Feuer, Rauch, Explosionen)
  - **Datei**: `src/logic/particles/ParticleSystem.ts` (neue Datei)
  - **Features**:
    - Position, Velocity, Lifetime
    - Automatisches Löschen nach Lifetime
  - **Ressource**: "Game Engine - Particle System Tutorial"

---

## 5. LEVEL & SCENE MANAGEMENT

### 5.1 Tilemap System
- [ ] **Tilemap Loader**
  - **Datei**: `src/logic/tilemap/TilemapLoader.ts` (neue Datei)
  - **Format**: JSON mit Tile-Daten
  - **Features**:
    - Verschiedene Tile-Typen (Wall, Floor, Spike, etc.)
    - Automatische Collider-Erstellung für Walls
  - **Asset-Datei**: `src/assets/tilemap.json`

### 5.2 Camera System
- [ ] **Camera Klasse**
  - **Datei**: `src/logic/camera/Camera.ts` (neue Datei)
  - **Features**:
    - Follow Player
    - Viewport-Berechnung (bereits in Scene.getViewPort(), aber Camera sollte es verwalten)
    - Smooth Follow (Lerp)
  - **Ressource**: "2D Game Camera Tutorial"

---

## 6. GAME STATE & MANAGEMENT

### 6.1 Game States
- [ ] **State Machine**
  - **Datei**: `src/logic/state/GameStateMachine.ts` (neue Datei)
  - **States**: Menu, Playing, Paused, GameOver
  - **Features**: State Transitions, Enter/Exit Callbacks
  - **Ressource**: "State Pattern in Game Development"

### 6.2 Entity Manager
- [ ] **Erweiterte Entity-Verwaltung**
  - **Datei**: Erweiterung von `Scene.ts`
  - **Features**:
    - Entity Spawning
    - Entity Tagging (z.B. "player", "enemy", "collectible")
    - Entity Queries (z.B. alle Enemies finden)
  - **Methoden**:
    ```typescript
    getEntitiesByTag(tag: string): GameObject[]
    getEntityById(id: number): GameObject | null
    ```

### 6.3 Event System
- [ ] **Event Emitter**
  - **Datei**: `src/logic/events/EventEmitter.ts` (neue Datei)
  - **Features**: `on()`, `emit()`, `off()`
  - **Use Case**: Kollisionen, Death, Score-Änderungen
  - **Ressource**: Node.js EventEmitter (ähnliches Pattern)

---

## 7. AUDIO (Optional)

### 7.1 Sound Manager
- [ ] **Audio Playback**
  - **Datei**: `src/logic/audio/AudioManager.ts` (neue Datei)
  - **Features**:
    - Sound Effekte abspielen
    - Musik-Hintergrund
    - Volume Control
  - **Ressource**: "Web Audio API Tutorial"

---

## 8. UI SYSTEM

### 8.1 UI Renderer
- [ ] **Text-basierte UI**
  - **Datei**: `src/logic/ui/UIRenderer.ts` (neue Datei)
  - **Features**:
    - Score anzeigen
    - Health Bar
    - Menutext
  - **Änderung**: Renderer um UI-Drawing erweitern

### 8.2 Debug UI
- [ ] **Debug-Informationen**
  - **Datei**: `src/logic/debug/DebugRenderer.ts` (neue Datei)
  - **Features**:
    - Hitboxes visualisieren
    - Velocity Vektoren
    - Positions-Grid
  - **Toggle**: Mit Taste aktivierbar (z.B. D-Taste)

---

## 9. PERFORMANCE & OPTIMIZATION

### 9.1 Object Pooling
- [ ] **Object Pool für häufig erstellte Objekte**
  - **Datei**: `src/logic/pooling/ObjectPool.ts` (neue Datei)
  - **Ziel**: GC-Druck reduzieren
  - **Use Case**: Particles, Projectiles
  - **Ressource**: "Object Pooling Pattern - Game Dev"

### 9.2 Profiling
- [ ] **Performance Monitoring**
  - **Änderung**: In `gameEngine.ts` erweitern
  - **Metriken**: 
    - Update Time
    - Render Time
    - Collision Checks
  - **Display**: Im Debug UI zeigen

---

## 10. TESTING & DEBUGGING

### 10.1 Unit Tests
- [ ] **Physics Tests**
  - **Datei**: `src/logic/physics/__tests__/physics.test.ts`
  - **Test Cases**: 
    - Gravity anwenden
    - Collision Detection
    - Velocity Integration
  - **Tool**: Bun Test Runner oder Vitest

### 10.2 Visualization Tools
- [ ] **Gizmos für Debugging**
  - **Datei**: `src/logic/debug/Gizmos.ts`
  - **Features**: Collision Boxes, Velocity Vectors zeichnen

---

## 11. EMPFOHLENE DATEISTRUKTUR

```
src/
├── logic/
│   ├── gameEngine.ts
│   ├── entity.ts
│   ├── scene.ts
│   ├── renderer.ts
│   ├── physics/
│   │   ├── GravitySystem.ts
│   │   ├── CollisionDetector.ts
│   │   ├── CollisionResolver.ts
│   │   ├── CollisionManager.ts
│   │   └── DragSystem.ts
│   ├── input/
│   │   ├── InputManager.ts
│   │   └── MouseManager.ts
│   ├── controllers/
│   │   └── PlayerController.ts
│   ├── animation/
│   │   └── Animator.ts
│   ├── camera/
│   │   └── Camera.ts
│   ├── state/
│   │   └── GameStateMachine.ts
│   ├── events/
│   │   └── EventEmitter.ts
│   ├── particles/
│   │   └── ParticleSystem.ts
│   ├── tilemap/
│   │   └── TilemapLoader.ts
│   ├── ui/
│   │   └── UIRenderer.ts
│   ├── debug/
│   │   ├── DebugRenderer.ts
│   │   └── Gizmos.ts
│   └── audio/
│       └── AudioManager.ts
├── assets/
│   ├── entity.json
│   └── tilemap.json
├── main.ts
└── styles/
    └── tailwind.css
```

---

## 12. PRIORISIERUNG (Reihenfolge zum Implementieren)

### Phase 1 (MUST-HAVE)
1. Velocity in Position integrieren (GameObject.update())
2. Collision Detection (AABB)
3. Collision Response (einfach)
4. Input Manager + Player Controller
5. Camera System

### Phase 2 (SHOULD-HAVE)
6. Gravity System
7. Animation System
8. Tilemap Loader
9. Game State Machine
10. Event System

### Phase 3 (NICE-TO-HAVE)
11. Particle System
12. Spatial Partitioning
13. Audio Manager
14. Advanced UI
15. Profiling

---

## 13. HILFREICHE RESSOURCEN

| Topic | Ressource | Typ |
|-------|-----------|------|
| 2D Physics | "Game Physics Engine Development" - Ian Millington | Buch |
| Collision | MDN Web Docs - "2D collision detection" | Website |
| Game Loop | "Fix Your Timestep!" - Glenn Fiedler | Blog |
| Tilemap | Tiled Map Editor + Loader Tutorials | Video/Website |
| Camera | Sebastian Lague - "Game Camera Systems" | YouTube |
| State Pattern | "Design Patterns in Game Development" | Website |
| Audio Web | "Web Audio API" - MDN | Dokumentation |
| Performance | "Game Programming Patterns" - Optimization | Website |

---

## 14. QUICK START: ERSTE SCHRITTE

**Jetzt gleich implementieren (30min - 1h):**

1. Öffne `src/logic/entity.ts`
2. Ergänze in `update()`:
   ```typescript
   this.mapCordX += this.velX * delta;
   this.mapCordY += this.velY * delta;
   ```

3. Erstelle `src/logic/physics/CollisionDetector.ts` mit AABB-Check

4. Erstelle `src/logic/input/InputManager.ts` für Keyboard

5. Modifiziere `main.ts` um Player mit Spieler-Steuerung zu verwenden

Das gibt dir bereits eine funktionierende Basis für Bewegung & Input! 🚀