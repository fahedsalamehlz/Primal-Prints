/* =====================================================================
   PRIMAL PRINTS — SHOP ENGINE
   Settings you may need to change:
   ===================================================================== */
const SETTINGS = {
  // Paste your PayPal LIVE Client ID here (PayPal Developer > Apps & Credentials).
  // Leave "" until you have it: the cart will offer "Email this order" instead.
  PAYPAL_CLIENT_ID: "BAAMHccgP5Muyl98v7GubKzWv0eY1DmBstWONgrNZsY6RoL7FibP1GdMLk2LXZrUcMVjzWXo7DtfacP4-E",
  ORDER_EMAIL: "orders@primalprints3d.com",
  CUSTOM_EMAIL: "custom@primalprints3d.com",
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
/* sale: show the regular price crossed out */
const wasHTML = (p, n) => (window.SALE_ACTIVE && window.SALE_F && !p.second) ? `<s class="was">${money(Math.round(n / window.SALE_F * 100) / 100)}</s>` : "";

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
      <div class="ft"><span class="price">${from}${wasHTML(p, lowPrice(p))}${money(lowPrice(p))}</span>
        <button class="btn small" type="button" data-open="${p.id}">${p.options || p.notes ? "Choose options" : "View"}</button></div>
    </div></article>`;
}

const SHOP = PRODUCTS.filter(p => !p.second);
const maxQty = (p) => p.sold ? 0 : (p.max || 20);

function renderFeatured() {
  $("#featured").innerHTML = SHOP.filter(p => p.featured).sort((x, y) => (x.featuredRank || 99) - (y.featuredRank || 99)).slice(0, 4).map(p =>
    `<button class="feat" type="button" data-open="${p.id}">
       <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy">
       <span class="tag">Featured</span>
       <span class="cap"><b>${esc(p.name)}</b><span>${hasRange(p) ? "from " : ""}${wasHTML(p, lowPrice(p))}${money(lowPrice(p))}</span></span>
     </button>`).join("");
}

function renderTabs() {
  const counts = {}; SHOP.forEach(p => counts[p.cat] = (counts[p.cat] || 0) + 1);
  const tabs = [{ id: "all", name: "All gear", n: SHOP.length }]
    .concat(CATEGORIES.filter(c => counts[c.id]).map(c => ({ id: c.id, name: c.name, n: counts[c.id] })));
  $("#tabs").innerHTML = tabs.map(t =>
    `<button class="tab" role="tab" type="button" data-cat="${t.id}" aria-selected="${t.id === activeCat}">${esc(t.name)}<small>${t.n}</small></button>`).join("");
}

function renderGrid() {
  const q = $("#search").value.trim().toLowerCase();
  const list = SHOP.filter(p =>
    (activeCat === "all" || p.cat === activeCat) &&
    (!q || (p.name + " " + p.blurb + " " + (p.specs || []).join(" ") + " " + catName(p.cat)).toLowerCase().includes(q)));
  // keep category order when showing everything
  const order = CATEGORIES.map(c => c.id);
  list.sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat));
  $("#grid").innerHTML = list.map(cardHTML).join("");
  $("#empty").hidden = list.length > 0;
}

function renderSeconds() {
  const box = $("#seconds-grid"); if (!box) return;
  const items = PRODUCTS.filter(p => p.second);
  $("#seconds-empty").hidden = items.length > 0;
  box.innerHTML = items.map(p => `<article class="card second${p.sold ? " sold" : ""}">
    <button class="ph" type="button" data-open="${p.id}" aria-label="View ${esc(p.name)}">
      <img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy"><span class="badge sec">${p.sold ? "Sold" : "OH SHOOT · Only 1"}</span></button>
    <div class="bd">
      <span class="cat">OH SHOOT Bin</span>
      <h3>${esc(p.name)}</h3>
      <p class="flaw"><b>The flaw:</b> ${esc(p.flaw || "Cosmetic only.")}</p>
      <div class="ft"><span class="price">${p.was ? `<s>${money(p.was)}</s>` : ""}${money(lowPrice(p))}</span>
        <button class="btn small" type="button" data-open="${p.id}"${p.sold ? " disabled" : ""}>${p.sold ? "Sold" : "View"}</button></div>
    </div></article>`).join("");
}

function renderBench() {
  if (!$("#bench-grid")) return;
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
  $("#m-options").innerHTML = (p.options || []).map((o, i) => `<label><span>${esc(o.label)} <em class="req">*</em></span>
      <select data-opt="${i}" required><option value="" selected disabled>Select ${esc(o.label.toLowerCase())}…</option>${o.choices.map((c, k) => `<option value="${k}">${esc(c.name)}${"price" in c ? " — " + money(c.price) : ""}${"add" in c ? " (+" + money(c.add) + ")" : ""}</option>`).join("")}</select>
    </label>`).join("");
  $("#m-notes-wrap").hidden = !p.notes;
  $("#m-notes").value = "";
  $("#m-notes").placeholder = p.notesHint || "";
  $("#m-error").hidden = true;
  updateNotesLabel();
  $("#m-qty").value = 1;
  $("#m-qty").max = maxQty(p) || 1;
  $("#m-qty").closest("label").hidden = maxQty(p) === 1;
  $("#m-flaw").hidden = !p.second;
  $("#m-flaw").innerHTML = p.second ? "<b>OH SHOOT:</b> " + esc(p.flaw || "Cosmetic flaw.") + " Works 100%. Only one available, final sale." : "";
  $("#m-form button[type=submit]").disabled = !!p.sold;
  $("#m-ship").textContent = p.ship === 0 ? "Free shipping" : "+ " + money(p.ship) + " shipping";
  updateModalPrice();
  show("#modal");
}
function setPhoto(i) {
  $("#m-img").src = current.images[i]; $("#m-img").alt = current.name;
  document.querySelectorAll("#m-thumbs button").forEach((b, k) => b.setAttribute("aria-current", k === i));
}
/* -1 = not chosen yet */
const picksNow = () => [...document.querySelectorAll("#m-options select")].map(s => s.value === "" ? -1 : +s.value);
/* notes are required when the product says so, or when a chosen option needs them */
function notesRequired(p, picks) {
  if (!p.notes) return false;
  if (p.notesRequired) return true;
  return (p.options || []).some((o, i) => picks[i] >= 0 && o.choices[picks[i]].requiresNotes);
}
function updateNotesLabel() {
  const req = notesRequired(current, picksNow());
  $("#m-notes-label").innerHTML = (current.notesHint ? "Personalization / notes" : "Notes") + (req ? ' <em class="req">* required</em>' : " (optional)");
}
function updateModalPrice() {
  const picks = picksNow();
  const done = picks.every(n => n >= 0);
  const n = done ? priceFor(current, picks) : lowPrice(current);
  $("#m-price").innerHTML = (!done && hasRange(current) ? "from " : "") + wasHTML(current, n) + money(n);
  updateNotesLabel();
}
function missingFields() {
  const missing = [];
  document.querySelectorAll("#m-options select").forEach((s, i) => {
    const bad = s.value === ""; s.classList.toggle("invalid", bad);
    if (bad) missing.push(current.options[i].label);
  });
  const needNotes = notesRequired(current, picksNow()) && !clean($("#m-notes").value, 100);
  $("#m-notes").classList.toggle("invalid", needNotes);
  if (needNotes) missing.push((current.notesHint || "personalization").replace(/\.$/, ""));
  return missing;
}

/* ---------- cart (stored in this browser only; prices are re-read from the catalog) ---------- */
function loadCart() {
  try {
    const raw = JSON.parse(localStorage.getItem(SETTINGS.CART_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter(l => byId[l.id]).map(l => ({
      id: l.id, picks: Array.isArray(l.picks) ? l.picks.map(n => Math.max(0, n | 0)) : [],
      notes: clean(l.notes, 100), qty: Math.min(maxQty(byId[l.id]) || 1, Math.max(1, l.qty | 0))
    })).filter(l => !byId[l.id].sold).filter(l => (byId[l.id].options || []).every((o, i) => (l.picks[i] || 0) < o.choices.length)) : [];
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
  const missing = missingFields();
  if (missing.length) {
    $("#m-error").textContent = "Please choose: " + missing.join(", ");
    $("#m-error").hidden = false;
    const first = document.querySelector("#m-form .invalid"); if (first) first.focus();
    return;
  }
  $("#m-error").hidden = true;
  const picks = picksNow();
  const notes = clean($("#m-notes").value, 100);
  if (current.sold) { toast("Sorry, that one has sold."); return; }
  const cap = maxQty(current);
  const qty = Math.min(cap, Math.max(1, parseInt($("#m-qty").value, 10) || 1));
  const inCart = cart.filter(l => l.id === current.id).reduce((n, l) => n + l.qty, 0);
  if (inCart >= cap) { hide("#modal"); toast(cap === 1 ? "That one-of-a-kind item is already in your cart" : "Already at the limit in your cart"); return; }
  const same = cart.find(l => l.id === current.id && l.notes === notes && JSON.stringify(l.picks) === JSON.stringify(picks));
  if (same) same.qty = Math.min(cap, same.qty + qty); else cart.push({ id: current.id, picks, notes, qty: Math.min(qty, cap - inCart) });
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
        <div class="q"><button type="button" data-dec="${i}" aria-label="Fewer">−</button><span>${l.qty}</span><button type="button" data-inc="${i}" aria-label="More"${l.qty >= maxQty(p) ? " disabled" : ""}>+</button>
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
      onApprove: (data, actions) => {
        const summary = orderSummary(), total = totals().total;
        return actions.order.capture().then((details) => {
        notifyOrder(summary, total, details, data);
        cart = []; saveCart(); hide("#cart");
        toast("Order placed — thank you!");
        setTimeout(() => alert("Thank you! Your order is confirmed. You'll get a PayPal receipt by email, and we'll email you when it ships."), 300);
      });
      },
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

/* ---------- order notification email (to SETTINGS.ORDER_EMAIL via FormSubmit) ---------- */
function notifyOrder(summary, total, d, data) {
  try {
    const pu = (d && d.purchase_units && d.purchase_units[0]) || {};
    const sh = pu.shipping || {}, a = sh.address || {}, payer = (d && d.payer) || {};
    const cap = ((pu.payments && pu.payments.captures) || [])[0] || {};
    const buyer = (sh.name && sh.name.full_name) ||
      [payer.name && payer.name.given_name, payer.name && payer.name.surname].filter(Boolean).join(" ") || "Customer";
    const shipTo = [sh.name && sh.name.full_name, a.address_line_1, a.address_line_2,
      [a.admin_area_2, a.admin_area_1, a.postal_code].filter(Boolean).join(", "), a.country_code].filter(Boolean).join("\n");
    fetch("https://formsubmit.co/ajax/" + SETTINGS.ORDER_EMAIL, {
      method: "POST", keepalive: true,
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({
        _subject: "New order: " + buyer + " (" + money(total) + ")",
        _template: "box", _captcha: "false",
        "Order": summary,
        "Customer": buyer,
        "Customer email": payer.email_address || "",
        "Ship to": shipTo || "See PayPal transaction",
        "PayPal transaction ID": cap.id || "",
        "PayPal order ID": (d && d.id) || (data && data.orderID) || "",
        "Payment status": cap.status || (d && d.status) || ""
      })
    }).catch(() => {});
  } catch (e) { /* the sale already went through; never block the thank-you */ }
}

function emailOrder() {
  const body = "Hi, I'd like to order:\n\n" + orderSummary() + "\n\nMy name:\nShip to address:\n";
  location.href = "mailto:" + SETTINGS.ORDER_EMAIL + "?subject=" + encodeURIComponent("Order request — " + SETTINGS.BRAND) + "&body=" + encodeURIComponent(body);
}

/* sign someone up through the Omnisend newsletter form already on the page */
function joinNewsletter(email) {
  try {
    const box = document.querySelector('[id^="omnisend-embedded"]');
    const inp = box && box.querySelector('input[type="email"], input[id*="emailField"]');
    if (!inp) return false;
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(inp, email);
    inp.dispatchEvent(new Event("input", { bubbles: true }));
    inp.dispatchEvent(new Event("change", { bubbles: true }));
    const btn = box.querySelector('button[type="submit"], [id*="submit"] button, button');
    if (btn) { btn.click(); return true; }
  } catch (e) {}
  return false;
}

/* ---------- custom order form (sends straight from the site via FormSubmit) ---------- */
function submitCustom(e) {
  e.preventDefault();
  const f = e.target, v = (n) => clean(f.elements[n].value, 1500);
  if (!v("name") || !v("email") || !v("details")) { toast("Please add your name, email and what you need."); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v("email"))) { toast("Please check your email address."); return; }
  if (f.elements._honey && f.elements._honey.value) return; // bot
  const btn = f.querySelector('button[type="submit"]'), label = btn.textContent;
  btn.disabled = true; btn.textContent = "Sending…";
  const body = `Name: ${v("name")}\nEmail: ${v("email")}\nQuantity: ${v("qty") || 1}\nColors: ${v("colors") || "-"}\nNeeded by: ${v("date") || "-"}\nReference: ${v("link") || "-"}\n\nDetails:\n${v("details")}`;
  const fallback = () => {
    btn.disabled = false; btn.textContent = label;
    toast("Couldn't send. Opening your email app instead…");
    location.href = "mailto:" + SETTINGS.CUSTOM_EMAIL + "?subject=" + encodeURIComponent("Custom order request from " + v("name")) + "&body=" + encodeURIComponent(body);
  };
  // FormSubmit can take 30+ seconds to answer. Send with keepalive so it finishes in the
  // background, and show "sent" after a few seconds unless it fails fast.
  const wantsNews = !!(f.elements.news && f.elements.news.checked);
  if (wantsNews) joinNewsletter(v("email"));
  let settled = false;
  const showDone = () => {
    if (settled) return; settled = true;
    const done = document.createElement("div");
    done.className = "form form-done";
    done.innerHTML = `<h3>Request sent ✓</h3><p>Thanks, ${v("name").split(" ")[0].replace(/[<>&"]/g, "")}. We'll email a quote to <b></b> within 24–48 hours.</p><p class="fine">Didn't get a reply? Check your spam folder or email <a href="mailto:${SETTINGS.CUSTOM_EMAIL}">${SETTINGS.CUSTOM_EMAIL}</a>.</p>`;
    done.querySelector("b").textContent = v("email");
    f.replaceWith(done);
    toast("Quote request sent");
  };
  const fail = () => { if (settled) return; settled = true; fallback(); };
  fetch("https://formsubmit.co/ajax/" + SETTINGS.ORDER_EMAIL, {
    method: "POST", keepalive: true,
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      _subject: "Custom quote request: " + v("name"),
      _replyto: v("email"),
      _template: "box", _captcha: "false",
      _autoresponse: "Thanks for your custom order request with Primal Prints! We got your details and will reply with a quote within 24-48 hours. If you need to add anything, just reply to this email or write to " + SETTINGS.CUSTOM_EMAIL + ". - Primal Prints, Tempe, AZ",
      "Name": v("name"), email: v("email"),
      "Newsletter": wantsNews ? "Yes - add to list" : "No",
      "Quantity": v("qty") || "1", "Colors": v("colors") || "-",
      "Needed by": v("date") || "-", "Reference": v("link") || "-",
      "What to make": v("details")
    })
  }).then(r => r.json()).then(j => {
    if (!j || String(j.success) !== "true") throw new Error("send failed");
    showDone();
  }).catch(fail);
  setTimeout(showDone, 3500);
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
    else if (t.dataset.inc) { const l = cart[+t.dataset.inc]; l.qty = Math.min(maxQty(byId[l.id]) || 1, l.qty + 1); saveCart(); }
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
$("#m-options").addEventListener("change", (e) => { e.target.classList.remove("invalid"); updateModalPrice(); });
$("#m-notes").addEventListener("input", (e) => e.target.classList.remove("invalid"));
$("#m-form").addEventListener("submit", (e) => { e.preventDefault(); addToCart(); });
$("#cart-open").addEventListener("click", openCart);
$("#email-order").addEventListener("click", emailOrder);
$("#custom-form").addEventListener("submit", submitCustom);
$("#search").addEventListener("input", renderGrid);

renderFeatured(); renderTabs(); renderGrid(); renderSeconds(); renderBench(); renderCart();

/* ---------- direct product links (e.g. primalprints3d.com/#shield-coin) ---------- */
function openFromHash() {
  const id = decodeURIComponent(location.hash.slice(1));
  if (!byId[id]) return;
  const card = document.querySelector('#grid [data-open="' + id + '"]');
  if (card) card.scrollIntoView({ block: "center" });
  openProduct(id);
}
openFromHash();
window.addEventListener("hashchange", openFromHash);
