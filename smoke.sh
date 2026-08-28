#!/bin/bash

set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost}"
API_PREFIX="${API_PREFIX:-/api}"
ES_URL="${ES_URL:-http://localhost:9200}"
ES_INDEX="${ES_INDEX:-api-logs}"

body=$(mktemp)
cookies=$(mktemp)
trap 'rm -f "$body" "$cookies"' EXIT

fail() { echo "FAIL: $*" >&2; exit 1; }
pass() { echo "  ok  $*"; }

echo "Smoke test against ${BASE_URL}${API_PREFIX}"

# The api needs a moment after `up`; give it 2 minutes before giving up.
for _ in $(seq 1 60); do
  curl -sf -o /dev/null "${BASE_URL}${API_PREFIX}/healthcheck/ping" 2>/dev/null && break
  sleep 2
done
curl -sf -H 'Accept: application/json' "${BASE_URL}${API_PREFIX}/healthcheck/ping" -o "$body" || fail "healthcheck unreachable"
# Parsed rather than grepped: some backends pretty-print their JSON.
python3 -c "import json,sys;sys.exit(0 if json.load(open('${body}')).get('success') is True else 1)" \
  || fail "healthcheck body: $(cat "$body")"
pass "healthcheck"

EMAIL="smoke-$(date +%s)-${RANDOM}@example.com"
PASSWORD="SmokeTest12345!"

code=$(curl -s -o "$body" -w '%{http_code}' -X POST "${BASE_URL}${API_PREFIX}/auth/sign-up/email" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\",\"name\":\"Smoke Test\"}")
case "$code" in 200 | 201) ;; *) fail "sign-up returned ${code}: $(cat "$body")" ;; esac
# Some backends wrap the payload in `data`, some return it at the top level.
user_id=$(python3 -c "
import json
d = json.load(open('${body}'))
d = d.get('data', d)
print(d.get('user', {}).get('id') or '')
")
[ -n "$user_id" ] || fail "sign-up returned no user id: $(cat "$body")"
pass "sign-up"

code=$(curl -s -c "$cookies" -o "$body" -w '%{http_code}' -X POST "${BASE_URL}${API_PREFIX}/auth/sign-in/email" \
  -H 'Content-Type: application/json' -H 'Accept: application/json' \
  -d "{\"email\":\"${EMAIL}\",\"password\":\"${PASSWORD}\"}")
case "$code" in 200 | 201) ;; *) fail "sign-in returned ${code}: $(cat "$body")" ;; esac
pass "sign-in"

# Cookie sessions and bearer tokens are both in play across the branches; send
# whichever sign-in handed back, and fall back to the cookie jar alone.
token=$(python3 -c "
import json
d = json.load(open('${body}'))
d = d.get('data', d)
print(d.get('token') or d.get('session', {}).get('token') or '')
")
auth=()
[ -n "$token" ] && auth=(-H "Authorization: Bearer ${token}")

# ${arr[@]+"${arr[@]}"} so an empty array is not an unbound-variable error under
# `set -u` on bash 3.2, which is what macOS ships.
code=$(curl -s -b "$cookies" ${auth[@]+"${auth[@]}"} -H 'Accept: application/json' \
  -o "$body" -w '%{http_code}' "${BASE_URL}${API_PREFIX}/users/${user_id}")
[ "$code" = "200" ] || fail "GET users/:id returned ${code}: $(cat "$body")"
grep -q "$EMAIL" "$body" || fail "GET users/:id did not return the created user: $(cat "$body")"
pass "GET ${API_PREFIX}/users/:id with session"

code=$(curl -s -H 'Accept: application/json' -o "$body" -w '%{http_code}' "${BASE_URL}${API_PREFIX}/users/${user_id}")
[ "$code" = "401" ] || fail "GET users/:id without a session returned ${code}, expected 401"
pass "GET ${API_PREFIX}/users/:id without session rejected"

code=$(curl -s -o /dev/null -w '%{http_code}' "${BASE_URL}/")
[ "$code" = "200" ] || fail "frontend returned ${code}"
pass "frontend"

if [ "${SKIP_ES:-0}" = "1" ]; then
  echo "  skip  Elasticsearch log shipping (SKIP_ES=1)"
else
  # Elasticsearch takes 30-60s to warm up before the first log flush lands.
  count=0
  for _ in $(seq 1 30); do
    count=$(curl -s "${ES_URL}/${ES_INDEX}/_count" 2>/dev/null \
      | python3 -c "import sys,json;print(json.load(sys.stdin).get('count',0))" 2>/dev/null || echo 0)
    [ "${count:-0}" -gt 0 ] && break
    sleep 4
  done
  [ "${count:-0}" -gt 0 ] || fail "no documents in the ${ES_INDEX} index"
  pass "Elasticsearch log shipping (${count} documents)"
fi

echo "Smoke test passed."
