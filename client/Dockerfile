# Stage 1: Build the React app
FROM node:18 as builder
WORKDIR /src
COPY . .
RUN yarn install && yarn build

# Stage 2: Final image
FROM nginx:alpine
COPY --from=builder /src/build /usr/share/nginx/html

# setup health check
RUN apk update && apk upgrade && apk add --no-cache curl
COPY --from=builder /src/nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
