prepare-reservations:
	docker compose -f reservations-deploy/docker-compose-infras.yaml up db_migrations --exit-code-from db_migrations || ( docker compose logs reservations_backend && exit 1)	


prepare: prepare-reservations
	echo "Ready"

test-bdd: prepare
	docker compose -f docker-compose-infras.yaml -f reservations-deploy/docker-compose-infras.yaml  -f reservations-deploy/docker-compose.yaml -f docker-compose-bdd-tests.yaml up bdd-tests --exit-code-from bdd-tests --build || ( docker compose logs reservations_backend && exit 1)

test-system: prepare
	docker compose -f docker-compose-infras.yaml -f reservations-deploy/docker-compose-infras.yaml  -f reservations-deploy/docker-compose.yaml -f docker-compose-system-tests.yaml up system-tests --exit-code-from system-tests --build || ( docker compose logs reservations_backend && exit 1)

dev: prepare
	docker-compose -f docker-compose-infras.yaml -f reservations-deploy/docker-compose.yaml -f reservations-deploy/docker-compose-infras.yaml -f reservations-deploy/docker-compose-dev.yaml up reservations_backend --build

prod: prepare
	docker-compose -f docker-compose-infras.yaml -f reservations-deploy/docker-compose.yaml -f reservations-deploy/docker-compose-infras.yaml up reservations_backend --build
