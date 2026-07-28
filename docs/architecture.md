# System Architecture

## Functional blocks

```text
Motor power source
  -> voltage and current measurement
  -> ESC / motor controller
  -> motor
  -> propeller

Independent tester power
  -> Arduino Nano ESP32 (intended target)
  -> accelerometer
  -> optical sensors
  -> thrust and torque load cells
  -> temperature sensors
  -> microSD logging
  -> connectivity and provisioning
  -> optional motor control
```

Tester power and motor power remain independent. No meaningful sensing mass is added to the rotating propeller; optical sensing and the accelerometer remain stationary.

## Primary sensors

- ADXL345 accelerometer on the stationary motor carriage
- Optical Sensor A for blade passage
- Optical Sensor B for a hub or motor-bell reference
- Load cell and HX711 for thrust
- Load cell and HX711 for reaction torque
- ACS758 current sensor
- DC voltage divider module
- DS18B20 temperature probes

## Calculated values

- RPM
- One-per-revolution vibration amplitude and phase
- Recommended correction imbalance, mass, radius, and angle
- Thrust
- Reaction torque
- Electrical input power and energy
- Mechanical shaft power
- Combined ESC and motor efficiency
- Thrust per watt

## Motor Control

```text
Motor command provider
├── External control
├── Live manual PWM
├── Programmed PWM sequence
├── Automatic closed-loop RPM control
└── Future control interfaces

Motor Control
├── External command mode
├── Internal standard ESC PWM output
├── Live manual PWM command
├── Programmed PWM sequence
├── Automatic closed-loop RPM control
├── Extensible future command interface
├── Arm/disarm state machine
├── Command limits
├── Safety shutdown inputs
└── Emergency shutdown behavior
```

Motor control is optional. In **external control**, an independent RC receiver, servo tester, external controller, or laboratory pulse generator supplies the ESC command; OpenPropLab is measurement-only. This mode remains available after internal control exists.

In **live manual PWM**, OpenPropLab supplies standard servo-style PWM selected by the operator through the local web interface. A typical configurable pulse range is approximately 1000–2000 microseconds, but minimum, maximum, neutral, and arming behavior depend on the ESC and must be configurable.

A **programmed PWM sequence** is a predefined open-loop list. Each step has at least a PWM or normalized-throttle command and hold time, plus an optional transition/ramp time—for example, 1200 microseconds for 10 seconds, 1400 for 15 seconds, 1600 for 15 seconds, then minimum command. It is not automatic RPM control.

**Automatic closed-loop RPM control** adjusts PWM from measured RPM feedback. Later capabilities may include a target RPM, controlled ramps, stepped sweeps, stabilization at each point, and automatic data acquisition. Future controller interfaces may be added, but no additional protocol is selected now.

The active command source is always explicit and displayed. External/Internal selection must be unambiguous, transitions must be safe, and minimum PWM is required before internal control can be enabled. Internal command is disabled by default; power-up, reset, communication loss, and faults never automatically start or resume the motor. Physical mode selection, electrical isolation, or a hardware interlock will be evaluated during hardware design rather than finalized here.

## Connectivity and Provisioning

```text
Connectivity and Provisioning
├── Normal Wi-Fi station mode
├── First-start setup access point
├── Local provisioning webpage
├── Nonvolatile credential storage
├── Setup/Wi-Fi-reset button
├── Connection retry and fallback behavior
├── Simple connection-status LED
└── Local OpenPropLab web server
```

The intended Arduino Nano ESP32 startup workflow is:

1. Detect whether valid Wi-Fi credentials are stored.
2. If credentials are missing, enter Wi-Fi setup access-point mode.
3. The user connects a phone or computer to the OpenPropLab setup network.
4. The user opens the local setup webpage and enters an SSID and password.
5. Store credentials in nonvolatile storage and restart.
6. Attempt to connect in Wi-Fi station mode.
7. Once connected, serve the local OpenPropLab webpage over that network.

`OpenPropLab-Setup` and `192.168.4.1` are provisional, configurable examples for the setup SSID and address, not fixed final values. Retry and fallback details remain to be decided. Normal users will not compile credentials into `secrets.h`; only the temporary Arduino Nano 33 IoT proof-of-concept firmware may continue that development mechanism.

With valid credentials, normal startup connects in station mode. No credentials, holding the setup/Wi-Fi-reset button during startup, or a sufficiently long button hold enters setup mode; the long-hold case erases credentials first. Exact hold times remain undecided. The button never arms or starts the motor, and setup mode forces motor control disarmed.

One ordinary connection-status LED will primarily report Wi-Fi state: provisionally, slow blink means setup access-point mode, faster blink means connecting, and steady on or a short repeating confirmation blink means connected. Off may mean no power, initialization, or an undefined state depending on the final circuit. Exact timing remains pending. This LED lets an operator confirm connection without a serial monitor, but it is not the sole motor-safety indication.

The local interface is developed first as a self-contained static mock with simulated data. The same assets will later be served by the Arduino Nano ESP32, with Arduino HTTP endpoints and a Server-Sent Events or WebSocket stream replacing mock data. The browser interface is not a safety device, and Wi-Fi loss does not physically isolate motor power.

## Development hardware status

The Arduino Nano ESP32 remains the intended production and development target. The currently available Arduino Nano 33 IoT is only a temporary test board used to validate PlatformIO, firmware upload, Wi-Fi connectivity, local HTTP serving, and the mock interface. Its basic hosted-page proof of concept works; final Nano ESP32 validation, full mock-interface serving, and production provisioning remain pending.
