# AWS ECS Simple Website with AppSync!

This Project is a boiler plate for running a secure nodejs webapp through ECS using Fargate with CDK.

A backend is provided through GraphQL AppSync.

## Getting up and running!

Configure your [aws-cli](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html) and [CDK](https://aws.amazon.com/cdk/)

Be sure how you know how run CDK in [context](https://docs.aws.amazon.com/cdk/latest/guide/context.html)

### Build the GraphQL stack

The graphQL stack creates an [Aurora DB](https://aws.amazon.com/rds/aurora/?aurora-whats-new.sort-by=item.additionalFields.postDateTime&aurora-whats-new.sort-order=desc) instance that interfaces with [AppSync GraphQL](https://aws.amazon.com/appsync/) for saving and retrieving data.

*Build GraphQL Stack first to set API Key and GraphQL URL in param store*

`cdk deploy GraphQLStack -c domain=<sub.yourdomain.com> -c aws-access-key=$(aws configure get aws_access_key_id) -c aws-secret-access-key=$(aws configure get aws_secret_access_key) -c region=eu-west-1`

### Build the Webapp stack

The webapp stack runs a simple NodeJS server instance with micro-service which consumes the graphql endpoint.
The app is [loadbalanced](https://aws.amazon.com/elasticloadbalancing/?elb-whats-new.sort-by=item.additionalFields.postDateTime&elb-whats-new.sort-order=desc) with its container hosted on [Fargate](https://aws.amazon.com/fargate/?whats-new-cards.sort-by=item.additionalFields.postDateTime&whats-new-cards.sort-order=desc&fargate-blogs.sort-by=item.additionalFields.createdDate&fargate-blogs.sort-order=desc) and protected using [WAF](https://aws.amazon.com/waf/) rules.

*Build WebappStack that provides the secrets to allow aws cli to retrieve params set in AppSync GraphQL Stack*


`cdk deploy WebappStack -c domain=<sub.yourdomain.com> -c aws-access-key=$(aws configure get aws_access_key_id) -c aws-secret-access-key=$(aws configure get aws_secret_access_key) -c region=eu-west-1`

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Setup domains and Route53

Register or transfer a domain using [Route53](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/Welcome.html).

Follow the steps to create a [Hosted Zone](https://docs.aws.amazon.com/Route53/latest/DeveloperGuide/hosted-zones-working-with.html)

Tip: 

[Create accounts for development/testing/production](https://aws.amazon.com/organizations/getting-started/best-practices/)

I wished to have some sub-domains for various development/testing and production environment so this [tutorial](https://serverless-stack.com/chapters/share-route-53-domains-across-aws-accounts.html) helped set that up!

## Certificate Creation for HTTPS

Uses the CDK method `DnsValidatedCertificate` which authorizes your certificates without having to manually approve. 
This requires the previous step completed for domains in Route53.

## ECS Registry, Cluster, Tasks, Service and Docker

WebappStack is deployed to ECS and the task is run based on the Dockerfile in the `simple` directory.

This application uses the ECS Patterns for an [application load balanced fargatge service](https://docs.aws.amazon.com/cdk/api/latest/docs/@aws-cdk_aws-ecs-patterns.ApplicationLoadBalancedFargateService.html)

## Testing the application

TODO

## CI Integration

TODO

## Local Development

To run the Webapp with GraphQL instances locally with Docker:

1. Deploy the GraphQL stack as described above
2. Change directory to the simple application `cd simple` 
3. Export the required variables used by the Docker instance
    `$ export AWS_ACCESS_KEY_ID=$(aws configure get aws_access_key_id)`
    `$ export AWS_SECRET_ACCESS_KEY=$(aws configure get aws_secret_access_key)`
4. Build the docker image providing the new env variables e.g.
    `$ docker build --build-arg AWS_ACCESS_KEY_ID --build-arg AWS_SECRET_ACCESS_KEY . `
5. Get the latest docker image id
    `$ docker image ls`
6. Run the latest image id and bind port 3000
   `$ docker run -p 3000:3000 <docker image id from step 5>`



## Useful commands


 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run test`    perform the jest unit tests
 * `cdk deploy -c domain=<INSERT DOMAIN NAME HERE>` deploy this stack to your default AWS account/region, providing a domain name
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
