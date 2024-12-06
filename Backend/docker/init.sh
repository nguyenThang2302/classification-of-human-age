#!/bin/sh

# Try to fetch SSM value
aws --region "${AWS_DEFAULT_REGION}" ssm get-parameters-by-path --path "/${SERVICE_NAME}" --output json | jq -c ".[][]" | while read item; do key=$(printf '%s' "$item" | jq -r '.ARN | split("/")[-1]'); value=$(printf '%s' "$item" | jq -r '.Value'); value=$(echo $value | sed -e 's/\\/\\\\/g; s/\//\\\//g; s/&/\\\&/g; s/|/\\\|/g'); sed -i -e "s|^${key}=.*|${key}=\"${value}\"|g" .env; done

# Start application
pm2-runtime ecosystem.config.js
