# mgren

A minimalist English typing practice site, inspired by Monkeytype.
Static HTML, CSS and vanilla JavaScript. No backend, no dependencies, no API keys.

- Live: https://mgren.pages.dev/
- Repo: https://github.com/abohnadyx/mgren

## Structure

```
mgren/
├── index.html   # layout: header, controls, typing area, results, progress, settings
├── style.css    # dark minimal theme (colors are variables under :root)
├── script.js    # sentence generator, typing engine, timer, stats, localStorage
└── README.md
```

## Run locally

```bash
cd ~/mgren
python -m http.server 8000
# open http://localhost:8000  (Ctrl+Shift+R to bypass cache after edits)
```

Test on a phone on the same Wi-Fi:

```bash
python -m http.server 8000 --bind 0.0.0.0
ip -4 addr show | grep inet     # then open http://<your-ip>:8000 on the phone
```

## Edit

| Change | File |
|---|---|
| Colors, fonts, spacing | `style.css` (`:root` variables) |
| Buttons, structure | `index.html` |
| Sentences, modes, logic | `script.js` |

Useful spots in `script.js`:

- `TOPICS`: topic vocabulary and sentence templates (`{slot}` placeholders; templates starting with `#` contain numbers and appear only when Numbers is on).
- `GENERAL`: standalone sentences (short, advanced, questions).
- `MY_TEXT`: the text used by the **mine** mode. Typing is case-sensitive.
- `S` (defaults): duration, mode, punctuation, numbers, font size, sound, accent.

## Deploy

Cloudflare Pages (`mgren.pages.dev`). To publish a change (requires `nodejs npm`):

```bash
cd ~/mgren
npx wrangler pages deploy . --project-name mgren
```

Then keep GitHub updated as a backup:

```bash
git add .
git commit -m "describe the change"
git push
```

## Keyboard shortcuts

- `Tab`: restart with the same text
- `Esc`: new text (or close settings)
- `Enter` on the results screen: next test

## Data

Progress (best/average WPM, best accuracy, test count, recent results) is stored only in the
browser's `localStorage`. Nothing is sent anywhere. Use the **reset statistics** button to clear it.

## Optional next steps

- Buy a custom domain (e.g. `mgren.io`) and attach it under Custom domains.
- Add PWA support (manifest + service worker) so it installs on phones and works offline.
