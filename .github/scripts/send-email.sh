#!/bin/bash
set -xue

response=$(curl \
    --request POST \
    --header "Content-Type: application/x-www-form-urlencoded" \
    --data "grant_type=client_credentials&client_id=${MAIL_CLIENT_ID}&client_secret=${MAIL_CLIENT_SECRET}&resource=https://management.core.windows.net" \
    "https://login.microsoftonline.com/${MAIL_TENANT_ID}/oauth2/token")

access_token=`echo $response | jq -r '. | select(.access_token) | .access_token'`

curl \
    --request POST \
    --header "Content-Type: application/json" \
    --header "Authorization: Bearer $access_token" \
    --data "{\"to\": \"${TO}\", \"body\": ${BODY}, \"subject\": \"${SUBJECT}\"}" \
    'https://prod-18.northcentralus.logic.azure.com:443/workflows/b33d7861bfc64832a6f62cc8f2213988/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0'
