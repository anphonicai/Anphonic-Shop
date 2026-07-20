#!/usr/bin/env bash
# Builds the frontend image and deploys it to the live anphonic.shop Cloud Run service.
# See deploy/README.md for why this manual step is required.
set -euo pipefail

PROJECT="anphonicshop"
REGION="asia-east1"
SERVICE="anphonicshop-web"
IMAGE="asia-south1-docker.pkg.dev/anphonicshop/anphonicshop/frontend:latest"
VITE_API_URL="https://anphonicshop-api-283084689629.asia-south1.run.app"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_CONFIG="$(mktemp)"
trap 'rm -f "$BUILD_CONFIG"' EXIT

cat > "$BUILD_CONFIG" <<EOF
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '--build-arg'
      - 'VITE_API_URL=${VITE_API_URL}'
      - '-t'
      - '${IMAGE}'
      - '.'
images:
  - '${IMAGE}'
EOF

echo "==> Building and pushing ${IMAGE}"
gcloud builds submit --project "$PROJECT" --config="$BUILD_CONFIG" "$REPO_ROOT"

echo "==> Deploying to Cloud Run service ${SERVICE} (${REGION})"
gcloud run deploy "$SERVICE" \
  --project "$PROJECT" \
  --region "$REGION" \
  --image "$IMAGE" \
  --quiet

echo "==> Done. Live at https://www.anphonic.shop/"
