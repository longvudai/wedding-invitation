# Thiệp Cưới 83 Pre — React

A 1:1 React re-implementation of `thiep-cuoi-83-pre/template-preview/thiep-cuoi-83-pre.html`
(the ZenLove "Thiệp Cưới 83 Pre" wedding invitation for Đại Long & Kim Anh, 29.06.2026).

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
```

## How it works

The original is a ZenLove canvas template: 59 absolutely-positioned nodes on a
500 × 7053 px canvas. This project reproduces that verbatim:

- `src/nodes.json` — the extracted node list (geometry + text styles), pulled from the
  rendered DOM of the original page.
- `src/App.jsx` — renders the canvas and scales it to the viewport width; drives
  scroll-triggered entrance animations (fade / slide / zoom).
- `src/components/` — the interactive pieces:
  - `Countdown` — live countdown to 2026-06-29 15:30 (+07:00)
  - `Calendar` — June 2026, days 29–30 marked with the heart badge
  - `RsvpForm` — "Xác nhận tham dự" form (client-side only, no backend)
  - `GiftBox` — wobbling heart that opens the gift/QR modal
  - `AudioToggle` — background music ("Beautiful in White"), starts on first tap
  - `Menu` — floating section navigation
- `public/fonts/` — the 9 original ZenLove webfonts (Mesdag Regular, AnisaSignature,
  Clodia, Whitegone, Loving Ambros, VNF Bodoni, Eastin Hikary, Lora, Times New Roman).

Photos and a few decorative assets are still loaded from the ZenLove CDN (`cdn.zenlove.me`).

## Personalizing per guest

Pass the guest's name in the `guest` query parameter and it replaces the default
"Gia đình anh An" line on the invitation. URL-encode spaces and Vietnamese
characters:

```
https://your-site/?guest=Ch%E1%BB%8B%20Lan       # Chị Lan
https://your-site/?guest=Gia%20%C4%91%C3%ACnh%20anh%20An   # Gia đình anh An
```

`?guest=Chị%20Lan` also works in browsers that accept raw UTF-8 in the address
bar. Handled by `getGuestName()` in `src/guest.js`; falls back to the template
text when the parameter is absent.
