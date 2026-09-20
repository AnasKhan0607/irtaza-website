# irtaza-website

Portfolio site for **Irtaza Javed** — grade 8, aspiring AI software engineer,
right back, Real Madrid fan.

Static: three files and three images. No framework, no build step, no
dependencies. One typeface (Inter), one accent, used sparingly. Dark and
light, following the system setting, with a toggle that overrides it.

```
index.html          the page
style.css           all styling; every colour and measure is a token at the top
script.js           the year, the nav border, and the scroll fade-in
images/irtaza.*     hero portrait (900×1125, EXIF stripped)
images/pitch.*      Real Madrid render, in "On the pitch"
images/engineer.*   AI workstation render, in "The lab"
```

Each image ships as WebP with a JPEG fallback; the browser picks the WebP.

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>. Opening `index.html` from Finder works too,
but a server is closer to how it will actually be served.

## What still needs your details

Search `index.html` for `EDIT ME`. Two things are placeholders:

- **the email** — currently `hello@example.com`, in the Contact section
- **the social links** — GitHub, Instagram and YouTube all point at `#`.
  Replace the `href`s, or delete the `<li>`s you don't use.

Everything else is real content.

## Theming

`data-theme` on `<html>` is the single source of truth and is **always**
present — `"dark"` or `"light"`, never absent. An inline script in `<head>`
resolves it before first paint from `localStorage`, falling back to the system
preference, so the page never flashes the wrong theme. The stylesheet then
matches two plain attribute selectors and nothing clever.

The dark tokens are *also* on a bare `:root`, so a full palette survives that
script never running; the `prefers-color-scheme` block is scoped to
`:root:not([data-theme])` and is the no-JS path only.

**This replaced a version that did not work reliably.** Light used to live
inside a media query guarded by `:root:not([data-theme="dark"])`, with the
attribute absent meaning "follow the system". It was hard to reason about, and
the control was a 15px unlabelled circle almost nobody found. The toggle is now
a labelled pill naming the theme it switches *to*.

**There is no transition on the page background.** A cross-fade there makes the
switch feel like it half-worked on a slow device, and it hides a real failure
behind an animation.

## Interaction

All of it is optional: the page is complete and readable with `script.js`
removed, and every behaviour is skipped under `prefers-reduced-motion` or on a
touch-only pointer where it would misfire.

| Thing | How |
|---|---|
| The slab | A real box in CSS 3D — two faces and four side panels. Drag to spin, momentum on release, then a slow idle rotation. |
| Timeline fill | The plan's line fills and its dots light as you scroll past them. |
| Spotlight | Panels track the pointer and paint a radial gradient from `--mx`/`--my`. |
| Tilt | Pointer-driven `rotateX`/`rotateY` on the portrait and panels. |
| Magnetic | Buttons and the email drift toward the cursor. |
| Word reveal | Headlines are split into words that wipe up on scroll. |

Three things worth knowing before changing any of it:

- **The slab is sized from `--cw`/`--ch`/`--cd`**, so every `translateZ` is a
  `calc()` off the same numbers. No JS measuring, correct at every width.
  Change the size in one place.
- **Dragging the slab needs three separate switches.** `user-select` on the
  box, `-webkit-user-drag` plus `draggable="false"` on the images, and
  `preventDefault()` on `pointerdown`/`dragstart`. None of them covers the
  others: miss one and the drag either selects the text around the panel or
  lifts a ghost of the photo out of the page.
- **The scroll handler's rAF guard has a timeout release.** The usual
  `if (ticking) return` pattern wedges permanently if that frame never runs.
- **Word-wipe spans clip descenders.** `overflow: hidden` is what makes it a
  wipe; the clip box is extended with `padding-bottom` and pulled back with a
  matching negative margin.

`fillProgress()` in `script.js` is pure and has a Node test — see the commit.

## The two renders

`images/pitch.*` and `images/engineer.*` are generated images, not
photographs. The visible badge and caption were removed at Irtaza's request.
Their **alt text still describes them as illustrations**, which is what a
screen reader and an image search read, and it costs the design nothing.

## Changing it

**Colours and spacing** are tokens at the top of `style.css`. `--accent` is
the warm off-gold; `--bg`, `--text`, `--muted` and the two `--line`s are the
rest. Change them there and the whole page follows.

**Keep the restraint.** An earlier pass had all-caps Anton headlines, a
scrolling HALA MADRID marquee, an outlined gold surname, a huge watermark 7
and a Ronaldo quote in a pull-out. It read as shouting. Size, space and one
accent do the work now — adding any of that back undoes it.

**Adding a project** is one more `<li class="card reveal">` in `#building`.
**Adding a timeline step** is one more `<li class="reveal">` in `#plan`; the
last one is filled automatically. Both reflow on their own.

**Swapping the photo**: replace both files in `images/`, keeping a roughly 4:5
portrait. Strip the metadata first — phone photos carry GPS coordinates, and
this repository is public:

```bash
magick new.jpg -auto-orient -strip -resize 900x1125^ -gravity center \
  -extent 900x1125 -quality 86 images/irtaza.jpg
magick images/irtaza.jpg -quality 82 images/irtaza.webp
```

## Notes

- **Motion**: the fade-ins stop under
  `prefers-reduced-motion`, and show everything at once when
  `IntersectionObserver` is missing — the failure mode of getting that wrong
  is a blank page, so it fails toward visible.
- **`og:image` is a relative path.** Some link previews want an absolute URL —
  once this has a domain, make it `https://<domain>/images/irtaza.jpg`.

## Deploying

Any static host serves this as-is. GitHub Pages is the shortest path:
**Settings → Pages → Source: Deploy from a branch → `main` / `root`**.

## License

MIT — see [LICENSE](LICENSE).
