#!/usr/bin/env bash
# Records the 45s demo mode (dev server must be running) and renders docs/media/*.mp4 + *.gif
set -euo pipefail
cd "$(dirname "$0")/.."
REC=${REC:-/tmp/rec}
OUT=${OUT:-docs/media}
mkdir -p "$REC" "$OUT"
node scripts/record-demo.mjs "$REC"

LEAD=1.1
ffmpeg -y -v error -ss $LEAD -i "$REC/raw-demo.webm" -t 45.5 -c:v libx264 -preset medium -crf 22 \
  -pix_fmt yuv420p -movflags +faststart "$OUT/rotbot-demo-45s.mp4"

gif() { # name start duration
  ffmpeg -y -v error -ss "$2" -t "$3" -i "$OUT/rotbot-demo-45s.mp4" \
    -vf "fps=8,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=64:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle" \
    "$OUT/$1.gif"
}
gif rotbot-radar-sources 0.4 4
gif rotbot-agent-flow 7 5
gif rotbot-breeding-hatch 21 5
gif rotbot-publish-metrics 13 5.5

# hero stays 1200px and under 8MB: short slices, small palette, no dither
PAL="fps=6,scale=1200:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=32:stats_mode=single[p];[b][p]paletteuse=dither=none"
ffmpeg -y -v error -ss 0.5 -t 2.6 -i "$OUT/rotbot-demo-45s.mp4" -ss 21.5 -t 2.8 -i "$OUT/rotbot-demo-45s.mp4" \
  -filter_complex "[0:v][1:v]concat=n=2:v=1[c];[c]$PAL" "$OUT/rotbot-hero.gif"
ls -la "$OUT"
