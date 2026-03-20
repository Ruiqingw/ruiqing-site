#!/bin/bash
cd "$(dirname "$0")"
git add src/data/notes.json
git commit -m "${1:-update notes}"
git push
