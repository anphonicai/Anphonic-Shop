#!/usr/bin/env bash
# Builds the backend image and deploys it to the live anphonicshop-api Cloud Run service.
# See deploy/README.md for why this manual step is required.
set -euo pipefail

PROJECT="anphonicshop"
REGION="asia-south1"
SERVICE="anphonicshop-api"
IMAGE="asia-south1-docker.pkg.dev/anphonicshop/anphonicshop/backend:latest"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

echo "==> Building and pushing ${IMAGE}"
gcloud builds submit --project "$PROJECT" --tag "$IMAGE" "$REPO_ROOT/server"

echo "==> Deploying to Cloud Run service ${SERVICE} (${REGION})"
gcloud run deploy "$SERVICE" \
  --project "$PROJECT" \
  --region "$REGION" \
  --image "$IMAGE" \
  --quiet

echo "==> Done. Live at https://anphonicshop-api-283084689629.asia-south1.run.app/"
