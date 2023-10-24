#!/bin/bash
echo "Starting backup process..."

source .env

# Backup timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Backup MySQL database to the project directory
mysqldump -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME > ./mysql_backups/backup-$TIMESTAMP.sql

echo "MySQL backup completed!"