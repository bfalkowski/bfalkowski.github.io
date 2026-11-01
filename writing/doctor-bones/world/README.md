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
  Dale's chair at the table (Sat in: Now and then), Dale's laptop at his place (Fits the
  kitchen: No; On the screen: His own posts), Dale's hat on a hook (Worn: Never), a
  shelf of jars and plates, a trash can, a bread box, a braided rug and a sink mat. A dog
  bed arrives with the first dog. The walls have oak Arts and Crafts woodwork: wainscoting
  with battens and a cap ledge, and Craftsman casing on the window (with an oak sill and
  apron) and the back door (with plinth blocks). The inspector calls it "Built by: Nobody".
- **Everyone has habits.** Each character picks a small habit at random every few
  seconds, so the room never repeats exactly. Marjorie thinks with her pencil on her
  chin, sips her coffee (setting the pencil down first), checks the clock and fixes her
  glasses, but never looks at the dog or at you. Dale starts each run in his chair at the
  table with his laptop open: he types, reads his posts, rests his chin on his hand, looks
  at the floor, sighs, and looks at Marjorie. Now and then the log says "Dale posted
  something". When the first dog arrives, he keeps typing for a moment. Then he is startled
  ("Dale saw the dog"): he leans back with his hands up. He stares at it, closes his laptop
  ("Dale closed his laptop"), gets up ("Dale got up from the table"), walks over like a toy
  moved by a hand, and sits on the floor by the dog ("Dale sat on the floor by the dog").
  After that he goes back and forth: 20 to 40 seconds on the floor with the dog, then he
  gets up, walks back to his chair and opens his laptop for 15 to 30 seconds (now with a
  look at the dog now and then), then he closes it and goes back to the dog. The dog watches him wherever he is, and visits him only on the
  floor. With reduced motion he is simply on the floor, and he stays there. You can ask him
  the dog's name when he is on the floor or at his laptop. On the floor he scratches his head, rests
  his chin on his hand, leans back, sighs, and turns to look at Marjorie ("She did not
  look up"). His head follows the dog wherever it goes. The dog hops around like a toy moved by a
  hand: it drinks from the bowl, sniffs, chases its tail, wanders, barks "Woof.", and
  visits Dale, who pets it. The inspector shows what each one is doing.
- **Ask Dale the dog's name** (once there is a dog). Whatever dog you gave him, he thinks, then says "Doctor Bones." The log records it,
  then "Security answer accepted". Marjorie keeps doing her crossword.
- **Look** (a menu under the scene) changes how real the kitchen looks while it runs:
  Toy (the original light), Sunlight (reflections, real chrome, and sun through the window
  that casts the window frame on the floor), Sunlight and surfaces (also wood grain, worn
  glossy floor tiles with grout, plaster, painted cabinets, enamel with a clear coat, and
  rounded edges), and Sunlight, surfaces and shading (also ambient occlusion, antialiasing
  and a light vignette). A new visitor gets the last one. The browser remembers the choice.
  The first switch to a higher look can pause for a moment while it makes the textures.
- **Wireframe view** shows the whole world as wireframes.
- **Radio sound** (off by default) plays the radio's song: an original slow ballad in the
  style of a 1940s radio record, made in the page with Web Audio. It sounds muffled like a
  small speaker, with record crackle. It starts from the top when the radio comes on and
  fades out when the run is turned off. It pauses when
  the scene is off screen or the tab is hidden.
- **Turn the run off.** Things go one at a time, Marjorie still writing near the end.
  The dog goes last and collapses into one dot. With no dog, the note says "Dale never got
  a dog." Then you can start the next run, which starts with no dog again.
- **Reduced motion:** no camera fly-in or build animation.
- **No WebGL:** it shows the still picture (`../kitchen.jpg`) instead.

## Code

Everything is in `index.html`: page, styles, and three.js code. It uses three.js r128
from cdnjs, and from jsDelivr (`three@0.128.0/examples/js`) its OrbitControls,
RoomEnvironment, RoundedBoxGeometry, and the post-processing files for the shading
(EffectComposer, RenderPass, ShaderPass, MaskPass, SSAOPass with SSAOShader and
SimplexNoise, CopyShader, GammaCorrectionShader, FXAAShader, VignetteShader).

Useful places in the script:

| What | Where |
| --- | --- |
| Figure size | `FIG` (1.35) scales the people, dog, table, chair, cup and crossword |
| Where people sit | `TABLE`, `M_POS`/`M_YAW` (Marjorie), `D_POS`/`D_YAW` (Dale on the floor), `CHAIR_SPOT`/`CHAIR_YAW` (Dale at the table), `DOG_POS` |
| Dale's chair, laptop and walks | `state.daleSeat` ('laptop', 'moving' or 'floor') and `state.daleNext` (when he next moves); poses `D_CHAIR` (sitting, hands on the closed laptop), `D_LAPTOP`, `D_SURPRISED` and `D_STAND` (`lift` raises his body on `DJ.rig`); `laptopHabits` and `floorHabits`; `seatDale`, `walkStep`, `daleToFloor(surprised)` and `daleToLaptop`; the back-and-forth timer and the lid in the frame loop |
| Laptop | `laptop`, `lid` (opens with `state.lidOpen`), `laptopScreen` and `screenTex` (the feed on the screen) |
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
| Look | `setLook(n)` (0 to 3) in the "look" block before the state; `makeSurfaces` (the canvas textures), `setSurfaces` (maps, clear coat, and sharp or rounded boxes from `roundables`), `makeComposer` (ambient occlusion and the passes after it), `sunIn` (the sun through the window), `hemi`; the choice is kept in localStorage as `run4113-look` |
| Shadows | each mesh keeps its own `castShadow` in `userData.cast`, so switching to wireframe and back does not make the window glass block the sun |
| Radio song | `SONG` (tempo, chords in `CH` and `BARS`, melody in `MEL` as bar, beat, length, MIDI note), `playEvent` (the instruments), `startAudio` (the speaker filter and crackle), `music` and `syncAudio` |

The figures are built from spheres, cylinders and boxes with the `ball`, `rod`, `limb`
and `block` helpers. Arms, legs, necks and torsos that move are rebuilt every frame
from joint positions (`dynLimb` and `setLimb`), in meters, facing +z.

## Ideas not built yet

- Start the next run with small differences, so each run is not quite the same.
- Room sounds with the radio: a ticking clock and a pencil on paper.
- Bring back a wireframe glitch. Two versions were built and then taken out: the
  cabinets under the sink turning to wireframe now and then (commit d26d818), and the whole
  world blinking to wireframe in a short flutter (last in commit c6b2da3).
