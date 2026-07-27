#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "secrets.h"

namespace {
WiFiServer server(80);

const char testPage[] = R"HTML(<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>OpenPropLab firmware test</title>
  <style>
    body { font: 1.1rem system-ui, sans-serif; margin: 3rem auto; max-width: 42rem; padding: 0 1rem; }
    h1 { color: #1261a0; }
    .status { background: #e8f5e9; border-left: .4rem solid #2e7d32; padding: 1rem; }
  </style>
</head>
<body>
  <h1>OpenPropLab</h1>
  <p class="status">Arduino Nano 33 IoT web server is running.</p>
  <p>This is the first OpenPropLab firmware prototype.</p>
</body>
</html>
)HTML";

void connectToWifi() {
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("WiFiNINA module not detected. Check the board and firmware.");
    while (true) {
      delay(1000);
    }
  }

  Serial.print("Connecting to ");
  Serial.println(WIFI_SSID);
  while (WiFi.status() != WL_CONNECTED) {
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    for (uint8_t attempt = 0;
         attempt < 10 && WiFi.status() != WL_CONNECTED;
         ++attempt) {
      Serial.print('.');
      delay(1000);
    }
    Serial.println();
  }

  Serial.println("Wi-Fi connected.");
  Serial.print("Open http://");
  Serial.print(WiFi.localIP());
  Serial.println("/ in a browser.");
}

void sendResponse(WiFiClient &client, bool found) {
  if (found) {
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html; charset=utf-8");
  } else {
    client.println("HTTP/1.1 404 Not Found");
    client.println("Content-Type: text/plain; charset=utf-8");
  }
  client.println("Connection: close");
  client.println();
  client.print(found ? testPage : "Not found\n");
}

void handleClient() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  client.setTimeout(1000);
  const String requestLine = client.readStringUntil('\n');
  const bool rootRequested = requestLine.startsWith("GET / ");

  // Consume the rest of the HTTP headers before writing the response.
  while (client.connected()) {
    const String header = client.readStringUntil('\n');
    if (header == "\r" || header.length() == 0) {
      break;
    }
  }

  sendResponse(client, rootRequested);
  delay(1);
  client.stop();
}
}  // namespace

void setup() {
  Serial.begin(115200);
  const unsigned long serialWaitStarted = millis();
  while (!Serial && millis() - serialWaitStarted < 5000) {
  }

  Serial.println("\nOpenPropLab Nano 33 IoT web test");
  connectToWifi();
  server.begin();
  Serial.println("Web server started.");
}

void loop() {
  handleClient();
}
