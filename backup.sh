#!/bin/bash
echo "Starting backup process..."

source .env

# Backup timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Backup MySQL database to the project directory
mysqldump -u "$MYSQL_DEV_ADMIN_DB_USERNAME" -p"$MYSQL_DEV_ADMIN_DB_PASSWORD" "$MYSQL_DEV_DB_NAME" > ./backups/mysql-backup-$TIMESTAMP.sql

echo "MySQL backup completed!"

mongodump --host "$MONGO_DEV_DB_HOST" --db "$MONGO_DEV_DB_NAME" --out ./backups/mongo-backup-$TIMESTAMP

echo "MongoDB backup completed!"
