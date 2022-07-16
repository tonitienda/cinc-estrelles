FROM node:18-slim as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY tsconfig.json .
COPY src src

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

COPY --from=build /app/build build
COPY --from=dependencies /app/node_modules node_modules
COPY --from=build /app/package.json .

CMD node build/index.js




