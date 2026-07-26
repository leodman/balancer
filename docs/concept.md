# Project Concept

OpenPropLab combines three functions in one open-source instrument:

1. Dynamic propeller balancing
2. Static thrust and reaction-torque testing
3. Electrical characterization of the complete ESC, motor, and propeller drive

The first implementation will use an Arduino Nano ESP32 and common off-the-shelf modules. The instrument has its own independent power supply. The motor under test is powered by a separate battery or DC supply.

## Design principles

- No sensor, magnet, encoder disk, or measurable marker mass is added to the rotating propeller.
- Optical sensors remain stationary behind the propeller.
- The accelerometer is mounted on the stationary motor carriage.
- Motor electrical power is measured at the ESC input.
- The device operates without cloud services through a local webpage.
- The first hardware version avoids custom PCBs and specialized laboratory instrumentation.
- One-blade and multiblade propellers are supported.

## Development sequence

1. RPM, blade passage, vibration amplitude, and vibration phase
2. Trial-mass balancing workflow
3. Thrust measurement
4. Voltage, current, power, and energy measurement
5. Torque and shaft-power measurement
6. Automatic RPM control and automated test sweeps
