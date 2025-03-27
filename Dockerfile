# Builder Stage / compiles contracts
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-slim AS build
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Define build arguments in the build stage
ARG VITE_CONTROLLER_CHAINID
ARG VITE_TOKEN_HTTP_RPC
ARG VITE_TOKEN_CONTRACT_ADDRESS
ARG VITE_KATANA_HTTP_RPC
ARG VITE_TORII_HTTP_RPC
ARG VITE_TORII_WS_RPC
ARG VITE_BURNER_ADDRESS
ARG VITE_BURNER_PRIVATE_KEY
ARG VITE_SLOT

# Set environment variables in the build stage
ENV VITE_CONTROLLER_CHAINID=${VITE_CONTROLLER_CHAINID}
ENV VITE_TOKEN_HTTP_RPC=${VITE_TOKEN_HTTP_RPC}
ENV VITE_TOKEN_CONTRACT_ADDRESS=${VITE_TOKEN_CONTRACT_ADDRESS}
ENV VITE_KATANA_HTTP_RPC=${VITE_KATANA_HTTP_RPC}
ENV VITE_TORII_HTTP_RPC=${VITE_TORII_HTTP_RPC}
ENV VITE_TORII_WS_RPC=${VITE_TORII_WS_RPC}
ENV VITE_BURNER_ADDRESS=${VITE_BURNER_ADDRESS}
ENV VITE_BURNER_PRIVATE_KEY=${VITE_BURNER_PRIVATE_KEY}
ENV VITE_SLOT=${VITE_SLOT}

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
RUN pnpm exec vite build --mode slot

# Runtime Stage
FROM oven/bun:latest as serve

WORKDIR /app

RUN bun install -g serve

ARG PORT=3000
ENV PORT=${PORT}

# Copy only the built client files
COPY --from=build /app/packages/client/dist /app

EXPOSE ${PORT}
CMD ["bunx", "--bun", "serve", "-s", "/app"] 