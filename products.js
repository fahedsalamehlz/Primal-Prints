/* =====================================================================
   PRIMAL PRINTS — CATALOG
   This is the only file you need to touch to add, remove or reprice items.

   Each product:
     id        unique short name (letters, numbers, dashes)
     cat       category id from CATEGORIES below
     name      product name
     blurb     one or two sentences
     specs     short tags shown on the card
     price     base price (number)
     ship      shipping charge for this item (0 = free shipping)
     images    photo URLs or "photos/your-file.jpg"
     options   choices the buyer makes. If a choice changes the price,
               give it a price ("price" replaces the base price) or
               an "add" (added to the price).
     notes     true = show a "Name / personalization" box
     notesHint what to type in that box
     notesRequired true = the box must be filled before Add to cart
     (a single choice can also have requiresNotes: true, e.g. "Build Your Own")
   Every option must be picked before an item can go in the cart.
     featured  true = shows in the Featured row at the top

   Ideas on the bench (prototypes / coming soon) are in IDEAS at the bottom.
   ===================================================================== */

const ETSY = "https://i.etsystatic.com/67938469/r/il/";
const img = (h) => ETSY + h.split("/")[0] + "/" + h.split("/")[1].split("_")[0] +
                   "/il_794xN." + h.split("/")[1] + ".jpg";

const CATEGORIES = [
  { id: "safe",      name: "Gun Safe Organizer" },
  { id: "range",     name: "Range & Ammo" },
  { id: "duty",      name: "Police & First Responder" },
  { id: "christmas", name: "Christmas & Gifts" },
  { id: "desk",      name: "Coasters & Desk" },
  { id: "vehicle",   name: "Vehicle MOLLE" },
  { id: "home",      name: "Home & Health" }
];

