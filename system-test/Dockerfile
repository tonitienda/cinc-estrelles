# We will create tests with Nodejs as well.
# For now the test is a simple curl to the backend
FROM node:18-slim as build

RUN apt-get update && apt-get install curl -y

CMD curl backend:3000/healthz




