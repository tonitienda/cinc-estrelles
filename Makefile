
test-bdd:
	docker compose -f docker-compose.yaml -f docker-compose-bdd-tests.yaml up --exit-code-from bdd-tests --build

test-system:
	docker compose -f docker-compose.yaml -f docker-compose-system-tests.yaml up --exit-code-from system-tests --build

# In DEV we want to use docker-compose (instead of docker compose) to use the logging feature
# to silent pdagmin container.
# See https://stackoverflow.com/questions/34590317/disable-logging-for-one-container-in-docker-compose
dev:
	docker-compose -f docker-compose.yaml -f docker-compose-dev.yaml up


restart:
	docker compose up --build