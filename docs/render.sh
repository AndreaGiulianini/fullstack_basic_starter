#!/usr/bin/env bash
# Render docs/architecture.d2 -> docs/architecture.png
#
# Requires D2 (https://d2lang.com — `brew install d2`) plus any one of:
#   rsvg-convert (brew install librsvg) · resvg · ImageMagick · Chrome/Chromium
#
# D2 can emit PNG directly, but that path downloads a Playwright driver whose
# CDN currently 404s, so we render SVG first and rasterise it ourselves.
# Layout, theme and padding live in the `d2-config` block inside the .d2 file.
set -euo pipefail

cd "$(dirname "$0")"

SRC="architecture.d2"
OUT="architecture.png"
SVG="$(mktemp -t architecture).svg"
SCALE=2
trap 'rm -f "$SVG"' EXIT

# Icons are vendored in ./icons, so this needs no network. --bundle inlines
# them into the SVG as base64 before it is rasterised.
d2 --bundle "$SRC" "$SVG"

read -r W H < <(sed -n 's/.*<svg[^>]*width="\([0-9]*\)" height="\([0-9]*\)".*/\1 \2/p' "$SVG" | head -1)
if [[ -z "${W:-}" || -z "${H:-}" ]]; then
  echo "could not read SVG dimensions" >&2
  exit 1
fi

rasterise() {
  if command -v rsvg-convert >/dev/null 2>&1; then
    rsvg-convert -w $((W * SCALE)) -h $((H * SCALE)) -o "$OUT" "$SVG"
  elif command -v resvg >/dev/null 2>&1; then
    resvg --zoom "$SCALE" "$SVG" "$OUT"
  elif command -v magick >/dev/null 2>&1; then
    magick -density $((96 * SCALE)) -background white "$SVG" "$OUT"
  else
    for c in \
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
      "/Applications/Chromium.app/Contents/MacOS/Chromium" \
      "$(command -v google-chrome || true)" \
      "$(command -v chromium || true)"; do
      if [[ -n "$c" && -x "$c" ]]; then
        "$c" --headless --disable-gpu --hide-scrollbars \
          --force-device-scale-factor="$SCALE" \
          --default-background-color=FFFFFF \
          --window-size="$W,$H" \
          --screenshot="$OUT" "file://$SVG" >/dev/null 2>&1
        return
      fi
    done
    echo "no rasteriser found — install librsvg, resvg, ImageMagick or Chrome" >&2
    exit 1
  fi
}

rasterise
echo "wrote $(pwd)/$OUT  (${W}x${H} @${SCALE}x)"
