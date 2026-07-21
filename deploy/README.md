# Deploying anphonic.shop

`git push` alone does **not** put changes live. There is no CI/CD trigger connected
to this repo — pushing to GitHub only backs up the code. The live site at
`www.anphonic.shop` is a separate Cloud Run service that must be rebuilt and
redeployed manually every time.

Two steps are required for a change to reach production:

1. **Push to GitHub** — `git push origin main` (source control / backup only)
2. **Deploy to GCP** — build a new container image and roll it out to Cloud Run

Run step 2 with:

```bash
./deploy/deploy-frontend.sh   # frontend (anphonic.shop)
./deploy/deploy-backend.sh    # backend/API (anphonicshop-api)
```

`deploy-frontend.sh` builds the frontend image via Cloud Build (with the same
`VITE_API_URL` build arg used in production), pushes it to Artifact Registry,
and deploys it as a new revision of the `anphonicshop-web` Cloud Run service
in `asia-east1` (the region mapped to `anphonic.shop` / `www.anphonic.shop`).

`deploy-backend.sh` builds the `server/` image via Cloud Build, pushes it to
Artifact Registry, and deploys it as a new revision of the `anphonicshop-api`
Cloud Run service in `asia-south1`. Run this one whenever `server/` changes
(new routes, schema changes, etc.) — the frontend script does not touch it.

## Current infra (as of 2026-07-20)

- **Frontend**: Cloud Run service `anphonicshop-web`, region `asia-east1`,
  project `anphonicshop`. Domain-mapped to `anphonic.shop` and `www.anphonic.shop`.
  Image: `asia-south1-docker.pkg.dev/anphonicshop/anphonicshop/frontend:latest`.
- **Backend/API**: Cloud Run service `anphonicshop-api`, region `asia-south1`.
  No custom domain — the frontend calls its `*.run.app` URL directly via
  `VITE_API_URL`.
- There's also an idle `anphonicshop-web` service in `asia-south1` with no
  domain mapping — not part of the live path, left alone unless you need it.

If you add a Cloud Build trigger later so pushing to `main` auto-deploys,
update this file to say so.
