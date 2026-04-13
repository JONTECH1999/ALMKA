#include <Arduino.h>
#include <WiFi.h>
#include <WebServer.h>
#include <EEPROM.h>
#include <TinyGPSPlus.h>
#include <HTTPClient.h>

// ==== WIFI (STA MODE - Connect to Phone Hotspot) ====
const char* ssid = "ALMKA";
const char* password = "12345678";
const char* camIp = "10.41.241.105"; // ESP32-CAM IP on hotspot network
WebServer server(80);

// ==== DATA LOGGING ====
const char* SERVER_URL = "http://10.41.241.11:8000"; // Laravel server IP on hotspot
String deviceId = "almka-blind-001";
int currentSessionId = -1;
unsigned long lastDataLog = 0;
const unsigned long DATA_LOG_INTERVAL = 10000; // Log data every 10 seconds
bool dataLoggingEnabled = true;

// ==== LOCATIONIQ REVERSE GEOCODING ====
const char* locationiqKey = "pk.e0c135da8b6e925543f3ece9bb5ef436"; // Free LocationIQ API key
String latestAddress = "Waiting for GPS fix...";

// ==== EEPROM ====
#define EEPROM_SIZE 10

// ==== SETTINGS ====
int detectionStart = 100;
int globalMaxVibe = 300;

// ==== ULTRASONIC PINS ====
#define TRIG_LEFT 16
#define ECHO_LEFT 17
#define TRIG_FRONT 18
#define ECHO_FRONT 19
#define TRIG_RIGHT 5
#define ECHO_RIGHT 33

// ==== MOTORS ====
#define MOTOR_LEFT 25
#define MOTOR_FRONT 26
#define MOTOR_RIGHT 32

int currentIntensity[3] = {0,0,0};

// ==== GPS (FIXED PINS) ====
#define GPS_RX 2
#define GPS_TX 4

TinyGPSPlus gps;
HardwareSerial GPS(2); // Use UART2 for pins 2 (RX) and 4 (TX)

double latestLat = 0.0;
double latestLon = 0.0;
unsigned long lastGpsStatus = 0;
unsigned long lastGpsDebug = 0;

// ================= EEPROM =================
void saveSettings() {
  EEPROM.write(0, detectionStart);
  EEPROM.write(1, globalMaxVibe / 2);
  EEPROM.commit();
  Serial.printf("Settings saved to EEPROM: detection=%d, vibration=%d (stored as %d)\n", detectionStart, globalMaxVibe, globalMaxVibe / 2);
}

void loadSettings() {
  detectionStart = EEPROM.read(0);
  globalMaxVibe = EEPROM.read(1) * 2;

  if (detectionStart < 50 || detectionStart > 200) detectionStart = 100;
  if (globalMaxVibe < 50 || globalMaxVibe > 300) globalMaxVibe = 150; // Changed default to 150

  Serial.printf("Settings loaded from EEPROM: detection=%d, vibration=%d\n", detectionStart, globalMaxVibe);
}

// ================= DISTANCE =================
long measureDistance(int trigPin, int echoPin) {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);
  if (duration == 0) return 200;

  long distance = duration * 0.034 / 2;
  return constrain(distance, 0, 200);
}

long getStableDistance(int trigPin, int echoPin) {
  return (measureDistance(trigPin, echoPin) + measureDistance(trigPin, echoPin)) / 2;
}

// ================= MOTOR CONTROL =================
void controlMotor(int pin, long distance, int i) {
  int minDistance = 5;
  int startDistance = detectionStart;

  if (!distance || distance > startDistance) {
    currentIntensity[i] = 0;
    analogWrite(pin, 0);
    return;
  }

  float normalized = (float)(startDistance - distance) / (startDistance - minDistance);
  normalized = constrain(normalized, 0.0, 1.0);

  // Vibrate more intensely when objects are closer
  int intensity = normalized * globalMaxVibe;
  intensity = constrain(intensity, 0, 255);

  currentIntensity[i] = currentIntensity[i]*0.7 + intensity*0.3;

  analogWrite(pin, currentIntensity[i]);

  // Debug output every 2 seconds
  static unsigned long lastDebug = 0;
  if (millis() - lastDebug > 2000) {
    Serial.printf("Motor %d: dist=%d, normalized=%.2f, intensity=%d, current=%d\n", i, distance, normalized, intensity, currentIntensity[i]);
    lastDebug = millis();
  }
}

