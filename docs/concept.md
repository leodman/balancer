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
- External control remains available for measurement-only tests; an optional internal motor-control subsystem is added only after its safety requirements are validated.

## Optional motor-command modes

The active ESC command source must always be explicit. The extensible motor command provider comprises:

1. **External control** — an RC receiver, servo tester, external controller, or laboratory pulse generator commands the ESC; OpenPropLab measures but does not command speed.
2. **Live manual PWM** — OpenPropLab generates standard servo-style PWM and the operator selects the command through the local web interface. The normally approximately 1000–2000 microsecond range, minimum, maximum, neutral, and arming behavior are configurable for the selected ESC.
3. **Programmed PWM sequence** — the operator predefines open-loop steps containing a PWM or normalized-throttle command, hold time, and optional transition/ramp time. This is not automatic RPM control.
4. **Automatic closed-loop RPM control** — measured RPM feeds back to the PWM command for a target, controlled ramp, stepped sweep, stabilization, and later automatic data acquisition.
5. **Future control interfaces** — the architecture permits later command methods without selecting another protocol now.

Documentation and interface design precede implementation. Internal command is disabled by default and external measurement-only operation remains a permanent capability.

## Development sequence

1. RPM, blade passage, vibration amplitude, and vibration phase
2. Trial-mass balancing workflow
3. Thrust measurement
4. Voltage, current, power, and energy measurement
5. Torque and shaft-power measurement
6. External measurement-only operation and safety-system validation
7. Internal PWM generation without a propeller, then live manual PWM
8. Programmed PWM sequences
9. Automatic closed-loop RPM control and automated test sweeps
