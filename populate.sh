#!/bin/bash

set -eu

docker exec api npm run generate
docker exec api npm run migrate
