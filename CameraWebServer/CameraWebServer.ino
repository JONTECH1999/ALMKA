#include "esp_camera.h"
#include <WiFi.h>
#include <WebServer.h>
#include <EEPROM.h>
#include <ESPmDNS.h>

// ===========================
// Select camera model in board_config.h
// ===========================
#include "board_config.h"

// ===========================
// WiFi Settings
// ===========================
const char* default_ssid = "ALMKA";
const char* default_password = "12345678";

// AP Mode for configuration
const char* ap_ssid = "ESP32-CAM-SETUP";
const char* ap_password = "12345678";

WebServer server(80);

// EEPROM addresses
#define EEPROM_SSID_ADDR 0
#define EEPROM_PASS_ADDR 32
#define EEPROM_SIZE 64

String currentSSID = default_ssid;
String currentPassword = default_password;

void startCameraServer();
void setupLedFlash();

// Load WiFi settings from EEPROM
void loadWiFiSettings() {
  EEPROM.begin(EEPROM_SIZE);
  
  // Read SSID
  char ssidBuf[32];
  bool isEmpty = true;
  for (int i = 0; i < 32; i++) {
    ssidBuf[i] = EEPROM.read(EEPROM_SSID_ADDR + i);
    if (ssidBuf[i] != 0xFF && ssidBuf[i] != 0) {
      isEmpty = false;
    }
  }
  ssidBuf[31] = '\0';
  currentSSID = String(ssidBuf);
  
  // Read Password
  char passBuf[32];
  for (int i = 0; i < 32; i++) {
    passBuf[i] = EEPROM.read(EEPROM_PASS_ADDR + i);
  }
  passBuf[31] = '\0';
  currentPassword = String(passBuf);
  
  // Use defaults if EEPROM is empty (all 0xFF) or invalid
  if (isEmpty || currentSSID.length() == 0 || currentSSID == " " || currentSSID == String((char)0xFF)) {
    currentSSID = default_ssid;
    currentPassword = default_password;
    Serial.println("Using default WiFi settings (EEPROM empty)");
  } else {
    Serial.println("Loaded WiFi settings from EEPROM:");
    Serial.println("SSID: " + currentSSID);
    Serial.println("Password: " + currentPassword);
  }
}

// Save WiFi settings to EEPROM
void saveWiFiSettings(String ssid, String password) {
  // Save SSID
  for (int i = 0; i < 32; i++) {
    if (i < ssid.length()) {
      EEPROM.write(EEPROM_SSID_ADDR + i, ssid[i]);
    } else {
      EEPROM.write(EEPROM_SSID_ADDR + i, 0);
    }
  }
  
  // Save Password
  for (int i = 0; i < 32; i++) {
    if (i < password.length()) {
      EEPROM.write(EEPROM_PASS_ADDR + i, password[i]);
    } else {
      EEPROM.write(EEPROM_PASS_ADDR + i, 0);
    }
  }
  
  EEPROM.commit();
  Serial.println("WiFi settings saved to EEPROM");
}

// Reconnect to new WiFi
void reconnectWiFi(String newSSID, String newPassword) {
  Serial.println("Connecting to WiFi...");
  
  WiFi.disconnect();
  delay(1000);
  
  WiFi.begin(newSSID.c_str(), newPassword.c_str());
  
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 15000) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    
    // Start mDNS
    if (MDNS.begin("esp32-cam")) {
      Serial.println("mDNS started: http://esp32-cam.local");
    } else {
      Serial.println("mDNS failed to start");
    }
    
    Serial.println("Camera Ready!");
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed");
  }
}

