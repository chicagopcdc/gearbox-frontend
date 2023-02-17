#!/bin/sh
#
# Little startup script launching nginx
#
set -eu

# add https://gearbox-dev-data-bucket-with-versioning.s3.amazonaws.com after connect-src in content security policy
s3_bucket="https://gearbox-dev-data-bucket-with-versioning.s3.amazonaws.com"
sed -i -e "s|connect-src|& $s3_bucket|" /usr/share/nginx/html/index.html

/usr/sbin/nginx -g 'daemon off;'
