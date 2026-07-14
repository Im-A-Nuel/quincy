# Quincy indexer - long-running worker mirroring contract events into Postgres.
FROM node:20-slim

WORKDIR /app

# Install dependencies first for better layer caching. tsx (a dev dep) runs the
# TypeScript entrypoint directly, so install the full dependency set.
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

CMD ["npm", "start"]
