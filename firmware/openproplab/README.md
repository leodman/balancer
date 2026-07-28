# Firmware

Arduino Nano ESP32 firmware will live here.

Planned modules:

- Sensor acquisition
- RPM and phase timing
- Synchronous vibration analysis
- Load-cell acquisition
- Electrical and temperature measurement
- Calibration storage
- Connectivity and provisioning (Wi-Fi station mode, first-start setup access point, local provisioning, nonvolatile credentials, setup/Wi-Fi-reset button, connection-status LED, retry/fallback behavior, and local server)
- Arm/disarm and safety state machine
- Local web API
- Data logging
- Optional extensible motor command provider: external control, internal standard servo-style PWM, live manual PWM, programmed PWM sequence, and later automatic closed-loop RPM control

The Arduino Nano ESP32 is the intended target. The Arduino Nano 33 IoT project is only a temporary proof of concept. Internal motor command remains disabled by default and will not be implemented for powered-propeller use until sensing, interlocks, shutdown logic, and emergency-stop behavior are validated.
