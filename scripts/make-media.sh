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
    -vf "fps=12,scale=960:-1:flags=lanczos,split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle" \
    "$OUT/$1.gif"
}
gif rotbot-radar-sources 0.4 4.2
gif rotbot-agent-flow 3.6 6
gif rotbot-breeding-hatch 7.4 8.6
gif rotbot-publish-metrics 29.8 7.5
ls -la "$OUT"
