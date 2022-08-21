FROM node:18-slim as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY tsconfig.json .
COPY features features

RUN  npx --package typescript tsc --build

# ----

FROM node:18-slim as dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production

RUN ls

# ---------------

FROM node:18-slim as service

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/features features
COPY --from=build /app/package.json .
COPY cucumber.js .

CMD yarn cucumber-js
