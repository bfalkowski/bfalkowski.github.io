# Doctor Bones scene

An animated version of the kitchen picture from the short story
[Doctor Bones](../../doctor-bones.html). Not linked from the site yet.

Live at https://bfalkowski.github.io/writing/doctor-bones/scene/

## What it does

- **While it runs:** the photo drifts slowly with a sense of depth, and dust floats in
  the window light. Moving the pointer over it shifts the view a little.
- **"Turn Dale off":** the picture drops to low resolution, the room and the people
  drift away like ash, the dog stands alone for a moment, then the dog collapses into
  one dot that fades like an old TV. "Start run 4,114" resets it and counts up.
- **Reduced motion:** if the reader's system asks for less motion, there is no drift
  or dust, and the ending is a plain fade to black.
- **No WebGL:** it shows the still picture instead.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The whole scene: page, styles, and three.js code (r128 from cdnjs). |
| `depth.png` | Red channel is depth (0 far, 255 near). Green channel is the dog mask. |
| `tools/build_depth.py` | Rebuilds `depth.png` from `../kitchen.jpg`. |
| `../kitchen.jpg` | The picture, shared with the story page. |

## How it works

- The living picture is one flat plane. Each pixel is shifted by its depth times a
  small camera offset, so near things move more than far things.
- The ending switches to a grid of 240 x 160 points that sample the same picture.
  Points outside the dog drift up and fade, with far things going first. Dog points
  then collapse to the dog's center.
- Timing for the ending is in `frame()` in `index.html` (settle 0.6 s, pixelate to
  1.3 s, room gone by 4.8 s, dog collapses 5.6 to 6.8 s, last dot fades by 8.3 s).

## Rebuilding the depth map

If the picture changes, the shapes in `tools/build_depth.py` need to be moved to match.
Coordinates are pixels in `kitchen.jpg` (1399 x 932).

```
cd tools
pip install pillow numpy scipy
python3 build_depth.py ../../kitchen.jpg ../depth.png
```

## Ideas not built yet

- A second copy at the end of the story that turns off by itself when the reader
  scrolls to it, with the first copy only drifting.
- The dog's back half flickering into a blue wireframe now and then.
- The checkered floor turning into a glowing grid.
