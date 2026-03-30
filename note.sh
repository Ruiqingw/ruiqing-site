#!/bin/bash
cd "$(dirname "$0")"
git add .
# 自动用变动的文件名作为 commit message
CHANGED=$(git diff --cached --name-only | xargs -I{} basename {} | tr '\n' ' ' | sed 's/ $//')
MSG="${1:-update: $CHANGED}"
git commit -m "$MSG"
git push
