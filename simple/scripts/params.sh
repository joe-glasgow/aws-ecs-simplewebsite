#!/usr/bin/env bash

graphQLURL=$( aws ssm get-parameters --name graphQLURL --query="Parameters[0].Value")
apiKey=$(aws ssm get-parameters --name apiKey --query="Parameters[0].Value")

echo "$graphQLURL"
echo "$apiKey"