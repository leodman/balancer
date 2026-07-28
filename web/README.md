# OpenPropLab static web mock

This directory contains the first interactive mock of the local OpenPropLab instrument console. It is a dependency-free HTML, CSS, and vanilla JavaScript prototype; **every measurement and balancing recommendation is simulated demonstration data**. It does not communicate with an Arduino or control a motor.

## Run locally

Open [`index.html`](index.html) directly in a modern browser. All assets are local, so the mock works offline and does not make network requests.

If a browser feature or development tool prefers HTTP, serve the repository with any simple static server, for example:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000/web/`. The HTTP server is optional and is not part of the application.

## Prototype data boundary

`app.js` currently owns an in-memory simulation loop:

- `simulate()` creates the twice-per-second sensor sample and calculated power values.
- `renderSample()`, `renderChart()`, and `renderTable()` present each sample.
- `start()` and `stop()` change mock acquisition state only.
- `download()` exports the session buffer in the browser.

In a later firmware integration, the Arduino Nano ESP32 will serve these same static files. Initial configuration and commands can use Arduino HTTP endpoints, while live samples should feed the rendering functions through Server-Sent Events or a WebSocket. The simulation producer will be removed; the presentation and browser-only export code can remain. Real motor power isolation and emergency stopping must be implemented in hardware, not delegated to this interface.

## Limitations

- Values are synthetic and are not suitable for engineering decisions.
- Settings and samples are reset on reload.
- The Balance Wizard demonstrates workflow and output formatting, not balancing mathematics.
- Motor control is intentionally unavailable. Future controls shown or added to the interface will be command surfaces, not safety devices; webpage accessibility alone must never enable internal ESC command.
