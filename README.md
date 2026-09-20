# irtaza-website

Portfolio site for **Irtaza Javed** — grade 8, centre-back, teaching himself
the computer science behind machine learning.

Static: three files and three images. No framework, no build step, no
dependencies. One typeface (Inter), one accent, used sparingly.

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

## The two renders are labelled, on purpose

`images/pitch.*` and `images/engineer.*` are generated images, not
photographs. Both carry an **Illustration** badge, a caption saying
"An illustration, not a photograph", and alt text that says the same.

That is not decoration. The Bernabéu shot puts a real 13-year-old in a Real
Madrid first-team kit on a stadium pitch, and an unlabelled copy on a public
portfolio reads as a claim that he plays for the club. Labelled, it reads as
ambition — which is what it is, and which is the better look anyway. If you
restyle the page, keep the badge, the caption and the alt text.

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
