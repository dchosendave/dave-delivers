# 3D Portfolio Roadmap

## Vision Summary

| Aspect | Decision |
|--------|----------|
| **Theme** | Network nodes (clustered by category) |
| **Node Style** | Hexagons/custom shapes |
| **Connections** | Only between related items |
| **Interaction** | Click to open modal with details |
| **Color Theme** | Terminal vibes (`#bd5eff`, `#4facfe`, `#00ff00`, dark bg) |
| **Easter Egg** | `Ctrl + ~` toggles terminal overlay |
| **Data Source** | FastAPI + SQLite backend |

---

## Phase 1: Setup Threlte

- [ ] Install Threlte and Three.js dependencies
- [ ] Create a basic 3D scene with camera and lights
- [ ] Verify it renders in your Svelte app

**Install command:**
```bash
npm install @threlte/core @threlte/extras three
```

---

## Phase 2: Build the Node System

- [ ] Create a hexagon node component
- [ ] Position nodes in clusters (Skills, Projects, Experience, Contacts)
- [ ] Add connection lines between related nodes
- [ ] Style with terminal color palette

---

## Phase 3: Interactivity

- [ ] Add hover effects (glow, scale)
- [ ] Add click detection
- [ ] Create a detail modal/panel
- [ ] Fetch data from backend API

---

## Phase 4: Terminal Easter Egg

- [ ] Add keyboard listener for `Ctrl + ~`
- [ ] Toggle terminal overlay visibility
- [ ] Integrate existing Terminal.svelte

---

## Phase 5: Polish

- [ ] Camera controls (orbit, zoom)
- [ ] Animations (node entrance, floating idle)
- [ ] Responsive adjustments

---

## Future Enhancements

- [ ] Force-directed node layout (physics simulation)
- [ ] Expand node details inline in 3D space
- [ ] Mobile support