// ================= WEB PAGE =================
// ================= WEB PAGE =================
String webpage() {
  return R"rawliteral(
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body { font-family: Arial; background:#eef2f7; text-align:center; }
.card { background:white; padding:20px; margin:20px; border-radius:15px; }
input { width:90%; margin:10px 0; }
button {
  padding:15px;
  background:#007bff;
  color:white;
  border:none;
  border-radius:10px;
  width:90%;
}
.sensor-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 10px 0; }
.sensor-item { background: #f8f9fa; padding: 10px; border-radius: 8px; text-align: center; }
.distance { font-size: 24px; font-weight: bold; color: #28a745; }
.vibration { font-size: 14px; color: #6c757d; }
.active { background: #fff3cd !important; border: 2px solid #ffc107; }
</style>
</head>
<body>

<h2>ESP32 Vibration + GPS</h2>

<div class="card">
<p>Detection Distance (50 - 200 cm)</p>
<input type="range" min="50" max="200" value="100" id="dist">
<span id="distVal">100</span> cm

<p>Intensity (50 - 300)</p>
<input type="range" min="50" max="300" value="300" id="vibe">
<span id="vibeVal">300</span>

<br><br>
<button onclick="save()">SAVE SETTINGS</button>
</div>

<div class="card">
<h3>Real-Time Sensor Readings</h3>
<div class="sensor-grid">
  <div class="sensor-item" id="left-sensor">
    <div>LEFT</div>
    <div class="distance" id="left-dist">--</div>
    <div class="vibration" id="left-vibe">--</div>
  </div>
  <div class="sensor-item" id="front-sensor">
    <div>FRONT</div>
    <div class="distance" id="front-dist">--</div>
    <div class="vibration" id="front-vibe">--</div>
  </div>
  <div class="sensor-item" id="right-sensor">
    <div>RIGHT</div>
    <div class="distance" id="right-dist">--</div>
    <div class="vibration" id="right-vibe">--</div>
  </div>
</div>
</div>

<div class="card">
<h3>GPS Location</h3>
<p>Latitude: <span id="lat">--</span></p>
<p>Longitude: <span id="lon">--</span></p>
<p><b>Address:</b><br><span id="addr" style="font-size:14px; color:#333;">Waiting for GPS fix...</span></p>
</div>

<script>
const distSlider = document.getElementById("dist");
const vibeSlider = document.getElementById("vibe");
const distVal = document.getElementById("distVal");
const vibeVal = document.getElementById("vibeVal");

// Initialize sliders with current values
fetch('/sensors')
  .then(res => res.json())
  .then(data => {
    distSlider.value = data.detection_start;
    vibeSlider.value = data.max_vibe;
    distVal.innerText = data.detection_start;
    vibeVal.innerText = data.max_vibe;
  })
  .catch(err => console.log('Initial load failed:', err));

distSlider.oninput = () => { distVal.innerText = distSlider.value; }
vibeSlider.oninput = () => { vibeVal.innerText = vibeSlider.value; }

function save(){
  fetch(`/save?d=${distSlider.value}&v=${vibeSlider.value}`)
  .then(()=>alert("Saved!"));
}

// LIVE SENSOR UPDATE
setInterval(() => {
  fetch('/sensors')
    .then(res => res.json())
    .then(data => {
      document.getElementById("left-dist").innerText = data.left + "cm";
      document.getElementById("front-dist").innerText = data.front + "cm";
      document.getElementById("right-dist").innerText = data.right + "cm";
      
      document.getElementById("left-vibe").innerText = "V:" + data.vibe_left;
      document.getElementById("front-vibe").innerText = "V:" + data.vibe_front;
      document.getElementById("right-vibe").innerText = "V:" + data.vibe_right;
      
      // Highlight active sensors (when vibration > 0)
      document.getElementById("left-sensor").classList.toggle("active", data.vibe_left > 0);
      document.getElementById("front-sensor").classList.toggle("active", data.vibe_front > 0);
      document.getElementById("right-sensor").classList.toggle("active", data.vibe_right > 0);
    })
    .catch(err => console.log('Sensor update failed:', err));
}, 500);

// LIVE GPS UPDATE
setInterval(() => {
  fetch('/gps')
    .then(res => res.json())
    .then(data => {
      document.getElementById("lat").innerText = data.lat;
      document.getElementById("lon").innerText = data.lon;
      document.getElementById("addr").innerText = data.address || "Waiting for GPS fix...";
    })
    .catch(err => console.log('GPS update failed:', err));
}, 2000);
</script>

</body>
</html>
)rawliteral";
}

void handleOptions() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  server.send(200, "text/plain", "");
}

// ================= ROUTES =================
void handleRoot() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "text/html", webpage());
}

