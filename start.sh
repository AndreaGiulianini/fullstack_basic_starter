#!/bin/bash

set -eu

cp compose_override/development.yml docker-compose.override.yml
# docker compose down && docker compose up --build #PROD
docker compose down && docker compose watch #DEV

