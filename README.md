# OpenPropLab

OpenPropLab is an open-source, Arduino-based propeller balancing and motor/propeller characterization platform for RC aircraft and drones.

The project is designed around common off-the-shelf modules that can be purchased from ordinary retailers. Nothing needs to be attached to the rotating propeller for measurement.

## Planned measurements

- Propeller vibration magnitude and phase
- Recommended balancing correction mass and angular position
- RPM and blade-passage timing
- Static thrust
- Reaction torque
- Drive input voltage, current, power, and energy
- Mechanical shaft power and combined ESC/motor efficiency
- Motor, ESC, and battery temperature

## Core design

- Arduino Nano ESP32 as the intended production and development target
- Local Wi-Fi webpage hosted by the device
- ADXL345 vibration sensor mounted on the stationary motor carriage
- Stationary optical sensors behind the propeller
- Two load cells for thrust and reaction torque
- Independent tester power and motor power
- Commodity Amazon-style modules; no custom PCB required for the first version
- Optional ESC command subsystem with external control, live manual PWM, programmed PWM sequences, and later automatic closed-loop RPM control

## Safety

A rotating propeller can fail violently. Development and testing require a polycarbonate containment guard, remote operation, an emergency stop, current and RPM limits, and hardware motor-power isolation. Read [docs/safety.md](docs/safety.md) before operating the device.

## Repository structure

- `docs/` — design, architecture, wiring, calibration, safety, and bill of materials
- `hardware/` — diagrams, mechanical designs, and enclosure designs
- `firmware/` — Arduino firmware
- `web/` — local browser interface
- `simulation/` — balancing and sensor simulations
- `tests/` — automated and hardware validation tests
- `data/examples/` — example measurements and test datasets

## Project status

Phase 1 is in progress. A basic Arduino-hosted webpage proof of concept has validated PlatformIO, firmware upload, Wi-Fi connectivity, local HTTP serving, and the mock-webpage approach on an Arduino Nano 33 IoT used only as a temporary test board. Target validation on the Arduino Nano ESP32, the complete mock interface, first-start Wi-Fi provisioning, credential storage, setup/Wi-Fi-reset-button behavior, a connection-status LED, and a local status endpoint remain pending.

The production design will use a Wi-Fi setup access point and local provisioning webpage rather than requiring normal users to compile credentials into firmware. Measurement-only operation and safety validation precede internal ESC command and automatic motor operation.

## Web interface mock

The first offline, simulated OpenPropLab instrument interface is available in [`web/`](web/README.md). Open [`web/index.html`](web/index.html) directly in a browser to explore the dashboard, balancing workflow, test setup, results export, and settings without connected hardware.
