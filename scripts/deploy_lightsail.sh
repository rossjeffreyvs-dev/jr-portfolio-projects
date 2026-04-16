#!/usr/bin/env bash
set -euo pipefail

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

: "${OPENAI_API_KEY:?Missing OPENAI_API_KEY}"
: "${NEWS_API_KEY:?Missing NEWS_API_KEY}"
: "${FX_API_KEY:?Missing FX_API_KEY}"

cd "${ROOT_DIR}"

echo "Building Docker image for linux/amd64..."
docker build --platform linux/amd64 -t "${IMAGE_NAME}" .

echo "Pushing image to Lightsail..."
PUSH_OUTPUT="$(
  aws lightsail push-container-image \
    --service-name "${LIGHTSAIL_SERVICE_NAME}" \
    --label "${LIGHTSAIL_IMAGE_LABEL}" \
    --image "${IMAGE_NAME}" \
    --region "${AWS_REGION}" \
    --no-cli-pager 2>&1
)"

echo "${PUSH_OUTPUT}"

echo "Looking up latest registered image for label '${LIGHTSAIL_IMAGE_LABEL}'..."

IMAGE_PREFIX=":${LIGHTSAIL_SERVICE_NAME}.${LIGHTSAIL_IMAGE_LABEL}."

LIGHTSAIL_IMAGE_REF="$(
  aws lightsail get-container-images \
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

echo "Using image ref: ${LIGHTSAIL_IMAGE_REF}"
export LIGHTSAIL_IMAGE_REF

"${ROOT_DIR}/scripts/generate_lightsail_json.sh"

echo "Creating Lightsail deployment in ${AWS_REGION}..."
aws lightsail create-container-service-deployment \
  --cli-input-json "file://${ROOT_DIR}/lightsail.json" \
  --region "${AWS_REGION}" \
  --no-cli-pager

echo "Deployment submitted."
echo "Next:"
echo "1. Verify the default Lightsail domain"
echo "2. Create/attach certificate for ai-fx-insights.jeffrey-ross.me"
echo "3. Point Vercel DNS CNAME to the Lightsail default domain"