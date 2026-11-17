/*!
 * FordPass Card
 * A Lovelace card for vehicles connected through the FordPass integration
 * (https://github.com/marq24/ha-fordpass).
 * MIT License. Not affiliated with, endorsed by or sponsored by Ford Motor Company.
 */
(() => {
  const FPC_VERSION = "0.6.0";
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

  // ---------- Details pop-up dictionaries ----------

  // Attribute names (lower case) shown in the details pop-up
  const FPC_ATTR = {
    frontleft: ["Front left", "Anteriore sinistro", "Delantero izquierdo", "Avant gauche", "Vorne links"],
    frontright: ["Front right", "Anteriore destro", "Delantero derecho", "Avant droit", "Vorne rechts"],
    rearleft: ["Rear left", "Posteriore sinistro", "Trasero izquierdo", "Arrière gauche", "Hinten links"],
    rearright: ["Rear right", "Posteriore destro", "Trasero derecho", "Arrière droit", "Hinten rechts"],
    driver: ["Driver", "Guidatore", "Conductor", "Conducteur", "Fahrer"],
    passenger: ["Passenger", "Passeggero", "Acompañante", "Passager", "Beifahrer"],
    systemstate: ["System", "Sistema", "Sistema", "Système", "System"],
    batteryvoltage: ["Voltage", "Tensione", "Tensión", "Tension", "Spannung"],
    batteryloadstatus: ["Load status", "Stato di carico", "Estado de carga", "État de charge", "Ladezustand"],
    fuelrange: ["Range", "Autonomia", "Autonomía", "Autonomie", "Reichweite"],
    ambienttemp: ["Outside temperature", "Temperatura esterna", "Temperatura exterior", "Température extérieure", "Außentemperatur"],
    acceleration: ["Acceleration", "Accelerazione", "Aceleración", "Accélération", "Beschleunigung"],
    sensortype: ["Sensor type", "Tipo sensore", "Tipo de sensor", "Type de capteur", "Sensortyp"],
    acceleratorpedalposition: ["Accelerator pedal", "Pedale acceleratore", "Pedal del acelerador", "Pédale d'accélérateur", "Gaspedal"],
    brakepedalstatus: ["Brake pedal", "Pedale del freno", "Pedal de freno", "Pédale de frein", "Bremspedal"],
    braketorque: ["Brake torque", "Coppia frenante", "Par de frenado", "Couple de freinage", "Bremsmoment"],
    parkingbrakestatus: ["Parking brake", "Freno di stazionamento", "Freno de mano", "Frein de stationnement", "Feststellbremse"],
    torqueattransmission: ["Transmission torque", "Coppia al cambio", "Par en la transmisión", "Couple à la transmission", "Getriebemoment"],
    wheeltorquestatus: ["Wheel torque", "Coppia alle ruote", "Par en las ruedas", "Couple aux roues", "Radmoment"],
    yawrate: ["Yaw rate", "Velocità d'imbardata", "Velocidad de guiñada", "Vitesse de lacet", "Gierrate"],
    enginespeed: ["Engine speed", "Giri motore", "Régimen del motor", "Régime moteur", "Motordrehzahl"],
    tripfueleconomy: ["Trip fuel economy", "Consumo del viaggio", "Consumo del viaje", "Consommation du trajet", "Verbrauch der Fahrt"],
    location: ["Position", "Posizione", "Ubicación", "Position", "Position"],
    lat: ["Latitude", "Latitudine", "Latitud", "Latitude", "Breitengrad"],
    latitude: ["Latitude", "Latitudine", "Latitud", "Latitude", "Breitengrad"],
    lon: ["Longitude", "Longitudine", "Longitud", "Longitude", "Längengrad"],
    longitude: ["Longitude", "Longitudine", "Longitud", "Longitude", "Längengrad"],
    alt: ["Altitude", "Altitudine", "Altitud", "Altitude", "Höhe"],
    altitude: ["Altitude", "Altitudine", "Altitud", "Altitude", "Höhe"],
    gpsdimension: ["GPS fix", "Fix GPS", "Fix GPS", "Fix GPS", "GPS-Fix"],
    gpscoordinatemethod: ["Method", "Metodo", "Método", "Méthode", "Methode"],
    gpsmoduletimestamp: ["GPS time", "Ora GPS", "Hora GPS", "Heure GPS", "GPS-Zeit"],
    compassdirection: ["Heading", "Direzione", "Dirección", "Direction", "Richtung"],
    gps_accuracy: ["Accuracy", "Precisione", "Precisión", "Précision", "Genauigkeit"],
    pdop: ["Precision (PDOP)", "Precisione (PDOP)", "Precisión (PDOP)", "Précision (PDOP)", "Genauigkeit (PDOP)"],
    hdop: ["Horizontal precision (HDOP)", "Precisione orizzontale (HDOP)", "Precisión horizontal (HDOP)", "Précision horizontale (HDOP)", "Horizontale Genauigkeit (HDOP)"],
    vdop: ["Vertical precision (VDOP)", "Precisione verticale (VDOP)", "Precisión vertical (VDOP)", "Précision verticale (VDOP)", "Vertikale Genauigkeit (VDOP)"],
    gdop: ["Geometric precision (GDOP)", "Precisione geometrica (GDOP)", "Precisión geométrica (GDOP)", "Précision géométrique (GDOP)", "Geometrische Genauigkeit (GDOP)"],
    in_zones: ["Zones", "Zone", "Zonas", "Zones", "Zonen"],
    source_type: ["Source", "Fonte", "Fuente", "Source", "Quelle"],
    tracking_type: ["Tracking", "Tracciamento", "Seguimiento", "Suivi", "Ortung"],
    panicalarmstatus: ["Panic alarm", "Allarme panico", "Alarma de pánico", "Alarme panique", "Panikalarm"],
    alarm_source: ["Triggered by", "Origine", "Origen", "Origine", "Auslöser"],
    type: ["Type", "Tipo", "Tipo", "Type", "Typ"],
    dieselexhaustovertemp: ["Exhaust over-temperature", "Sovratemperatura scarico", "Sobretemperatura del escape", "Surchauffe échappement", "Abgas-Übertemperatur"],
    dieselparticulatefiltersootlevel: ["DPF soot level", "Livello particolato DPF", "Nivel de hollín DPF", "Niveau de suie FAP", "DPF-Rußbeladung"],
    dieselexhaustfluidrange: ["AdBlue range", "Autonomia AdBlue", "Autonomía AdBlue", "Autonomie AdBlue", "AdBlue-Reichweite"],
    dieselexhaustfluidlow: ["AdBlue low", "AdBlue basso", "AdBlue bajo", "AdBlue bas", "AdBlue niedrig"],
    dieselexhaustfluidsystemfault: ["AdBlue system fault", "Guasto sistema AdBlue", "Fallo del sistema AdBlue", "Défaut système AdBlue", "AdBlue-Systemfehler"],
    firmwareversion: ["Firmware version", "Versione firmware", "Versión de firmware", "Version du firmware", "Firmware-Version"],
    updatedecus: ["Updated modules", "Moduli aggiornati", "Módulos actualizados", "Modules mis à jour", "Aktualisierte Steuergeräte"],
    ecuid: ["Module", "Modulo", "Módulo", "Module", "Steuergerät"],
    partnumber: ["Part number", "Codice ricambio", "Referencia", "Référence", "Teilenummer"],
    nickname: ["Nickname", "Soprannome", "Apodo", "Surnom", "Spitzname"],
    licenseplate: ["Licence plate", "Targa", "Matrícula", "Plaque", "Kennzeichen"],
    vin: ["VIN", "Telaio (VIN)", "Bastidor (VIN)", "VIN", "FIN"],
    color: ["Colour", "Colore", "Color", "Couleur", "Farbe"],
    modelyear: ["Model year", "Anno modello", "Año del modelo", "Année modèle", "Modelljahr"],
    history: ["History", "Cronologia", "Historial", "Historique", "Verlauf"],
    value: ["Value", "Valore", "Valor", "Valeur", "Wert"],
    lowerbound: ["Min", "Min", "Mín", "Min", "Min"],
    upperbound: ["Max", "Max", "Máx", "Max", "Max"],
  };

  // Door names (lower case); used for door and lock sensors
  const FPC_DOORS = {
    driverfront: ["Driver door", "Porta guidatore", "Puerta del conductor", "Porte conducteur", "Fahrertür"],
    passengerfront: ["Passenger door", "Porta passeggero", "Puerta del acompañante", "Porte passager", "Beifahrertür"],
    driverrear: ["Rear door, driver side", "Porta post. lato guida", "Puerta trasera, lado conductor", "Porte arrière côté conducteur", "Hintertür Fahrerseite"],
    passengerrear: ["Rear door, passenger side", "Porta post. lato passeggero", "Puerta trasera, lado acompañante", "Porte arrière côté passager", "Hintertür Beifahrerseite"],
    rearleft: ["Rear left door", "Porta posteriore sinistra", "Puerta trasera izquierda", "Porte arrière gauche", "Tür hinten links"],
    rearright: ["Rear right door", "Porta posteriore destra", "Puerta trasera derecha", "Porte arrière droite", "Tür hinten rechts"],
    tailgate: ["Tailgate", "Portellone", "Portón trasero", "Hayon", "Heckklappe"],
    innertailgate: ["Inner tailgate", "Portellone interno", "Portón interior", "Hayon intérieur", "Innere Heckklappe"],
    hood: ["Bonnet", "Cofano", "Capó", "Capot", "Motorhaube"],
    frunk: ["Front trunk", "Bagagliaio anteriore", "Maletero delantero", "Coffre avant", "Frunk"],
    alldoors: ["All doors", "Tutte le porte", "Todas las puertas", "Toutes les portes", "Alle Türen"],
  };

  // Attribute values (upper case) in singular form for the details pop-up; FPC_STATES is the fallback
  const FPC_VALUES = {
    NORMAL: ["Normal", "Normale", "Normal", "Normal", "Normal"],
    NORMAL_OPERATION: ["Normal", "Normale", "Normal", "Normal", "Normal"],
    LOW: ["Low", "Bassa", "Baja", "Basse", "Niedrig"],
    HIGH: ["High", "Alta", "Alta", "Haute", "Hoch"],
    OPEN: ["Open", "Aperto", "Abierto", "Ouvert", "Offen"],
    CLOSED: ["Closed", "Chiuso", "Cerrado", "Fermé", "Geschlossen"],
    LOCKED: ["Locked", "Bloccato", "Bloqueado", "Verrouillé", "Verriegelt"],
    UNLOCKED: ["Unlocked", "Sbloccato", "Desbloqueado", "Déverrouillé", "Entriegelt"],
    BUCKLED: ["Fastened", "Allacciata", "Abrochado", "Attachée", "Angelegt"],
    UNBUCKLED: ["Not fastened", "Slacciata", "Desabrochado", "Détachée", "Nicht angelegt"],
    UNDEFINED: ["Not set", "Non definito", "No definido", "Non défini", "Nicht definiert"],
    ACTUAL: ["Actual", "Reale", "Real", "Réelle", "Tatsächlich"],
    DIM_2D: ["2D", "2D", "2D", "2D", "2D"],
    DIM_3D: ["3D", "3D", "3D", "3D", "3D"],
    NORTH: ["North", "Nord", "Norte", "Nord", "Nord"],
    SOUTH: ["South", "Sud", "Sur", "Sud", "Süd"],
    EAST: ["East", "Est", "Este", "Est", "Ost"],
    WEST: ["West", "Ovest", "Oeste", "Ouest", "West"],
    NORTH_EAST: ["North-east", "Nord-est", "Noreste", "Nord-est", "Nordost"],
    NORTH_WEST: ["North-west", "Nord-ovest", "Noroeste", "Nord-ouest", "Nordwest"],
    SOUTH_EAST: ["South-east", "Sud-est", "Sureste", "Sud-est", "Südost"],
    SOUTH_WEST: ["South-west", "Sud-ovest", "Suroeste", "Sud-ouest", "Südwest"],
    NORTHEAST: ["North-east", "Nord-est", "Noreste", "Nord-est", "Nordost"],
    NORTHWEST: ["North-west", "Nord-ovest", "Noroeste", "Nord-ouest", "Nordwest"],
    SOUTHEAST: ["South-east", "Sud-est", "Sureste", "Sud-est", "Südost"],
    SOUTHWEST: ["South-west", "Sud-ovest", "Suroeste", "Sud-ouest", "Südwest"],
    MECHANICAL: ["Mechanical", "Meccanico", "Mecánico", "Mécanique", "Mechanisch"],
    ELECTRIC: ["Electric", "Elettrico", "Eléctrico", "Électrique", "Elektrisch"],
  };

  const FPC_LIGHT = {
    on: ["On", "Accesa", "Encendido", "Allumé", "An"],
    off: ["Off", "Spenta", "Apagado", "Éteint", "Aus"],
  };

  // Dashboard warning lights from the FordPass "indicators" sensor (code suffix removed)
  const FPC_INDICATORS = {
    adaptivecruisecontrol: ["Adaptive cruise control", "Cruise control adattivo", "Control de crucero adaptativo", "Régulateur adaptatif", "Abstandsregeltempomat"],
    airfilterminder: ["Air filter", "Filtro aria", "Filtro de aire", "Filtre à air", "Luftfilter"],
    airsuspensionridecontrolfault: ["Air suspension fault", "Guasto sospensioni pneumatiche", "Fallo de la suspensión neumática", "Défaut suspension pneumatique", "Luftfederung gestört"],
    allwheeldrivedisabled: ["AWD disabled", "Trazione integrale disattivata", "Tracción total desactivada", "Transmission intégrale désactivée", "Allradantrieb deaktiviert"],
    antitheft: ["Anti-theft", "Antifurto", "Antirrobo", "Antivol", "Diebstahlschutz"],
    antilockbrake: ["ABS", "ABS", "ABS", "ABS", "ABS"],
    blindspotdetection: ["Blind spot detection", "Monitoraggio angolo cieco", "Detector de ángulo muerto", "Détection d'angle mort", "Toter-Winkel-Assistent"],
    brakewarning: ["Brake warning", "Spia freni", "Testigo de freno", "Alerte freins", "Bremswarnung"],
    chargesystemfault: ["Charging system fault", "Guasto sistema di ricarica", "Fallo del sistema de carga", "Défaut système de charge", "Ladesystem gestört"],
    checkfuelcap: ["Check fuel cap", "Controlla tappo carburante", "Revisar tapón de combustible", "Vérifier le bouchon", "Tankdeckel prüfen"],
    checkfuelfillinlet: ["Check fuel filler", "Controlla bocchettone", "Revisar boca de llenado", "Vérifier la goulotte", "Tankstutzen prüfen"],
    dieselengineidleshutdown: ["Diesel idle shutdown", "Spegnimento al minimo", "Apagado al ralentí", "Arrêt au ralenti", "Leerlaufabschaltung"],
    dieselenginewarning: ["Diesel engine warning", "Avviso motore diesel", "Aviso motor diésel", "Alerte moteur diesel", "Dieselmotor-Warnung"],
    dieselexhaustfluidlow: ["AdBlue low", "AdBlue basso", "AdBlue bajo", "AdBlue bas", "AdBlue niedrig"],
    dieselexhaustfluidsystemfault: ["AdBlue system fault", "Guasto sistema AdBlue", "Fallo del sistema AdBlue", "Défaut système AdBlue", "AdBlue-Systemfehler"],
    dieselexhaustovertemp: ["Exhaust over-temperature", "Sovratemperatura scarico", "Sobretemperatura del escape", "Surchauffe échappement", "Abgas-Übertemperatur"],
    dieselparticulatefilter: ["Diesel particulate filter", "Filtro antiparticolato (DPF)", "Filtro de partículas", "Filtre à particules", "Dieselpartikelfilter"],
    dieselpreheat: ["Glow plugs", "Candelette", "Precalentamiento", "Préchauffage", "Vorglühen"],
    electrictrailerbrakeconnection: ["Trailer brake connection", "Collegamento freno rimorchio", "Conexión freno del remolque", "Connexion frein de remorque", "Anhängerbremse Verbindung"],
    electronicparkingbrakewarning: ["Electronic parking brake", "Freno di stazionamento elettrico", "Freno de estacionamiento eléctrico", "Frein de stationnement électrique", "Elektrische Feststellbremse"],
    enginecoolantovertemp: ["Coolant over-temperature", "Surriscaldamento refrigerante", "Sobretemperatura del refrigerante", "Surchauffe liquide de refroidissement", "Kühlmittel-Übertemperatur"],
    fastenseatbeltwarning: ["Fasten seat belt", "Allacciare le cinture", "Abrochar el cinturón", "Attacher la ceinture", "Gurt anlegen"],
    forwardcollisionwarning: ["Forward collision warning", "Avviso collisione frontale", "Alerta de colisión frontal", "Alerte de collision avant", "Kollisionswarnung"],
    fueldooropen: ["Fuel door open", "Sportello carburante aperto", "Tapa de combustible abierta", "Trappe à carburant ouverte", "Tankklappe offen"],
    gasparticulatefilterwarning: ["Petrol particulate filter", "Filtro antiparticolato benzina", "Filtro de partículas gasolina", "Filtre à particules essence", "Ottopartikelfilter"],
    genericabsfaultwarning: ["ABS fault", "Guasto ABS", "Fallo del ABS", "Défaut ABS", "ABS-Störung"],
    hevhazard: ["Hybrid system hazard", "Pericolo sistema ibrido", "Peligro del sistema híbrido", "Danger système hybride", "Hybridsystem-Gefahr"],
    hilldescentcontrolfault: ["Hill descent control fault", "Guasto controllo discesa", "Fallo del control de descenso", "Défaut aide à la descente", "Bergabfahrhilfe gestört"],
    hillstartassistwarning: ["Hill start assist", "Assistenza partenza in salita", "Asistente de arranque en pendiente", "Aide au démarrage en côte", "Berganfahrassistent"],
    lanekeepingaid: ["Lane keeping aid", "Mantenimento corsia", "Asistente de carril", "Aide au maintien de voie", "Spurhalteassistent"],
    lightingsystemfailure: ["Lighting failure", "Guasto luci", "Fallo de iluminación", "Défaut d'éclairage", "Beleuchtungsstörung"],
    lowbrakefluid: ["Low brake fluid", "Liquido freni basso", "Líquido de frenos bajo", "Liquide de frein bas", "Bremsflüssigkeit niedrig"],
    lowengineoilpressure: ["Low oil pressure", "Pressione olio bassa", "Presión de aceite baja", "Pression d'huile basse", "Öldruck niedrig"],
    lowfuel: ["Low fuel", "Riserva carburante", "Combustible bajo", "Carburant bas", "Kraftstoff niedrig"],
    lowwasherfluid: ["Low washer fluid", "Liquido lavavetri basso", "Líquido limpiaparabrisas bajo", "Lave-glace bas", "Waschwasser niedrig"],
    malfunctionindicator: ["Engine malfunction", "Spia avaria motore", "Avería del motor", "Défaut moteur", "Motorkontrollleuchte"],
    parkaidmalfunction: ["Park aid fault", "Guasto sensori di parcheggio", "Fallo ayuda al aparcamiento", "Défaut aide au stationnement", "Einparkhilfe gestört"],
    passiveentrypassivestart: ["Keyless entry and start", "Accesso e avviamento senza chiave", "Acceso y arranque sin llave", "Accès et démarrage sans clé", "Schlüsselloser Zugang"],
    powertrainmalfunction: ["Powertrain fault", "Guasto gruppo propulsore", "Fallo del tren motriz", "Défaut groupe motopropulseur", "Antriebsstörung"],
    restraintsindicatorwarning: ["Airbag and restraints", "Airbag e sistemi di ritenuta", "Airbag y sujeción", "Airbag et retenue", "Airbag und Rückhaltesysteme"],
    servicesteering: ["Service steering", "Assistenza sterzo", "Revisar dirección", "Réviser la direction", "Lenkung prüfen"],
    startstopenginewarning: ["Start/stop warning", "Avviso Start&Stop", "Aviso Start/Stop", "Alerte Start/Stop", "Start/Stopp-Warnung"],
    tractioncontroldisabled: ["Traction control off", "Controllo trazione disattivato", "Control de tracción desactivado", "Antipatinage désactivé", "Traktionskontrolle aus"],
    tractioncontrolevent: ["Traction control active", "Intervento controllo trazione", "Control de tracción activo", "Antipatinage actif", "Traktionskontrolle aktiv"],
    tirepressuremonitorsystemwarning: ["Tyre pressure warning", "Avviso pressione pneumatici", "Aviso de presión de neumáticos", "Alerte pression des pneus", "Reifendruckwarnung"],
    waterinfuel: ["Water in fuel", "Acqua nel gasolio", "Agua en el combustible", "Eau dans le carburant", "Wasser im Kraftstoff"],
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
      details_updated: "Updated",
      details_history: "History",
      details_close: "Close",
      details_more: "{n} more values not shown",
      details_on: "Warnings on",
      details_others: "Other warning lights",
      details_none_on: "No warning light on",
      details_maps: "Open in Maps",
      yes: "Yes",
      no: "No",
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
      details_updated: "Aggiornato",
      details_history: "Cronologia",
      details_close: "Chiudi",
      details_more: "Altri {n} valori non mostrati",
      details_on: "Spie accese",
      details_others: "Altre spie",
      details_none_on: "Nessuna spia accesa",
      details_maps: "Apri in Mappe",
      yes: "Sì",
      no: "No",
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
      details_updated: "Actualizado",
      details_history: "Historial",
      details_close: "Cerrar",
      details_more: "{n} valores más sin mostrar",
      details_on: "Testigos encendidos",
      details_others: "Otros testigos",
      details_none_on: "Ningún testigo encendido",
      details_maps: "Abrir en Mapas",
      yes: "Sí",
      no: "No",
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
      details_updated: "Mis à jour",
      details_history: "Historique",
      details_close: "Fermer",
      details_more: "{n} autres valeurs non affichées",
      details_on: "Témoins allumés",
      details_others: "Autres témoins",
      details_none_on: "Aucun témoin allumé",
      details_maps: "Ouvrir dans Plans",
      yes: "Oui",
      no: "Non",
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
      details_updated: "Aktualisiert",
      details_history: "Verlauf",
      details_close: "Schließen",
      details_more: "{n} weitere Werte ausgeblendet",
      details_on: "Aktive Warnleuchten",
      details_others: "Weitere Warnleuchten",
      details_none_on: "Keine Warnleuchte aktiv",
      details_maps: "In Karten öffnen",
      yes: "Ja",
      no: "Nein",
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

  // ---------- Details pop-up: attributes in plain language ----------

  // Attributes that Home Assistant or FordPass add for internal use
  const FPC_SKIP_ATTRS = new Set([
    "friendly_name", "icon", "unit_of_measurement", "device_class", "state_class", "options",
    "entity_picture", "access_token", "attribution", "supported_features", "restored", "editable",
    "assumed_state", "oemcorrelationid", "commandid", "updatetime", "tracking_type", "source_type",
  ]);
  const FPC_DETAIL_MAX = 150;

  const fpcLow = (k) => String(k).toLowerCase();
  const fpcIsObj = (v) => v !== null && typeof v === "object" && !Array.isArray(v);
  const fpcIsPrim = (v) => v === null || ["string", "number", "boolean"].includes(typeof v);

  // "frontLeft_state" -> "Front left state", "NORMAL_OPERATION" -> "Normal operation"
  function fpcHuman(k) {
    const s = String(k)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim()
      .toLowerCase();
    return s ? s[0].toUpperCase() + s.slice(1) : String(k);
  }

  function fpcAttrLabel(k, lang, doors) {
    const low = fpcLow(k);
    const row = (doors && FPC_DOORS[low]) || FPC_ATTR[low] || FPC_DOORS[low];
    return row ? tr(row, lang) : fpcHuman(k);
  }

  function fpcAttrUnit(hass, low) {
    const us = (hass.config && hass.config.unit_system) || {};
    if (low === "batteryvoltage") return "V";
    if (low === "dieselparticulatefiltersootlevel") return "%";
    if (low === "gps_accuracy" || low === "alt" || low === "altitude") return "m";
    if (low === "ambienttemp") return us.temperature || "";
    if ((low === "fuelrange" || low === "dieselexhaustfluidrange") && us.length === "km") return "km";
    return "";
  }

  function fpcDate(d, loc) {
    try {
      return d.toLocaleString(loc, { dateStyle: "medium", timeStyle: "short" });
    } catch (e) {
      return d.toLocaleString();
    }
  }

  function fpcAgo(d, lang, loc) {
    const sec = Math.round((d.getTime() - Date.now()) / 1000);
    const abs = Math.abs(sec);
    let rtf;
    try {
      rtf = new Intl.RelativeTimeFormat(loc || lang, { numeric: "auto" });
    } catch (e) {
      return fpcDate(d, loc);
    }
    if (abs < 60) return rtf.format(sec, "second");
    if (abs < 3600) return rtf.format(Math.round(sec / 60), "minute");
    if (abs < 86400) return rtf.format(Math.round(sec / 3600), "hour");
    if (abs < 86400 * 30) return rtf.format(Math.round(sec / 86400), "day");
    return fpcDate(d, loc);
  }

  function fpcAttrValue(hass, v, lang, k) {
    if (v === null || v === undefined || v === "") return "—";
    const loc = (hass.locale && hass.locale.language) || lang;
    if (typeof v === "boolean") return t(lang, v ? "yes" : "no");
    if (typeof v === "number") {
      const low = fpcLow(k || "");
      const digits = /^(lat|lon|lng|latitude|longitude)$/.test(low) ? 6 : 2;
      let s;
      try {
        s = new Intl.NumberFormat(loc, { maximumFractionDigits: digits }).format(v);
      } catch (e) {
        s = String(v);
      }
      const unit = fpcAttrUnit(hass, low);
      return unit ? `${s} ${unit}` : s;
    }
    if (Array.isArray(v)) return v.length ? v.map((x) => fpcAttrValue(hass, x, lang, k)).join(", ") : "—";
    if (typeof v === "object") return JSON.stringify(v);
    const s = String(v);
    if (/^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}/.test(s)) {
      const d = new Date(s);
      if (!isNaN(d)) return fpcDate(d, loc);
    }
    if (/^zone\.[a-z0-9_]+$/.test(s) && hass.states[s]) return hass.states[s].attributes.friendly_name || s;
    if (/^[A-Z][A-Z0-9_]*$/.test(s)) {
      const row = (k && FPC_STATES[`${fpcLow(k)}:${s}`]) || FPC_VALUES[s] || FPC_STATES[s];
      return row ? tr(row, lang) : fpcHuman(s);
    }
    return s;
  }

  // Dot colour for a value: green for normal/closed/locked, red for open/unlocked, orange for faults
  function fpcAttrColor(v, k) {
    if (typeof v === "boolean") {
      return v && /fault|warn|low|overtemp|malfunction|open|failure/i.test(k || "") ? WARN : null;
    }
    const s = String(v == null ? "" : v).toUpperCase();
    if (["LOCKED", "CLOSED", "NORMAL", "NORMAL_OPERATION"].includes(s)) return GOOD;
    if (["OPEN", "UNLOCKED"].includes(s)) return BAD;
    if (["PARTLY_LOCKED", "LOW", "HIGH"].includes(s) || /FAULT|WARNING|LOW_PRESSURE|HIGH_PRESSURE/.test(s)) return WARN;
    return null;
  }

  // {lowerBound, upperBound} (also wrapped, e.g. {doubleRange: {...}}) -> a single value
  function fpcRange(v, key, lang) {
    while (fpcIsObj(v) && Object.keys(v).length === 1 && fpcIsObj(Object.values(v)[0])) v = Object.values(v)[0];
    if (!fpcIsObj(v) || !("lowerBound" in v || "upperBound" in v)) return null;
    const lo = Number(v.lowerBound);
    const hi = Number(v.upperBound);
    if (key === "windowposition") {
      if (!lo && !hi) return { text: tr(FPC_VALUES.CLOSED, lang), color: GOOD };
      return { text: `${tr(FPC_VALUES.OPEN, lang)} · ${lo === hi ? hi : `${lo}–${hi}`}`, color: BAD };
    }
    return { text: lo === hi ? String(hi) : `${lo} – ${hi}`, color: null };
  }

  // Build the pop-up content: { sections: [{ title, folded, rows: [{label, value, color, note}] }], more, updated }
  function fpcDetails(hass, st, key, lang) {
    const attrs = (st && st.attributes) || {};
    const doors = key === "doorstatus" || key === "doorlock";
    let left = FPC_DETAIL_MAX;
    let more = 0;
    const push = (sec, r) => {
      if (left <= 0) {
        more++;
        return;
      }
      left--;
      sec.rows.push(r);
    };
    const main = { title: "", rows: [] };
    const sections = [main];
    const done = new Set();

    // Lift wrappers ("value": {...}, "tags": {...}) to the top level
    const top = [];
    for (const [k, v] of Object.entries(attrs)) {
      const low = fpcLow(k);
      if (FPC_SKIP_ATTRS.has(low)) continue;
      if ((low === "value" || low === "tags") && fpcIsObj(v)) {
        for (const [k2, v2] of Object.entries(v)) if (!FPC_SKIP_ATTRS.has(fpcLow(k2))) top.push([k2, v2]);
        continue;
      }
      if (low === "value" && fpcIsPrim(v) && st && (String(v) === String(st.state) || (v !== "" && Number(v) === Number(st.state)))) continue;
      top.push([k, v]);
    }

    if (key === "tirepressure") {
      for (const [k, v] of top) {
        if (!fpcIsPrim(v) || /_state$/i.test(k) || fpcLow(k) === "systemstate") continue;
        const stateKey = top.find(([k2]) => fpcLow(k2) === `${fpcLow(k)}_state`);
        const sv = stateKey ? stateKey[1] : null;
        push(main, {
          label: fpcAttrLabel(k, lang),
          value: fpcAttrValue(hass, v, lang, k),
          note: sv ? fpcAttrValue(hass, sv, lang) : "",
          color: sv ? fpcAttrColor(sv) : null,
        });
        done.add(k);
        if (stateKey) done.add(stateKey[0]);
      }
    }

    if (key === "indicators") {
      const on = [];
      const off = [];
      for (const [k, v] of top) {
        if (typeof v !== "boolean") continue;
        const base = fpcLow(k).replace(/_[0-9a-f]{4,}$/, "");
        const name = FPC_INDICATORS[base] ? tr(FPC_INDICATORS[base], lang) : fpcHuman(base);
        (v ? on : off).push(name);
        done.add(k);
      }
      const onSec = { title: t(lang, "details_on"), rows: [] };
      if (on.length) on.forEach((n) => push(onSec, { label: n, value: tr(FPC_LIGHT.on, lang), color: WARN }));
      else onSec.rows.push({ label: t(lang, "details_none_on"), value: "", color: GOOD });
      sections.push(onSec);
      if (off.length) {
        const offSec = { title: `${t(lang, "details_others")} (${off.length})`, folded: true, rows: [] };
        off.sort((a, b) => a.localeCompare(b)).forEach((n) => push(offSec, { label: n, value: tr(FPC_LIGHT.off, lang) }));
        sections.push(offSec);
      }
    }

    // Nested objects become "Parent · child" rows inside one section
    const flat = (sec, obj, prefix, depth) => {
      for (const [k, v0] of Object.entries(obj)) {
        if (FPC_SKIP_ATTRS.has(fpcLow(k))) continue;
        const label = (prefix ? `${prefix} · ` : "") + fpcAttrLabel(k, lang, doors);
        let v = v0;
        const range = fpcRange(v, key, lang);
        if (range) {
          push(sec, { label, value: range.text, color: range.color });
          continue;
        }
        while (fpcIsObj(v) && Object.keys(v).length === 1 && fpcIsObj(Object.values(v)[0])) v = Object.values(v)[0];
        if (fpcIsObj(v)) {
          if (depth >= 3) push(sec, { label, value: JSON.stringify(v) });
          else flat(sec, v, label, depth + 1);
        } else if (Array.isArray(v) && !v.every(fpcIsPrim)) {
          v.forEach((x, i) => {
            const l = v.length > 1 ? `${label} ${i + 1}` : label;
            if (fpcIsObj(x) && Object.values(x).every(fpcIsPrim)) {
              push(sec, { label: l, value: Object.values(x).map((y) => fpcAttrValue(hass, y, lang)).join(" · ") });
            } else if (fpcIsObj(x)) flat(sec, x, l, depth + 1);
            else push(sec, { label: l, value: fpcAttrValue(hass, x, lang) });
          });
        } else {
          push(sec, { label, value: fpcAttrValue(hass, v, lang, k), color: fpcAttrColor(v, k) });
        }
      }
    };

    for (const [k, v0] of top) {
      if (done.has(k)) continue;
      const label = fpcAttrLabel(k, lang, doors);
      let v = v0;
      const range = fpcRange(v, key, lang);
      if (range) {
        push(main, { label, value: range.text, color: range.color });
        continue;
      }
      while (fpcIsObj(v) && Object.keys(v).length === 1 && fpcIsObj(Object.values(v)[0])) v = Object.values(v)[0];
      if (fpcIsObj(v)) {
        const sec = { title: label, rows: [] };
        flat(sec, v, "", 1);
        if (sec.rows.length) sections.push(sec);
      } else if (Array.isArray(v) && v.length && !v.every(fpcIsPrim)) {
        const sec = { title: label, rows: [] };
        const pairs = v.every((x) => fpcIsObj(x) && Object.keys(x).length === 2 && Object.values(x).every(fpcIsPrim));
        if (pairs) {
          v.forEach((x) => {
            const [a, b] = Object.values(x);
            push(sec, { label: fpcAttrValue(hass, a, lang), value: fpcAttrValue(hass, b, lang) });
          });
        } else {
          const loc = (hass.locale && hass.locale.language) || lang;
          v.slice(0, 30).forEach((x, i) => {
            if (!fpcIsObj(x)) {
              push(sec, { label: String(i + 1), value: fpcAttrValue(hass, x, lang) });
              return;
            }
            const when = x.updateTime || x.timestamp || x.date || x.time;
            const d = when ? new Date(when) : null;
            const item = { title: d && !isNaN(d) ? `${label} · ${fpcDate(d, loc)}` : `${label} ${i + 1}`, rows: [] };
            flat(item, x, "", 1);
            if (item.rows.length) sections.push(item);
          });
          more += Math.max(0, v.length - 30);
        }
        if (sec.rows.length) sections.push(sec);
      } else {
        push(main, { label, value: fpcAttrValue(hass, v, lang, k), color: fpcAttrColor(v, k) });
      }
    }

    let updated = null;
    if (attrs.updateTime) {
      const d = new Date(attrs.updateTime);
      if (!isNaN(d)) updated = d;
    }
    return { sections: sections.filter((s) => s.rows.length), more, updated };
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

    .dlg {
      box-sizing: border-box;
      width: min(440px, calc(100vw - 24px));
      max-width: none;
      max-height: min(82vh, 760px);
      margin: auto;
      padding: 0;
      overflow: hidden;
      color: #fff;
      font-family: inherit;
      color-scheme: dark;
      border-radius: var(--fpc-radius, 28px);
      border: 1px solid rgba(255,255,255,0.10);
      background: var(--fpc-background,
        radial-gradient(circle at 50% 0%, rgba(100,140,255,0.20), transparent 60%),
        linear-gradient(145deg, rgba(22,25,34,0.99), rgba(8,10,14,0.99)));
      box-shadow: 0 24px 60px rgba(0,0,0,0.60), inset 0 1px 0 rgba(255,255,255,0.12);
    }
    .dlg:focus { outline: none; }
    .dlg[open] { display: flex; flex-direction: column; animation: fpc-in .22s ease; }
    .dlg::backdrop { background: rgba(0,0,0,0.55); -webkit-backdrop-filter: blur(6px); backdrop-filter: blur(6px); }
    @keyframes fpc-in { from { opacity: 0; transform: translateY(14px) scale(0.98); } to { opacity: 1; transform: none; } }
    .dhead { display: flex; align-items: center; gap: 12px; padding: 18px 18px 4px; }
    .dicon {
      flex: none; width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: rgba(255,255,255,0.08); --mdc-icon-size: 22px; color: rgba(255,255,255,0.85);
    }
    .dtitle { flex: 1; min-width: 0; }
    .dname { font-size: 17px; font-weight: 700; line-height: 22px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .dsub { font-size: 12px; line-height: 16px; color: rgba(255,255,255,0.55); }
    .dx {
      all: unset; flex: none; width: 32px; height: 32px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      background: rgba(255,255,255,0.08); color: rgba(255,255,255,0.8); font-size: 15px;
    }
    .dx:hover { background: rgba(255,255,255,0.14); }
    .dx:focus-visible, .dbtn:focus-visible { outline: 2px solid var(--primary-color, #03a9f4); outline-offset: 2px; }
    .dstate { padding: 6px 20px 14px; font-size: 26px; line-height: 32px; font-weight: 700; letter-spacing: -0.3px; }
    .dbody { flex: 1 1 auto; overflow-y: auto; overscroll-behavior: contain; -webkit-overflow-scrolling: touch; padding: 0 14px 4px; }
    .sec {
      margin: 0 0 12px; padding: 2px 14px;
      border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07);
    }
    .stitle {
      display: block; padding: 11px 0 3px;
      font-size: 11px; font-weight: 700; letter-spacing: 0.6px; text-transform: uppercase;
      color: rgba(255,255,255,0.50);
    }
    details.sec > summary { cursor: pointer; list-style: none; padding-bottom: 10px; }
    details.sec > summary::-webkit-details-marker { display: none; }
    details.sec > summary::after { content: " ▸"; }
    details.sec[open] > summary::after { content: " ▾"; }
    details.sec[open] > summary { padding-bottom: 3px; }
    .row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-top: 1px solid rgba(255,255,255,0.06); }
    .stitle + .row, .sec > .row:first-child { border-top: 0; }
    .dot { flex: none; width: 8px; height: 8px; border-radius: 50%; }
    .rl { flex: 1; min-width: 0; font-size: 14px; line-height: 18px; color: rgba(255,255,255,0.75); }
    .rv { max-width: 62%; text-align: right; font-size: 14px; line-height: 18px; font-weight: 600; overflow-wrap: anywhere; }
    .rv small { display: block; font-size: 11px; line-height: 14px; font-weight: 500; color: rgba(255,255,255,0.55); }
    .dmore { padding: 0 0 10px; text-align: center; font-size: 12px; color: rgba(255,255,255,0.50); }
    .dfoot { display: flex; gap: 8px; padding: 8px 14px 16px; }
    .dbtn {
      all: unset; flex: 1; box-sizing: border-box; text-align: center; cursor: pointer;
      padding: 12px; border-radius: 16px; font-size: 14px; font-weight: 600;
      background: rgba(255,255,255,0.09); border: 1px solid rgba(255,255,255,0.10);
    }
    .dbtn:hover { background: rgba(255,255,255,0.14); }
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
      if (this._dlgEntity) this._renderDetails();
    }

    disconnectedCallback() {
      clearTimeout(this._armTimer);
      this._armed = null;
      if (this._dlg && this._dlg.open) this._dlg.close();
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
      // Replace everything but the details dialog, so an open pop-up survives a rebuild
      Array.from(this.shadowRoot.childNodes).forEach((n) => {
        if (n !== this._dlg) n.remove();
      });
      const tpl = document.createElement("template");
      tpl.innerHTML = `<style>${CARD_CSS}</style><ha-card>${body}</ha-card>`;
      this.shadowRoot.insertBefore(tpl.content, this._dlg || null);

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
        const st = hass.states[item.entity];
        if (this._config.details !== false && st && fpcDetails(hass, st, key, this._lang).sections.length) {
          this._openDetails(item.entity);
        } else {
          this._moreInfo(item.entity);
        }
        return;
      }
      const coords = fpcCoords(hass.states[item.entity]);
      if (!coords) {
        this._toast(t(this._lang, "no_position"));
        return;
      }
      this._openUrl(fpcMapsUrl(coords, this._config.maps));
    }

    _openUrl(url) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.style.display = "none";
      this.shadowRoot.appendChild(a);
      a.click();
      a.remove();
    }

    // ---------- Details pop-up ----------

    _ensureDialog() {
      if (this._dlg) return this._dlg;
      const dlg = document.createElement("dialog");
      dlg.className = "dlg";
      // Focus the dialog itself on open, so the close button does not start with a focus ring
      dlg.setAttribute("autofocus", "");
      dlg.tabIndex = -1;
      dlg.addEventListener("click", (ev) => {
        if (ev.target === dlg) {
          dlg.close();
          return;
        }
        const btn = ev.target.closest && ev.target.closest("[data-act]");
        if (!btn) return;
        const id = this._dlgEntity;
        const act = btn.dataset.act;
        if (act === "close") dlg.close();
        else if (act === "history") {
          dlg.close();
          this._moreInfo(id);
        } else if (act === "maps") {
          const c = this._hass && fpcCoords(this._hass.states[id]);
          if (c) this._openUrl(fpcMapsUrl(c, this._config.maps));
        }
      });
      dlg.addEventListener("close", () => {
        this._dlgEntity = null;
        this._dlgSig = null;
      });
      this._dlg = dlg;
      this.shadowRoot.appendChild(dlg);
      return dlg;
    }

    _openDetails(entityId) {
      const dlg = this._ensureDialog();
      this._dlgEntity = entityId;
      this._dlgSig = null;
      this._renderDetails();
      if (!dlg.open) {
        try {
          dlg.showModal();
        } catch (e) {
          dlg.setAttribute("open", "");
        }
      }
      const body = dlg.querySelector(".dbody");
      if (body) body.scrollTop = 0;
    }

    _renderDetails() {
      const dlg = this._dlg;
      const hass = this._hass;
      const id = this._dlgEntity;
      if (!dlg || !hass || !id) return;
      const st = hass.states[id];
      const lang = this._lang || fpcLang(hass, this._config);
      const sig = JSON.stringify([lang, st && st.state, st && st.last_updated, Math.floor(Date.now() / 60000)]);
      if (sig === this._dlgSig) return;
      this._dlgSig = sig;

      const key = fpcEntityKey(hass, id);
      const item = (this._items || []).find((i) => i.entity === id) || { entity: id };
      const vehicle = fpcVehicle(hass, this._config.device_id);
      const name = item.name || fpcName(hass, id, vehicle ? vehicle.name : "", lang);
      const d = fpcDetails(hass, st, key, lang);
      const loc = (hass.locale && hass.locale.language) || lang;
      const when = d.updated || (st && st.last_updated ? new Date(st.last_updated) : null);
      const sub = when && !isNaN(when) ? `${t(lang, "details_updated")} ${fpcAgo(when, lang, loc)}` : "";

      const rowHtml = (r) => `<div class="row">
          ${r.color ? `<span class="dot" style="background:${r.color};box-shadow:0 0 8px ${r.color}"></span>` : ""}
          <span class="rl">${esc(r.label)}</span>
          <span class="rv">${esc(r.value)}${r.note ? `<small>${esc(r.note)}</small>` : ""}</span>
        </div>`;
      const secHtml = (s, i) =>
        s.folded
          ? `<details class="sec" data-sec="${i}"><summary class="stitle">${esc(s.title)}</summary>${s.rows.map(rowHtml).join("")}</details>`
          : `<div class="sec">${s.title ? `<div class="stitle">${esc(s.title)}</div>` : ""}${s.rows.map(rowHtml).join("")}</div>`;

      // Keep scroll position and expanded sections across live updates
      const oldBody = dlg.querySelector(".dbody");
      const scroll = oldBody ? oldBody.scrollTop : 0;
      const opened = new Set(Array.from(dlg.querySelectorAll("details[open]")).map((el) => el.dataset.sec));

      const coords = fpcCoords(st);
      dlg.setAttribute("aria-label", name);
      dlg.innerHTML = `
        <div class="dhead">
          <span class="dicon"></span>
          <div class="dtitle">
            <div class="dname">${esc(name)}</div>
            ${sub ? `<div class="dsub" title="${esc(when ? fpcDate(when, loc) : "")}">${esc(sub)}</div>` : ""}
          </div>
          <button class="dx" type="button" data-act="close" aria-label="${esc(t(lang, "details_close"))}">✕</button>
        </div>
        <div class="dstate">${esc(fpcFormat(hass, st, key, lang))}</div>
        <div class="dbody">
          ${d.sections.map(secHtml).join("")}
          ${d.more ? `<div class="dmore">${esc(t(lang, "details_more").replace("{n}", d.more))}</div>` : ""}
        </div>
        <div class="dfoot">
          ${coords ? `<button class="dbtn" type="button" data-act="maps">${esc(t(lang, "details_maps"))}</button>` : ""}
          <button class="dbtn" type="button" data-act="history">${esc(t(lang, "details_history"))}</button>
        </div>`;

      const icon = document.createElement("ha-state-icon");
      icon.hass = hass;
      icon.stateObj = st;
      if (item.icon) icon.icon = item.icon;
      const wrap = dlg.querySelector(".dicon");
      wrap.appendChild(icon);
      wrap.style.color = item.color || fpcStateColor(key, st && st.state) || FPC_ICON_COLORS[key] || "";

      dlg.querySelectorAll("details[data-sec]").forEach((el) => {
        if (opened.has(el.dataset.sec)) el.open = true;
      });
      const body = dlg.querySelector(".dbody");
      if (body) body.scrollTop = scroll;
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
