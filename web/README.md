# OpenPropLab standalone web mock

This folder is the design source for the offline OpenPropLab control-architecture mock. It uses dependency-free HTML, CSS, and vanilla JavaScript. Every measurement, command, fault, Wi-Fi state, balancing result, and exported sample is simulated; the mock makes no network requests, cannot connect to an Arduino, and cannot control a motor.

## Run locally

Open [`index.html`](index.html) directly in a modern browser, or serve the repository locally:

```sh
python3 -m http.server 8000
```

Then open `http://localhost:8000/web/`. No build step is required.

## Review areas

The mock provides responsive Dashboard, Balance, Motor Control, Test Sequence, Wi-Fi Setup, Settings, and Data / Export sections. It demonstrates:

- persistent mock, target-board, Wi-Fi, command-mode, arm, motor, and fault status;
- external measurement-only control, deliberate live manual PWM, programmed open-loop PWM sequences, and simple automatic closed-loop RPM simulation;
- default-disarmed behavior, an arming checklist, simulated emergency stop, latched faults, and configurable simulated limits;
- in-memory provisioning states and a single ordinary connection-status LED representation;
- coherent synthetic measurements, a demonstration balancing workflow, rolling trace, and CSV/JSON export.

## Safety and data boundary

The interface is not a safety device. Real emergency stopping and motor-power isolation must be independent hardware. Mode changes, setup mode, disarm, and faults return this simulation to minimum command, but browser behavior cannot guarantee a real motor state.

No credentials or settings persist after reload. Do not enter a real Wi-Fi password. Reloading restores safe defaults, clears session data, and returns the mock to disarmed external-control mode.

The Arduino Nano ESP32 is the intended target. The Nano 33 IoT remains a temporary development board; this standalone mock is not yet duplicated into either firmware project.

## Known limitations

- The plant and RPM controller are deliberately simple visual simulations, not engineering models.
- The balancing recommendation is formatting/workflow demonstration data, not implemented balancing mathematics.
- Communication timeout is displayed as an active limit, but communication-loss testing uses the explicit fault-injection button because no real communications channel exists.
- Wi-Fi connection, restart, setup AP, button, and LED behavior are state simulations only.