void handleSave() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  if (server.hasArg("d") && server.hasArg("v")) {
    detectionStart = server.arg("d").toInt();
    globalMaxVibe = server.arg("v").toInt();
    saveSettings();
    Serial.printf("Settings saved: detection=%d, vibration=%d\n", detectionStart, globalMaxVibe);
  }
  server.send(200, "text/plain", "OK");
}

void handleGPS() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
  bool validFix = gps.location.isValid();
  String json = "{";
  json += "\"lat\":" + String(latestLat,6) + ",";
  json += "\"lon\":" + String(latestLon,6) + ",";
  json += "\"address\":\"" + latestAddress + "\",";
  json += "\"valid\":" + String(validFix ? "true" : "false");
  json += "}";
  server.send(200, "application/json", json);
}

// ================= REVERSE GEOCODING =================
void getAddressFromCoordinates(double lat, double lon) {
  if (WiFi.status() != WL_CONNECTED) {
    latestAddress = "WiFi not connected";
    return;
  }

  String url = "https://us1.locationiq.com/v1/reverse.php?key=" + String(locationiqKey) + 
               "&lat=" + String(lat, 6) + "&lon=" + String(lon, 6) + "&format=json";

  HTTPClient http;
  http.begin(url);
  int httpCode = http.GET();

  if (httpCode == 200) {
    String payload = http.getString();
    
    // Parse "display_name" from JSON response
    int idx = payload.indexOf("\"display_name\":");
    if (idx > 0) {
      int start = payload.indexOf("\"", idx + 15) + 1;
      int end = payload.indexOf("\"", start);
      latestAddress = payload.substring(start, end);
      Serial.print("🏠 Address: ");
      Serial.println(latestAddress);
    } else {
      latestAddress = "Address not found";
    }
  } else {
    latestAddress = "API Error: " + String(httpCode);
    Serial.println(latestAddress);
  }

  http.end();
}

void handleSensors() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  // Get current sensor readings
  long leftDist = getStableDistance(TRIG_LEFT, ECHO_LEFT);
  long frontDist = getStableDistance(TRIG_FRONT, ECHO_FRONT);
  long rightDist = getStableDistance(TRIG_RIGHT, ECHO_RIGHT);

  String json = "{";
  json += "\"left\":" + String(leftDist) + ",";
  json += "\"front\":" + String(frontDist) + ",";
  json += "\"right\":" + String(rightDist) + ",";
  json += "\"vibe_left\":" + String(currentIntensity[0]) + ",";
  json += "\"vibe_front\":" + String(currentIntensity[1]) + ",";
  json += "\"vibe_right\":" + String(currentIntensity[2]) + ",";
  json += "\"detection_start\":" + String(detectionStart) + ",";
  json += "\"max_vibe\":" + String(globalMaxVibe);
  json += "}";

  server.send(200, "application/json", json);
}

