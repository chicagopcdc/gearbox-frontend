#!/bin/sh
#
# Little startup script launching nginx
#
set -eu

/usr/sbin/nginx -g 'daemon off;'
