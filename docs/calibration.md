# Calibration

## Required calibration areas

- Thrust load cell
- Torque load cell and lever-arm length
- Voltage measurement
- Current measurement
- RPM timing
- Accelerometer orientation and offset
- Optical sensor alignment
- Trial balancing masses and correction radius
- Cross-coupling between thrust and torque channels

## Load cells

Apply several known masses in both increasing and decreasing order. Record raw readings, fitted scale, zero offset, repeatability, and residual error.

For torque calibration, apply a known mass at a measured lever-arm distance:

```text
torque = mass x gravitational acceleration x lever length
```

## Electrical channels

Compare the voltage and current readings against a trusted meter at several operating points. Store calibration coefficients in nonvolatile memory with a date and hardware identifier.

## Balancing workflow

1. Record baseline vibration amplitude and phase.
2. Add a known trial mass at a known radius and angle.
3. Repeat the run at the same RPM.
4. Calculate the influence coefficient and recommended correction.
5. Remove the trial mass, apply the correction, and verify the final vibration.

Calibration procedures and acceptance tolerances will be refined through prototype testing.
