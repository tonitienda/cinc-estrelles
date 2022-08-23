prepare:
	docker compose -f reservations/docker-compose-db.yaml up reservations_db_migrations --exit-code-from reservations_db_migrations || ( docker compose logs reservations-backend && exit 1)	

test-bdd: prepare
	docker compose -f reservations/docker-compose-db.yaml -f docker-compose-infras.yaml -f reservations/docker-compose.yaml -f docker-compose-bdd-tests.yaml up bdd-tests --exit-code-from bdd-tests --build || ( docker compose logs reservations-backend && exit 1)

test-system: prepare
	docker compose -f reservations/docker-compose-db.yaml -f docker-compose-infras.yaml -f reservations/docker-compose.yaml -f docker-compose-system-tests.yaml up system-tests --exit-code-from system-tests --build  || (docker compose logs reservations-backend && exit 1)

dev: prepare
	docker-compose -f reservations/docker-compose.yaml -f reservations/docker-compose-db.yaml -f docker-compose-infras.yaml -f reservations/docker-compose-dev.yaml up reservations-backend --build

prod: prepare
	docker-compose -f reservations/docker-compose.yaml -f reservations/docker-compose-db.yaml -f docker-compose-infras.yaml up reservations-backend reservations-event-publisher --build
