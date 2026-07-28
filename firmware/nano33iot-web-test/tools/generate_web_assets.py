#!/usr/bin/env python3
"""Synchronize the approved mock and generate flash-resident C++ assets."""

from pathlib import Path
import shutil

try:
    Import("env")
    PROJECT = Path(env.subst("$PROJECT_DIR"))
except NameError:
    # Keep direct `python tools/generate_web_assets.py` execution working.
    PROJECT = Path(__file__).resolve().parents[1]
SOURCE = PROJECT.parents[1] / "web"
DATA = PROJECT / "data"
OUTPUT = PROJECT / "src" / "web_assets.h"
ASSETS = (("index.html", "index_html", "text/html; charset=utf-8"),
          ("styles.css", "styles_css", "text/css; charset=utf-8"),
          ("app.js", "app_js", "application/javascript; charset=utf-8"))

def byte_lines(payload):
    chunks = (payload[i:i + 16] for i in range(0, len(payload), 16))
    return "\n".join("  " + ", ".join(f"0x{v:02x}" for v in chunk) + "," for chunk in chunks)

def main():
    DATA.mkdir(exist_ok=True)
    sections = ["// GENERATED FILE. DO NOT EDIT.", "// Run: python3 tools/generate_web_assets.py",
                "#pragma once", "", "#include <Arduino.h>", "",
                "struct WebAsset {", "  const char *path;", "  const char *contentType;",
                "  const uint8_t *data;", "  size_t length;", "};", ""]
    total = 0
    for filename, symbol, _ in ASSETS:
        shutil.copyfile(SOURCE / filename, DATA / filename)
        payload = (DATA / filename).read_bytes()
        total += len(payload)
        sections += [f"const uint8_t {symbol}[] PROGMEM = {{", byte_lines(payload), "};", ""]
    sections.append("const WebAsset web_assets[] = {")
    for filename, symbol, content_type in ASSETS:
        sections.append(f'  {{"/{filename}", "{content_type}", {symbol}, sizeof({symbol})}},')
    sections += ["};", "constexpr size_t web_asset_count = sizeof(web_assets) / sizeof(web_assets[0]);",
                 f"constexpr size_t web_asset_total_bytes = {total};", ""]
    OUTPUT.write_text("\n".join(sections), encoding="utf-8")
    print(f"Generated {OUTPUT.relative_to(PROJECT)} ({total} asset bytes)")

main()
