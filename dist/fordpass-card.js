/*!
 * FordPass Card
 * A Lovelace card for vehicles connected through the FordPass integration
 * (https://github.com/marq24/ha-fordpass).
 * MIT License. Not affiliated with, endorsed by or sponsored by Ford Motor Company.
 */
(() => {
  const FPC_VERSION = "0.5.0";
  const FPC_TAG = "fordpass-card";
  const FPC_EDITOR_TAG = FPC_TAG + "-editor";
  const FPC_REPO = "https://github.com/Minny94/fordpass-card";

  // Supported languages, in the order used by every translation row below
  const FPC_LANGS = ["en", "it", "es", "fr", "de"];
  const FPC_LANG_NAMES = { en: "English", it: "Italiano", es: "Español", fr: "Français", de: "Deutsch" };

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

  // Controls shown when the user has not picked any (domain.translation_key)
  const FPC_CONTROL_DEFAULTS = [
    "lock.doorlock",
    "switch.ignition",
    "button.extendremotestart",
    "select.rcctemperature",
    "select.rcctemperaturefahrenheit",
    "number.rcctemperature",
    "switch.rccdefrostfront",
    "switch.rccdefrostrear",
    "switch.rccsteeringwheel",
    "select.rccseatfrontleft",
    "select.rccseatfrontright",
    "button.hafshort",
    "button.request_refresh",
    "button.update_data",
  ];

  // Map apps for the GPS navigation tile
  const FPC_MAPS = ["auto", "apple", "google", "waze"];

  // Domains offered in the two editor lists
  const FPC_LIST_DOMAINS = ["sensor", "binary_sensor", "device_tracker"];
  const FPC_CONTROL_DOMAINS = ["lock", "button", "switch", "select", "number"];

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

  // Entity names by FordPass translation_key. Rows follow FPC_LANGS: en, it, es, fr, de.
  // A "domain.key" entry wins over a plain "key" entry.
  const FPC_NAMES = {
    fuel: ["Fuel", "Carburante", "Combustible", "Carburant", "Kraftstoff"],
    soc: ["Battery charge", "Carica batteria", "Carga de batería", "Charge batterie", "Akkustand"],
    elveh: ["EV data", "Dati veicolo elettrico", "Datos VE", "Données VE", "E-Fahrzeugdaten"],
    elvehplug: ["Charging plug", "Spina di ricarica", "Conector de carga", "Prise de charge", "Ladestecker"],
    elvehcharging: ["Charging", "Ricarica", "Carga", "Recharge", "Laden"],
    fuelrange: ["Range", "Autonomia", "Autonomía", "Autonomie", "Reichweite"],
    odometer: ["Odometer", "Contachilometri", "Cuentakilómetros", "Compteur kilométrique", "Kilometerstand"],
    battery: ["12V battery", "Batteria 12V", "Batería 12V", "Batterie 12V", "12V-Batterie"],
    oil: ["Oil life", "Vita olio", "Vida del aceite", "Durée de vie de l'huile", "Öllebensdauer"],
    tirepressure: ["Tyres", "Pneumatici", "Neumáticos", "Pneus", "Reifen"],
    gps: ["GPS location", "Posizione GPS", "Ubicación GPS", "Position GPS", "GPS-Position"],
    alarm: ["Alarm", "Allarme", "Alarma", "Alarme", "Alarmanlage"],
    ignitionstatus: ["Ignition", "Accensione", "Encendido", "Contact", "Zündung"],
    doorstatus: ["Doors", "Porte", "Puertas", "Portes", "Türen"],
    windowposition: ["Windows", "Finestrini", "Ventanillas", "Vitres", "Fenster"],
    lastrefresh: ["Last update", "Ultimo aggiornamento", "Última actualización", "Dernière mise à jour", "Letzte Aktualisierung"],
    speed: ["Speed", "Velocità", "Velocidad", "Vitesse", "Geschwindigkeit"],
    enginespeed: ["Engine speed", "Giri motore", "Régimen del motor", "Régime moteur", "Motordrehzahl"],
    indicators: ["Warnings", "Spie", "Testigos", "Témoins", "Warnleuchten"],
    coolanttemp: ["Coolant temp.", "Temp. refrigerante", "Temp. refrigerante", "Temp. liquide de refroid.", "Kühlmitteltemp."],
    outsidetemp: ["Outside temp.", "Temp. esterna", "Temp. exterior", "Temp. extérieure", "Außentemp."],
    cabintemperature: ["Cabin temp.", "Temp. abitacolo", "Temp. habitáculo", "Temp. habitacle", "Innenraumtemp."],
    messages: ["Messages", "Messaggi", "Mensajes", "Messages", "Nachrichten"],
    dieselsystemstatus: ["Diesel system", "Sistema diesel", "Sistema diésel", "Système diesel", "Dieselsystem"],
    exhaustfluidlevel: ["AdBlue", "AdBlue", "AdBlue", "AdBlue", "AdBlue"],
    seatbelt: ["Seat belts", "Cinture", "Cinturones", "Ceintures", "Gurte"],
    deviceconnectivity: ["Connectivity", "Connettività", "Conectividad", "Connectivité", "Konnektivität"],
    parkingbrakestatus: ["Parking brake", "Freno di stazionamento", "Freno de mano", "Frein de stationnement", "Feststellbremse"],
    brakepedalstatus: ["Brake pedal", "Pedale del freno", "Pedal de freno", "Pédale de frein", "Bremspedal"],
    deepsleep: ["Deep sleep", "Sospensione", "Suspensión", "Veille profonde", "Tiefschlaf"],
    remotestartstatus: ["Remote start status", "Stato avviamento remoto", "Estado arranque remoto", "État démarrage à distance", "Fernstart-Status"],
    remotestartcountdown: ["Remaining time", "Tempo rimanente", "Tiempo restante", "Temps restant", "Restzeit"],
    gearleverposition: ["Gear", "Marcia", "Marcha", "Rapport", "Gang"],
    elvehchargingpower: ["Charging power", "Potenza di ricarica", "Potencia de carga", "Puissance de charge", "Ladeleistung"],
    departureschedules: ["Next departure", "Prossima partenza", "Próxima salida", "Prochain départ", "Nächste Abfahrt"],
    "sensor.doorlock": ["Locks", "Serrature", "Cerraduras", "Serrures", "Schlösser"],
    "lock.doorlock": ["Door lock", "Blocco porte", "Bloqueo de puertas", "Verrouillage", "Türverriegelung"],
    tracker: ["Location", "Posizione", "Ubicación", "Position", "Standort"],
    // controls
    update_data: ["Refresh data", "Aggiorna dati", "Actualizar datos", "Actualiser", "Daten aktualisieren"],
    request_refresh: ["Sync vehicle", "Sincronizza veicolo", "Sincronizar vehículo", "Synchroniser", "Fahrzeug abfragen"],
    hafshort: ["Honk & flash", "Clacson e luci", "Claxon y luces", "Klaxon et feux", "Hupen & Blinken"],
    hafdefault: ["Honk & flash 3s", "Clacson e luci 3s", "Claxon y luces 3s", "Klaxon et feux 3s", "Hupen & Blinken 3s"],
    haflong: ["Honk & flash 5s", "Clacson e luci 5s", "Claxon y luces 5s", "Klaxon et feux 5s", "Hupen & Blinken 5s"],
    doorunlock: ["Unlock doors", "Sblocca porte", "Desbloquear puertas", "Déverrouiller", "Entriegeln"],
    guardmode: ["Guard mode", "Modalità sorveglianza", "Modo vigilancia", "Mode surveillance", "Wachmodus"],
    evstart: ["Start charging", "Avvia ricarica", "Iniciar carga", "Démarrer la charge", "Laden starten"],
    evcancel: ["Resume charging", "Riprendi ricarica", "Reanudar carga", "Reprendre la charge", "Laden fortsetzen"],
    evpause: ["Pause charging", "Pausa ricarica", "Pausar carga", "Suspendre la charge", "Laden pausieren"],
    elvehcharge: ["Charging", "Ricarica", "Carga", "Recharge", "Laden"],
    elvehtargetcharge: ["Target charge", "Carica obiettivo", "Carga objetivo", "Charge cible", "Ladeziel"],
    globaltargetsoc: ["Target charge", "Carica obiettivo", "Carga objetivo", "Charge cible", "Ladeziel"],
    departuretimes: ["Departure times", "Orari di partenza", "Horarios de salida", "Heures de départ", "Abfahrtszeiten"],
    trailerlightcheckon: ["Trailer lights test", "Test luci rimorchio", "Prueba luces remolque", "Test feux remorque", "Anhängerlicht-Test"],
    trailerlightcheckoff: ["Stop trailer test", "Ferma test rimorchio", "Parar prueba remolque", "Arrêter test remorque", "Anhängertest beenden"],
    msgdeletelast: ["Delete last message", "Elimina ultimo messaggio", "Borrar último mensaje", "Supprimer dernier message", "Letzte Nachricht löschen"],
    msgdeleteall: ["Delete all messages", "Elimina tutti i messaggi", "Borrar todos los mensajes", "Supprimer tous les messages", "Alle Nachrichten löschen"],
    autosoftwareupdates: ["Auto updates", "Aggiornamenti automatici", "Actualizaciones automáticas", "Mises à jour auto", "Auto-Updates"],
    "switch.ignition": ["Remote start", "Avviamento remoto", "Arranque remoto", "Démarrage à distance", "Fernstart"],
    extendremotestart: ["Extend start", "Prolunga avviamento", "Prolongar arranque", "Prolonger", "Verlängern"],
    rccdefrostfront: ["Heated windscreen", "Parabrezza riscaldato", "Parabrisas térmico", "Pare-brise chauffant", "Frontscheibenheizung"],
    rccdefrostrear: ["Rear defrost", "Lunotto termico", "Luneta térmica", "Dégivrage arrière", "Heckscheibenheizung"],
    rccsteeringwheel: ["Heated wheel", "Volante riscaldato", "Volante calefactado", "Volant chauffant", "Lenkradheizung"],
    rccseatfrontleft: ["Seat front left", "Sedile ant. sx", "Asiento del. izq.", "Siège avant G", "Sitz vorne links"],
    rccseatfrontright: ["Seat front right", "Sedile ant. dx", "Asiento del. der.", "Siège avant D", "Sitz vorne rechts"],
    rccseatrearleft: ["Seat rear left", "Sedile post. sx", "Asiento tras. izq.", "Siège arrière G", "Sitz hinten links"],
    rccseatrearright: ["Seat rear right", "Sedile post. dx", "Asiento tras. der.", "Siège arrière D", "Sitz hinten rechts"],
    rcctemperature: ["Climate temp.", "Temp. clima", "Temp. climatización", "Temp. climatisation", "Klimatemperatur"],
    rcctemperaturefahrenheit: ["Climate temp.", "Temp. clima", "Temp. climatización", "Temp. climatisation", "Klimatemperatur"],
    zonelighting: ["Zone lighting", "Luci di zona", "Iluminación de zona", "Éclairage de zone", "Zonenbeleuchtung"],
  };

  // Raw FordPass states (upper case). "key:STATE" and "domain:STATE" entries win over a plain "STATE".
  const FPC_STATES = {
    LOCKED: ["Locked", "Bloccate", "Bloqueadas", "Verrouillées", "Verriegelt"],
    UNLOCKED: ["Unlocked", "Sbloccate", "Desbloqueadas", "Déverrouillées", "Entriegelt"],
    PARTLY_LOCKED: ["Partly locked", "Parzialmente bloccate", "Parcialmente bloqueadas", "Partiellement verrouillées", "Teilweise verriegelt"],
    "lock:LOCKED": ["Locked", "Bloccato", "Bloqueado", "Verrouillé", "Verriegelt"],
    "lock:UNLOCKED": ["Unlocked", "Sbloccato", "Desbloqueado", "Déverrouillé", "Entriegelt"],
    "lock:LOCKING": ["Locking…", "Blocco in corso…", "Bloqueando…", "Verrouillage…", "Wird verriegelt…"],
    "lock:UNLOCKING": ["Unlocking…", "Sblocco in corso…", "Desbloqueando…", "Déverrouillage…", "Wird entriegelt…"],
    OPEN: ["Open", "Aperte", "Abiertas", "Ouvertes", "Offen"],
    CLOSED: ["Closed", "Chiuse", "Cerradas", "Fermées", "Geschlossen"],
    "windowposition:OPEN": ["Open", "Aperti", "Abiertas", "Ouvertes", "Offen"],
    "windowposition:CLOSED": ["Closed", "Chiusi", "Cerradas", "Fermées", "Geschlossen"],
    NORMAL_OPERATION: ["Normal", "Normale", "Normal", "Normal", "Normal"],
    DISARMED: ["Disarmed", "Disinserito", "Desactivada", "Désactivée", "Unscharf"],
    ARMED: ["Armed", "Inserito", "Activada", "Activée", "Scharf"],
    ON: ["On", "Acceso", "Encendido", "Allumé", "An"],
    OFF: ["Off", "Spento", "Apagado", "Éteint", "Aus"],
    RUN: ["Running", "In moto", "En marcha", "En marche", "Läuft"],
    START: ["Starting", "Avvio", "Arrancando", "Démarrage", "Startet"],
    ACCESSORY: ["Accessory", "Accessori", "Accesorios", "Accessoires", "Zubehör"],
    "parkingbrakestatus:ON": ["Engaged", "Inserito", "Echado", "Serré", "Angezogen"],
    "parkingbrakestatus:OFF": ["Released", "Disinserito", "Quitado", "Desserré", "Gelöst"],
    "brakepedalstatus:ON": ["Pressed", "Premuto", "Pisado", "Enfoncée", "Gedrückt"],
    "brakepedalstatus:OFF": ["Released", "Rilasciato", "Suelto", "Relâchée", "Gelöst"],
    BUCKLED: ["Buckled", "Allacciate", "Abrochados", "Attachées", "Angelegt"],
    UNBUCKLED: ["Unbuckled", "Slacciate", "Desabrochados", "Détachées", "Nicht angelegt"],
    CONNECTED: ["Connected", "Connesso", "Conectado", "Connecté", "Verbunden"],
    DISCONNECTED: ["Disconnected", "Disconnesso", "Desconectado", "Déconnecté", "Getrennt"],
    "device_tracker:HOME": ["Home", "A casa", "En casa", "À la maison", "Zuhause"],
    "device_tracker:NOT_HOME": ["Away", "Fuori casa", "Fuera", "Absent", "Abwesend"],
    UNKNOWN: ["Unknown", "Sconosciuto", "Desconocido", "Inconnu", "Unbekannt"],
    UNAVAILABLE: ["Unavailable", "Non disponibile", "No disponible", "Indisponible", "Nicht verfügbar"],
  };

  // Seat heating/cooling option words (followed by the level number)
  const FPC_SEAT = {
    heated: ["Heat", "Caldo", "Calor", "Chaud", "Heizen"],
    cooled: ["Cool", "Fresco", "Frío", "Froid", "Kühlen"],
  };

  // Editor and card interface text
  const FPC_UI = {
    en: {
      vehicle: "Vehicle",
      language: "Language",
      language_auto: "Automatic (Home Assistant language)",
      title: "Title (empty = vehicle name)",
      image: "Image URL (empty = FordPass vehicle picture)",
      image_open: "Image URL with doors open (optional)",
      columns: "Columns",
      sensors: "Sensors",
      sensors_hint: "Tick the sensors to show. Use the arrows to change their order.",
      controls: "Controls",
      controls_hint: "Tick the commands to show above the sensors. Lock, remote start, horn and delete commands ask for a second tap to confirm.",
      defaults: "Defaults",
      none: "None",
      name_placeholder: "Custom name (optional)",
      diagnostic: "diagnostic",
      no_vehicle: "No FordPass vehicle found. Install and set up the FordPass integration first.",
      up: "Move up",
      down: "Move down",
      confirm_tap: "Tap again",
      sent: "Command sent",
      failed: "Command failed",
      navigate: "Navigate",
      maps: "Maps app",
      maps_auto: "Automatic (Apple Maps on iPhone/Mac, Google Maps elsewhere)",
      no_position: "No position available",
    },
    it: {
      vehicle: "Veicolo",
      language: "Lingua",
      language_auto: "Automatica (lingua di Home Assistant)",
      title: "Titolo (vuoto = nome del veicolo)",
      image: "URL immagine (vuoto = immagine FordPass del veicolo)",
      image_open: "URL immagine con porte aperte (facoltativa)",
      columns: "Colonne",
      sensors: "Sensori",
      sensors_hint: "Spunta i sensori da mostrare. Con le frecce cambi l'ordine.",
      controls: "Comandi",
      controls_hint: "Spunta i comandi da mostrare sopra i sensori. Blocco porte, avviamento remoto, clacson ed eliminazioni chiedono un secondo tocco di conferma.",
      defaults: "Predefiniti",
      none: "Nessuno",
      name_placeholder: "Nome personalizzato (facoltativo)",
      diagnostic: "diagnostica",
      no_vehicle: "Nessun veicolo FordPass trovato. Installa e configura prima l'integrazione FordPass.",
      up: "Sposta su",
      down: "Sposta giù",
      confirm_tap: "Tocca ancora",
      sent: "Comando inviato",
      failed: "Comando non riuscito",
      navigate: "Naviga",
      maps: "App mappe",
      maps_auto: "Automatica (Apple Mappe su iPhone/Mac, Google Maps altrove)",
      no_position: "Posizione non disponibile",
    },
    es: {
      vehicle: "Vehículo",
      language: "Idioma",
      language_auto: "Automático (idioma de Home Assistant)",
      title: "Título (vacío = nombre del vehículo)",
      image: "URL de la imagen (vacío = imagen de FordPass)",
      image_open: "URL de la imagen con puertas abiertas (opcional)",
      columns: "Columnas",
      sensors: "Sensores",
      sensors_hint: "Marca los sensores que quieres mostrar. Usa las flechas para cambiar el orden.",
      controls: "Controles",
      controls_hint: "Marca los controles que quieres mostrar encima de los sensores. Bloqueo, arranque remoto, claxon y borrado piden un segundo toque para confirmar.",
      defaults: "Predeterminados",
      none: "Ninguno",
      name_placeholder: "Nombre personalizado (opcional)",
      diagnostic: "diagnóstico",
      no_vehicle: "No se encontró ningún vehículo FordPass. Instala y configura primero la integración FordPass.",
      up: "Subir",
      down: "Bajar",
      confirm_tap: "Toca otra vez",
      sent: "Orden enviada",
      failed: "La orden ha fallado",
      navigate: "Navegar",
      maps: "App de mapas",
      maps_auto: "Automático (Apple Maps en iPhone/Mac, Google Maps en el resto)",
      no_position: "Ubicación no disponible",
    },
    fr: {
      vehicle: "Véhicule",
      language: "Langue",
      language_auto: "Automatique (langue de Home Assistant)",
      title: "Titre (vide = nom du véhicule)",
      image: "URL de l'image (vide = image FordPass du véhicule)",
      image_open: "URL de l'image portes ouvertes (facultatif)",
      columns: "Colonnes",
      sensors: "Capteurs",
      sensors_hint: "Cochez les capteurs à afficher. Utilisez les flèches pour changer l'ordre.",
      controls: "Commandes",
      controls_hint: "Cochez les commandes à afficher au-dessus des capteurs. Verrouillage, démarrage à distance, klaxon et suppressions demandent un second appui pour confirmer.",
      defaults: "Par défaut",
      none: "Aucun",
      name_placeholder: "Nom personnalisé (facultatif)",
      diagnostic: "diagnostic",
      no_vehicle: "Aucun véhicule FordPass trouvé. Installez et configurez d'abord l'intégration FordPass.",
      up: "Monter",
      down: "Descendre",
      confirm_tap: "Appuyez encore",
      sent: "Commande envoyée",
      failed: "Échec de la commande",
      navigate: "Naviguer",
      maps: "App de cartes",
      maps_auto: "Automatique (Plans sur iPhone/Mac, Google Maps ailleurs)",
      no_position: "Position indisponible",
    },
    de: {
      vehicle: "Fahrzeug",
      language: "Sprache",
      language_auto: "Automatisch (Sprache von Home Assistant)",
      title: "Titel (leer = Fahrzeugname)",
      image: "Bild-URL (leer = FordPass-Fahrzeugbild)",
      image_open: "Bild-URL mit offenen Türen (optional)",
      columns: "Spalten",
      sensors: "Sensoren",
      sensors_hint: "Wähle die anzuzeigenden Sensoren aus. Mit den Pfeilen änderst du die Reihenfolge.",
      controls: "Steuerung",
      controls_hint: "Wähle die Befehle über den Sensoren aus. Verriegeln, Fernstart, Hupe und Löschen verlangen zur Bestätigung ein zweites Tippen.",
      defaults: "Standard",
      none: "Keine",
      name_placeholder: "Eigener Name (optional)",
      diagnostic: "Diagnose",
      no_vehicle: "Kein FordPass-Fahrzeug gefunden. Installiere und richte zuerst die FordPass-Integration ein.",
      up: "Nach oben",
      down: "Nach unten",
      confirm_tap: "Nochmal tippen",
      sent: "Befehl gesendet",
      failed: "Befehl fehlgeschlagen",
      navigate: "Navigieren",
      maps: "Karten-App",
      maps_auto: "Automatisch (Apple Karten auf iPhone/Mac, sonst Google Maps)",
      no_position: "Keine Position verfügbar",
    },
  };

  // Language for this card: the configured one, or the Home Assistant user language, or English
  function fpcLang(hass, config) {
    const chosen = config && config.language;
    if (chosen && chosen !== "auto" && FPC_LANGS.includes(chosen)) return chosen;
    const ha = ((hass && hass.locale && hass.locale.language) || (hass && hass.language) || "en").toLowerCase().split("-")[0];
    return FPC_LANGS.includes(ha) ? ha : "en";
  }

  const t = (lang, key) => (FPC_UI[lang] || FPC_UI.en)[key] || FPC_UI.en[key] || key;
  const tr = (row, lang) => (row ? row[FPC_LANGS.indexOf(lang)] || row[0] : null);

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
      out.push({ id, name: d ? d.name_by_user || d.name || id : id, model: d ? d.model || "" : "", entities });
    }
    return out;
  }

  function fpcVehicle(hass, deviceId) {
    const all = fpcVehicles(hass);
    if (deviceId) return all.find((v) => v.id === deviceId) || null;
    return all[0] || null;
  }

  const fpcDomain = (entityId) => String(entityId || "").split(".")[0];

  function fpcKey(entry) {
    if (entry.translation_key) return entry.translation_key;
    return entry.entity_id.split(".")[1].replace(/^fordpass_[a-z0-9]+_/, "");
  }

  function fpcEntityKey(hass, entityId) {
    const reg = hass.entities && hass.entities[entityId];
    return reg ? fpcKey(reg) : "";
  }

  function fpcFind(vehicle, domain, key) {
    return vehicle.entities.find((e) => fpcDomain(e.entity_id) === domain && fpcKey(e) === key) || null;
  }

  function fpcPick(hass, vehicle, list) {
    if (!vehicle) return [];
    return list
      .map((k) => {
        const [domain, key] = k.split(".");
        const e = fpcFind(vehicle, domain, key);
        return e && hass.states[e.entity_id] ? e.entity_id : null;
      })
      .filter(Boolean);
  }

  const fpcDefaultEntities = (hass, vehicle) => fpcPick(hass, vehicle, FPC_DEFAULTS);
  const fpcDefaultControls = (hass, vehicle) => fpcPick(hass, vehicle, FPC_CONTROL_DEFAULTS);

  function fpcName(hass, entityId, deviceName, lang) {
    const reg = hass.entities && hass.entities[entityId];
    if (reg && reg.platform === "fordpass") {
      const key = fpcKey(reg);
      const row = FPC_NAMES[`${fpcDomain(entityId)}.${key}`] || FPC_NAMES[key];
      if (row) return tr(row, lang);
    }
    const st = hass.states[entityId];
    let n = (st && st.attributes.friendly_name) || entityId;
    if (deviceName && n.toLowerCase().startsWith(deviceName.toLowerCase() + " ")) {
      n = n.slice(deviceName.length + 1);
    }
    return n;
  }

  function fpcListable(hass, vehicle, lang, domains, defaults) {
    if (!vehicle) return [];
    const list = vehicle.entities
      .filter((e) => domains.includes(fpcDomain(e.entity_id)) && !e.hidden && hass.states[e.entity_id])
      .map((e) => ({
        entity: e.entity_id,
        name: fpcName(hass, e.entity_id, vehicle.name, lang),
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

  function fpcItems(list) {
    return (list || []).map((x) => (typeof x === "string" ? { entity: x } : { ...x })).filter((x) => x.entity);
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

  // Select options such as "19_5", "lo", "heated2"
  function fpcOption(value, lang) {
    const v = String(value || "");
    const temp = /^(\d+)_(\d)$/.exec(v);
    if (temp) return `${temp[1]}${lang === "en" ? "." : ","}${temp[2]}°`;
    if (v === "lo" || v === "hi") return v.toUpperCase();
    const seat = /^(heated|cooled)(\d)$/.exec(v);
    if (seat) return `${tr(FPC_SEAT[seat[1]], lang)} ${seat[2]}`;
    const row = FPC_STATES[v.toUpperCase()];
    return row ? tr(row, lang) : null;
  }

  function fpcFormat(hass, stateObj, key, lang) {
    if (!stateObj) return "—";
    const raw = String(stateObj.state);
    const domain = fpcDomain(stateObj.entity_id);
    if (domain === "select") {
      const o = fpcOption(raw, lang);
      if (o) return o;
    }
    if (raw !== "" && isNaN(Number(raw))) {
      const up = raw.toUpperCase();
      const row = FPC_STATES[`${key}:${up}`] || FPC_STATES[`${domain}:${up}`] || FPC_STATES[up];
      if (row) return tr(row, lang);
    }
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

  // Commands that need a second tap unless the user sets `confirm` on the item
  function fpcNeedsConfirm(domain, key) {
    if (domain === "lock") return true;
    return /^haf|msgdelete|^ignition$|extendremotestart|doorunlock|^ev(start|cancel|pause)$|^elvehcharge$|guardmode/.test(key);
  }

  // Latitude/longitude from a device_tracker, the FordPass GPS sensor or any entity with coordinates
  function fpcCoords(stateObj) {
    if (!stateObj) return null;
    const a = stateObj.attributes || {};
    const ok = (lat, lon) => (Number.isFinite(lat) && Number.isFinite(lon) ? { lat, lon } : null);
    let c = ok(Number(a.latitude), Number(a.longitude));
    if (c) return c;
    const loc = a.value && a.value.location;
    if (loc) {
      c = ok(Number(loc.lat), Number(loc.lon !== undefined ? loc.lon : loc.lng));
      if (c) return c;
    }
    const s = String(stateObj.state || "");
    const lat = /lat\w*['"]?\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(s);
    const lon = /(?:lon|lng)\w*['"]?\s*:\s*(-?\d+(?:\.\d+)?)/i.exec(s);
    return lat && lon ? ok(Number(lat[1]), Number(lon[1])) : null;
  }

  function fpcMapsUrl(coords, app) {
    const ll = `${coords.lat},${coords.lon}`;
    let which = app && app !== "auto" ? app : null;
    if (!which) which = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(navigator.userAgent || "") ? "apple" : "google";
    if (which === "apple") return `https://maps.apple.com/?daddr=${ll}&dirflg=d`;
    if (which === "waze") return `https://waze.com/ul?ll=${ll}&navigate=yes`;
    return `https://www.google.com/maps/dir/?api=1&destination=${ll}&travelmode=driving`;
  }

  // GPS sensor tiles navigate by default; any tile can opt in with `navigate: true`
  const fpcNavigates = (item, key) => (item.navigate !== undefined ? !!item.navigate : key === "gps");

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

    .controls {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(72px, 1fr));
      gap: 12px 6px;
      padding: 16px 12px 2px;
    }
    .ctl {
      all: unset;
      position: relative;
      display: flex; flex-direction: column; align-items: center; gap: 5px;
      min-width: 0; cursor: pointer; text-align: center;
      -webkit-tap-highlight-color: transparent;
    }
    .ctl select.native {
      position: absolute; inset: 0; width: 100%; height: 100%;
      opacity: 0; cursor: pointer; font-size: 16px;
      -webkit-appearance: none; appearance: none; border: 0; margin: 0;
    }
    .ctl:focus-within .ring { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
    .ring {
      width: 50px; height: 50px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.13);
      box-shadow: 0 6px 16px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12);
      color: rgba(255,255,255,0.9);
      --mdc-icon-size: 22px;
      transition: transform .12s ease, box-shadow .25s ease, border-color .25s ease, color .25s ease, background .25s ease, opacity .25s ease;
    }
    .ctl:hover .ring { background: rgba(255,255,255,0.11); }
    .ctl:active .ring { transform: scale(0.92); }
    .ctl:focus-visible .ring { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
    .clabel {
      font-size: 11px; line-height: 13px; color: rgba(255,255,255,0.80);
      max-width: 100%; overflow: hidden;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
    }
    .cstate {
      font-size: 10px; line-height: 12px; min-height: 12px; color: rgba(255,255,255,0.50);
      max-width: 100%; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .ctl.good .ring { color: ${GOOD}; border-color: rgba(91,237,150,0.60); box-shadow: 0 0 18px rgba(91,237,150,0.28), 0 6px 16px rgba(0,0,0,0.35); }
    .ctl.bad .ring { color: ${BAD}; border-color: rgba(255,91,108,0.65); box-shadow: 0 0 18px rgba(255,91,108,0.30), 0 6px 16px rgba(0,0,0,0.35); }
    .ctl.on .ring {
      color: rgb(255,196,80); border-color: rgba(255,170,40,0.65);
      background: radial-gradient(circle at 50% 30%, rgba(255,170,40,0.38), rgba(255,130,10,0.12));
      box-shadow: 0 0 18px rgba(255,150,30,0.35), 0 6px 16px rgba(0,0,0,0.35);
    }
    .ctl.armed .ring { color: ${WARN}; border-color: ${WARN}; animation: fpc-pulse 1s ease-in-out infinite; }
    .ctl.armed .cstate { color: ${WARN}; font-weight: 700; }
    .ctl.busy .ring { opacity: 0.55; }
    .ctl.unavailable { opacity: 0.4; pointer-events: none; }
    @keyframes fpc-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(255,188,75,0.55); }
      50% { box-shadow: 0 0 0 8px rgba(255,188,75,0); }
    }

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
      return v ? { device_id: v.id, controls: fpcDefaultControls(hass, v), entities: fpcDefaultEntities(hass, v) } : {};
    }

    setConfig(config) {
      if (!config || typeof config !== "object") throw new Error("Invalid configuration");
      this._config = { ...config };
      this._sig = null;
      this._built = false;
      this._armed = null;
      if (this._hass) this._update();
    }

    set hass(hass) {
      this._hass = hass;
      this._update();
    }

    disconnectedCallback() {
      clearTimeout(this._armTimer);
      this._armed = null;
    }

    getCardSize() {
      const cols = Number(this._config && this._config.columns) || 2;
      const n = this._items ? this._items.length : 6;
      const c = this._controls && this._controls.length ? 2 : 0;
      return 4 + c + Math.ceil(n / cols);
    }

    getGridOptions() {
      return { columns: 12, min_columns: 6 };
    }

    _resolve() {
      const hass = this._hass;
      const cfg = this._config || {};
      const lang = fpcLang(hass, cfg);
      const vehicle = fpcVehicle(hass, cfg.device_id);
      let items = fpcItems(cfg.entities);
      if (!cfg.entities && vehicle) items = fpcDefaultEntities(hass, vehicle).map((entity) => ({ entity }));
      let controls = fpcItems(cfg.controls);
      if (!cfg.controls && vehicle) controls = fpcDefaultControls(hass, vehicle).map((entity) => ({ entity }));

      let image = cfg.image || null;
      let imageOpen = cfg.image_open || null;
      if (!image && vehicle && cfg.show_image !== false) {
        const imgEnt = fpcFind(vehicle, "image", "vehicleimage");
        const st = imgEnt && hass.states[imgEnt.entity_id];
        if (st && st.attributes.entity_picture) image = st.attributes.entity_picture;
      }
      if (cfg.show_image === false) {
        image = null;
        imageOpen = null;
      }

      let doorEntity = cfg.door_entity || null;
      if (!doorEntity && vehicle) {
        const d = fpcFind(vehicle, "sensor", "doorstatus");
        doorEntity = d ? d.entity_id : null;
      }
      const doorState = doorEntity && hass.states[doorEntity] ? hass.states[doorEntity].state : null;
      const doorsOpen = String(doorState || "").toUpperCase() === "OPEN";

      const title = cfg.show_title === false ? "" : cfg.title || (vehicle ? vehicle.name : "");
      return { lang, vehicle, items, controls, image, imageOpen, doorsOpen, title };
    }

    _update() {
      if (!this._hass || !this._config) return;
      const r = this._resolve();
      this._items = r.items;
      this._controls = r.controls;
      this._lang = r.lang;
      const stateSig = (list) =>
        list.map((i) => {
          const s = this._hass.states[i.entity];
          return s ? `${s.state}|${s.last_updated}` : "x";
        });
      const sig = JSON.stringify([
        r.lang,
        r.vehicle && r.vehicle.id,
        r.items,
        r.controls,
        r.image,
        r.imageOpen,
        r.doorsOpen,
        r.title,
        this._config.columns,
        stateSig(r.items),
        stateSig(r.controls),
        this._armed,
        this._hass.locale && this._hass.locale.language,
      ]);
      if (sig === this._sig) return;
      this._sig = sig;

      const structure = JSON.stringify([r.lang, !!r.vehicle, r.items, r.controls, !!r.image, !!r.imageOpen, r.title, this._config.columns]);
      if (!this._built || structure !== this._structure) {
        this._build(r);
        this._structure = structure;
        this._built = true;
      }
      this._fill(r);
    }

    _build(r) {
      if (!this.shadowRoot) this.attachShadow({ mode: "open" });
      const cols = Math.min(Math.max(Number(this._config.columns) || 2, 1), 4);
      let body = "";
      if (!r.vehicle && !(this._config.entities || []).length && !(this._config.controls || []).length) {
        body = `<div class="notice">${esc(t(r.lang, "no_vehicle"))}</div>`;
      } else {
        body = `
          ${r.title || r.image ? `<div class="hero">
            ${r.title ? `<div class="title">${esc(r.title)}</div>` : ""}
            ${r.image ? `<div class="pics${r.imageOpen ? " has-open" : ""}">
              <img class="closed" alt="">
              ${r.imageOpen ? `<img class="open" alt="">` : ""}
            </div>` : ""}
          </div>` : ""}
          ${r.controls.length ? `<div class="controls">
            ${r.controls
              .map((c, idx) =>
                fpcDomain(c.entity) === "select"
                  ? `<label class="ctl" data-cidx="${idx}" data-kind="select">
                  <span class="ring"></span>
                  <span class="clabel"></span>
                  <span class="cstate"></span>
                  <select class="native"></select>
                </label>`
                  : `<button class="ctl" data-cidx="${idx}" type="button">
                  <span class="ring"></span>
                  <span class="clabel"></span>
                  <span class="cstate"></span>
                </button>`
              )
              .join("")}
          </div>` : ""}
          ${r.items.length ? `<div class="grid" style="--fpc-cols:${cols}">
            ${r.items
              .map(
                (i, idx) => `<button class="tile" data-idx="${idx}" type="button">
                  <span class="icon"></span>
                  <span class="name"></span>
                  <span class="state"></span>
                </button>`
              )
              .join("")}
          </div>` : ""}`;
      }
      this.shadowRoot.innerHTML = `<style>${CARD_CSS}</style><ha-card>${body}</ha-card>`;

      this._tiles = [];
      this.shadowRoot.querySelectorAll(".tile").forEach((el) => {
        const idx = Number(el.dataset.idx);
        const iconWrap = el.querySelector(".icon");
        const icon = document.createElement("ha-state-icon");
        iconWrap.appendChild(icon);
        el.addEventListener("click", () => this._tileTap(idx));
        this._tiles[idx] = { el, icon, iconWrap, name: el.querySelector(".name"), state: el.querySelector(".state") };
      });

      this._ctls = [];
      this.shadowRoot.querySelectorAll(".ctl").forEach((el) => {
        const idx = Number(el.dataset.cidx);
        const ring = el.querySelector(".ring");
        const icon = document.createElement("ha-state-icon");
        ring.appendChild(icon);
        const select = el.querySelector("select.native");
        if (select) {
          select.addEventListener("click", () => this._disarm());
          select.addEventListener("change", () => this._selectOption(idx, select.value));
        } else {
          el.addEventListener("click", () => this._control(idx));
        }
        this._ctls[idx] = { el, icon, select, label: el.querySelector(".clabel"), state: el.querySelector(".cstate") };
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

      r.controls.forEach((c, idx) => {
        const ui = this._ctls[idx];
        if (!ui) return;
        const st = hass.states[c.entity];
        const domain = fpcDomain(c.entity);
        const key = fpcEntityKey(hass, c.entity);
        const name = c.name || fpcName(hass, c.entity, devName, r.lang);
        ui.label.textContent = name;
        ui.el.title = name;
        ui.el.setAttribute("aria-label", name);
        const s = st ? String(st.state) : "";
        ui.el.classList.toggle("unavailable", !st || s === "unavailable");
        ui.el.classList.toggle("good", domain === "lock" && s === "locked");
        ui.el.classList.toggle("bad", domain === "lock" && (s === "unlocked" || s === "open"));
        ui.el.classList.toggle("on", domain === "switch" && s === "on");
        ui.el.classList.toggle("armed", this._armed === idx);
        ui.icon.hass = hass;
        ui.icon.stateObj = st;
        if (c.icon) ui.icon.icon = c.icon;
        if (this._armed === idx) ui.state.textContent = t(r.lang, "confirm_tap");
        else if (domain === "button") ui.state.textContent = "";
        else ui.state.textContent = fpcFormat(hass, st, key, r.lang);

        if (ui.select && st) {
          const options = Array.isArray(st.attributes.options) ? st.attributes.options : [];
          const optSig = `${r.lang}|${options.join(",")}`;
          if (ui.optSig !== optSig) {
            ui.select.innerHTML = options
              .map((o) => `<option value="${esc(o)}">${esc(fpcOption(o, r.lang) || o)}</option>`)
              .join("");
            ui.optSig = optSig;
          }
          ui.select.setAttribute("aria-label", name);
          if (ui.select.value !== st.state) ui.select.value = st.state;
        }
      });

      r.items.forEach((item, idx) => {
        const tile = this._tiles[idx];
        if (!tile) return;
        const st = hass.states[item.entity];
        const key = fpcEntityKey(hass, item.entity);
        const nav = fpcNavigates(item, key);
        tile.name.textContent = item.name || fpcName(hass, item.entity, devName, r.lang);
        if (nav) tile.state.textContent = fpcCoords(st) ? t(r.lang, "navigate") : t(r.lang, "no_position");
        else tile.state.textContent = fpcFormat(hass, st, key, r.lang);
        tile.el.classList.toggle("unavailable", !st || st.state === "unavailable");
        tile.icon.hass = hass;
        tile.icon.stateObj = st;
        if (item.icon) tile.icon.icon = item.icon;
        else if (nav) tile.icon.icon = "mdi:navigation-variant";

        const color = item.color || (nav ? BLUE : null) || fpcStateColor(key, st && st.state) || FPC_ICON_COLORS[key] || null;
        tile.iconWrap.style.color = color || "";
      });
    }

    _disarm() {
      clearTimeout(this._armTimer);
      if (this._armed === null || this._armed === undefined) return;
      this._armed = null;
      this._sig = null;
      this._update();
    }

    _control(idx) {
      const c = this._controls && this._controls[idx];
      const hass = this._hass;
      if (!c || !hass) return;
      const st = hass.states[c.entity];
      if (!st) return;
      const domain = fpcDomain(c.entity);
      const key = fpcEntityKey(hass, c.entity);

      if (domain === "select" || domain === "number") {
        this._disarm();
        this._moreInfo(c.entity);
        return;
      }

      const needsConfirm = c.confirm !== undefined ? !!c.confirm : fpcNeedsConfirm(domain, key);
      if (needsConfirm && this._armed !== idx) {
        clearTimeout(this._armTimer);
        this._armed = idx;
        this._sig = null;
        this._update();
        this._armTimer = setTimeout(() => this._disarm(), 4000);
        return;
      }
      this._disarm();

      let call = null;
      if (domain === "lock") call = ["lock", st.state === "locked" ? "unlock" : "lock"];
      else if (domain === "button") call = ["button", "press"];
      else if (domain === "switch") call = ["switch", st.state === "on" ? "turn_off" : "turn_on"];
      if (!call) {
        this._moreInfo(c.entity);
        return;
      }

      const ui = this._ctls[idx];
      if (ui) ui.el.classList.add("busy");
      const lang = this._lang;
      Promise.resolve(hass.callService(call[0], call[1], { entity_id: c.entity }))
        .then(() => this._toast(t(lang, "sent")))
        .catch((err) => this._toast(`${t(lang, "failed")}: ${(err && err.message) || err}`))
        .finally(() => setTimeout(() => ui && ui.el.classList.remove("busy"), 600));
    }

    _selectOption(idx, option) {
      const c = this._controls && this._controls[idx];
      const hass = this._hass;
      if (!c || !hass) return;
      const st = hass.states[c.entity];
      if (!st || st.state === option) return;
      const ui = this._ctls[idx];
      if (ui) ui.el.classList.add("busy");
      const lang = this._lang;
      Promise.resolve(hass.callService("select", "select_option", { entity_id: c.entity, option }))
        .then(() => this._toast(t(lang, "sent")))
        .catch((err) => {
          if (ui && ui.select) ui.select.value = st.state;
          this._toast(`${t(lang, "failed")}: ${(err && err.message) || err}`);
        })
        .finally(() => setTimeout(() => ui && ui.el.classList.remove("busy"), 600));
    }

    _tileTap(idx) {
      const item = this._items && this._items[idx];
      const hass = this._hass;
      if (!item || !hass) return;
      const key = fpcEntityKey(hass, item.entity);
      if (!fpcNavigates(item, key)) {
        this._moreInfo(item.entity);
        return;
      }
      const coords = fpcCoords(hass.states[item.entity]);
      if (!coords) {
        this._toast(t(this._lang, "no_position"));
        return;
      }
      const a = document.createElement("a");
      a.href = fpcMapsUrl(coords, this._config.maps);
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.display = "none";
      this.shadowRoot.appendChild(a);
      a.click();
      a.remove();
    }

    _toast(message) {
      const ev = new Event("hass-notification", { bubbles: true, composed: true });
      ev.detail = { message };
      this.dispatchEvent(ev);
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
    .pickers { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; }
    .picker { display: flex; flex-direction: column; gap: 6px; font-size: 12px; color: var(--secondary-text-color); min-width: 0; }
    .picker select {
      font: inherit; font-size: 15px; padding: 12px 10px; border-radius: 8px;
      border: 1px solid var(--divider-color, #444);
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      min-width: 0;
    }
    @media (max-width: 450px) { .pickers { grid-template-columns: 1fr; } }
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

  // The two pickable lists in the editor
  const FPC_SECTIONS = {
    controls: { domains: FPC_CONTROL_DOMAINS, defaults: fpcDefaultControls, title: "controls", hint: "controls_hint" },
    entities: { domains: FPC_LIST_DOMAINS, defaults: fpcDefaultEntities, title: "sensors", hint: "sensors_hint" },
  };

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

    _lang() {
      return fpcLang(this._hass, this._config);
    }

    _emit(config) {
      Object.keys(config).forEach((k) => {
        if (config[k] === "" || config[k] === undefined || config[k] === null) delete config[k];
      });
      const langChanged = fpcLang(this._hass, config) !== this._lang();
      this._config = config;
      this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
      if (langChanged) this._render();
      else this._renderLists();
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
          <div class="pickers">
            <label class="picker vehicle"><span></span><select></select></label>
            <label class="picker language"><span></span><select></select></label>
            <label class="picker maps"><span></span><select></select></label>
          </div>
          <div class="form"></div>
          ${Object.keys(FPC_SECTIONS)
            .map(
              (key) => `<div class="section" data-key="${key}">
            <div class="head">
              <h3></h3>
              <div class="actions">
                <button class="btn" data-act="defaults" type="button"></button>
                <button class="btn" data-act="none" type="button"></button>
              </div>
            </div>
            <p class="hint"></p>
            <div class="list"></div>
          </div>`
            )
            .join("")}`;
        const form = document.createElement("ha-form");
        form.computeLabel = (s) => t(this._lang(), s.name);
        form.addEventListener("value-changed", (ev) => this._formChanged(ev.detail.value));
        this.shadowRoot.querySelector(".form").appendChild(form);
        this._form = form;
        this.shadowRoot
          .querySelector(".vehicle select")
          .addEventListener("change", (ev) => this._formChanged({ device_id: ev.target.value }));
        this.shadowRoot
          .querySelector(".language select")
          .addEventListener("change", (ev) => this._emit({ ...this._config, language: ev.target.value === "auto" ? undefined : ev.target.value }));
        this.shadowRoot
          .querySelector(".maps select")
          .addEventListener("change", (ev) => this._emit({ ...this._config, maps: ev.target.value === "auto" ? undefined : ev.target.value }));
        this.shadowRoot.querySelectorAll(".section").forEach((sec) => {
          const key = sec.dataset.key;
          sec.querySelector('[data-act="defaults"]').addEventListener("click", () => this._setDefaults(key));
          sec.querySelector('[data-act="none"]').addEventListener("click", () => this._emit({ ...this._config, [key]: [] }));
        });
        this._rendered = true;
      }
      const hass = this._hass;
      const lang = this._lang();
      const vehicles = fpcVehicles(hass);
      const current = this._vehicle();
      this.shadowRoot.querySelector(".vehicle span").textContent = t(lang, "vehicle");
      this.shadowRoot.querySelector(".vehicle select").innerHTML = vehicles.length
        ? vehicles
            .map((v) => `<option value="${esc(v.id)}"${current && current.id === v.id ? " selected" : ""}>${esc(v.name)}</option>`)
            .join("")
        : `<option value="">${esc(t(lang, "no_vehicle"))}</option>`;
      const chosen = this._config.language || "auto";
      this.shadowRoot.querySelector(".language span").textContent = t(lang, "language");
      this.shadowRoot.querySelector(".language select").innerHTML = [
        `<option value="auto"${chosen === "auto" ? " selected" : ""}>${esc(t(lang, "language_auto"))}</option>`,
        ...FPC_LANGS.map((l) => `<option value="${l}"${chosen === l ? " selected" : ""}>${esc(FPC_LANG_NAMES[l])}</option>`),
      ].join("");
      const mapsChosen = this._config.maps || "auto";
      const mapsNames = { auto: t(lang, "maps_auto"), apple: "Apple Maps", google: "Google Maps", waze: "Waze" };
      this.shadowRoot.querySelector(".maps span").textContent = t(lang, "maps");
      this.shadowRoot.querySelector(".maps select").innerHTML = FPC_MAPS.map(
        (m) => `<option value="${m}"${mapsChosen === m ? " selected" : ""}>${esc(mapsNames[m])}</option>`
      ).join("");
      this.shadowRoot.querySelectorAll(".section").forEach((sec) => {
        const def = FPC_SECTIONS[sec.dataset.key];
        sec.querySelector("h3").textContent = t(lang, def.title);
        sec.querySelector(".hint").textContent = t(lang, def.hint);
        sec.querySelector('[data-act="defaults"]').textContent = t(lang, "defaults");
        sec.querySelector('[data-act="none"]').textContent = t(lang, "none");
      });
      this._form.hass = hass;
      this._form.schema = this._schema();
      this._form.data = this._config;
      this._renderLists();
    }

    _vehicle() {
      return fpcVehicle(this._hass, this._config.device_id);
    }

    _formChanged(value) {
      const next = { ...this._config, ...value };
      if (next.columns !== undefined) next.columns = Number(next.columns) || undefined;
      if (value.device_id !== undefined && value.device_id !== this._config.device_id) {
        const v = fpcVehicle(this._hass, value.device_id);
        next.entities = fpcDefaultEntities(this._hass, v);
        next.controls = fpcDefaultControls(this._hass, v);
      }
      this._emit(next);
      this._form.data = this._config;
    }

    _setDefaults(key) {
      this._emit({ ...this._config, [key]: FPC_SECTIONS[key].defaults(this._hass, this._vehicle()) });
    }

    _currentItems(key) {
      if (this._config[key]) return fpcItems(this._config[key]);
      return FPC_SECTIONS[key].defaults(this._hass, this._vehicle()).map((entity) => ({ entity }));
    }

    _saveItems(key, items) {
      const list = items.map((i) => {
        const extra = { ...i };
        delete extra.entity;
        return Object.keys(extra).length ? { entity: i.entity, ...extra } : i.entity;
      });
      this._emit({ ...this._config, [key]: list });
    }

    _renderLists() {
      Object.keys(FPC_SECTIONS).forEach((key) => this._renderList(key));
    }

    _renderList(key) {
      const root = this.shadowRoot;
      if (!root) return;
      const listEl = root.querySelector(`.section[data-key="${key}"] .list`);
      if (!listEl) return;
      const hass = this._hass;
      const lang = this._lang();
      const vehicle = this._vehicle();
      if (!vehicle) {
        listEl.innerHTML = `<div class="row"><span></span><span class="notice">${esc(t(lang, "no_vehicle"))}</span><span></span></div>`;
        return;
      }
      const def = FPC_SECTIONS[key];
      const items = this._currentItems(key);
      const selected = items.map((i) => i.entity);
      const all = fpcListable(hass, vehicle, lang, def.domains, def.defaults(hass, vehicle));
      const known = new Map(all.map((a) => [a.entity, a]));
      const rows = [
        ...items.map((i) => ({ entity: i.entity, custom: i.name || "", on: true, meta: known.get(i.entity) })),
        ...all.filter((a) => !selected.includes(a.entity)).map((a) => ({ entity: a.entity, custom: "", on: false, meta: a })),
      ];

      listEl.innerHTML = rows
        .map((row) => {
          const name = row.meta ? row.meta.name : fpcName(hass, row.entity, vehicle.name, lang);
          const pos = row.on ? selected.indexOf(row.entity) : -1;
          return `<div class="row${row.on ? " on" : ""}" data-entity="${esc(row.entity)}">
            <input type="checkbox" ${row.on ? "checked" : ""} aria-label="${esc(name)}">
            <div class="label">
              <div class="n">${esc(name)}${row.meta && row.meta.diagnostic ? `<span class="tag">${esc(t(lang, "diagnostic"))}</span>` : ""}</div>
              <div class="e">${esc(row.entity)}</div>
            </div>
            ${row.on
              ? `<div class="move">
                  <button type="button" data-dir="-1" title="${esc(t(lang, "up"))}" ${pos === 0 ? "disabled" : ""}>▲</button>
                  <button type="button" data-dir="1" title="${esc(t(lang, "down"))}" ${pos === selected.length - 1 ? "disabled" : ""}>▼</button>
                </div>
                <input class="rename" type="text" value="${esc(row.custom)}" placeholder="${esc(t(lang, "name_placeholder"))}">`
              : "<span></span>"}
          </div>`;
        })
        .join("");

      listEl.querySelectorAll(".row").forEach((rowEl) => {
        const entity = rowEl.dataset.entity;
        const box = rowEl.querySelector('input[type="checkbox"]');
        const toggle = () => {
          const cur = this._currentItems(key);
          if (cur.some((i) => i.entity === entity)) this._saveItems(key, cur.filter((i) => i.entity !== entity));
          else this._saveItems(key, [...cur, { entity }]);
        };
        box.addEventListener("change", toggle);
        rowEl.querySelector(".label").addEventListener("click", toggle);
        rowEl.querySelectorAll("[data-dir]").forEach((b) =>
          b.addEventListener("click", () => {
            const cur = this._currentItems(key);
            const i = cur.findIndex((x) => x.entity === entity);
            const j = i + Number(b.dataset.dir);
            if (i < 0 || j < 0 || j >= cur.length) return;
            [cur[i], cur[j]] = [cur[j], cur[i]];
            this._saveItems(key, cur);
          })
        );
        const rename = rowEl.querySelector(".rename");
        if (rename) {
          rename.addEventListener("change", () => {
            const cur = this._currentItems(key);
            const it = cur.find((x) => x.entity === entity);
            if (!it) return;
            const v = rename.value.trim();
            if (v) it.name = v;
            else delete it.name;
            this._saveItems(key, cur);
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
      description: "Vehicle card for the FordPass integration: auto-detects your vehicle, lock/unlock, remote start and climate, sensors picked from a list, GPS navigation, doors-open picture.",
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
