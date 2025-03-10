# Builder Stage / compiles contracts
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set workdir to the root of the project
WORKDIR /app

# Copy the entire monorepo
COPY . .

# Install dependencies at the root level for all packages
ARG PNPM_VERSION=latest
RUN npm install -g pnpm@$PNPM_VERSION --force

# Build the client package
WORKDIR /app/packages/client
RUN pnpm install
RUN pnpm run build:slot

# Runtime Stage
FROM oven/bun:latest as serve

WORKDIR /app

RUN bun install -g serve

ARG PORT=3000
ENV PORT=${PORT}

# Set Environment Variables
ARG VITE_CONTROLLER_CHAINID
ARG VITE_TOKEN_HTTP_RPC
ARG VITE_TOKEN_CONTRACT_ADDRESS
ARG VITE_KATANA_HTTP_RPC
ARG VITE_TORII_HTTP_RPC
ARG VITE_TORII_WS_RPC
ARG VITE_BURNER_ADDRESS
ARG VITE_BURNER_PRIVATE_KEY
ARG VITE_SLOT

ENV VITE_CONTROLLER_CHAINID=${VITE_CONTROLLER_CHAINID}
ENV VITE_TOKEN_HTTP_RPC=${VITE_TOKEN_HTTP_RPC}
ENV VITE_TOKEN_CONTRACT_ADDRESS=${VITE_TOKEN_CONTRACT_ADDRESS}
ENV VITE_KATANA_HTTP_RPC=${VITE_KATANA_HTTP_RPC}
ENV VITE_TORII_HTTP_RPC=${VITE_TORII_HTTP_RPC}
ENV VITE_TORII_WS_RPC=${VITE_TORII_WS_RPC}
ENV VITE_BURNER_ADDRESS=${VITE_BURNER_ADDRESS}
ENV VITE_BURNER_PRIVATE_KEY=${VITE_BURNER_PRIVATE_KEY}
ENV VITE_SLOT=${VITE_SLOT}

# COPY --from=Builder /app/packages/client/.svelte-kit/output/client /app
# COPY --from=Builder /app/packages/client/.svelte-kit/output/client /app

COPY --from=build /app/packages/client/build /app/build
COPY --from=build /app/packages/client/node_modules /app/node_modules
COPY --from=build /app/packages/client/package.json /app

EXPOSE ${PORT}
CMD [ "node", "./build/index.js" ]