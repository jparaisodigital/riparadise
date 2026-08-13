# R.I.PARADISE

A lightweight, static e-commerce site for the streetwear brand **R.I.PARADISE**. No backend, no build step — just HTML, vanilla JS, and CSS. Products, content, and site behavior are all driven from a single config file.

## Pages

| File            | Purpose                                                              |
|-----------------|-----------------------------------------------------------------------|
| `index.html`    | Landing page — slideshow + "Shop Now" CTA                            |
| `store.html`    | Product grid, product detail modal, size chart modal                 |
| `chapters.html` | Brand story page — gallery mosaic, IG reel embed, timeline, footer   |
| `checkout.html` | Checkout form, order summary, payment selection, order success modal |
| `help.html`     | FAQs, terms & conditions, return/exchange policy                     |

## File structure

```
├── index.html
├── store.html
├── chapters.html
├── checkout.html
├── help.html
├── config.js       # single source of truth for all content/settings
├── app.js          # shared UI logic (nav, modals, cart drawer, gallery, etc.)
├── cart.js         # cart engine (localStorage)
├── checkout.js      # checkout page logic (payments, shipping, place order)
├── style.css
└── assets/          # images, logos, QR codes, gallery photos
```

## How it works

### Config-driven content
Almost everything on the site — brand name, colors, fonts, nav links, homepage slides, product list, sizes, size chart, payment methods, shipping fees, socials, chapters gallery/timeline/manifesto, footer message — lives in **`config.js`**. Edit the values there and the pages re-render automatically; no HTML edits needed for content changes.

Key sections in `config.js`:
- `brand`, `colors`, `fonts` — theme, applied to CSS variables by `app.js`
- `nav` — header navigation links
- `slides`, `cta` — homepage slideshow + shop button
- `products` — the 4 products (id, name, price, images, sizes, description)
- `sizeChart` — size chart modal table + image
- `payments` — GCash / Cash on Delivery, with QR image
- `shipping` — per-region shipping fees (Luzon / Visayas-Mindanao)
- `deliveryInfo`, `codDelivery` — courier info banners
- `messenger` — Messenger link used for COD order handoff
- `gallery`, `chaptersMedia`, `chaptersManifesto`, `chaptersTimeline` — Chapters page content
- `footerThanks` — tombstone "scratch to reveal" footer section
- `socials` — footer social icons/links

### Cart (`cart.js`)
- Cart state is stored in `localStorage` under the key `rip_cart`.
- `addToCart(product, size)` — adds an item or increments qty if the same product+size is already in the cart.
- `getCart()`, `saveCart()`, `cartCount()`, `cartTotal()` — core cart helpers.
- Cart badge (`.cart-count`) auto-updates on every save, on every page.

### Shared UI (`app.js`)
Runs on every page and handles:
- Applying `CONFIG` theme values as CSS variables
- Rendering nav, footer logo/socials, hamburger menu
- Homepage slideshow (auto-rotates every 3.2s)
- Product grid + product detail modal (tap image to preview alt image, tap card to open modal)
- Size chart modal
- Cart drawer (open/close, qty +/−, remove item)
- Page transition fade on internal links
- Toast notifications
- Chapters page: mosaic gallery + lightbox, hover tilt effect, Instagram embed, manifesto, timeline, and the interactive tombstone "rub to reveal" canvas footer
- Scroll-to-top button (Chapters page)

### Checkout (`checkout.js`)
- Renders order summary from the cart.
- Payment method toggle (GCash shows QR code; COD shows a cash note).
- Shipping fee is calculated from the selected region (skipped for COD, which is arranged via Messenger instead).
- Basic form validation (required fields + email format) before placing an order.
- On **Place Order**: generates an order, saves it to `localStorage` (`rip_orders`), clears the cart, and shows the Order Success modal with order number/total and next-step instructions. For COD, a "Continue to Messenger" button opens the configured Messenger link.
- Redirects to store with an "empty cart" toast if checkout is reached with nothing in the cart.

## Editing common things

- **Add/remove/edit a product** → edit the `products` array in `config.js`.
- **Change prices, shipping fees, currency symbol** → `config.js` (`products`, `shipping`, `currency`).
- **Swap images/logo/slides** → replace files in `assets/` and update the matching path in `config.js`.
- **Change payment methods** → edit the `payments` array (add `iconImage`/`qr` as needed).
- **Toggle Chapters sections on/off** → `chaptersManifesto.enabled`, `chaptersTimeline.enabled`, `footerThanks.enabled` in `config.js`.
- **Update FAQs / policies** → edit the text directly in `help.html`.

## Running locally

No build tools needed — it's static HTML/CSS/JS. Just serve the folder with any static server, e.g.:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open `index.html` (or `http://localhost:PORT`) in your browser.

## Notes

- All data (cart, orders) is stored client-side in `localStorage` — there is no real backend/database, so orders aren't centrally recorded beyond the customer's own browser and whatever gets sent to you via GCash/Messenger.
- Instagram embed on the Chapters page depends on Instagram's `embed.js` script loading at runtime.