prepare:
	docker compose -f docker-compose-db.yaml up db_migrations --exit-code-from db_migrations || ( docker compose logs backend && exit 1)	

test-bdd: prepare
	docker compose -f docker-compose-db.yaml -f docker-compose.yaml -f docker-compose-bdd-tests.yaml up bdd-tests --exit-code-from bdd-tests --build || ( docker compose logs backend && exit 1)

test-system: prepare
	docker compose -f docker-compose-db.yaml -f docker-compose.yaml -f docker-compose-system-tests.yaml up system-tests --exit-code-from system-tests --build  || (docker compose logs backend && exit 1)


# In DEV we want to use docker-compose (instead of docker compose) to use the logging feature
# to silent pdagmin container.
# See https://stackoverflow.com/questions/34590317/disable-logging-for-one-container-in-docker-compose
dev:
	docker-compose -f docker-compose.yaml -f docker-compose-db.yaml -f docker-compose-dev.yaml up backend --build


restart:
	docker compose up --build