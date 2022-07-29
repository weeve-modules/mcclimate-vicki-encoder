SHELL := /bin/bash # to enable source command in run_app

MODULE=weevenetwork/mcclimate-vicki-encoder
VERSION_NAME=v1.0.0

lint:
	npm run lint
.phony: lint

lint-fix:
	npm run lint-fix
.phony: lint-fix

format:
	npm run format
.phony: format

run_app:
	set -a && source .env && set +a && npm run start
.phony: run_app

create_image:
	docker build -t ${MODULE}:${VERSION_NAME} . -f docker/Dockerfile
.phony: create_image

run_image:
	docker run -p 5000:80 --rm --env-file=./.env ${MODULE}:${VERSION_NAME}
.phony: run_image

debug_image:
	docker run -p 80:80 --rm --env-file=./.env --entrypoint /bin/bash -it ${MODULE}:${VERSION_NAME}
.phony: debug_image

run_docker_compose:
	docker-compose -f docker/docker-compose.yml up
.phony: run_docker_compose

stop_docker_compose:
	docker-compose -f docker/docker-compose.yml down
.phony: stop_docker_compose

push_latest:
	docker image push ${MODULE}:${VERSION_NAME}
.phony: push_latest

create_and_push_multi_platform:
	docker buildx build --platform linux/amd64,linux/arm,linux/arm64 -t ${MODULE}:${VERSION_NAME} --push . -f docker/Dockerfile
.phony: create_and_push_multi_platform

run_listener:
	docker run --rm -p 8000:8000 \
	-e PORT=8000 \
	-e LOG_HTTP_BODY=true \
	-e LOG_HTTP_HEADERS=true \
	--name listener \
	jmalloc/echo-server
.phony: run_listener