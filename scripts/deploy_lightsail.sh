#!/usr/bin/env bash
set -euo pipefail

trap 'echo "[ERROR] Failed at line $LINENO"' ERR

log() {
  echo "[$(date '+%H:%M:%S')] $*"
}

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="${ROOT_DIR}/api_keys.env"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  source "${ENV_FILE}"
  set +a
fi

IMAGE_NAME="${IMAGE_NAME:-jr-portfolio-projects}"
LIGHTSAIL_SERVICE_NAME="${LIGHTSAIL_SERVICE_NAME:-jr-portfolio-projects}"
LIGHTSAIL_IMAGE_LABEL="${LIGHTSAIL_IMAGE_LABEL:-gateway}"
AWS_REGION="${AWS_REGION:-us-west-2}"

AWS_DEBUG_FLAG=""
if [[ "${PUSH_DEBUG:-0}" == "1" ]]; then
  AWS_DEBUG_FLAG="--debug"
fi

: "${OPENAI_API_KEY:?Missing OPENAI_API_KEY}"
: "${NEWS_API_KEY:?Missing NEWS_API_KEY}"
: "${FX_API_KEY:?Missing FX_API_KEY}"

cd "${ROOT_DIR}"

log "Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t "${IMAGE_NAME}" .

log "Pushing image to Lightsail..."
time aws ${AWS_DEBUG_FLAG} lightsail push-container-image \
  --service-name "${LIGHTSAIL_SERVICE_NAME}" \
  --label "${LIGHTSAIL_IMAGE_LABEL}" \
  --image "${IMAGE_NAME}" \
  --region "${AWS_REGION}" \
  --no-cli-pager 2>&1 | tee /tmp/lightsail-push.log
log "Push finished."

log "Looking up latest registered image for label '${LIGHTSAIL_IMAGE_LABEL}'..."

IMAGE_PREFIX=":${LIGHTSAIL_SERVICE_NAME}.${LIGHTSAIL_IMAGE_LABEL}."

LIGHTSAIL_IMAGE_REF="$(
  aws ${AWS_DEBUG_FLAG} lightsail get-container-images \
    --service-name "${LIGHTSAIL_SERVICE_NAME}" \
    --region "${AWS_REGION}" \
    --no-cli-pager \
    --query "reverse(sort_by(containerImages,&createdAt))[].image" \
    --output text \
  | tr '\t' '\n' \
  | grep "^${IMAGE_PREFIX}" \
  | head -n 1
)"

if [[ -z "${LIGHTSAIL_IMAGE_REF}" ]]; then
  echo "Could not determine latest Lightsail image ref for prefix ${IMAGE_PREFIX}"
  exit 1
fi

log "Using image ref: ${LIGHTSAIL_IMAGE_REF}"
export LIGHTSAIL_IMAGE_REF

log "Generating lightsail.json..."
"${ROOT_DIR}/scripts/generate_lightsail_json.sh"

log "Creating Lightsail deployment in ${AWS_REGION}..."
time aws ${AWS_DEBUG_FLAG} lightsail create-container-service-deployment \
  --cli-input-json "file://${ROOT_DIR}/lightsail.json" \
  --region "${AWS_REGION}" \
  --no-cli-pager 2>&1 | tee /tmp/lightsail-deploy.log

log "Deployment submitted."
echo "Next:"
echo "1. Verify the default Lightsail domain"
echo "2. Create/attach certificate for ai-fx-insights.jeffrey-ross.me"
echo "3. Point Vercel DNS CNAME to the Lightsail default domain"