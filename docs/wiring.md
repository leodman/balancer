# Wiring

The initial proposed pin assignment is documented in the wiring diagram under `hardware/diagrams/`. That drawing predates the provisioning and expanded motor-control architecture and requires revision; see [the drawing revision report](drawing-revision-report.md). Existing drawings are retained until replacements are supplied.

## Example Arduino Nano ESP32 assignments

| Function | Interface | Pin |
|---|---|---|
| Blade optical sensor | Digital interrupt | D2 |
| Hub optical sensor | Digital interrupt | D3 |
| Thrust HX711 data | Digital | D4 |
| Thrust HX711 clock | Digital | D5 |
| Torque HX711 data | Digital | D6 |
| Torque HX711 clock | Digital | D7 |
| DS18B20 data | OneWire | D8 |
| ADXL345 interrupt | Digital, optional | D9 |
| ADXL345 chip select | SPI | D10 |
| SPI MOSI | SPI | D11 |
| SPI clock | SPI | D12 |
| SPI MISO | SPI | D13 |
| microSD chip select | SPI | D14 |
| ESC signal | PWM, optional | D15 |
| Setup/Wi-Fi-reset button | Digital input, provisional | TBD |
| Connection-status LED | Digital output, provisional | TBD |
| Current sensor | Analog | A0 |
| Voltage sensor | Analog | A1 |

## Power rules

- The Arduino and all tester electronics use an independent USB-C or regulated 5 V supply.
- The motor uses a separate battery or DC power supply.
- Voltage is measured at the ESC input.
- Current is measured in series with the ESC input.
- Grounds connect at one controlled point when required by the selected non-isolated sensor modules.
- Motor current must never flow through Arduino ground wiring.
- All ESP32 analog inputs must remain within the permitted ADC voltage range.
- The emergency stop and independent motor-power disconnect must not depend on the browser interface, Wi-Fi, or the ESC-signal pin.
- Physical External/Internal selection, electrical isolation, or a hardware interlock will be evaluated during hardware design; the active source must be unambiguous.
- Entering Wi-Fi setup access-point mode must leave internal motor command disabled and disarmed.

The pin assignment is provisional and may change after breadboard testing. Exact setup-button hold times, LED timing, ESC output circuitry, control-source selection, and interlock wiring are intentionally not finalized.
