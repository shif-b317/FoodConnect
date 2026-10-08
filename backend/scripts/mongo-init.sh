#!/bin/bash
set -eu

case "${MONGO_APP_USERNAME}${MONGO_APP_PASSWORD}" in
  *[!A-Za-z0-9_-]*) echo 'Mongo application credentials must use letters, digits, underscore, or hyphen.' >&2; exit 1 ;;
esac

mongosh "$MONGO_INITDB_DATABASE" \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase admin \
  --quiet \
  --eval "db.createUser({user: '$MONGO_APP_USERNAME', pwd: '$MONGO_APP_PASSWORD', roles: [{role: 'readWrite', db: '$MONGO_INITDB_DATABASE'}]})"
