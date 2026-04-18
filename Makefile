SHELL := /bin/bash

.PHONY: help build deploy generate-lightsail-json clean-lightsail-json

help:
	@echo "Available targets:"
	@echo "  make build                  Build linux/amd64 Docker image"
	@echo "  make generate-lightsail-json Generate lightsail.json from api_keys.env + LIGHTSAIL_IMAGE_REF"
	@echo "  make deploy                 Build, push, generate JSON, and deploy to Lightsail"
	@echo "  make clean-lightsail-json   Remove generated lightsail.json"

build:
	./scripts/build_lightsail_image.sh

generate-lightsail-json:
	./scripts/generate_lightsail_json.sh

deploy:
	PUSH_DEBUG=$(PUSH_DEBUG) ./scripts/deploy_lightsail.sh

clean-lightsail-json:
	rm -f lightsail.json