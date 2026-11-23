/* =====================================================================
   PRIMAL PRINTS — SALE (mirrors the Etsy sales exactly)
   Each group runs start..end (Arizona time, end day included), then turns off.
   Items not listed are full price. OH SHOOT Bin items are never discounted.
   If an item is in two live groups, the bigger discount wins.
   ===================================================================== */
const SALE_GROUPS = [
  { percent: 20, start: "2026-11-19", end: "2026-11-27", ids: ["safe-set"] },                       // Etsy SAFESET20BF
  { percent: 15, start: "2026-11-18", end: "2026-12-02", ids: ["halligan-coin"] },                  // Etsy HALLIGAN15
  { percent: 15, start: "2026-11-12", end: "2026-12-08", ids: [                                     // Etsy HOLIDAY15B
      "tbl-coasters", "card-holder", "seat-tile", "name-coasters", "ammo-coasters", "ipsc-coasters",
      "ammo-can", "badge-ornament", "bodycam-dock", "tbl-tree-name", "tbl-tree", "coin-rack",
      "tbl-tree-light", "narcan-visor", "syringe-organizer", "syringe-stand", "seat-kit"] }
];
const SALE_BANNER = {
  label: "BLACK FRIDAY SALE IS ON",
  sub: (top) => "Up to " + top + "% off select gear. Marked prices are already discounted, no code needed."
};

(function () {
  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Phoenix" }).format(new Date());
  const live = SALE_GROUPS.filter((g) => today >= g.start && today <= g.end);
  if (!live.length) return;
  const pct = {};
  live.forEach((g) => g.ids.forEach((id) => { pct[id] = Math.max(pct[id] || 0, g.percent); }));
  let any = false, top = 0;
  PRODUCTS.forEach((p) => {
    if (p.second || !pct[p.id]) return;
    const f = 1 - pct[p.id] / 100;
    const off = (n) => Math.round(n * f * 100) / 100;
    p.saleF = f; any = true; top = Math.max(top, pct[p.id]);
    if (typeof p.price === "number") p.price = off(p.price);
    (p.options || []).forEach((o) => (o.choices || []).forEach((c) => {
      if (typeof c.price === "number") c.price = off(c.price);
      if (typeof c.add === "number") c.add = off(c.add);
    }));
  });
  if (!any) return;
  window.SALE_ACTIVE = true;
  const b = document.createElement("div");
  b.setAttribute("role", "note");
  b.style.cssText = "background:#d32f2f;color:#fff;text-align:center;padding:10px 16px;font:800 15px/1.3 system-ui,sans-serif;letter-spacing:1px";
  b.innerHTML = SALE_BANNER.label + '<div style="font-weight:500;font-size:13px;letter-spacing:0;opacity:.95">' + SALE_BANNER.sub(top) + "</div>";
  const put = () => document.body.prepend(b);
  if (document.body) put(); else document.addEventListener("DOMContentLoaded", put);
})();
