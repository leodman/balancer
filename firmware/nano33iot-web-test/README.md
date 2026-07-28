# OpenPropLab Nano 33 IoT web test

This PlatformIO project is a temporary OpenPropLab proof of concept, not the final target firmware. It connects
an Arduino Nano 33 IoT to Wi-Fi with WiFiNINA and serves the complete approved simulation over
HTTP. It validates PlatformIO, upload, Wi-Fi connectivity, local HTTP serving,
and the mock-interface approach while Arduino Nano ESP32 Phase 1 work remains pending.

## Requirements

- Arduino Nano 33 IoT
- A USB cable that supports data
- A 2.4 GHz Wi-Fi network
- [PlatformIO Core](https://docs.platformio.org/en/latest/core/installation/index.html)
  or the PlatformIO IDE extension for Visual Studio Code

## Configure Wi-Fi

This temporary development firmware compiles credentials from `secrets.h` only as a development convenience. The intended Arduino Nano ESP32 workflow uses a Wi-Fi setup access point, local provisioning webpage, and nonvolatile credential storage; normal users will not edit `secrets.h`.

From this directory, copy the credentials template:

```sh
cp include/secrets.example.h include/secrets.h
```

Edit `include/secrets.h` and replace the placeholder values with the network
name and password. The populated file is ignored by Git so credentials are not
committed.

## Build, upload, and run

Connect the Nano 33 IoT over USB, then run:

```sh
pio run
pio run --target upload
pio device monitor
```

The serial monitor runs at 115200 baud. After the board connects, it prints a
URL such as `http://192.168.1.42/`. Open that URL from a device on the same
network to see the OpenPropLab test page.

Press **Ctrl+C** to exit the serial monitor. If PlatformIO cannot select the
upload port automatically, list ports with `pio device list` and set
`upload_port` in `platformio.ini` or pass `--upload-port PORT` to the upload
command.

## Project layout

- `platformio.ini` selects the Arduino Nano 33 IoT, Arduino framework, and
  WiFiNINA dependency.
- `src/main.cpp` connects to Wi-Fi and handles HTTP requests on port 80.
- `data/` is an automatically synchronized copy of the design source in `../../web/`.
- `tools/generate_web_assets.py` copies the approved files and generates
  `src/web_assets.h`. PlatformIO runs it before each build. To regenerate manually,
  run `python3 tools/generate_web_assets.py` from this directory.
- Generated assets are separate `PROGMEM` byte arrays and are sent in 512-byte
  chunks rather than copied into whole-file `String` objects in RAM.
- `include/secrets.example.h` is the safe-to-commit credentials template.

The routes are `/`, `/index.html`, `/styles.css`, `/app.js`, and `/api/status`.
Unknown routes return 404. No credentials are exposed. There are deliberately no
motor-command API routes; all page controls remain browser-only simulation.
