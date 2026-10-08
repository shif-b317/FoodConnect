FROM mongo:8
COPY scripts/mongo-init.sh /docker-entrypoint-initdb.d/01-create-app-user.sh
RUN chmod 0755 /docker-entrypoint-initdb.d/01-create-app-user.sh
