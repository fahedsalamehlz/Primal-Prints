/* =====================================================================
   PRIMAL PRINTS — SHOP ENGINE
   Settings you may need to change:
   ===================================================================== */
const SETTINGS = {
  // Paste your PayPal LIVE Client ID here (PayPal Developer > Apps & Credentials).
  // Leave "" until you have it: the cart will offer "Email this order" instead.
  PAYPAL_CLIENT_ID: "AeT4AFO8v4i9tBjWk0grGxbo2JEcvjG-3woQQS1Lm7zVMubUKslOQXD08AVJ9mmQJCGTjzav9PpYdSOH",
  ORDER_EMAIL: "fahedsalamehlz@gmail.com",
  BRAND: "Primal Prints",
  CART_KEY: "pp_cart_v2"
};

/* ---------- helpers ---------- */
const $ = (s, r = document) => r.querySelector(s);
const money = (n) => "$" + (Math.round(n * 100) / 100).toFixed(2);
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const clean = (s, max) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const catName = (id) => (CATEGORIES.find(c => c.id === id) || {}).name || "";

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), 2200);
}

/* price for a product + chosen option indexes — always computed from the catalog,
   never from anything stored in the browser */
function priceFor(p, picks) {
  let price = p.price;
  (p.options || []).forEach((o, i) => { const c = o.choices[picks[i] || 0]; if (c && typeof c.price === "number") price = c.price; });
  (p.options || []).forEach((o, i) => { const c = o.choices[picks[i] || 0]; if (c && typeof c.add === "number") price += c.add; });
  return Math.round(price * 100) / 100;
}
function lowPrice(p) {
  let low = Infinity;
  const walk = (i, picks) => {
    if (!p.options || i === p.options.length) { low = Math.min(low, priceFor(p, picks)); return; }
    p.options[i].choices.forEach((_, k) => walk(i + 1, picks.concat(k)));
  };
  walk(0, []); return low;
}
const hasRange = (p) => (p.options || []).some(o => o.choices.some(c => "price" in c || "add" in c));

/* ---------- shop rendering ---------- */
let activeCat = "all";

function cardHTML(p) {
  const from = hasRange(p) ? "<small>from</small>" : "";
  const badge = p.ship === 0 ? '<span class="badge free">Free shipping</span>' : "";
  return `<article class="card">
    <button class="ph" type="button" data-open="${p.id}" aria-label="View ${esc(p.name)}">
      <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">${badge}</button>
    <div class="bd">
      <span class="cat">${esc(catName(p.cat))}</span>
      <h3>${esc(p.name)}</h3>
      <p>${esc(p.blurb)}</p>
      <div class="ft"><span class="price">${from}${money(lowPrice(p))}</span>
        <button class="btn small" type="button" data-open="${p.id}">${p.options || p.notes ? "Choose options" : "View"}</button></div>
    </div></article>`;
}

function renderFeatured() {
  $("#featured").innerHTML = PRODUCTS.filter(p => p.featured).slice(0, 4).map(p =>
    `<button class="feat" type="button" data-open="${p.id}">
       <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">
       <span class="tag">Featured</span>
       <span class="cap"><b>${esc(p.name)}</b><span>${hasRange(p) ? "from " : ""}${money(lowPrice(p))}</span></span>
     </button>`).join("");
}

function renderTabs() {
  const counts = {}; PRODUCTS.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  const tabs = [{ id: "all", name: "All gear", n: PRODUCTS.length }]
    .concat(CATEGORIES.filter(c => counts[c.id]).map(c => ({ id: c.id, name: c.name, n: counts[c.id] })));
  $("#tabs").innerHTML = tabs.map(t =>
    `<button class="tab" role="tab" type="button" data-cat="${t.id}" aria-selected="${t.id === activeCat}">${esc(t.name)}<small>${t.n}</small></button>`).join("");
}

function renderGrid() {
  const q = $("#search").value.trim().toLowerCase();
  const list = PRODUCTS.filter(p =>
    (activeCat === "all" || p.cat === activeCat) &&
    (!q || (p.name + " " + p.blurb + " " + (p.specs || []).join(" ") + " " + catName(p.cat)).toLowerCase().includes(q)));
  // keep category order when showing everything
  const order = CATEGORIES.map(c => c.id);
  list.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
  $("#grid").innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
}

