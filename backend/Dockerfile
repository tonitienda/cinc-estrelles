FROM node:18-slim as base_dependencies

RUN apt-get update && apt-get install git -y

# ----

FROM base_dependencies as dev_dependencies

WORKDIR /app

COPY package.json yarn.lock jest.config.js tsconfig.json ./

RUN yarn --frozen-lockfile

# -----

FROM dev_dependencies as with_generated_files

WORKDIR /app

COPY src src
RUN yarn run generate-model

# -----

FROM base_dependencies as prod_dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile


# ---


FROM with_generated_files as test

RUN  yarn jest

# ----


FROM with_generated_files as build

WORKDIR /app

RUN npx --package typescript tsc --build

# ---

FROM with_generated_files as dev

WORKDIR /app

COPY nodemon.json ./

CMD npx nodemon -watch src --exec "yarn run generate-model && ts-node src/index.ts"


# ---------------

FROM node:18-slim as prod

WORKDIR /app

COPY --from=prod_dependencies /app/node_modules node_modules
COPY --from=build /app/build build
COPY --from=build /app/package.json .

CMD node build/index.js




