Natürlich! Hier ist eine strukturierte REST-API-Dokumentation zu den in deinem Code gefundenen Endpunkten, Methoden und Parametern. Die Informationen stammen aus den von dir genannten Funktionsdefinitionen und ggf. weiteren Kontext aus den bereitgestellten Dateien.

---

# REST-API Dokumentation

## 1. Gimbal-Geschwindigkeit setzen

**POST** `/camera/sdk/gimbal_speed`

- **Beschreibung:** Setzt die Geschwindigkeit des Gimbals (Schwenk-/Neigekopf).
- **Body-Parameter:** (JSON)
  ```json
  {
    "pitch": <number>,   // Geschwindigkeit für Neigung (optional)
    "yaw": <number>,     // Geschwindigkeit für Schwenken (optional)
    "roll": <number>,    // Geschwindigkeit für Rollachse (optional)
    "stop": <boolean>    // Bewegung stoppen (optional)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"pitch": 100,
  	"yaw": 50,
  	"roll": 0,
  	"stop": false
  }
  ```

---

## 2. Zoom steuern

**POST** `/camera/sdk/zoom`

- **Beschreibung:** Steuert den Zoom der Kamera.
- **Body-Parameter:** (JSON)
  ```json
  {
    "ratio": <number>,   // Zoomfaktor (z.B. 1.0 bis 4.0)
    "speed": <number>    // Zoomgeschwindigkeit (optional)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"ratio": 2.5,
  	"speed": 10
  }
  ```

---

## 3. Preset-Position anfahren

**POST** `/camera/sdk/trigger_preset`

- **Beschreibung:** Fährt eine gespeicherte Preset-Position an.
- **Body-Parameter:** (JSON)
  ```json
  {
    "id": <number>   // ID der Preset-Position
  }
  ```
- **Beispiel:**
  ```json
  {
  	"id": 1
  }
  ```

---

## 4. Preset-Position speichern

**POST** `/camera/sdk/preset`

- **Beschreibung:** Speichert die aktuelle Position als Preset.
- **Body-Parameter:** (JSON)
  ```json
  {
    "id": <number>,      // ID der Preset-Position (0, 1, 2, ...)
    "name": <string>     // Name der Preset-Position (Base64-codiert)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"id": 1,
  	"name": "U3R1ZGlv" // "Studio" als Base64
  }
  ```

---

## 5. Preset-Position löschen

**DELETE** `/camera/sdk/preset`

- **Beschreibung:** Löscht eine gespeicherte Preset-Position.
- **Body-Parameter:** (JSON, im Feld `data`)
  ```json
  {
    "id": <number>   // ID der Preset-Position
  }
  ```
- **Beispiel:**
  ```json
  {
  	"id": 1
  }
  ```

---

## 6. Preset-Position umbenennen

**PUT** `/camera/sdk/preset_rename`

- **Beschreibung:** Benennt eine gespeicherte Preset-Position um.
- **Body-Parameter:** (JSON)
  ```json
  {
    "id": <number>,      // ID der Preset-Position
    "name": <string>     // Neuer Name (Base64-codiert)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"id": 1,
  	"name": "TmV1ZXMgTmFtZQ==" // "Neues Name" als Base64
  }
  ```

---

## 7. Preset-Position aktualisieren

**PUT** `/camera/sdk/preset`

- **Beschreibung:** Aktualisiert eine gespeicherte Preset-Position.
- **Body-Parameter:** (JSON)
  ```json
  {
    "id": <number>,      // ID der Preset-Position
    "name": <string>     // Neuer Name (Base64-codiert)
  }
  ```
- **Beispiel:** siehe oben

---

## 8. Autofokus-Modus setzen

**POST** `/camera/sdk/af`

- **Beschreibung:** Setzt den Autofokus-Modus.
- **Body-Parameter:** (JSON)
  ```json
  {
    "mode": <string>   // z.B. "AFC", "MF"
  }
  ```
