# OpenPropLab Project Proposal

## 1. Project summary

OpenPropLab is an open-source, Arduino-based propeller balancing and motor/propeller characterization platform for RC aircraft, drones, fans, and related rotating systems.

The system is intended to be self-contained, low-cost, reproducible, and built from ordinary off-the-shelf modules. The first implementation targets the Arduino Nano ESP32 and provides a local webpage hosted directly by the device.

The project combines three capabilities that are usually separate:

1. Dynamic propeller balancing
2. Motor/propeller thrust and torque characterization
3. Electrical input-power and energy measurement

The instrument will support propellers with one or more blades, including one-blade configurations with counterweights. Measurement must not require adding a magnet, encoder disk, sensor, or other meaningful mass to the rotating assembly.

## 2. Objectives

The project will:

- Measure RPM and blade-passage timing using stationary optical sensors.
- Measure vibration magnitude and phase using a stationary accelerometer mounted on the motor carriage.
- Recommend balancing correction mass, radius, and angular position.
- Measure thrust with a load cell.
- Measure reaction torque with a second load cell and known lever arm.
- Measure drive input voltage, current, power, capacity, and energy.
- Calculate mechanical shaft power and combined ESC/motor efficiency.
- Monitor motor, ESC, and battery temperatures.
- Host a responsive local web interface over Wi-Fi.
- Operate without cloud services or an external internet connection.
- Use common modules available through ordinary electronics retailers.
- Remain open source and reproducible by other builders.

## 3. Design principles

### 3.1 No added rotating measurement mass

The normal measurement configuration must not add a magnet, encoder, sensor, wire, or substantial marker to the propeller or hub.

Preferred sensing:

- Optical Sensor A detects blade passage from behind the propeller.
- Optical Sensor B detects an existing hub, spinner, motor-bell, screw, slot, or surface feature for a once-per-revolution phase reference.

### 3.2 Independent power domains

The test device and the motor drive use independent power sources.

The electrical measurement point is:

```text
Battery or DC power supply
→ voltage and current measurement
→ ESC or motor controller
→ motor
→ propeller
```

The measured electrical power therefore represents the complete drive input consumed by the ESC/controller, motor, downstream wiring, and propeller load. Arduino and sensor consumption are excluded.

### 3.3 Commodity components

The first version should avoid:

- Custom PCBs
- Laboratory accelerometers
- Rotary torque transducers
- Proprietary DAQ hardware
- Cloud services
- Dedicated desktop or mobile applications

The reference build should use an Arduino Nano ESP32, ADXL345, ordinary optical modules, HX711 load-cell modules, common load cells, a current sensor, voltage divider, DS18B20 temperature probes, and standard wiring and construction materials.

### 3.4 Measurement before motor control

Motor control is intentionally deferred.

The first validated versions will be measurement-only. Automatic ESC control, RPM regulation, and automated sweeps will be added only after hardware interlocks, current limits, vibration shutdown, temperature shutdown, watchdog behavior, and emergency stopping have been validated.

## 4. Initial system architecture

```text
OpenPropLab
├── Arduino Nano ESP32
│   ├── Wi-Fi access point
│   ├── Local HTTP server
│   ├── Configuration
│   ├── Acquisition timing
│   ├── Signal processing
│   ├── Calculations
│   └── Logging
├── Optical Sensor A
│   └── Blade passage
├── Optical Sensor B
│   └── Hub / once-per-revolution reference
├── ADXL345
│   └── X/Y/Z vibration
├── HX711 + load cell #1
│   └── Thrust
├── HX711 + load cell #2
│   └── Reaction torque
├── Voltage and current sensing
│   └── Drive electrical input
├── DS18B20 probes
│   └── Motor / ESC / battery temperature
├── microSD or flash logging
└── Local browser interface
```

## 5. Measurement model

### Electrical input power

```text
P_electrical = voltage × current
```

### Mechanical shaft power

```text
P_shaft = torque × 2 × π × RPM / 60
```

### Combined drive efficiency

```text
Efficiency = P_shaft / P_electrical
```

### Torque

```text
Torque = measured reaction force × lever arm
```

### Balancing

The first practical balancing implementation will use a baseline run followed by a known trial-mass run. An influence-coefficient calculation will produce the correction vector.

The interface must report:

- Correction mass
- Correction radius
- Absolute angular position
- Position relative to Blade 1 or the hub reference
- Equivalent remove-mass position approximately 180 degrees opposite
- Verification result after correction

## 6. Project phases

### Phase 0 — Project foundation

Deliverables:

- Repository structure
- Project proposal
- Architecture documentation
- Bill of materials
- Wiring documentation
- Safety document
- Contribution guide
- Mock webpage

Exit criteria:

- Repository is understandable to a new contributor.
- Browser mock runs offline.
- Scope and design principles are documented.

### Phase 1 — Arduino-hosted web preview

Deliverables:

- Arduino Nano ESP32 PlatformIO project
- LittleFS-hosted webpage
- Standalone Wi-Fi access point
- Local HTTP server
- Static `/api/status` endpoint
- Exact upload instructions

Exit criteria:

- A phone or computer connects directly to the Arduino.
- `http://192.168.4.1` loads the same mock interface.
- No sensor hardware is required.

### Phase 2 — Optical RPM and phase sensing

Deliverables:

