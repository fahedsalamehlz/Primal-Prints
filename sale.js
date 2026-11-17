/* =====================================================================
   PRIMAL PRINTS — SALE
   Runs from SALE.start through SALE.end (Arizona time), then turns itself off.
   To run another sale later, change start / end / percent / label below.
   OH SHOOT Bin items are left out (already marked down).
   ===================================================================== */
const SALE = { start: "2026-11-17", end: "2026-11-20", percent: 15, label: "15% OFF EVERYTHING THROUGH FRIDAY", sub: "Prices already marked down. Ends Friday, Nov 20 at midnight (AZ)." };

(function () {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Phoenix" }).format(new Date());
  if (today < SALE.start || today > SALE.end) return;
  const f = 1 - SALE.percent / 100;
  const off = (n) => Math.round(n * f * 100) / 100;
  PRODUCTS.forEach((p) => {
    if (p.second) return;
    if (typeof p.price === "number") p.price = off(p.price);
    (p.options || []).forEach((o) => (o.choices || []).forEach((c) => {
      if (typeof c.price === "number") c.price = off(c.price);
      if (typeof c.add === "number") c.add = off(c.add);
    }));
  });
  window.SALE_ACTIVE = true;
  const b = document.createElement("div");
  b.setAttribute("role", "note");
  b.style.cssText = "background:#d32f2f;color:#fff;text-align:center;padding:10px 16px;font:800 15px/1.3 system-ui,sans-serif;letter-spacing:1px";
  b.innerHTML = SALE.label + '<div style="font-weight:500;font-size:13px;letter-spacing:0;opacity:.95">' + SALE.sub + "</div>";
  const put = () => document.body.prepend(b);
  if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
})();