// Web page HTML
String getWebPage() {
  String html = R"rawliteral(
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ESP32-CAM Settings</title>
  <style>
    body { font-family: Arial; background: #f0f0f0; text-align: center; padding: 20px; }
    .card { background: white; padding: 20px; margin: 20px auto; border-radius: 10px; max-width: 400px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    input, button { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ddd; border-radius: 5px; }
    button { background: #007bff; color: white; border: none; cursor: pointer; }
    button:hover { background: #0056b3; }
    .status { background: #e9ecef; padding: 10px; border-radius: 5px; margin: 10px 0; }
  </style>
</head>
<body>
  <h1>ESP32-CAM Configuration</h1>
  
  <div class="card">
    <h2>Current Status</h2>
    <div class="status">
      <p><strong>AP Mode:</strong> ESP32-CAM-SETUP</p>
      <p><strong>AP IP:</strong> 192.168.4.1</p>
      <p><strong>STA Connected:</strong> )rawliteral";
  
  html += (WiFi.status() == WL_CONNECTED) ? "Yes" : "No";
  html += R"rawliteral(</p>
      <p><strong>STA IP:</strong> )rawliteral";
  html += WiFi.localIP().toString();
  html += R"rawliteral(</p>
      <p><strong>Camera:</strong> Ready</p>
    </div>
  </div>
  
  <div class="card">
    <h2>WiFi Settings</h2>
    <form action="/save" method="POST">
      <input type="text" name="ssid" placeholder="WiFi Network Name" value=")rawliteral";
  html += currentSSID;
  html += R"rawliteral(" required>
      <input type="password" name="password" placeholder="WiFi Password" value=")rawliteral";
  html += currentPassword;
  html += R"rawliteral(" required>
      <button type="submit">Save & Reconnect</button>
    </form>
  </div>
  
  <div class="card">
    <h2>Camera Stream</h2>
    <p><a href="/stream" target="_blank">Open Camera Stream</a></p>
    <p><a href="/capture" target="_blank">Take Photo</a></p>
  </div>
</body>
</html>
)rawliteral";
  
  return html;
}

// Handle root page
void handleRoot() {
  server.send(200, "text/html", getWebPage());
}

// Handle save settings
void handleSave() {
  if (server.hasArg("ssid") && server.hasArg("password")) {
    String newSSID = server.arg("ssid");
    String newPassword = server.arg("password");
    
    Serial.println("Saving new WiFi settings...");
    saveWiFiSettings(newSSID, newPassword);
    
    currentSSID = newSSID;
    currentPassword = newPassword;
    
    reconnectWiFi(newSSID, newPassword);
    
    server.send(200, "text/html", "<h1>Settings Saved!</h1><p>Reconnecting... <a href='/'>Back to Settings</a></p>");
  } else {
    server.send(400, "text/plain", "Missing parameters");
  }
}

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  Serial.println();
  
  // Load WiFi settings
  loadWiFiSettings();
  
  // Camera config
  camera_config_t config;
  config.ledc_channel = LEDC_CHANNEL_0;
  config.ledc_timer = LEDC_TIMER_0;
  config.pin_d0 = Y2_GPIO_NUM;
  config.pin_d1 = Y3_GPIO_NUM;
  config.pin_d2 = Y4_GPIO_NUM;
  config.pin_d3 = Y5_GPIO_NUM;
  config.pin_d4 = Y6_GPIO_NUM;
  config.pin_d5 = Y7_GPIO_NUM;
  config.pin_d6 = Y8_GPIO_NUM;
  config.pin_d7 = Y9_GPIO_NUM;
  config.pin_xclk = XCLK_GPIO_NUM;
  config.pin_pclk = PCLK_GPIO_NUM;
  config.pin_vsync = VSYNC_GPIO_NUM;
  config.pin_href = HREF_GPIO_NUM;
  config.pin_sscb_sda = SIOD_GPIO_NUM;
  config.pin_sscb_scl = SIOC_GPIO_NUM;
  config.pin_pwdn = PWDN_GPIO_NUM;
  config.pin_reset = RESET_GPIO_NUM;
  config.xclk_freq_hz = 20000000;
  config.frame_size = FRAMESIZE_QVGA;
  config.pixel_format = PIXFORMAT_JPEG;
  config.grab_mode = CAMERA_GRAB_LATEST;
  config.fb_location = CAMERA_FB_IN_PSRAM;
  config.jpeg_quality = 30;
  config.fb_count = 1;

  if (config.pixel_format == PIXFORMAT_JPEG) {
    if (psramFound()) {
      config.jpeg_quality = 35;
      config.fb_count = 1;
      config.grab_mode = CAMERA_GRAB_LATEST;
    } else {
      config.frame_size = FRAMESIZE_QQVGA;
      config.fb_location = CAMERA_FB_IN_DRAM;
    }
  }

  esp_err_t err = esp_camera_init(&config);
  if (err != ESP_OK) {
    Serial.printf("Camera init failed with error 0x%x", err);
    return;
  }

  sensor_t *s = esp_camera_sensor_get();
  if (s->id.PID == OV3660_PID) {
    s->set_vflip(s, 1);
    s->set_brightness(s, 1);
    s->set_saturation(s, -2);
  }
  if (config.pixel_format == PIXFORMAT_JPEG) {
    s->set_framesize(s, FRAMESIZE_QVGA);
  }

  // Setup LED Flash if defined
  #if defined(LED_GPIO_NUM)
  setupLedFlash();
  #endif

  // Start AP for configuration
  WiFi.mode(WIFI_AP_STA);
  WiFi.softAP(ap_ssid, ap_password);
  Serial.println("AP started: ESP32-CAM-SETUP");
  Serial.println("AP IP: 192.168.4.1");

  // Connect to STA WiFi
  Serial.println("Connecting to WiFi...");
  WiFi.begin(currentSSID.c_str(), currentPassword.c_str());
  
  unsigned long startTime = millis();
  while (WiFi.status() != WL_CONNECTED && millis() - startTime < 15000) {
    delay(500);
    Serial.print(".");
  }
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("");
    Serial.println("WiFi connected!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    
    // Start mDNS
    if (MDNS.begin("esp32-cam")) {
      Serial.println("mDNS started: http://esp32-cam.local");
    } else {
      Serial.println("mDNS failed to start");
    }
    
    Serial.println("Camera Ready!");
  } else {
    Serial.println("");
    Serial.println("WiFi connection failed");
  }

  startCameraServer();

  // Web routes
  server.on("/", handleRoot);
  server.on("/save", HTTP_POST, handleSave);
  
  server.begin();
  Serial.println("Web server started");
}

void loop() {
  server.handleClient();
  delay(10);
}