- **Beispiel:**
  ```json
  {
  	"mode": "AFC"
  }
  ```

---

## 9. Manuellen Fokus setzen

**POST** `/camera/sdk/mf_position`

- **Beschreibung:** Setzt die Position des manuellen Fokus.
- **Body-Parameter:** (JSON)
  ```json
  {
    "position": <number>   // Fokusposition (0-100)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"position": 55
  }
  ```

---

## 10. AI-Tracking-Ziel setzen

**POST** `/camera/sdk/ai_trace`

- **Beschreibung:** Setzt das Ziel für das AI-Tracking.
- **Body-Parameter:** (JSON)
  ```json
  {
    "target": <string>   // Zieltyp, z.B. "BODY", "HAND", "NONE"
  }
  ```
- **Beispiel:**
  ```json
  {
  	"target": "BODY"
  }
  ```

---

## 11. Foto aufnehmen

**POST** `/camera/sdk/capture`

- **Beschreibung:** Startet oder stoppt die Fotoaufnahme.
- **Body-Parameter:** (JSON)
  ```json
  {
    "capture": <boolean>   // true = Aufnahme starten, false = stoppen
  }
  ```
- **Beispiel:**
  ```json
  {
  	"capture": true
  }
  ```

---

## 12. Videoaufnahme starten/stoppen

**POST** `/camera/sdk/record`

- **Beschreibung:** Startet oder stoppt die Videoaufnahme.
- **Body-Parameter:** (JSON)
  ```json
  {
    "record": <boolean>   // true = Aufnahme starten, false = stoppen
  }
  ```
- **Beispiel:**
  ```json
  {
  	"record": true
  }
  ```

---

## 13. Produktschlüssel verifizieren

**POST** `/camera/sdk/key_verify`

- **Beschreibung:** Verifiziert einen Produktschlüssel.
- **Body-Parameter:** (JSON)
  ```json
  {
    "key": <string>
  }
  ```
- **Beispiel:**
  ```json
  {
  	"key": "ABCDEF123456"
  }
  ```

---

## 14. Netzwerkkonfiguration abrufen

**GET** `/camera/sdk/networkconfig`

- **Beschreibung:** Ruft die aktuelle Netzwerkkonfiguration ab.
- **Query-Parameter:** (als Objekt)
  ```json
  {
  	// z.B. Filter oder spezifische Felder, je nach API-Definition
  }
  ```
- **Beispiel:** Keine Parameter notwendig, ggf. optionale Filter.

---

## 15. Netzwerkkonfiguration setzen

**POST** `/camera/sdk/networkconfig`

- **Beschreibung:** Setzt die Netzwerkkonfiguration.
- **Body-Parameter:** (JSON)
  ```json
  {
    // Felder je nach Netzwerkkonfiguration, z.B.:
    "ip": <string>,
    "subnet": <string>,
    "gateway": <string>,
    ...
  }
  ```
- **Beispiel:**
  ```json
  {
  	"ip": "192.168.1.100",
  	"subnet": "255.255.255.0",
  	"gateway": "192.168.1.1"
  }
  ```

---

## 16. SD-Karte formatieren

**POST** `/camera/sdk/sdcard_format`

- **Beschreibung:** Formatiert die eingelegte SD-Karte.
- **Body-Parameter:** (JSON)
  ```json
  {
    // Ggf. keine oder optionale Parameter, z.B.:
    "quick": <boolean>   // true = Schnellformatierung (optional)
  }
  ```
- **Beispiel:**
  ```json
  {
  	"quick": true
  }
  ```

---

# Hinweise

- Die tatsächlichen Parameter können je nach Firmware/API-Version variieren.
- Die Base64-Kodierung von Namen ist im Frontend implementiert (siehe z.B. `mo(g)` im Code).
- Die meisten Endpunkte erwarten ein JSON-Objekt im Request-Body.
- Die Endpunkte sind für eine Kamera-Steuerung (z.B. OBSBOT) gedacht.
