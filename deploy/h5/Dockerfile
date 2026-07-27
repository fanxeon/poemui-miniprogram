ARG BASE_IMAGE=nginx:1.27-alpine
FROM ${BASE_IMAGE}

COPY deploy/h5/nginx.conf /etc/nginx/conf.d/default.conf
COPY preview/ /usr/share/nginx/html/

EXPOSE 8080

HEALTHCHECK --interval=15s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz >/dev/null || exit 1
