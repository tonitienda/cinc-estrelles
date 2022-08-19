prepare:
	docker compose -f docker-compose-infras.yaml up db_migrations --exit-code-from db_migrations || ( docker compose logs backend && exit 1)	

test-bdd: prepare
	docker compose -f docker-compose-infras.yaml -f docker-compose.yaml -f docker-compose-bdd-tests.yaml up bdd-tests --exit-code-from bdd-tests --build || ( docker compose logs backend && exit 1)

test-system: prepare
	docker compose -f docker-compose-infras.yaml -f docker-compose.yaml -f docker-compose-system-tests.yaml up system-tests --exit-code-from system-tests --build  || (docker compose logs backend && exit 1)

dev:
	docker-compose -f docker-compose.yaml -f docker-compose-infras.yaml -f docker-compose-dev.yaml up backend --build

prod:
	docker-compose -f docker-compose.yaml -f docker-compose-infras.yaml up backend --build
