#!/bin/bash
set -e

cd ~/porto

# 1. Commit (kalau ada perubahan)
if ! git diff-index --quiet HEAD --; then
  git add -A
  git commit -m "Update: $(date '+%Y-%m-%d %H:%M')"
fi

# 2. Build & push
IMG="ghcr.io/nrlatiefadhi/portfolio:sha-$(git rev-parse --short HEAD)"
echo "→ Building: $IMG"
docker build -t "$IMG" .
docker push "$IMG"

# 3. Update kustomization
TAG="${IMG##*:}"
sed -i "s/newTag: .*/newTag: $TAG/" k8s/kustomization.yaml

# 4. Deploy
echo "→ Deploying..."
kubectl apply -k k8s/
kubectl rollout status deploy/portfolio

echo "✅ Done: $IMG"
