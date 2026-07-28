# Drawing Revision Report

No drawing is changed by this documentation update. Revised artwork will be supplied separately.

## Current files and references

| Current file | Current subject | Documentation references |
|---|---|---|
| `hardware/diagrams/arduino_propeller_balancer_wiring_guide.svg` | Initial wiring poster | `docs/wiring.md`, `hardware/diagrams/README.md` |
| `hardware/diagrams/ChatGPT Image Jul 26, 2026, 05_35_13 PM.png` | Concept/reference image | `hardware/diagrams/README.md` (inventory reference) |
| `docs/reference/openproplab_web_mockup.png` | Web-interface reference | `docs/reference/README.md` |

## Revisions expected

- The current wiring SVG is likely to require replacement or revision to show the Arduino Nano ESP32 target, independent tester and motor power, optional external/internal ESC command routing, setup/Wi-Fi-reset button, ordinary connection-status LED, emergency stop, independent motor-power disconnect, and safety/interlock signals.
- The current concept PNG may require replacement if it represents the earlier architecture; its provenance and intended authoritative role need confirmation.
- The web mockup PNG does not require an architectural redraw solely for these decisions, though a later interface reference may need explicit active-mode and arm/disarm indications. The browser must not be presented as a safety device.

Future revised drawing subjects are: complete system architecture; ESC control-mode architecture; Wi-Fi provisioning flow; setup button and status LED; safety and interlock architecture; and updated wiring overview. Filenames are intentionally not assigned until the drawings are uploaded.
