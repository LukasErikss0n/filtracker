FROM node:22-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# npm ci installs Rollup's optional native binary strictly from the lockfile,
# which was generated on a different machine's architecture — a known npm
# bug (npm/cli#4828) where that binary then doesn't match the container's
# actual platform. npm install re-resolves optional deps for whatever
# platform it's actually running on, which is what we want in a Dockerfile.
RUN npm install

# ---- dev: live-reloading Vite dev server, source bind-mounted at runtime ----
FROM deps AS dev
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ---- build: compiles the static production bundle ----
FROM deps AS build
ARG VITE_API_BASE_URL=/api
ARG VITE_API_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_API_KEY=$VITE_API_KEY
COPY . .
RUN npm run build

# ---- prod (default target): nginx serving the static bundle ----
FROM nginx:1.27-alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
