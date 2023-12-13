#!/bin/bash
echo "Starting backup process..."

source .env

# Backup timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Backup MySQL database to the project directory
mysqldump -u $MYSQL_DEV_DB_USERNAME -p$MYSQL_DEV_DB_PASSWORD $MYSQL_DEV_DB_NAME > ./mysql_backups/backup-$TIMESTAMP.sql

echo "MySQL backup completed!"