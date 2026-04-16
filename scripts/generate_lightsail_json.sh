#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE_FILE="${ROOT_DIR}/lightsail.json.template"
OUTPUT_FILE="${ROOT_DIR}/lightsail.json"
ENV_FILE="${ROOT_DIR}/api_keys.env"

if [[ -f "${ENV_FILE}" ]]; then
  set -a
  source "${ENV_FILE}"
  set +a
fi

: "${LIGHTSAIL_SERVICE_NAME:?Missing LIGHTSAIL_SERVICE_NAME}"
: "${LIGHTSAIL_IMAGE_REF:?Missing LIGHTSAIL_IMAGE_REF}"
: "${OPENAI_API_KEY:?Missing OPENAI_API_KEY}"
: "${NEWS_API_KEY:?Missing NEWS_API_KEY}"
: "${FX_API_KEY:?Missing FX_API_KEY}"

if [[ ! -f "${TEMPLATE_FILE}" ]]; then
  echo "Template not found: ${TEMPLATE_FILE}"
  exit 1
fi

sed \
  -e "s|__SERVICE_NAME__|${LIGHTSAIL_SERVICE_NAME}|g" \
  -e "s|__IMAGE__|${LIGHTSAIL_IMAGE_REF}|g" \
  -e "s|__OPENAI_API_KEY__|${OPENAI_API_KEY}|g" \
  -e "s|__NEWS_API_KEY__|${NEWS_API_KEY}|g" \
  -e "s|__FX_API_KEY__|${FX_API_KEY}|g" \
  "${TEMPLATE_FILE}" > "${OUTPUT_FILE}"

echo "Generated ${OUTPUT_FILE}"