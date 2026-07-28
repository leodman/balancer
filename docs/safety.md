# Safety

A rotating propeller can fracture or detach and release high-energy fragments. Treat the device as hazardous machinery.

## Minimum safeguards

- Fully contain the propeller plane with clear polycarbonate.
- Operate the stand remotely and keep people outside the propeller plane.
- Use a physical emergency stop that interrupts motor power independently of software.
- Keep tester power separate from motor power.
- Never route motor current through Arduino wiring or ground traces.
- Begin every new configuration with the propeller removed.
- Validate RPM sensing, current sensing, and emergency shutdown before powered propeller tests.
- Set maximum RPM, current, voltage, temperature, and vibration limits.
- Stop automatically after sensor failure, communication loss, or watchdog timeout.
- Inspect the propeller, hub, motor mount, load-cell mounts, and enclosure before each run.

## Internal ESC-command safety architecture

Access to the webpage never makes internal ESC command available. Internal command is disabled by default and requires an explicit arm/disarm state, minimum PWM at startup, and the configurable arming procedure for the selected ESC. The active External/Internal source and control mode must be unambiguous, with safe transitions between modes.

The physical emergency stop and independent motor-power disconnect must operate independently of firmware, the browser, and Wi-Fi. A Wi-Fi disconnection can trigger a software shutdown response but does not itself physically isolate motor power. Physical mode selection, electrical isolation, or a hardware interlock remains to be evaluated during hardware design.

Before internal powered operation, the safety state machine must define and validate:

- watchdog and loss-of-communication responses;
- invalid-sensor responses;
- overcurrent and overspeed shutdowns;
- excessive-vibration shutdown;
- motor-, ESC-, and battery-temperature shutdowns;
- latched faults where appropriate, followed by deliberate reset before rearming; and
- emergency shutdown behavior that returns the ESC command to its defined safe state while independent hardware removes motor power.

There is no automatic motor start after power-up or reset, no automatic resumption after communication loss or a fault, and no automatic restart after a power interruption. Wi-Fi setup access-point mode forces the motor-control subsystem disarmed. The setup/Wi-Fi-reset button cannot arm or start the motor, and the connection-status LED is not the only motor-safety indication.

## Development rule

Measurement capabilities—including RPM and vibration sensing—are developed and validated before automatic motor control. Internal PWM is first validated on the bench without a propeller. Automatic ESC control must not be enabled until sensing, shutdown logic, hardware interlocks, and a tested emergency-stop path are present. The present prototype is not validated as safe for automatic motor operation.

This document is an initial engineering safety checklist, not a certification or substitute for a formal risk assessment.