- Blade optical sensor input
- Hub reference input
- Interrupt-based timestamp capture
- Blade-count configuration from 1 to 12
- RPM calculation
- Pulse-quality diagnostics
- Phase-reference validation

Exit criteria:

- RPM is stable and repeatable across the target range.
- One-blade operation is supported.
- No added rotating sensor mass is required.

### Phase 3 — Vibration acquisition

Deliverables:

- ADXL345 SPI driver
- Configurable range and sampling rate
- Timestamped X/Y/Z sampling
- Raw data display and export
- Sensor-orientation configuration

Exit criteria:

- Vibration changes are repeatable.
- Known temporary imbalance produces a visible response.
- Sampling loss and timing jitter are reported.

### Phase 4 — Synchronous balancing analysis

Deliverables:

- Rotor-angle reconstruction
- 1× vibration amplitude and phase
- Revolution averaging
- Rejection of poor revolutions
- Baseline and trial-mass workflow
- Influence-coefficient correction calculation
- Verification run

Exit criteria:

- Repeated baseline runs agree within a documented tolerance.
- A known trial mass produces a predictable vector change.
- The recommended correction reduces vibration in controlled tests.

### Phase 5 — Thrust and electrical measurements

Deliverables:

- Thrust load cell
- Voltage measurement
- Current measurement
- Electrical power, capacity, and energy
- Calibration workflow
- Live dashboard integration

Exit criteria:

- Thrust calibration is repeatable.
- Voltage and current agree with reference instruments within documented limits.
- Electrical input values are synchronized with RPM and vibration.

### Phase 6 — Torque and efficiency

Deliverables:

- Reaction-torque load cell
- Lever-arm calibration
- Shaft-power calculation
- Combined drive-efficiency calculation
- Uncertainty and sanity checks

Exit criteria:

- Applied calibration torque is measured within documented tolerance.
- Shaft power remains physically plausible.
- Efficiency never exceeds 100% after calibration and filtering.

### Phase 7 — Integrated logging and reports

Deliverables:

- CSV and JSON logging
- Test metadata
- Propeller and motor profiles
- Results history
- Downloadable test reports
- Example datasets

Exit criteria:

- A complete test can be reproduced from exported data.
- Data formats are documented and versioned.

### Phase 8 — Controlled motor operation

Deliverables:

- ESC output
- Arm/disarm state machine
- Physical emergency stop input
- Hardware motor-power isolation
- Current, RPM, vibration, and temperature shutdowns
- Watchdog and communication-loss behavior
- Closed-loop RPM control
- Automated sweeps

Exit criteria:

- Hardware emergency stop operates independently of firmware.
- All shutdown paths are tested.
- Automated motor operation is disabled by default.

## 7. Suggested work order

The recommended immediate sequence is:

1. Arduino-hosted web preview
2. Optical blade sensor
3. Optional hub-reference sensor
4. ADXL345 raw acquisition
5. RPM and synchronous vibration analysis
6. Trial-mass balancing workflow
7. Thrust measurement
8. Voltage and current measurement
9. Torque measurement
10. Integrated reports
11. Motor control only after safety validation

## 8. Safety requirements

A rotating propeller can fragment and eject material at high speed. Safety is part of the product architecture, not only documentation.

Minimum requirements before powered propeller tests:

- Polycarbonate containment enclosure
- Remote operation
- Physical emergency stop
- Independent motor-power disconnect
- Arm/disarm control
- Current limit
- RPM limit
- Excess-vibration shutdown
- Motor, ESC, and battery temperature limits
- Watchdog behavior
- Sensor-failure handling
- Loss-of-communication handling
- No people in the propeller plane

Motor-control features must not be merged as production-ready until these requirements have explicit validation evidence.

## 9. Testing strategy

Testing will be performed at four levels:

### Software unit tests

- RPM math
- Angular calculations
- Vector and balancing calculations
- Power and efficiency calculations
- CSV and JSON serialization

### Simulation tests

- Synthetic pulse streams
- Synthetic vibration signals
- Known imbalance vectors
- Missing and duplicate pulse cases
- Sensor saturation and noise

### Bench tests without a propeller

- Wi-Fi and webpage
- Optical triggering with a hand target
- Accelerometer response
- Load-cell calibration
- Voltage and current calibration
- Emergency-stop logic

### Guarded rotating tests

- Low RPM first
- Progressive RPM increase
- Repeatability runs
- Trial-weight validation
- Before/after balance comparison
- Cross-check against reference instruments

## 10. Documentation deliverables

The repository should ultimately include:

- Assembly instructions
- Wiring diagrams
- Mechanical drawings
- Enclosure design
- Bill of materials
- Calibration procedures
- Safety procedures
- Firmware build and upload instructions
- Web interface documentation
- API documentation
- Data format documentation
- Example test reports
- Troubleshooting guide

## 11. Open-source release model

The project should be easy to fork, reproduce, and improve.

Recommended release artifacts:

- Source code
- Compiled firmware binaries
- LittleFS image
- Wiring SVGs
- Mechanical drawings and printable parts
- BOM with generic search terms
- Calibration templates
- Example datasets
- Tagged releases with change logs

## 12. Current status

Completed:

- Repository initialized
- Initial documentation structure
- Browser-based interactive mock webpage
- Mock webpage validated in Google Colab
- Initial wiring visual and bill of materials

Next milestone:

> Host the existing mock webpage directly from the Arduino Nano ESP32 over its own Wi-Fi network.
