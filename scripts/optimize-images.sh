#!/bin/bash
# Quick image optimization using sips (built into macOS)

cd "$(dirname "$0")/../public"

echo "Optimizing images..."
for img in *.JPG *.jpg *.HEIC 2>/dev/null; do
  if [ -f "$img" ]; then
    echo "Resizing $img..."
    sips -Z 1920 --setProperty formatOptions 70 "$img"
  fi
done

echo "Done! Images resized to max 1920px width with 70% quality."
