# Run 4,113

A toy 3D version of the kitchen from the short story [Doctor Bones](../../doctor-bones.html),
shown as the generated world the young man is watching. Not linked from the site yet.

Live at https://bfalkowski.github.io/writing/doctor-bones/world/

## What it does

- **The world builds itself.** Floor, walls, kitchen, table, Marjorie, then Dale.
  The dog is added last, and the log says "Dog added (default)". Each piece shows as a
  blue wireframe for a moment before it turns solid.
- **Observe it.** Drag to orbit, scroll or pinch to zoom. Hover shows a box around a
  thing and its name. Click, tap, or use the Inspect menu to open its details. Some of
  them: the window's outside is "Not rendered", the coffee's temperature "Never changes",
  and Marjorie "Has noticed you: No".
- **Ask Dale the dog's name.** He thinks, then says "Doctor Bones." The log records it,
  then "Security answer accepted". Marjorie keeps doing her crossword.
- **Wireframe view** shows the whole world as wireframes.
- **Turn the run off.** Things go one at a time, Marjorie still writing near the end.
  The dog goes last and collapses into one dot. Then you can start the next run.
- **Reduced motion:** no camera fly-in or build animation.
- **No WebGL:** it shows the still picture (`../kitchen.jpg`) instead.

## Code

Everything is in `index.html`: page, styles, and three.js code. It uses three.js r128
from cdnjs and its OrbitControls from jsDelivr (`three@0.128.0`).

Useful places in the script:

| What | Where |
| --- | --- |
| Figure size | `FIG` (1.35) scales the people, dog, table, chair, cup and crossword |
| Where people sit | `TABLE`, `M_POS`/`M_YAW` (Marjorie), `D_POS`/`D_YAW` (Dale), `DOG_POS` |
| Camera | `HOME` (default view), `START` (fly-in), `TARGET` |
| Build order | `spawnAt` on each `entity(...)`, in seconds |
| Turn-off order | `offAt` on each `entity(...)`; the dog and last dot use `DOG_START`, `DOG_END`, `GLOW_END` |
| Inspector text | the `info` function on each `entity(...)` |
| Clock speed | `state.sim += dt * 4` (4 story seconds per real second) |

The figures are built from spheres, cylinders and boxes with the `ball`, `rod`, `limb`
and `block` helpers. Each figure is posed by its joint positions, in meters, facing +z.

## Ideas not built yet

- Let the viewer add the dog themselves, the way the young man does in the story.
- Start the next run with small differences, so each run is not quite the same.
- A sound toggle with a ticking clock and a pencil on paper.
