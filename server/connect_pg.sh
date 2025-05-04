#!/bin/bash

# Connection details
POSTGRES_HOST="/var/run/postgresql"

# POSTGRES_HOST="villebiz.com"
POSTGRES_PORT="5432"
POSTGRES_USER="villebiz_villebiz"
POSTGRES_DB="villebiz_main"
POSTGRES_PASSWORD="villebiz1234"

# Export the password so psql can use it
export PGPASSWORD="$POSTGRES_PASSWORD"

# Connect to the PostgreSQL database
psql -h $POSTGRES_HOST -p $POSTGRES_PORT -U $POSTGRES_USER -d $POSTGRES_DB -c "SELECT 'Connection successful!';"

# Unset the password for security
unset PGPASSWORD
