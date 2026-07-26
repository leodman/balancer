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

- Arduino Nano ESP32
- Local Wi-Fi webpage hosted by the device
- ADXL345 vibration sensor mounted on the stationary motor carriage
- Stationary optical sensors behind the propeller
- Two load cells for thrust and reaction torque
- Independent tester power and motor power
- Commodity Amazon-style modules; no custom PCB required for the first version

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

Initial architecture and documentation stage.
