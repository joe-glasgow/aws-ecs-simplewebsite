# AWS ECS Simple Website!

This Project is a boiler plate for running a secure nodejs webapp through ECS using Fargate with CDK.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Setup domains and Route53

## Certificate Creation for HTTPS

## ECS Registry, Cluster, Tasks, Service and Docker

`cd simple`

`docker build . `

`docker image ls`

`docker run -d -p 3000:3000 <docker-image-id>`

## Testing the application

## CI Integration

## Optional: MultiAccount AWS Setup (development, testing, production)

## Other considerations (Security, WAF, Cloudfront)

## Useful commands


 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy -c domain=<INSERT DOMAIN NAME HERE>` deploy this stack to your default AWS account/region, providing a domain name
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