void handleCameraTest() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  String json = "{";
  json += "\"camera_ip\":\"" + String(camIp) + "\",";
  json += "\"camera_port\":81,";
  json += "\"camera_endpoint\":\"/stream\",";
  
  // Test connection to camera
  HTTPClient testHttp;
  String testUrl = String("http://") + camIp + ":81/stream";
  testHttp.begin(testUrl);
  testHttp.setTimeout(3000);
  int testCode = testHttp.GET();
  
  json += "\"status\":";
  if (testCode == HTTP_CODE_OK) {
    json += "\"online\",";
    json += "\"message\":\"✓ Camera is responding and working.\",";
  } else if (testCode == 0 || testCode == -1) {
    json += "\"offline\",";
    json += "\"message\":\"✗ Camera not responding - Check if ESP32-CAM is powered on and connected to 'SM' hotspot.\",";
  } else {
    json += "\"error\",";
    json += "\"message\":\"✗ Camera returned HTTP " + String(testCode) + "\",";
  }
  
  json += "\"http_code\":" + String(testCode) + ",";
  json += "\"ap_ssid\":\"N/A\",";
  json += "\"main_esp_ip\":\"" + WiFi.localIP().toString() + "\"";
  json += "}";
  
  testHttp.end();
  server.send(200, "application/json", json);
}

void handleCameraProxy() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");

  HTTPClient http;
  String camUrl = String("http://") + camIp + ":81/stream";  // Use /stream for live MJPEG feed
  
  Serial.println("\n=== Camera Proxy Request ===");
  Serial.println("Attempting to fetch from: " + camUrl);
  
  http.begin(camUrl);
  http.setTimeout(5000);  // 5 second timeout
  int httpCode = http.GET();

  Serial.printf("Camera response code: %d\n", httpCode);

  if (httpCode == HTTP_CODE_OK) {
    String contentType = http.header("Content-Type");
    int contentLength = http.getSize();
    
    Serial.printf("✓ Camera OK - Content-Type: %s, Length: %d\n", contentType.c_str(), contentLength);
    
    server.sendHeader("Content-Type", contentType);
    server.sendHeader("Content-Length", String(contentLength));
    server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    server.sendHeader("Pragma", "no-cache");
    server.sendHeader("Expires", "0");
    server.send(200, contentType, "");
    
    WiFiClient *stream = http.getStreamPtr();
    while (stream->available()) {
      server.client().write(stream->read());
    }
  } else {
    String errorMsg = "";
    if (httpCode == 0) {
      errorMsg = "Connection failed - ESP32-CAM at " + String(camIp) + ":81 not responding";
      Serial.println("✗ Connection failed - Timeout or ESP32-CAM offline");
    } else if (httpCode == 404) {
      errorMsg = "Camera endpoint /capture not found on ESP32-CAM";
      Serial.println("✗ 404 - /capture endpoint not found");
    } else if (httpCode == -1) {
      errorMsg = "Connection timeout - ESP32-CAM may be offline";
      Serial.println("✗ Connection timeout");
    } else {
      errorMsg = String("Camera error: HTTP ") + String(httpCode);
      Serial.printf("✗ Error: HTTP %d\n", httpCode);
    }
    
    server.send(502, "text/plain", errorMsg);
  }

  http.end();
}

