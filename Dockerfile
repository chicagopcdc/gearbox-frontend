FROM quay.io/pcdc/node-lts-alpine:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY public ./public
COPY src ./src
COPY .env.production ./
COPY tailwind.config.js ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY .eslintrc ./
COPY .prettierrc ./

RUN npm run build

FROM quay.io/pcdc/nginx:1.22-alpine

COPY --from=build-stage /app/build /usr/share/nginx/html
COPY ./nginx /etc/nginx/conf.d

# ensure non-root can read/descend; normalize perms
RUN find /etc/nginx/conf.d -type d -exec chmod 0755 {} \; \
 && find /etc/nginx/conf.d -type f -exec chmod 0644 {} \;

# Ensure the script is readable/executable by non-root, and fix CRLF if present
COPY ./dockerStart.sh /dockerStart.sh
RUN apk add --no-cache libcap \
 && sed -i 's/\r$//' /dockerStart.sh \
 && chmod 0755 /dockerStart.sh \
 && setcap 'cap_net_bind_service=+ep' /usr/sbin/nginx \
 && chown -R nginx:nginx /usr/share/nginx/html \
 && mkdir -p /var/cache/nginx \
 && chown -R nginx:nginx /var/cache/nginx \
 && touch /var/run/nginx.pid \
 && chown nginx:nginx /var/run/nginx.pid \
 && chown -R nginx:nginx /var/log/nginx \
 && ln -sf /dev/stdout /var/log/nginx/access.log \
 && ln -sf /dev/stderr /var/log/nginx/error.log \
 && mkdir -p /var/lib/nginx/tmp/client_body \
 && chown -R nginx:nginx /var/lib/nginx

USER nginx
CMD ["/bin/sh", "/dockerStart.sh"]
