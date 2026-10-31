"""Build depth.png for the Doctor Bones scene from kitchen.jpg.

depth.png is a small RGB image the scene reads in two ways:
  red channel   = depth, painted by hand (0 = far wall, 255 = nearest to the viewer)
  green channel = mask of the dog (255 = dog), used so the dog goes last in the ending

The depth is rough shapes blurred together. It only needs to be good enough for a
small parallax shift. The dog mask starts from a hand-drawn outline and is then
tightened to the dog's own fur and collar colors.

Usage (from this folder):
  pip install pillow numpy scipy
  python3 build_depth.py ../../kitchen.jpg ../depth.png

All coordinates below are pixels in kitchen.jpg (1399 x 932).
"""
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

OUT_SIZE = (700, 466)

DOG = [(1015, 425), (1062, 405), (1127, 425), (1152, 492), (1219, 535), (1317, 587),
       (1339, 687), (1397, 777), (1399, 825), (1097, 825), (1079, 772), (1105, 687),
       (1115, 587), (1095, 532), (1049, 509), (1009, 457)]


def level(x):
    return int(255 * x)


def paint_depth(w, h):
    img = Image.new("L", (w, h), level(0.10))  # back wall and window
    d = ImageDraw.Draw(img)
    for y in range(627, h):  # floor: far at the cabinets, near at the bottom edge
        d.line([(0, y), (w, y)], fill=level(0.30 + 0.62 * (y - 627) / 318))
    d.rectangle([457, 317, 1212, 677], fill=level(0.24))  # counter and cabinets
    d.rectangle([1137, 12, 1399, 672], fill=level(0.30))  # refrigerator
    # Dale
    d.ellipse([627, 242, 762, 397], fill=level(0.52))
    d.polygon([(547, 392), (627, 337), (787, 339), (917, 417), (942, 527), (992, 587),
               (1055, 707), (1062, 832), (867, 835), (757, 792), (627, 757), (543, 692),
               (530, 547)], fill=level(0.52))
    # the dog
    d.polygon(DOG, fill=level(0.62))
    # chair behind Marjorie
    d.rectangle([407, 487, 532, 867], fill=level(0.70))
    # Marjorie
    d.ellipse([237, 42, 467, 287], fill=level(0.80))
    d.polygon([(27, 247), (207, 227), (317, 255), (467, 272), (492, 407), (467, 507),
               (512, 547), (535, 707), (562, 932), (0, 932), (0, 337)], fill=level(0.80))
    # table, cup, fruit bowl
    d.ellipse([0, 492, 437, 687], fill=level(0.86))
    d.polygon([(0, 587), (437, 587), (427, 687), (0, 707)], fill=level(0.86))
    d.ellipse([262, 432, 402, 547], fill=level(0.88))
    d.ellipse([0, 457, 127, 627], fill=level(0.90))
    # towel in the bottom left corner
    d.rectangle([0, 682, 245, 932], fill=level(0.96))
    return img.filter(ImageFilter.GaussianBlur(10))


def dog_mask(photo):
    w, h = photo.size
    poly = Image.new("L", (w, h), 0)
    ImageDraw.Draw(poly).polygon(DOG, fill=255)
    poly = np.asarray(poly.filter(ImageFilter.MaxFilter(15))) > 0  # a little slack

    hsv = np.asarray(photo.convert("HSV")).astype(float)
    hue, sat, val = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    fur_or_collar = (((hue >= 12) & (hue <= 45)) | (hue <= 8) | (hue >= 345)) & (sat >= 0.52) & (val >= 0.14)

    m = poly & fur_or_collar
    m = ndimage.binary_opening(m, iterations=2)
    m = ndimage.binary_closing(m, iterations=6)
    m = ndimage.binary_fill_holes(m)
    lab, n = ndimage.label(m)
    if n:
        sizes = ndimage.sum(m, lab, range(1, n + 1))
        m = lab == (1 + int(np.argmax(sizes)))
    m = ndimage.binary_dilation(m, iterations=3) & poly
    return Image.fromarray((m * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(1.5))


def main(src, out):
    photo = Image.open(src).convert("RGB")
    depth = paint_depth(*photo.size).resize(OUT_SIZE, Image.LANCZOS)
    mask = dog_mask(photo).resize(OUT_SIZE, Image.LANCZOS)
    blue = Image.new("L", OUT_SIZE, 0)
    Image.merge("RGB", (depth, mask, blue)).save(out, optimize=True)
    print("wrote", out)


if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "../../kitchen.jpg",
         sys.argv[2] if len(sys.argv) > 2 else "../depth.png")