// ================= DATA LOGGING FUNCTIONS =================
bool startDeviceSession() {
  if (WiFi.status() != WL_CONNECTED) return false;

  HTTPClient http;
  http.begin(String(SERVER_URL) + "/api/logger/session/start");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"device_id\":\"" + deviceId + "\",";
  jsonPayload += "\"device_ip\":\"" + WiFi.localIP().toString() + "\",";
  jsonPayload += "\"wifi_mode\":\"STA\",";
  jsonPayload += "\"wifi_ssid\":\"" + String(ssid) + "\"";
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode == HTTP_CODE_OK || httpResponseCode == HTTP_CODE_CREATED) {
    String response = http.getString();
    Serial.println("Session started: " + response);

    // Parse session ID from response
    int sessionIdIndex = response.indexOf("\"session_id\":");
    if (sessionIdIndex != -1) {
      String sessionIdStr = response.substring(sessionIdIndex + 13);  // Skip "\"session_id\":"
      sessionIdStr = sessionIdStr.substring(0, sessionIdStr.indexOf(","));
      currentSessionId = sessionIdStr.toInt();
      Serial.println("Current session ID: " + String(currentSessionId));
      return true;
    }
  } else {
    Serial.println("Failed to start session: " + String(httpResponseCode));
  }

  http.end();
  return false;
}

bool logSensorData(long distL, long distF, long distR, int vibL, int vibF, int vibR) {
  if (WiFi.status() != WL_CONNECTED || currentSessionId == -1) return false;

  HTTPClient http;
  http.begin(String(SERVER_URL) + "/api/logger/data");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"device_id\":\"" + deviceId + "\",";
  jsonPayload += "\"session_id\":" + String(currentSessionId) + ",";

  // GPS data
  if (latestLat != 0.0 && latestLon != 0.0) {
    jsonPayload += "\"latitude\":" + String(latestLat, 8) + ",";
    jsonPayload += "\"longitude\":" + String(latestLon, 8) + ",";
  }

  // Sensor data
  jsonPayload += "\"distance_left\":" + String(distL) + ",";
  jsonPayload += "\"distance_front\":" + String(distF) + ",";
  jsonPayload += "\"distance_right\":" + String(distR) + ",";
  jsonPayload += "\"vibration_left\":" + String(vibL) + ",";
  jsonPayload += "\"vibration_front\":" + String(vibF) + ",";
  jsonPayload += "\"vibration_right\":" + String(vibR);

  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);
  Serial.printf("logSensorData HTTP status: %d\n", httpResponseCode);

  if (httpResponseCode == HTTP_CODE_OK || httpResponseCode == HTTP_CODE_CREATED) {
    String response = http.getString();
    Serial.println("Data logged: " + response);
    return true;
  } else {
    String response = http.getString();
    Serial.printf("Failed to log data: HTTP %d\n", httpResponseCode);
    Serial.println(response);
  }

  http.end();
  return false;
}

bool endDeviceSession() {
  if (WiFi.status() != WL_CONNECTED || currentSessionId == -1) return false;

  HTTPClient http;
  http.begin(String(SERVER_URL) + "/api/logger/session/end");
  http.addHeader("Content-Type", "application/json");
  http.addHeader("Accept", "application/json");

  String jsonPayload = "{";
  jsonPayload += "\"device_id\":\"" + deviceId + "\",";
  jsonPayload += "\"session_id\":" + String(currentSessionId);
  jsonPayload += "}";

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode == HTTP_CODE_OK || httpResponseCode == HTTP_CODE_CREATED) {
    Serial.println("Session ended successfully");
    currentSessionId = -1;
    return true;
  } else {
    String response = http.getString();
    Serial.printf("Failed to end session: HTTP %d\n", httpResponseCode);
    Serial.println(response);
  }

  http.end();
  return false;
}