function renderBench() {
  $("#bench-grid").innerHTML = IDEAS.map((idea, i) => `<article class="idea">
      <div class="ph">${idea.image ? `<img src="${esc(idea.image)}" alt="${esc(idea.name)}" loading="lazy">` : '<svg><use href="#mark"/></svg>'}
        <span class="st">${esc(idea.status)}</span></div>
      <div class="bd"><h3>${esc(idea.name)}</h3><p>${esc(idea.blurb)}</p>
        <button class="btn small ghost" type="button" data-idea="${i}">I want one</button></div>
    </article>`).join("");
}

/* ---------- product modal ---------- */
let current = null;

function openProduct(id) {
  const p = byId[id]; if (!p) return; current = p;
  $("#m-cat").textContent = catName(p.cat);
  $("#m-title").textContent = p.name;
  $("#m-blurb").textContent = p.blurb;
  $("#m-specs").innerHTML = (p.specs || []).map(s => `<li>${esc(s)}</li>`).join("");
  setPhoto(0);
  $("#m-thumbs").innerHTML = p.images.length > 1 ? p.images.map((src, i) =>
    `<button type="button" data-photo="${i}" aria-current="${i === 0}"><img src="${esc(src)}" alt="" loading="lazy"></button>`).join("") : "";
  $("#m-options").innerHTML = (p.options || []).map((o, i) => `<label>${esc(o.label)}
      <select data-opt="${i}">${o.choices.map((c, k) => `<option value="${k}">${esc(c.name)}${"price" in c ? " — " + money(c.price) : ""}${"add" in c ? " (+" + money(c.add) + ")" : ""}</option>`).join("")}</select>
    </label>`).join("");
  $("#m-notes-wrap").hidden = !p.notes;
  $("#m-notes").value = "";
  $("#m-notes").placeholder = p.notesHint || "";
  $("#m-notes-label").textContent = p.notesHint ? "Personalization / notes" : "Notes";
  $("#m-qty").value = 1;
  $("#m-ship").textContent = p.ship === 0 ? "Free shipping" : "+ " + money(p.ship) + " shipping";
  updateModalPrice();
  show("#modal");
}
function setPhoto(i) {
  $("#m-img").src = current.images[i]; $("#m-img").alt = current.name;
  document.querySelectorAll("#m-thumbs button").forEach((b, k) => b.setAttribute("aria-current", k === i));
}
const picksNow = () => [...document.querySelectorAll("#m-options select")].map(s => +s.value);
function updateModalPrice() { $("#m-price").textContent = money(priceFor(current, picksNow())); }

/* ---------- cart (stored in this browser only; prices are re-read from the catalog) ---------- */
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS.CART_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(l => byId[l.id]).map(l => ({
      id: l.id, picks: Array.isArray(l.picks) ? l.picks.map(n => Math.max(0, n | 0)) : [],
      notes: clean(l.notes, 100), qty: Math.min(20, Math.max(1, l.qty | 0))
    })).filter(l => (byId[l.id].options || []).every((o, i) => (l.picks[i] || 0) < o.choices.length)) : [];
  } catch (e) { return []; }
}
let cart = loadCart();
function saveCart() { try { localStorage.setItem(SETTINGS.CART_KEY, JSON.stringify(cart)); } catch (e) {} renderCart(); }

const lineInfo = (l) => {
  const p = byId[l.id];
  const opts = (p.options || []).map((o, i) => o.label + ": " + o.choices[l.picks[i] || 0].name);
  return { p, opts, unit: priceFor(p, l.picks) };
};
function totals() {
  let sub = 0, ship = 0;
  cart.forEach(l => { const { p, unit } = lineInfo(l); sub += unit * l.qty; ship = Math.max(ship, p.ship || 0); });
  sub = Math.round(sub * 100) / 100;
  return { sub, ship, total: Math.round((sub + ship) * 100) / 100 };
}

