#!/bin/bash
# Deploy Top Dawg OS backend directly to Render (no GitHub required)
set -e

RENDER_API_KEY=$(cat ~/.render-api-key)
SERVICE_ID="srv-d8iq84c8aovs738javqg"

echo "Triggering Render deploy for topdawg-os..."
curl -s -X POST "https://api.render.com/v1/services/$SERVICE_ID/deploys" \
  -H "Authorization: Bearer $RENDER_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"clearCache": "do_not_clear"}' | python3 -c "
import sys, json
d = json.load(sys.stdin)
print('Deploy ID:', d.get('id', '—'))
print('Status:  ', d.get('status', '—'))
"
echo "Done. Check https://dashboard.render.com for deploy status."
