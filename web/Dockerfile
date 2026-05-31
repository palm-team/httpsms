# build stage
FROM node:lts-alpine AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm@9

# Install build tools for native modules (deasync, protobufjs, etc.)
RUN apk add --no-cache python3 make g++ gcc linux-headers

RUN pnpm install
COPY . .
RUN pnpm run generate

# production stage
FROM nginx:stable-alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the nginx configuration file
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Install gettext for envsubst
RUN apk add --no-cache gettext

CMD export PORT=${PORT:-3000} && envsubst '${PORT}' < /etc/nginx/conf.d/default.conf > /tmp/default.conf && mv /tmp/default.conf /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
