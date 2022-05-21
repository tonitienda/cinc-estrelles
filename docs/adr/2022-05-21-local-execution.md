# Local execution

## Context and Problem Statement

We need to run the service in the local machine to test and debug new features
or defects.


## Considered Options

- Docker compose
- Minikube
- K3s

## Decision Outcome

For now, since the system is pretty small we can start with docker compose.
This decision can be revisited in the future to decide another technology or
even the need of running the whole service in the local machines.

## Status

Decided