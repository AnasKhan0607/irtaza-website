# irtaza-website

Personal website for Irtaza Javed. A static site — three files, no build step,
no dependencies.

```
index.html    the page
style.css     all styling; the design tokens are at the top
script.js     the year, the nav border, and the scroll fade-in
```

## Run it locally

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

Opening `index.html` directly from Finder works too, but a local server is
closer to how it will actually be served.

## Editing it

Everything marked `EDIT ME` in `index.html` is placeholder text:

- the one-line intro under the name
- the About paragraphs and the skill tags
- the three project cards — name, one line, stack, and link
- the email address and the three social links

To restyle the whole site, change the tokens at the top of `style.css`
(`--accent` is the gold; `--bg`, `--text` and `--muted` are the rest). A light
theme is already defined and follows the visitor's system setting.

Adding a project is one more `<li class="card reveal">` block in the `#work`
list — the grid reflows on its own.

## Deploying

Any static host serves this as-is. GitHub Pages is the shortest path:
**Settings → Pages → Source: Deploy from a branch → `main` / `root`**.

## License

MIT — see [LICENSE](LICENSE).