// ================= SETUP =================
void setup() {
  Serial.begin(115200);

  EEPROM.begin(EEPROM_SIZE);
  loadSettings();

  Serial.println("========================================");
  Serial.println("Starting ESP32 Vibe controller...");
  Serial.println("========================================");
  Serial.printf("Trying to connect to hotspot '%s'...\n", ssid);

  // Start STA mode only - connect to hotspot
  WiFi.mode(WIFI_STA);

  // WiFi STA - Connect to Phone Hotspot
  WiFi.begin(ssid, password);
  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - start < 30000) {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nConnected to hotspot!");
    Serial.printf("Mode: STA\nSSID: %s\n", ssid);
    Serial.print("ESP32 IP: ");
    Serial.println(WiFi.localIP());

    // Start data logging session
    Serial.println("Starting data logging session...");
    if (startDeviceSession()) {
      Serial.println("✓ Data logging session started successfully");
    } else {
      Serial.println("✗ Failed to start data logging session");
    }
  } else {
    Serial.println("\nFailed to connect to hotspot.");
    Serial.println("Cannot start data logging.");
  }

  // Web routes
  server.on("/", handleRoot);
  server.on("/save", HTTP_GET, handleSave);
  server.on("/gps", HTTP_GET, handleGPS);
  server.on("/sensors", HTTP_GET, handleSensors);
  server.on("/camera", HTTP_GET, handleCameraProxy);
  server.on("/camera/test", HTTP_GET, handleCameraTest);
  server.on("/gps", HTTP_OPTIONS, handleOptions); // Handle preflight
  server.begin();

  // Ultrasonic
  pinMode(TRIG_LEFT, OUTPUT);
  pinMode(ECHO_LEFT, INPUT);
  pinMode(TRIG_FRONT, OUTPUT);
  pinMode(ECHO_FRONT, INPUT);
  pinMode(TRIG_RIGHT, OUTPUT);
  pinMode(ECHO_RIGHT, INPUT);

  // Motors
  pinMode(MOTOR_LEFT, OUTPUT);
  pinMode(MOTOR_FRONT, OUTPUT);
  pinMode(MOTOR_RIGHT, OUTPUT);

  // GPS start
  GPS.begin(9600, SERIAL_8N1, GPS_RX, GPS_TX);
}

// ================= LOOP =================
void loop() {
  server.handleClient();

  // ===== GPS READ =====
  int gpsBytes = GPS.available();
  if (gpsBytes > 0) {
    Serial.printf("GPS available bytes: %d\n", gpsBytes);
  }

  while (GPS.available() > 0) {
    char c = GPS.read();
    if (c == '$') {
      Serial.print("\nGPS NMEA: ");
    }
    Serial.write(c); // Debug raw GPS NMEA output
    gps.encode(c);
  }

  if (!gps.location.isValid()) {
    if (millis() - lastGpsStatus > 5000) {
      Serial.println("⏳ Searching for satellites...");
      Serial.printf("GPS chars=%u, sentences=%u\n", gps.charsProcessed(), gps.sentencesWithFix());
      if (gps.satellites.isValid()) {
        Serial.printf("Satellites: %u, HDOP: %.1f\n", gps.satellites.value(), gps.hdop.isValid() ? gps.hdop.value() : 0.0);
      }
      lastGpsStatus = millis();
    }
  } else if (gps.location.isUpdated()) {
    latestLat = gps.location.lat();
    latestLon = gps.location.lng();

    Serial.println("\n📍 GPS Fix Acquired!");
    Serial.printf("Latitude : %.6f\n", latestLat);
    Serial.printf("Longitude: %.6f\n", latestLon);
    
    // Fetch address from LocationIQ API
    getAddressFromCoordinates(latestLat, latestLon);
  }

  // ===== ULTRASONIC =====
  long L = getStableDistance(TRIG_LEFT, ECHO_LEFT);
  long F = getStableDistance(TRIG_FRONT, ECHO_FRONT);
  long R = getStableDistance(TRIG_RIGHT, ECHO_RIGHT);

  controlMotor(MOTOR_LEFT, L, 0);
  controlMotor(MOTOR_FRONT, F, 1);
  controlMotor(MOTOR_RIGHT, R, 2);

  // ===== DATA LOGGING =====
  if (dataLoggingEnabled && WiFi.status() == WL_CONNECTED && currentSessionId != -1) {
    if (millis() - lastDataLog >= DATA_LOG_INTERVAL) {
      Serial.println("Logging sensor data...");
      if (logSensorData(L, F, R, currentIntensity[0], currentIntensity[1], currentIntensity[2])) {
        Serial.println("✓ Data logged successfully");
      } else {
        Serial.println("✗ Failed to log data");
      }
      lastDataLog = millis();
    }
  }

  delay(50);
}