const PRODUCTS = [
  /* ---------------- GUN SAFE ORGANIZER ---------------- */
  {
    id: "safe-set", cat: "safe", featured: true,
    name: "Gun Safe Door Organizer — Full Set",
    blurb: "A rigid MOLLE tile with clip-on holders for an AR 3-mag, pistol 4-mag, flashlight and battery caddy. Sticks on with magnets or heavy-duty Velcro — no drilling, no sagging fabric. Works on a safe door, fridge or tool box too.",
    specs: ["9 x 8 in tile", "No drilling", "PETG"],
    price: 77.99, ship: 7,
    images: ["0b235d/8838040102_imby", "aae725/8811225894_3jw8", "828307/8729163176_4bct", "cb6769/8768336891_kkxo"].map(img),
    options: [
      { label: "Set", choices: [
        { name: "Full Set (as shown)" },
        { name: "Build Your Own Set — any 4 holders (list them in the notes)", requiresNotes: true } ] },
      { label: "Tile backing", choices: [ { name: "Magnetic (steel doors)" }, { name: "Velcro (felt-lined safes)" } ] },
      { label: "Tile color", choices: [ { name: "Black" }, { name: "Gray" } ] }
    ],
    notes: true, notesHint: "List your 4 holders (Build Your Own only)."
  },
  {
    id: "safe-tile", cat: "safe",
    name: "Magnetic MOLLE Safe Panel — Tile Only",
    blurb: "The 9 x 8 in rigid MOLLE tile on its own, ready for any of our clip-on holders. Magnetic back for bare steel or Velcro back for felt-lined safes, plus built-in screw holes.",
    specs: ["9 x 8 in", "Magnetic or Velcro", "Screw holes"],
    price: 41.99, ship: 7,
    images: ["2384e0/8719472474_atcp", "83b1d2/8767301739_p97f", "0b235d/8838040102_imby"].map(img),
    options: [
      { label: "Tile backing", choices: [ { name: "Magnetic (steel doors)" }, { name: "Velcro (felt-lined safes)" } ] },
      { label: "Tile color", choices: [ { name: "Black" }, { name: "Gray" } ] }
    ]
  },
  {
    id: "safe-holders", cat: "safe",
    name: "Clip-On Holders & Add-Ons",
    blurb: "Add to a tile you already have. Spring-grip mag holders hold loaded mags securely, and every holder comes with its clips and lock pin. Black.",
    specs: ["Fits our MOLLE tiles", "Clips + pin included"],
    price: 26.99, ship: 7,
    images: ["00d94e/8767301731_56r7", "0b235d/8838040102_imby", "828307/8729163176_4bct"].map(img),
    options: [
      { label: "Holder", choices: [
        { name: "AR 3-Mag Holder", price: 26.99 },
        { name: "AR 2-Mag Holder", price: 21.99 },
        { name: "AR 1-Mag Holder", price: 19.99 },
        { name: "Pistol 4-Mag Holder", price: 24.99 },
        { name: "Pistol 3-Mag Holder", price: 21.99 },
        { name: "Pistol 1-Mag Holder", price: 18.99 },
        { name: "Battery Caddy (CR123, AA, CR2032)", price: 19.99 },
        { name: "Flashlight Holder", price: 19.99 },
        { name: "Extra Clips 2-Pack", price: 15.99 } ] }
    ]
  },

  /* ---------------- RANGE & AMMO ---------------- */
  {
    id: "ammo-can", cat: "range", featured: true,
    name: "5.56 Ammo Can Organizer System",
    blurb: "Snap trays and vertical inserts that stack and mix inside a steel 50 cal M2A1 can — up to 732 rounds. Each round clicks into place, so a tipped tray doesn't spill.",
    specs: ["M2A1 50 cal can", "Up to 732 rds", "Ammo not included"],
    price: 67.99, ship: 7,
    images: ["8a09bf/8756732253_gr1q", "15aa0a/8756732257_gz0n", "2b5330/8756732259_fyqj", "54198a/8644755854_419o"].map(img),
    options: [
      { label: "Configuration", choices: [
        { name: "Full Can Kit — 732 rds", price: 67.99 },
        { name: "4 Vert Plates — 572 rds", price: 50.99 },
        { name: "2 Vert Plates — 286 rds", price: 33.99 },
        { name: "1 Vert Plate — 143 rds", price: 22.99 },
        { name: "6 Snap Trays — 120 rds", price: 45.99 },
        { name: "4 Snap Trays — 80 rds", price: 33.99 },
        { name: "2 Snap Trays — 40 rds", price: 24.99 },
        { name: "Top Cap (spare)", price: 18.99 } ] }
    ]
  },
  {
    id: "9mm-box", cat: "range",
    name: "9mm Ammo Box",
    blurb: "Rounds stand upright in tapered pockets that grip the case, so nothing rattles in a range bag. Pin hinge, full-length snap closure, custom colors.",
    specs: ["50 or 25 round", "Pin hinge", "Custom colors"],
    price: 19.99, ship: 7,
    images: ["c33352/8756740091_h8nz", "00f481/8708923544_gk1h", "754947/8756740093_hrbb", "5a1e06/8651144394_fr1g"].map(img),
    options: [
      { label: "Size", choices: [ { name: "50 Round", price: 19.99 }, { name: "25 Round", price: 14.99 } ] },
      { label: "Colors", choices: [
        { name: "All one color" },
        { name: "Custom lid color", add: 1, requiresNotes: true },
        { name: "Custom lid and base", add: 2, requiresNotes: true },
        { name: "Lid, base and text", add: 3, requiresNotes: true } ] }
    ],
    notes: true, notesHint: "Which colors? (e.g. black base, red lid)"
  },

  /* ---------------- POLICE & FIRST RESPONDER ---------------- */
  {
    id: "tbl-flag", cat: "duty", featured: true,
    name: "Light-Up Thin Blue Line Flag",
    blurb: "A glowing thin blue line flag for a desk, shelf or wall. A strong retirement or academy-graduation gift.",
    specs: ["LED", "Desk or wall"],
    price: 43.99, ship: 7,
    images: ["4d65ce/8869109555_pl1t", "966528/8869116283_ww2w", "6f7680/8821308930_2s3z", "07974d/8821308932_gkin"].map(img)
  },
  {
    id: "coin-rack", cat: "duty",
    name: "Personalized Challenge Coin Display",
    blurb: "Shows off 7 challenge coins on a thin blue line rack with your name across the front.",
    specs: ["Holds 7 coins", "Custom name"],
    price: 16.99, ship: 7,
    images: ["f5f127/8818935265_c9ih", "a1cd40/8771117912_iodh", "f5c8da/8818935271_mgjk"].map(img),
    notes: true, notesRequired: true, notesHint: "Name for the front plate"
  },
  {
    id: "bodycam-dock", cat: "duty",
    name: "Body Camera Charging Dock — Axon Body 4",
    blurb: "Drop the camera in and it seats straight onto the charger — no fumbling with cables at the end of a shift. Uses the USB-C cable you already have.",
    specs: ["Axon Body 4", "USB-C cable not included"],
    price: 20.99, ship: 7,
    images: ["103617/8717523664_gvap", "105c3c/8717523662_ab0l", "3c7c73/8765351331_a1s1", "b1be2b/8765351333_sfvh"].map(img)
  },
  {
    id: "narcan-visor", cat: "duty",
    name: "Naloxone Visor Holder",
    blurb: "Keeps a Narcan 4 mg nasal spray pack clipped to your sun visor, where you can grab it fast. Heat-resistant.",
    specs: ["Fits Narcan 4 mg", "Heat-resistant"],
    price: 16.99, ship: 7,
    images: ["f1d770/8852220139_t90u", "13f2d1/8852220157_gikl", "14d6e1/8852220133_scea", "1241fd/8804404218_nvos"].map(img),
    options: [ { label: "Size", choices: [ { name: "Single (holds 1)", price: 16.99 }, { name: "Double (holds 2)", price: 22.99 } ] } ]
  },
  {
    id: "card-holder", cat: "desk",
    name: "Tactical Pistol Business Card Holder",
    blurb: "The pistol sits inverted on its stand and cards feed up through a slot in the frame. Add a name or badge number on the base.",
    specs: ["6 or 8 in", "Custom name"],
    price: 20.99, ship: 7,
    images: ["ec6d8b/8650364252_q8u9", "8ef965/8549941773_to5f", "3c013f/8502069528_8agw", "83214e/8502069526_2f8j"].map(img),
    options: [ { label: "Size", choices: [ { name: "Large (about 8 in)", price: 20.99 }, { name: "Small (about 6 in)", price: 11.99 } ] } ],
    notes: true, notesHint: "Name or badge number (optional)"
  },

  /* ---------------- CHRISTMAS & GIFTS ---------------- */
  {
    id: "tbl-tree-light", cat: "christmas", featured: true,
    name: "Light-Up Thin Blue Line Christmas Tree",
    blurb: "A glowing thin blue line tree with ornaments. Full size or mini, USB or battery powered.",
    specs: ["14 in or 8.5 in", "USB or 3 AA"],
    price: 51.99, ship: 7,
    images: ["f4f86e/8771550658_2u3i", "edda8e/8771551898_mlza", "9ba5b6/8858333823_icwk", "745b5c/8858333827_8hdr"].map(img),
    options: [
      { label: "Size", choices: [ { name: "Full size — 14 in", price: 51.99 }, { name: "Mini — 8.5 in", price: 38.99 } ] },
      { label: "Power", choices: [ { name: "USB plug-in" }, { name: "Battery (3 AA)" } ] }
    ]
  },
  {
    id: "tbl-tree", cat: "christmas",
    name: "Thin Blue Line Spiral Christmas Tree",
    blurb: "A tabletop spiral tree in black with a thin blue line, with ornaments included.",
    specs: ["Tabletop", "Ornaments included"],
    price: 38.99, ship: 7,
    images: ["d5a98a/8792599377_2cc3", "a1371f/8744771928_rb2t", "e0893e/8744771930_4y0w", "922993/8792599379_c0u4"].map(img),
    options: [ { label: "Ornaments", choices: [ { name: "16 ornaments", price: 38.99 }, { name: "32 ornaments (full)", price: 47.99 } ] } ]
  },
  {
    id: "tbl-tree-name", cat: "christmas",
    name: "Personalized Thin Blue Line Mantel Tree",
    blurb: "A slat tree for the mantel with an optional custom-engraved base — a strong retirement gift.",
    specs: ["Mantel decor", "Engraved base option"],
    price: 43.99, ship: 7,
    images: ["e9079e/8783706909_552v", "94c289/8735879398_a2ih", "e138f0/8783706879_ewrc", "748938/8735879402_qrla"].map(img),
    options: [ { label: "Base", choices: [ { name: "No engraving", price: 43.99 }, { name: "Custom engraved base", price: 55.99, requiresNotes: true } ] } ],
    notes: true, notesHint: "Engraving text (if you chose the engraved base)"
  },
  {
    id: "mag-stocking", cat: "christmas",
    name: "AR Mag Stocking Holder",
    blurb: "A weighted rifle-mag stocking hook with your name on the front plate. Holds a loaded stocking on the mantel. Decorative — not a functional magazine.",
    specs: ["Weighted", "6 mag colors", "Custom name"],
    price: 34.99, ship: 7,
    images: ["7688bc/8725200223_gt0q", "7b625e/8677379834_zzvr", "ea88e1/8725201439_e0mu", "d3d4de/8677379814_jogd"].map(img),
    options: [ { label: "Mag color", choices: ["Black", "OD Green", "Green", "Red", "Orange", "Yellow"].map(n => ({ name: n })) } ],
    notes: true, notesRequired: true, notesHint: "Name for the plate"
  },
  {
    id: "badge-ornament", cat: "christmas",
    name: "Personalized Police Badge Ornament",
    blurb: "A two-color badge ornament with name, badge number and year. Shield or 7-point star, with a clip included.",
    specs: ["8 colors", "Clip included"],
    price: 11.99, ship: 7,
    images: ["6e6918/8705596927_pl6h", "f51e3f/8657771858_fu45", "01ace7/8705596901_kav8", "6a7278/8705596899_ocav"].map(img),
    options: [
      { label: "Color", choices: ["Black", "Blue", "Red", "Green", "White", "Pink", "Yellow", "Orange"].map(n => ({ name: n })) },
      { label: "Shape", choices: [ { name: "Shield" }, { name: "7-Point Star" } ] }
    ],
    notes: true, notesRequired: true, notesHint: "Name, badge number and year"
  },
  {
    id: "gift-card-can", cat: "christmas",
    name: "Mini Ammo Can Gift Card Holder",
    blurb: "A mini ammo can that holds a gift card or cash, with a holiday saying on the front. Great stocking stuffer.",
    specs: ["Holds a gift card", "7 sayings"],
    price: 11.99, ship: 7,
    images: ["73a42c/8768811687_qtf8", "54c21d/8768811691_g6h0", "af608b/8768811697_sd4b", "9ff7a0/8768811689_2v7u"].map(img),
    options: [
      { label: "Number of cans", choices: [
        { name: "1 can", price: 11.99 }, { name: "2 cans", price: 22.99 }, { name: "3 cans", price: 32.99 },
        { name: "4 cans", price: 42.99 }, { name: "5 cans", price: 51.99 }, { name: "6 cans", price: 59.99 } ] },
      { label: "Saying", choices: ["Merry Christmas", "Happy Holidays", "Season's Greetings", "Ho Ho Ho", "Naughty or Nice?", "Happy New Year", "Mix & Match (list in notes)"].map(n => ({ name: n, requiresNotes: /Mix/.test(n) })) }
    ],
    notes: true, notesHint: "Mixing sayings? List them here."
  },

  /* ---------------- COASTERS & DESK ---------------- */
  {
    id: "ipsc-coasters", cat: "desk",
    name: "IPSC Target Coaster Set",
    blurb: "Four silhouette coasters with A, C and D zones in a target-shaped caddy with your name on the plate. PETG, cork backed.",
    specs: ["PETG", "Cork backed", "Custom name"],
    price: 27.99, ship: 7,
    images: ["8919ad/8756722973_mqt1", "19c5f4/8756722971_5web", "023bc8/8756722975_75ln", "2a4267/8708906496_6vzl"].map(img),
    options: [ { label: "Set", choices: [ { name: "Caddy + 4 coasters", price: 27.99 }, { name: "Caddy only", price: 18.99 } ] } ],
    notes: true, notesRequired: true, notesHint: "Name for the plate (2 lines max)"
  },
  {
    id: "ammo-coasters", cat: "desk",
    name: "Ammo Can Coaster Set",
    blurb: "Coasters that live in their own .30 cal-style ammo can with a custom plaque. Red dot reticle or bullseye designs, cork backed.",
    specs: ["PETG", "Cork backed", "Custom plaque"],
    price: 24.99, ship: 7,
    images: ["cf2f6a/8650359806_1v6t", "9b660e/8650359804_jltn", "ef16ef/8698187301_9act", "aacc9d/8650359808_etpz"].map(img),
    options: [ { label: "Set", choices: [ { name: "Can + 4 coasters", price: 24.99 }, { name: "Can only", price: 16.99 } ] } ],
    notes: true, notesRequired: true, notesHint: "Plaque text + reticle or bullseye"
  },
  {
    id: "name-coasters", cat: "desk",
    name: "Personalized Coaster Holder",
    blurb: "A round coaster caddy with a two-line name plate — name, rank, badge number or unit. Reticle, bullseye or thin blue line coasters.",
    specs: ["PETG", "Cork backed", "2-line name plate"],
    price: 24.99, ship: 7,
    images: ["851f1e/8756696427_ffow", "0e8b9a/8756692973_912y", "5a5ef4/8756692971_hm2f", "8aab7a/8756692981_3kx0"].map(img),
    options: [ { label: "Set", choices: [ { name: "Caddy + 4 coasters", price: 24.99 }, { name: "Caddy only", price: 16.99 } ] } ],
    notes: true, notesRequired: true, notesHint: "Name plate text + coaster design"
  },

  /* ---------------- VEHICLE MOLLE ---------------- */
  {
    id: "seat-kit", cat: "vehicle",
    name: "Rigid MOLLE Seat Back Panel Kit (4-Pack)",
    blurb: "Four tiles that assemble into an 18 x 16 in seat-back panel with true PALS spacing on a hard surface that won't sag under loaded pouches.",
    specs: ["18 x 16 in", "True PALS spacing", "4-pack"],
    price: 41.99, ship: 7,
    images: ["579a13/8520550812_np3j", "2712d3/8520550762_7x8y", "c3eff3/8568424499_mlfo", "96848c/8520550758_2e9i"].map(img)
  },
  {
    id: "seat-tile", cat: "vehicle",
    name: "Rigid MOLLE Grid Tile",
    blurb: "A single tile for a seat back, wall or workbench. Real PALS spacing so the pouches you own thread on straight, plus M3 bolt holes.",
    specs: ["Single tile", "True PALS spacing", "M3 bolt grid"],
    price: 15.99, ship: 7,
    images: ["521aa9/8520509092_qnko", "e2bdd0/8568382493_csq5", "50091c/8568382495_9p5b", "60016e/8520509080_fut3"].map(img)
  },

  /* ---------------- HOME & HEALTH ---------------- */
  {
    id: "syringe-stand", cat: "home",
    name: "7-Day Syringe Holder Stand",
    blurb: "Holds 28 syringes upright by day of the week, plus 4 vials, so you can see at a glance what's been taken.",
    specs: ["Mon–Sun", "28 syringes + 4 vials"],
    price: 26.99, ship: 7,
    images: ["4cf781/8816584340_svyw", "80fd60/8864398035_299k", "418e9e/8864398025_l84c", "5ddf6c/8816584344_a09y"].map(img)
  },
  {
    id: "syringe-organizer", cat: "home",
    name: "Weekly Syringe & Vial Organizer",
    blurb: "A fridge organizer with Mon–Sun columns for 28 syringes plus 6 vial wells.",
    specs: ["Mon–Sun labels", "28 syringes + 6 vials", "PETG"],
    price: 32.99, ship: 7,
    images: ["e0354d/8863572841_5wfi", "2375ae/8863572843_gdiw", "94cfc1/8863572845_nmxp"].map(img)
  },
  {
    id: "fridge-insert", cat: "home",
    name: "Fridge Door Syringe & Vial Insert",
    blurb: "A weekly Mon–Sun insert that fits a fridge door shelf, holding 28 syringes and 6 vials.",
    specs: ["Fridge door", "28 syringes + 6 vials", "PETG"],
    price: 27.99, ship: 7,
    images: ["7f5e9c/8880797631_pdrf", "ca26d4/8880797629_6wdl", "290632/8880797609_8vis", "607907/8832996814_5dbw"].map(img)
  }
];

/* =====================================================================
   FROM THE BENCH — new ideas, prototypes and things coming soon.
   status: "Prototype", "Testing", "Coming soon" (anything you like)
   ===================================================================== */
const IDEAS = [];
