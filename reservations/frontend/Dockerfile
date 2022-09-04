FROM node:18-slim as base_dependencies

RUN apt-get update && apt-get install git -y

# ----

FROM base_dependencies as dev_dependencies

WORKDIR /app

COPY package.json yarn.lock tsconfig.json ./

RUN yarn --frozen-lockfile

# -----

FROM dev_dependencies as dev

WORKDIR /app

COPY src src
CMD yarn dev

# -----

FROM base_dependencies as prod_dependencies

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --frozen-lockfile --production


# ---


# FROM with_generated_files as test

# RUN  yarn jest

# ----


FROM prod_dependencies as build

WORKDIR /app

RUN yarn build

# ---

FROM node:18-slim as prod

WORKDIR /app

COPY --from=build /app/build build
COPY --from=build /app/package.json .

CMD yarn start
