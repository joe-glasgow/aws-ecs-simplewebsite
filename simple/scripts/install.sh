#!/usr/bin/env bash

graphQLURL=$(aws ssm get-parameters --region=eu-west-1 --name graphQLURL --query="Parameters[0].Value" | tr -d \")
apiKey=$(aws ssm get-parameters --region=eu-west-1 --name apiKey --query="Parameters[0].Value" | tr -d \")

echo "GRAPHQL_URL = $graphQLURL"
echo "API_KEY = $apiKey"

export GRAPHQL_URL=$graphQLURL
export API_KEY=$apiKey
npm install --verbose && npm run build && node app.js