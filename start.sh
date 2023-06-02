#!/bin/bash

set -eu

cp compose_override/development.yml docker-compose.override.yml
docker compose stop && docker compose up --build
