# Run 4,113

A toy 3D version of the kitchen from the short story [Doctor Bones](../../doctor-bones.html),
shown as the generated world the young man is watching. It appears on the story page
under the story, loaded in a frame with `?embed`. In that mode the page's own heading is
hidden, it stays in light colors, the scroll wheel scrolls the page until the scene is
clicked, and on phones one finger scrolls while two fingers turn and zoom. The run starts
when the scene first scrolls into view.

Live at https://bfalkowski.github.io/writing/doctor-bones/world/

## What it does

- **The world builds itself.** Floor, walls, kitchen, table, Marjorie, then Dale. Each
  piece shows as a blue wireframe for a moment before it turns solid. There is no dog.
  The log says "Password accepted", then the bank's security question, "What was the
  name of your first dog?", then "Dale has never had a dog".
- **Add things from the menu.** Pick a dog and press "Add to the world": Default (already
  selected, since it is the dog you get when you do not take the time to choose), Spotted,
  Small or Black. The water bowl comes with the first dog. There is one dog per run, so
  adding another replaces the current one. Under "Other things" there is a cat, who sits on
  the windowsill, washes a paw, naps and watches the dog or the fish, and a goldfish in a
  bowl on the counter that swims laps. Both say "Needed for the password: No". Each can be
  added once per run.
- **Observe it.** Drag to orbit, scroll or pinch to zoom. Hover shows a box around a
  thing and its name. Click, tap, or use the Inspect menu to open its details. Some of
  them: the window's outside is "Not rendered", the coffee's temperature "Never changes",
  and Marjorie "Has noticed you: No".
- **A full 1950s kitchen.** A stove with a pot roast (Ready: Never) and a kettle that
  steams but never boils, a back door whose window shows the outside is not rendered, a wall
  phone that rings now and then (the log says "Nobody answered"), a calendar that says
  TUESDAY instead of a month, a radio on the fridge with notes floating up (The same song),
  Dale's empty chair at the table (Sat in: Never), Dale's hat on a hook (Worn: Never), a
  shelf of jars and plates, a trash can, a bread box, a braided rug and a sink mat. A dog
  bed arrives with the first dog. The walls have oak Arts and Crafts woodwork: wainscoting
  with battens and a cap ledge, and Craftsman casing on the window (with an oak sill and
  apron) and the back door (with plinth blocks). The inspector calls it "Built by: Nobody".
- **Everyone has habits.** Each character picks a small habit at random every few
  seconds, so the room never repeats exactly. Marjorie thinks with her pencil on her
  chin, sips her coffee (setting the pencil down first), checks the clock and fixes her
  glasses, but never looks at the dog or at you. Dale scratches his head, rests his chin
  on his hand, leans back, sighs, and turns to look at Marjorie ("She did not look up").
  His head follows the dog wherever it goes. The dog hops around like a toy moved by a
  hand: it drinks from the bowl, sniffs, chases its tail, wanders, barks "Woof.", and
  visits Dale, who pets it. The inspector shows what each one is doing.
- **Ask Dale the dog's name** (once there is a dog). Whatever dog you gave him, he thinks, then says "Doctor Bones." The log records it,
  then "Security answer accepted". Marjorie keeps doing her crossword.
- **A wireframe flutter.** Now and then the whole world blinks to a blue wireframe two or
  three times, then turns solid again: one or two short blinks, then a longer one, with
  uneven gaps. The first comes 10 to 20 seconds into the run, then one every 20 to 45
  seconds. Each flutter is three blinks at most, inside about one second, so it stays at or
  under three flashes a second. It does not happen in wireframe view, while a dog is being
  replaced, or with reduced motion.
- **Wireframe view** shows the whole world as wireframes.
- **Turn the run off.** Things go one at a time, Marjorie still writing near the end.
  The dog goes last and collapses into one dot. With no dog, the note says "Dale never got
  a dog." Then you can start the next run, which starts with no dog again.
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
| Habits | `mA` (Marjorie), `dA` (Dale), `gA` (the dog): each has a list of `{ w, label, steps }`. `w` is how often it is picked, `label` shows in the inspector, `steps` are poses held for `dur` seconds |
| Poses | `M_BASE`, `D_BASE`, `G_BASE` and the named poses below them (joint positions in meters) |
| Dog kinds | `DOG_KINDS` (colors, size, spots); `buildDog(kind)` builds one, `placeDog(kind)` puts it in the world |
| Cat and goldfish | `cat` and `cA` (its habits), `fish` and `swimFish` |
| Add menu | `addBtn` click handler; `updateButtons()` decides which buttons are on |
| Kitchen things | the "more of the kitchen" block after the painting; steam and radio notes in `animateDecor`; the phone's ringing in the frame loop (`state.nextRing`) |
| Clock speed | `state.sim += dt * 4` (4 story seconds per real second) |
| Wireframe flutter | `glitch`, `glitchOn`, `glitchOff` and `flutterSteps` (the blink pattern); how often is in the frame loop after the spawn code |

The figures are built from spheres, cylinders and boxes with the `ball`, `rod`, `limb`
and `block` helpers. Arms, legs, necks and torsos that move are rebuilt every frame
from joint positions (`dynLimb` and `setLimb`), in meters, facing +z.

## Ideas not built yet

- Start the next run with small differences, so each run is not quite the same.
- A sound toggle with a ticking clock and a pencil on paper.
- Bring back the glitch where only the cabinets under the sink turn to wireframe. It is
  turned off for now; commit d26d818 has it.
