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

## Development rule

Automatic ESC control must not be enabled until hardware interlocks and a tested emergency-stop path are present.

This document is an initial engineering safety checklist, not a certification or substitute for a formal risk assessment.
