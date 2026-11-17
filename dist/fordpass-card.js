/*!
 * FordPass Card
 * A Lovelace card for vehicles connected through the FordPass integration
 * (https://github.com/marq24/ha-fordpass).
 * MIT License. Not affiliated with, endorsed by or sponsored by Ford Motor Company.
 */
(() => {
  const FPC_VERSION = "0.1.0";
  const FPC_TAG = "fordpass-card";
  const FPC_EDITOR_TAG = FPC_TAG + "-editor";
  const FPC_REPO = "https://github.com/OWNER/fordpass-card";

  // Sensors shown when the user has not picked any (domain.translation_key)
  const FPC_DEFAULTS = [
    "sensor.fuel",
    "sensor.soc",
    "sensor.elveh",
    "sensor.fuelrange",
    "sensor.odometer",
    "sensor.battery",
    "sensor.oil",
    "sensor.tirepressure",
    "sensor.outsidetemp",
    "sensor.doorlock",
    "device_tracker.tracker",
  ];

  // Domains offered in the editor list
  const FPC_LIST_DOMAINS = ["sensor", "binary_sensor", "device_tracker", "lock"];

  const GOOD = "rgb(91,237,150)";
  const BAD = "rgb(255,91,108)";
  const WARN = "rgb(255,188,75)";
  const BLUE = "rgb(113,184,255)";
  const VIOLET = "rgb(190,150,255)";

  const FPC_ICON_COLORS = {
    fuel: GOOD,
    soc: GOOD,
    elveh: GOOD,
    fuelrange: GOOD,
    battery: BLUE,
    odometer: VIOLET,
    oil: WARN,
    outsidetemp: BLUE,
    coolanttemp: WARN,
    exhaustfluidlevel: BLUE,
    tracker: BAD,
  };

  const FPC_I18N = {
    en: {
      vehicle: "Vehicle",
      title: "Title (empty = vehicle name)",
      image: "Image URL (empty = FordPass vehicle picture)",
      image_open: "Image URL with doors open (optional)",
      columns: "Columns",
      sensors: "Sensors",
      sensors_hint: "Tick the sensors to show. Use the arrows to change their order.",
      defaults: "Defaults",
      none: "None",
      name_placeholder: "Custom name (optional)",
      diagnostic: "diagnostic",
      no_vehicle: "No FordPass vehicle found. Install and set up the FordPass integration first.",
      pick_vehicle: "Pick a vehicle in the card editor.",
      up: "Move up",
      down: "Move down",
    },
    it: {
      vehicle: "Veicolo",
      title: "Titolo (vuoto = nome del veicolo)",
      image: "URL immagine (vuoto = immagine FordPass del veicolo)",
      image_open: "URL immagine con porte aperte (facoltativa)",
      columns: "Colonne",
      sensors: "Sensori",
      sensors_hint: "Spunta i sensori da mostrare. Con le frecce cambi l'ordine.",
      defaults: "Predefiniti",
      none: "Nessuno",
      name_placeholder: "Nome personalizzato (facoltativo)",
      diagnostic: "diagnostica",
      no_vehicle: "Nessun veicolo FordPass trovato. Installa e configura prima l'integrazione FordPass.",
      pick_vehicle: "Scegli un veicolo nell'editor della card.",
      up: "Sposta su",
      down: "Sposta giù",
    },
  };

  const t = (hass, key) => {
    const lang = ((hass && (hass.locale && hass.locale.language)) || (hass && hass.language) || "en").split("-")[0];
    return (FPC_I18N[lang] || FPC_I18N.en)[key] || FPC_I18N.en[key] || key;
  };

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // ---------- FordPass helpers ----------

  function fpcVehicles(hass) {
    const out = [];
    if (!hass || !hass.entities) return out;
    const byDevice = new Map();
    for (const e of Object.values(hass.entities)) {
      if (e.platform !== "fordpass" || !e.device_id) continue;
      if (!byDevice.has(e.device_id)) byDevice.set(e.device_id, []);
      byDevice.get(e.device_id).push(e);
    }
    for (const [id, entities] of byDevice) {
      const d = hass.devices && hass.devices[id];
      out.push({ id, name: d ? d.name_by_user || d.name || id : id, entities });
    }
    return out;
  }

  function fpcVehicle(hass, deviceId) {
    const all = fpcVehicles(hass);
    if (deviceId) return all.find((v) => v.id === deviceId) || null;
    return all[0] || null;
  }

  const fpcDomain = (entityId) => entityId.split(".")[0];

  function fpcKey(entry) {
    if (entry.translation_key) return entry.translation_key;
    return entry.entity_id.split(".")[1].replace(/^fordpass_[a-z0-9]+_/, "");
  }

  function fpcFind(vehicle, domain, key) {
    return vehicle.entities.find((e) => fpcDomain(e.entity_id) === domain && fpcKey(e) === key) || null;
  }

  function fpcDefaultEntities(hass, vehicle) {
    if (!vehicle) return [];
    return FPC_DEFAULTS.map((k) => {
      const [domain, key] = k.split(".");
      const e = fpcFind(vehicle, domain, key);
      return e && hass.states[e.entity_id] ? e.entity_id : null;
    }).filter(Boolean);
  }

  function fpcName(hass, entityId, deviceName) {
    const st = hass.states[entityId];
    let n = (st && st.attributes.friendly_name) || entityId;
    if (deviceName && n.toLowerCase().startsWith(deviceName.toLowerCase() + " ")) {
      n = n.slice(deviceName.length + 1);
    }
    return n;
  }

  function fpcListable(hass, vehicle) {
    if (!vehicle) return [];
    const defaults = fpcDefaultEntities(hass, vehicle);
    const list = vehicle.entities
      .filter((e) => FPC_LIST_DOMAINS.includes(fpcDomain(e.entity_id)) && !e.hidden && hass.states[e.entity_id])
      .map((e) => ({
        entity: e.entity_id,
        name: fpcName(hass, e.entity_id, vehicle.name),
        diagnostic: e.entity_category === "diagnostic" || e.entity_category === "config",
        rank: defaults.indexOf(e.entity_id),
      }));
    list.sort((a, b) => {
      const ra = a.rank === -1 ? 999 : a.rank;
      const rb = b.rank === -1 ? 999 : b.rank;
      if (ra !== rb) return ra - rb;
      if (a.diagnostic !== b.diagnostic) return a.diagnostic ? 1 : -1;
      return a.name.localeCompare(b.name);
    });
    return list;
  }

  function fpcItems(config) {
    return (config.entities || []).map((x) => (typeof x === "string" ? { entity: x } : { ...x })).filter((x) => x.entity);
  }

  function fpcStateColor(key, state) {
    const s = String(state || "").toUpperCase();
    if (key === "doorlock") {
      if (s === "LOCKED") return GOOD;
      if (s === "UNLOCKED") return BAD;
      if (s === "PARTLY_LOCKED") return WARN;
    }
    if (key === "doorstatus" || key === "windowposition") {
      if (s === "CLOSED") return GOOD;
      if (s === "OPEN") return BAD;
    }
    if (key === "tirepressure" || key === "dieselsystemstatus") {
      if (s === "NORMAL_OPERATION") return GOOD;
      if (s && s !== "UNKNOWN" && s !== "UNAVAILABLE") return WARN;
    }
    return null;
  }

  function fpcFormat(hass, stateObj) {
    if (!stateObj) return "—";
    if (typeof hass.formatEntityState === "function") {
      try {
        return hass.formatEntityState(stateObj);
      } catch (e) {
        /* fall through */
      }
    }
    const unit = stateObj.attributes.unit_of_measurement;
    return unit ? `${stateObj.state} ${unit}` : stateObj.state;
  }

  // ---------- Card ----------

  const CARD_CSS = `
    :host { display: block; }
    ha-card {
      overflow: hidden;
      border-radius: var(--fpc-radius, 28px);
      padding: 0;
      color: #fff;
      background: var(--fpc-background,
        radial-gradient(circle at 50% 30%, rgba(100,140,255,0.18), transparent 55%),
        linear-gradient(145deg, rgba(20,23,31,0.98), rgba(8,10,14,0.98)));
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow:
        0 12px 33px rgba(0,0,0,0.50),
        0 4px 8px rgba(0,0,0,0.35),
        inset 0 2px 0 rgba(255,255,255,0.12);
    }
    .hero { padding: 18px 20px 0; }
    .title {
      font-size: 22px; font-weight: 700; letter-spacing: -0.2px;
      color: rgba(255,255,255,0.96); line-height: 1.2;
    }
    .pics { display: grid; place-items: center; margin-top: 6px; }
    .pics img {
      grid-area: 1 / 1;
      max-width: 100%;
      max-height: var(--fpc-image-height, 240px);
      object-fit: contain;
      transition: opacity .45s ease;
      filter: drop-shadow(0 18px 24px rgba(0,0,0,0.55));
    }
    .pics img.open { opacity: 0; }
    .pics.is-open img.open { opacity: 1; }
    .pics.is-open.has-open img.closed { opacity: 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(var(--fpc-cols, 2), minmax(0, 1fr));
      gap: 8px;
      padding: 14px 12px 12px;
    }
    .tile {
      all: unset;
      box-sizing: border-box;
      display: grid;
      grid-template-columns: 30px minmax(0, 1fr);
      grid-template-rows: auto auto;
      column-gap: 9px;
      align-items: center;
      min-height: 54px;
      padding: 9px 11px;
      border-radius: 16px;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.08);
      box-shadow: 0 4px 12px rgba(0,0,0,0.25);
      cursor: pointer;
      transition: transform .12s ease, background .2s ease, border-color .2s ease;
    }
    .tile:hover { background: rgba(255,255,255,0.09); }
    .tile:active { transform: scale(0.97); }
    .tile:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
    .tile.unavailable { opacity: 0.5; }
    .icon {
      grid-row: 1 / span 2;
      width: 30px; height: 30px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%;
      background: rgba(255,255,255,0.08);
      --mdc-icon-size: 18px;
      color: rgba(255,255,255,0.82);
      transition: color .2s ease;
    }
    .name {
      align-self: end;
      font-size: 11px; line-height: 14px;
      color: rgba(255,255,255,0.60);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .state {
      align-self: start;
      font-size: 13px; line-height: 17px; font-weight: 700;
      color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .notice { padding: 14px 20px 18px; font-size: 13px; color: rgba(255,255,255,0.72); }
  `;

  class FordpassCard extends HTMLElement {
    static getConfigElement() {
      return document.createElement(FPC_EDITOR_TAG);
    }

    static getStubConfig(hass) {
      const v = fpcVehicle(hass);
      return v ? { device_id: v.id, entities: fpcDefaultEntities(hass, v) } : {};
    }

    setConfig(config) {
      if (!config || typeof config !== "object") throw new Error("Invalid configuration");
      this._config = { ...config };
      this._sig = null;
      this._built = false;
      if (this._hass) this._update();
    }

    set hass(hass) {
      this._hass = hass;
      this._update();
    }

    getCardSize() {
      const cols = Number(this._config && this._config.columns) || 2;
      const n = this._items ? this._items.length : 6;
      return 4 + Math.ceil(n / cols);
    }

    getGridOptions() {
      return { columns: 12, min_columns: 6 };
    }

    _resolve() {
      const hass = this._hass;
      const cfg = this._config || {};
      const vehicle = fpcVehicle(hass, cfg.device_id);
      let items = fpcItems(cfg);
      if (!cfg.entities && vehicle) items = fpcDefaultEntities(hass, vehicle).map((entity) => ({ entity }));

      let image = cfg.image || null;
      if (!image && vehicle && cfg.show_image !== false) {
        const imgEnt = fpcFind(vehicle, "image", "vehicleimage");
        const st = imgEnt && hass.states[imgEnt.entity_id];
        if (st && st.attributes.entity_picture) image = st.attributes.entity_picture;
      }
      if (cfg.show_image === false) image = null;

      let doorEntity = cfg.door_entity || null;
      if (!doorEntity && vehicle) {
        const d = fpcFind(vehicle, "sensor", "doorstatus");
        doorEntity = d ? d.entity_id : null;
      }
      const doorState = doorEntity && hass.states[doorEntity] ? hass.states[doorEntity].state : null;
      const doorsOpen = String(doorState || "").toUpperCase() === "OPEN";

      const title = cfg.show_title === false ? "" : cfg.title || (vehicle ? vehicle.name : "");
      return { vehicle, items, image, imageOpen: cfg.image_open || null, doorsOpen, title };
    }

    _update() {
      if (!this._hass || !this._config) return;
      const r = this._resolve();
      this._items = r.items;
      const states = r.items.map((i) => {
        const s = this._hass.states[i.entity];
        return s ? `${s.state}|${s.last_updated}` : "x";
      });
      const sig = JSON.stringify([
        r.vehicle && r.vehicle.id,
        r.items,
        r.image,
        r.imageOpen,
        r.doorsOpen,
        r.title,
        this._config.columns,
        states,
        this._hass.locale && this._hass.locale.language,
      ]);
      if (sig === this._sig) return;
      this._sig = sig;

      const structure = JSON.stringify([!!r.vehicle, r.items, !!r.image, !!r.imageOpen, r.title, this._config.columns]);
      if (!this._built || structure !== this._structure) {
        this._build(r);
        this._structure = structure;
        this._built = true;
      }
      this._fill(r);
    }

    _build(r) {
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const hass = this._hass;
      const cols = Math.min(Math.max(Number(this._config.columns) || 2, 1), 4);
      let body = "";
      if (!r.vehicle && !(this._config.entities || []).length) {
        body = `<div class="notice">${esc(t(hass, "no_vehicle"))}</div>`;
      } else {
        body = `
          ${r.title || r.image ? `<div class="hero">
            ${r.title ? `<div class="title">${esc(r.title)}</div>` : ""}
            ${r.image ? `<div class="pics${r.imageOpen ? " has-open" : ""}">
              <img class="closed" alt="">
              ${r.imageOpen ? `<img class="open" alt="">` : ""}
            </div>` : ""}
          </div>` : ""}
          <div class="grid" style="--fpc-cols:${cols}">
            ${r.items
              .map(
                (i, idx) => `<button class="tile" data-idx="${idx}" type="button">
                  <span class="icon"></span>
                  <span class="name"></span>
                  <span class="state"></span>
                </button>`
              )
              .join("")}
          </div>`;
      }
      this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style><ha-card>${body}</ha-card>`;

      this._tiles = [];
      this.shadowRoot.querySelectorAll(".tile").forEach((el) => {
        const idx = Number(el.dataset.idx);
        const iconWrap = el.querySelector(".icon");
        const icon = document.createElement("ha-state-icon");
        iconWrap.appendChild(icon);
        el.addEventListener("click", () => this._moreInfo(this._items[idx] && this._items[idx].entity));
        this._tiles[idx] = { el, icon, iconWrap, name: el.querySelector(".name"), state: el.querySelector(".state") };
      });
    }

    _fill(r) {
      const hass = this._hass;
      const root = this.shadowRoot;
      const pics = root.querySelector(".pics");
      if (pics) {
        const closed = pics.querySelector("img.closed");
        if (closed && closed.getAttribute("src") !== r.image) closed.setAttribute("src", r.image);
        const open = pics.querySelector("img.open");
        if (open && open.getAttribute("src") !== r.imageOpen) open.setAttribute("src", r.imageOpen);
        pics.classList.toggle("is-open", r.doorsOpen);
      }

      const devName = r.vehicle ? r.vehicle.name : "";
      r.items.forEach((item, idx) => {
        const tile = this._tiles[idx];
        if (!tile) return;
        const st = hass.states[item.entity];
        tile.name.textContent = item.name || fpcName(hass, item.entity, devName);
        tile.state.textContent = fpcFormat(hass, st);
        tile.el.classList.toggle("unavailable", !st || st.state === "unavailable");
        tile.icon.hass = hass;
        tile.icon.stateObj = st;
        if (item.icon) tile.icon.icon = item.icon;

        const reg = hass.entities[item.entity];
        const key = reg ? fpcKey(reg) : "";
        const color = item.color || fpcStateColor(key, st && st.state) || FPC_ICON_COLORS[key] || null;
        tile.iconWrap.style.color = color || "";
      });
    }

    _moreInfo(entityId) {
      if (!entityId) return;
      const ev = new Event("hass-more-info", { bubbles: true, composed: true });
      ev.detail = { entityId };
      this.dispatchEvent(ev);
    }
  }

  // ---------- Editor ----------

  const EDITOR_CSS = `
    :host { display: block; }
    .vehicle { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; font-size: 12px; color: var(--secondary-text-color); }
    .vehicle select {
      font: inherit; font-size: 15px; padding: 12px 10px; border-radius: 8px;
      border: 1px solid var(--divider-color, #444);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    .section { margin-top: 20px; }
    .head { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .head h3 { margin: 0; font-size: 16px; font-weight: 500; }
    .head .actions { display: flex; gap: 6px; }
    .hint { margin: 4px 0 10px; font-size: 12px; color: var(--secondary-text-color); }
    .btn {
      font: inherit; font-size: 12px; cursor: pointer;
      padding: 4px 10px; border-radius: 14px;
      border: 1px solid var(--divider-color, #444);
      background: transparent; color: var(--primary-text-color);
    }
    .btn:hover { background: var(--secondary-background-color, rgba(127,127,127,0.12)); }
    .list { border: 1px solid var(--divider-color, #444); border-radius: 12px; overflow: hidden; }
    .row {
      display: grid;
      grid-template-columns: 24px minmax(0, 1fr) auto;
      align-items: center; column-gap: 10px;
      padding: 8px 10px;
      border-top: 1px solid var(--divider-color, #444);
    }
    .row:first-child { border-top: none; }
    .row.on { background: var(--secondary-background-color, rgba(127,127,127,0.08)); }
    .row input[type=checkbox] { width: 18px; height: 18px; margin: 0; accent-color: var(--primary-color); cursor: pointer; }
    .label { min-width: 0; cursor: pointer; }
    .label .n { font-size: 14px; color: var(--primary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .label .e { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .tag { font-size: 10px; margin-left: 6px; padding: 1px 6px; border-radius: 8px; border: 1px solid var(--divider-color, #444); color: var(--secondary-text-color); }
    .move { display: flex; gap: 2px; }
    .move button {
      width: 28px; height: 28px; cursor: pointer; border-radius: 8px;
      border: 1px solid var(--divider-color, #444);
      background: transparent; color: var(--primary-text-color); font-size: 13px; line-height: 1;
    }
    .move button:disabled { opacity: 0.3; cursor: default; }
    .rename {
      grid-column: 2 / span 2;
      margin-top: 6px;
      font: inherit; font-size: 13px;
      padding: 6px 8px; border-radius: 8px;
      border: 1px solid var(--divider-color, #444);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
    }
    .notice { font-size: 13px; color: var(--secondary-text-color); }
  `;

  class FordpassCardEditor extends HTMLElement {
    setConfig(config) {
      this._config = { ...config };
      this._render();
    }

    set hass(hass) {
      this._hass = hass;
      if (this._form) this._form.hass = hass;
      if (!this._rendered) this._render();
    }

    _emit(config) {
      Object.keys(config).forEach((k) => {
        if (config[k] === "" || config[k] === undefined || config[k] === null) delete config[k];
      });
      this._config = config;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      this._renderList();
    }

    _schema() {
      return [
        { name: "title", selector: { text: {} } },
        { name: "image", selector: { text: {} } },
        { name: "image_open", selector: { text: {} } },
        { name: "columns", selector: { number: { min: 1, max: 4, mode: "box" } } },
      ];
    }

    _render() {
      if (!this._hass || !this._config) return;
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      if (!this._rendered) {
        this.shadowRoot.innerHTML = `<style>${EDITOR_CSS}</style>
          <label class="vehicle"><span></span><select></select></label>
          <div class="form"></div>
          <div class="section">
            <div class="head">
              <h3></h3>
              <div class="actions">
                <button class="btn" data-act="defaults" type="button"></button>
                <button class="btn" data-act="none" type="button"></button>
              </div>
            </div>
            <p class="hint"></p>
            <div class="list"></div>
          </div>`;
        const form = document.createElement("ha-form");
        form.computeLabel = (s) => t(this._hass, s.name);
        form.addEventListener("value-changed", (ev) => this._formChanged(ev.detail.value));
        this.shadowRoot.querySelector(".form").appendChild(form);
        this._form = form;
        this.shadowRoot
          .querySelector(".vehicle select")
          .addEventListener("change", (ev) => this._formChanged({ device_id: ev.target.value }));
        this.shadowRoot.querySelector('[data-act="defaults"]').addEventListener("click", () => this._setDefaults());
        this.shadowRoot.querySelector('[data-act="none"]').addEventListener("click", () => this._emit({ ...this._config, entities: [] }));
        this._rendered = true;
      }
      const hass = this._hass;
      const vehicles = fpcVehicles(hass);
      const current = this._vehicle();
      this.shadowRoot.querySelector(".vehicle span").textContent = t(hass, "vehicle");
      this.shadowRoot.querySelector(".vehicle select").innerHTML = vehicles.length
        ? vehicles
            .map((v) => `<option value="${esc(v.id)}"${current && current.id === v.id ? " selected" : ""}>${esc(v.name)}</option>`)
            .join("")
        : `<option value="">${esc(t(hass, "no_vehicle"))}</option>`;
      this.shadowRoot.querySelector("h3").textContent = t(hass, "sensors");
      this.shadowRoot.querySelector(".hint").textContent = t(hass, "sensors_hint");
      this.shadowRoot.querySelector('[data-act="defaults"]').textContent = t(hass, "defaults");
      this.shadowRoot.querySelector('[data-act="none"]').textContent = t(hass, "none");
      this._form.hass = hass;
      this._form.schema = this._schema();
      this._form.data = this._config;
      this._renderList();
    }

    _vehicle() {
      return fpcVehicle(this._hass, this._config.device_id);
    }

    _formChanged(value) {
      const next = { ...this._config, ...value };
      if (next.columns !== undefined) next.columns = Number(next.columns) || undefined;
      if (value.device_id !== this._config.device_id) {
        const v = fpcVehicle(this._hass, value.device_id);
        next.entities = fpcDefaultEntities(this._hass, v);
      }
      this._emit(next);
      this._form.data = this._config;
    }

    _setDefaults() {
      this._emit({ ...this._config, entities: fpcDefaultEntities(this._hass, this._vehicle()) });
    }

    _currentItems() {
      if (this._config.entities) return fpcItems(this._config);
      return fpcDefaultEntities(this._hass, this._vehicle()).map((entity) => ({ entity }));
    }

    _saveItems(items) {
      const entities = items.map((i) => (i.name ? { entity: i.entity, name: i.name } : i.entity));
      this._emit({ ...this._config, entities });
    }

    _renderList() {
      const root = this.shadowRoot;
      if (!root) return;
      const listEl = root.querySelector(".list");
      if (!listEl) return;
      const hass = this._hass;
      const vehicle = this._vehicle();
      if (!vehicle) {
        listEl.innerHTML = `<div class="row"><span></span><span class="notice">${esc(t(hass, "no_vehicle"))}</span><span></span></div>`;
        return;
      }
      const items = this._currentItems();
      const selected = items.map((i) => i.entity);
      const all = fpcListable(hass, vehicle);
      const known = new Map(all.map((a) => [a.entity, a]));
      const rows = [
        ...items.map((i) => ({ entity: i.entity, custom: i.name || "", on: true, meta: known.get(i.entity) })),
        ...all.filter((a) => !selected.includes(a.entity)).map((a) => ({ entity: a.entity, custom: "", on: false, meta: a })),
      ];

      listEl.innerHTML = rows
        .map((row, idx) => {
          const name = row.meta ? row.meta.name : fpcName(hass, row.entity, vehicle.name);
          const pos = row.on ? selected.indexOf(row.entity) : -1;
          return `<div class="row${row.on ? " on" : ""}" data-entity="${esc(row.entity)}">
            <input type="checkbox" ${row.on ? "checked" : ""} aria-label="${esc(name)}">
            <div class="label">
              <div class="n">${esc(name)}${row.meta && row.meta.diagnostic ? `<span class="tag">${esc(t(hass, "diagnostic"))}</span>` : ""}</div>
              <div class="e">${esc(row.entity)}</div>
            </div>
            ${row.on
              ? `<div class="move">
                  <button type="button" data-dir="-1" title="${esc(t(hass, "up"))}" ${pos === 0 ? "disabled" : ""}>▲</button>
                  <button type="button" data-dir="1" title="${esc(t(hass, "down"))}" ${pos === selected.length - 1 ? "disabled" : ""}>▼</button>
                </div>
                <input class="rename" type="text" value="${esc(row.custom)}" placeholder="${esc(t(hass, "name_placeholder"))}">`
              : "<span></span>"}
          </div>`;
        })
        .join("");

      listEl.querySelectorAll(".row").forEach((rowEl) => {
        const entity = rowEl.dataset.entity;
        const box = rowEl.querySelector('input[type="checkbox"]');
        const toggle = () => {
          const cur = this._currentItems();
          if (cur.some((i) => i.entity === entity)) this._saveItems(cur.filter((i) => i.entity !== entity));
          else this._saveItems([...cur, { entity }]);
        };
        box.addEventListener("change", toggle);
        rowEl.querySelector(".label").addEventListener("click", toggle);
        rowEl.querySelectorAll("[data-dir]").forEach((b) =>
          b.addEventListener("click", () => {
            const cur = this._currentItems();
            const i = cur.findIndex((x) => x.entity === entity);
            const j = i + Number(b.dataset.dir);
            if (i < 0 || j < 0 || j >= cur.length) return;
            [cur[i], cur[j]] = [cur[j], cur[i]];
            this._saveItems(cur);
          })
        );
        const rename = rowEl.querySelector(".rename");
        if (rename) {
          rename.addEventListener("change", () => {
            const cur = this._currentItems();
            const it = cur.find((x) => x.entity === entity);
            if (!it) return;
            const v = rename.value.trim();
            if (v) it.name = v;
            else delete it.name;
            this._saveItems(cur);
          });
        }
      });
    }
  }

  // ---------- Registration ----------

  if (!customElements.get(FPC_TAG)) customElements.define(FPC_TAG, FordpassCard);
  if (!customElements.get(FPC_EDITOR_TAG)) customElements.define(FPC_EDITOR_TAG, FordpassCardEditor);

  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === FPC_TAG)) {
    window.customCards.push({
      type: FPC_TAG,
      name: "FordPass Card",
      description: "Vehicle card for the FordPass integration: auto-detects your vehicle, pick sensors from a list, swaps the picture when doors are open.",
      preview: true,
      documentationURL: FPC_REPO,
    });
  }

  console.info(
    `%c FORDPASS-CARD %c v${FPC_VERSION} `,
    "color:#fff;background:#003478;font-weight:700;border-radius:4px 0 0 4px;padding:2px 4px",
    "color:#003478;background:#e8eef7;font-weight:700;border-radius:0 4px 4px 0;padding:2px 4px"
  );
})();
