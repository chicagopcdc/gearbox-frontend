FROM quay.io/pcdc/node-lts-alpine:18-alpine as build-stage
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM quay.io/pcdc/nginx:1.22-alpine
COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./nginx /etc/nginx/conf.d
COPY ./dockerStart.sh .
RUN apk add --no-cache bash
CMD bash ./dockerStart.sh
