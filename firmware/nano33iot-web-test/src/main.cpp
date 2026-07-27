#include <Arduino.h>
#include <SPI.h>
#include <WiFiNINA.h>

#include "secrets.h"
#include "web_assets.h"

namespace {
WiFiServer server(80);

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

void writeAsset(WiFiClient &client, const uint8_t *data, size_t length) {
  constexpr size_t chunkSize = 512;
  for (size_t offset = 0; offset < length; offset += chunkSize) {
    const size_t remaining = length - offset;
    const size_t count = remaining < chunkSize ? remaining : chunkSize;
    client.write(data + offset, count);
  }
}

void sendResponse(WiFiClient &client, const char *contentType,
                  const uint8_t *content, size_t contentLength) {
  client.println("HTTP/1.1 200 OK");
  client.print("Content-Type: ");
  client.println(contentType);
  client.print("Content-Length: ");
  client.println(contentLength);
  client.println("Cache-Control: no-cache");
  client.println("Connection: close");
  client.println();
  writeAsset(client, content, contentLength);
}

void sendNotFound(WiFiClient &client) {
  static const uint8_t notFound[] = "Not found\n";
  client.println("HTTP/1.1 404 Not Found");
  client.println("Content-Type: text/plain; charset=utf-8");
  client.print("Content-Length: ");
  client.println(sizeof(notFound) - 1);
  client.println("Connection: close");
  client.println();
  client.write(notFound, sizeof(notFound) - 1);
}

void handleClient() {
  WiFiClient client = server.available();
  if (!client) {
    return;
  }

  client.setTimeout(1000);
  const String requestLine = client.readStringUntil('\n');

  // Consume the rest of the HTTP headers before writing the response.
  while (client.connected()) {
    const String header = client.readStringUntil('\n');
    if (header == "\r" || header.length() == 0) {
      break;
    }
  }

  if (requestLine.startsWith("GET / ") ||
      requestLine.startsWith("GET /index.html ")) {
    sendResponse(client, "text/html; charset=utf-8", index_html,
                 index_html_len);
  } else if (requestLine.startsWith("GET /styles.css ")) {
    sendResponse(client, "text/css; charset=utf-8", styles_css,
                 styles_css_len);
  } else if (requestLine.startsWith("GET /app.js ")) {
    sendResponse(client, "application/javascript; charset=utf-8", app_js,
                 app_js_len);
  } else {
    sendNotFound(client);
  }
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
