
test-bdd:
	docker compose -f docker-compose.yaml -f docker-compose-bdd-tests.yaml up --exit-code-from bdd-tests --build

test-system:
	docker compose -f docker-compose.yaml -f docker-compose-system-tests.yaml up --exit-code-from system-tests --build