function addToCart() {
  const picks = picksNow();
  const notes = clean($("#m-notes").value, 100);
  const qty = Math.min(20, Math.max(1, parseInt($("#m-qty").value, 10) || 1));
  const same = cart.find(l => l.id === current.id && l.notes === notes && JSON.stringify(l.picks) === JSON.stringify(picks));
  if (same) same.qty = Math.min(20, same.qty + qty); else cart.push({ id: current.id, picks, notes, qty });
  saveCart(); hide("#modal"); toast("Added to cart");
}

function renderCart() {
  const n = cart.reduce((a, l) => a + l.qty, 0);
  $("#cart-count").textContent = n;
  const box = $("#cart-items");
  if (!cart.length) {
    box.innerHTML = '<p class="cart-empty">Your cart is empty.<br><a href="#shop" data-close-cart>Browse the gear</a></p>';
    $("#cart-foot").hidden = true; return;
  }
  $("#cart-foot").hidden = false;
  box.innerHTML = cart.map((l, i) => {
    const { p, opts, unit } = lineInfo(l);
    return `<div class="ci"><img src="${esc(p.images[0])}" alt="">
      <div><h4>${esc(p.name)}</h4>
        ${opts.map(o => `<div class="opt">${esc(o)}</div>`).join("")}
        ${l.notes ? `<div class="opt">Notes: ${esc(l.notes)}</div>` : ""}
        <div class="q"><button type="button" data-dec="${i}" aria-label="Fewer">−</button><span>${l.qty}</span><button type="button" data-inc="${i}" aria-label="More">+</button>
          <button class="rm" type="button" data-rm="${i}">Remove</button></div></div>
      <div class="lp">${money(unit * l.qty)}</div></div>`;
  }).join("");
  const t = totals();
  $("#c-sub").textContent = money(t.sub);
  $("#c-ship").textContent = t.ship ? money(t.ship) : "Free";
  $("#c-total").textContent = money(t.total);
}

/* ---------- checkout ---------- */
function orderSummary() {
  const t = totals();
  return cart.map(l => {
    const { p, opts, unit } = lineInfo(l);
    return `${l.qty} x ${p.name} — ${money(unit)} each\n   ${opts.join("; ")}${l.notes ? "\n   Notes: " + l.notes : ""}`;
  }).join("\n\n") + `\n\nSubtotal: ${money(t.sub)}\nShipping: ${t.ship ? money(t.ship) : "Free"}\nTotal: ${money(t.total)}`;
}

let paypalLoaded = false, paypalRendered = false;
function setupCheckout() {
  if (!SETTINGS.PAYPAL_CLIENT_ID) { $("#checkout-fallback").hidden = false; return; }
  if (paypalRendered || !cart.length) return;
  const render = () => {
    if (!window.paypal || paypalRendered) return;
    paypalRendered = true;
    window.paypal.Buttons({
      style: { layout: "vertical", color: "gold", shape: "rect", label: "paypal" },
      createOrder: (data, actions) => {
        const t = totals();
        return actions.order.create({
          intent: "CAPTURE",
          purchase_units: [{
            description: SETTINGS.BRAND + " order",
            amount: { currency_code: "USD", value: t.total.toFixed(2),
              breakdown: { item_total: { currency_code: "USD", value: t.sub.toFixed(2) },
                           shipping: { currency_code: "USD", value: t.ship.toFixed(2) } } },
            items: cart.map(l => {
              const { p, opts, unit } = lineInfo(l);
              return { name: p.name.slice(0, 127), quantity: String(l.qty), category: "PHYSICAL_GOODS",
                unit_amount: { currency_code: "USD", value: unit.toFixed(2) },
                description: clean(opts.map(o => o.split(": ")[1]).join(", ") + (l.notes ? " | " + l.notes : ""), 127) };
            })
          }],
          application_context: { brand_name: SETTINGS.BRAND, shipping_preference: "GET_FROM_FILE", user_action: "PAY_NOW" }
        });
      },
      onApprove: (data, actions) => actions.order.capture().then(() => {
        cart = []; saveCart(); hide("#cart");
        toast("Order placed — thank you!");
        setTimeout(() => alert("Thank you! Your order is confirmed. You'll get a PayPal receipt by email, and we'll email you when it ships."), 300);
      }),
      onError: () => toast("Payment didn't go through. Please try again.")
    }).render("#paypal-buttons");
  };
  if (paypalLoaded) return render();
  const s = document.createElement("script");
  s.src = "https://www.paypal.com/sdk/js?client-id=" + encodeURIComponent(SETTINGS.PAYPAL_CLIENT_ID) +
          "&currency=USD&intent=capture&enable-funding=venmo";
  s.onload = () => { paypalLoaded = true; render(); };
  s.onerror = () => { $("#checkout-fallback").hidden = false; };
  document.head.appendChild(s);
}

