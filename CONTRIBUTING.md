# Contributing

Contributions are welcome for firmware, web UI, electronics, mechanical design, calibration, safety analysis, documentation, and test data.

## Basic workflow

1. Open an issue describing the proposed change.
2. Create a focused branch.
3. Keep hardware assumptions and safety limitations explicit.
4. Include test evidence or calculations where applicable.
5. Submit a pull request with a clear description of what changed and how it was validated.

## Engineering expectations

- Prefer ordinary, documented, off-the-shelf components.
- Do not add mass or instrumentation to the rotating propeller solely for sensing.
- Keep motor power separate from tester power.
- Document pin assignments, voltage levels, calibration assumptions, and measurement limits.
- Never enable automatic motor control without documented hardware safety interlocks.
