# Primal Prints website

Live at https://fahedsalamehlz.github.io/Primal-Prints/ (GitHub Pages, served over HTTPS).

## Files
- `index.html` – page layout
- `styles.css` – look and feel
- `products.js` – **the catalog**: products, prices, options, shipping, photos, and the "From the Bench" ideas
- `app.js` – shop, cart and checkout. Put your PayPal **live Client ID** in `SETTINGS.PAYPAL_CLIENT_ID` at the top.
- `photos/` – your own photos

## Add or change a product
Open `products.js`, copy an existing product block, change the fields, commit. Prices shown in the cart and sent to PayPal are always calculated from this file.

## Add a new idea
Add an entry to `IDEAS` at the bottom of `products.js` (name, status, blurb, optional photo).

## Security
- Static site: no server, database or logins on the site to break into.
- Payments run inside PayPal's checkout; card numbers never touch this site.
- A Content Security Policy only lets the page load scripts from this site and PayPal.
- Never put passwords or PayPal **secret** keys in this repo. The Client ID is public by design.
- Turn on two-factor login for GitHub and PayPal.
- **Before shipping any order, check the PayPal amount matches the catalog price.** A technical buyer could tamper with their own browser; PayPal's receipt shows exactly what they paid.

## Updating
When you change app.js, products.js or styles.css, bump the ?v= number on them in index.html so visitors get the new version right away.
