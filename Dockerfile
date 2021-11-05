FROM quay.io/pcdc/node-lts-alpine:latest as build-stage
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM quay.io/pcdc/nginx_1.16-alpine:latest
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./nginx /etc/nginx/conf.d
COPY ./dockerStart.sh .
RUN apk add --no-cache bash
CMD bash ./dockerStart.sh
