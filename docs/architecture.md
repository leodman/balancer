# System Architecture

## Functional blocks

```text
Motor power source
  -> voltage and current measurement
  -> ESC / motor controller
  -> motor
  -> propeller

Independent tester power
  -> Arduino Nano ESP32
  -> accelerometer
  -> optical sensors
  -> thrust and torque load cells
  -> temperature sensors
  -> microSD logging
  -> local Wi-Fi webpage
```

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

## Communications

The Arduino Nano ESP32 creates a Wi-Fi access point and hosts a local browser interface. A future mode may allow connection to an existing Wi-Fi network.