function emailOrder() {
  const body = "Hi, I'd like to order:\n\n" + orderSummary() + "\n\nMy name:\nShip to address:\n";
  location.href = "mailto:" + SETTINGS.ORDER_EMAIL + "?subject=" + encodeURIComponent("Order request — " + SETTINGS.BRAND) + "&body=" + encodeURIComponent(body);
}

/* ---------- custom order form ---------- */
function submitCustom(e) {
  e.preventDefault();
  const f = e.target, v = (n) => clean(f.elements[n].value, 1500);
  if (!v("name") || !v("email") || !v("details")) { toast("Please add your name, email and what you need."); return; }
  const body = `Name: ${v("name")}\nEmail: ${v("email")}\nQuantity: ${v("qty") || 1}\nColors: ${v("colors") || "-"}\nNeeded by: ${v("date") || "-"}\nReference: ${v("link") || "-"}\n\nDetails:\n${v("details")}`;
  location.href = "mailto:" + SETTINGS.ORDER_EMAIL + "?subject=" + encodeURIComponent("Custom order request from " + v("name")) + "&body=" + encodeURIComponent(body);
  toast("Opening your email app…");
}

/* ---------- overlays ---------- */
let lastFocus = null;
function show(sel) { lastFocus = document.activeElement; $(sel).hidden = false; document.body.style.overflow = "hidden"; const x = $(sel + " .x"); if (x) x.focus(); }
function hide(sel) { $(sel).hidden = true; if ($("#modal").hidden && $("#cart").hidden) document.body.style.overflow = ""; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
function openCart() { renderCart(); show("#cart"); setupCheckout(); }

/* ---------- events ---------- */
document.addEventListener("click", (e) => {
  const t = e.target.closest("[data-open],[data-photo],[data-cat],[data-close],[data-inc],[data-dec],[data-rm],[data-idea],[data-close-cart]");
  if (t) {
    if (t.dataset.open) openProduct(t.dataset.open);
    else if (t.dataset.photo) setPhoto(+t.dataset.photo);
    else if (t.dataset.cat) { activeCat = t.dataset.cat; renderTabs(); renderGrid(); }
    else if ("close" in t.dataset) hide("#" + t.closest(".overlay").id);
    else if ("closeCart" in t.dataset) hide("#cart");
    else if (t.dataset.inc) { const l = cart[+t.dataset.inc]; l.qty = Math.min(20, l.qty + 1); saveCart(); }
    else if (t.dataset.dec) { const l = cart[+t.dataset.dec]; if (l.qty > 1) { l.qty--; saveCart(); } }
    else if (t.dataset.rm) { cart.splice(+t.dataset.rm, 1); saveCart(); }
    else if (t.dataset.idea) {
      const idea = IDEAS[+t.dataset.idea];
      const f = $("#custom-form"); f.elements.details.value = "I'm interested in: " + idea.name + ". ";
      location.hash = "#custom"; f.elements.name.focus();
    }
    return;
  }
  if (e.target.classList.contains("overlay")) hide("#" + e.target.id);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { if (!$("#modal").hidden) hide("#modal"); else if (!$("#cart").hidden) hide("#cart"); } });
$("#m-options").addEventListener("change", updateModalPrice);
$("#m-form").addEventListener("submit", (e) => { e.preventDefault(); addToCart(); });
$("#cart-open").addEventListener("click", openCart);
$("#email-order").addEventListener("click", emailOrder);
$("#custom-form").addEventListener("submit", submitCustom);
$("#search").addEventListener("input", renderGrid);

renderFeatured(); renderTabs(); renderGrid(); renderBench(); renderCart();
