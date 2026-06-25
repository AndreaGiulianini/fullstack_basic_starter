#!/bin/bash

set -eu

# Apply Laravel database migrations (and seeders, if any) inside the api container.
docker exec api php artisan migrate --force
