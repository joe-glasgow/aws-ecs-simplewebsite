import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds'
import {join} from 'path'
import * as appsync from '@aws-cdk/aws-appsync';
import {CfnApiKey} from '@aws-cdk/aws-appsync';
import * as SSM from "@aws-cdk/aws-ssm";
import auroraVPC from "./vpc/vpc";
import httpDataSource from "./httpDataSource/dataSource";
import rdsDataSource from "./rdsDataSource/rdsDataSource";

export class GraphQLStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new appsync.GraphqlApi(this, 'Api', {
            name: 'demo',
            schema: appsync.Schema.fromAsset(join(__dirname, 'schema.gql')),
            xrayEnabled: true,
            // TODO: SHOULD ENABLE THIS IN A PRODUCTION CONTEXT
            // authorizationConfig: {
            //     additionalAuthorizationModes: [{
            //         authorizationType: AuthorizationType.IAM,
            //     }]
            // }
        });

        const apiKey = new CfnApiKey(this, 'graphql-app-sync-stack-key', {
            apiId: api.apiId
        });

        const region = this.node.tryGetContext('region')
        // Add RDS Data Source
        httpDataSource(api, region)

        const vpc = auroraVPC(this);

        // Create the serverless cluster, provide all values needed to customise the database.
        const cluster = new rds.ServerlessCluster(this, 'AuroraCluster', {
            engine: rds.DatabaseClusterEngine.AURORA_MYSQL,
            vpc,
            credentials: {username: 'clusteradmin'},
            clusterIdentifier: 'db-endpoint-test',
            defaultDatabaseName: 'demos',
        });
        // Build a data source for AppSync to access the database.
        rdsDataSource(api, cluster, this)
        // Show the GraphQL API Endpoint in the build - e.g useful in CI/CD
        new cdk.CfnOutput(this, 'Endpoint', {
            value: api.graphqlUrl
        });
        // Save URL to param store
        new SSM.StringParameter(this, 'graphQLURL', {
            stringValue: api.graphqlUrl,
            parameterName: 'graphQLURL',
        });

        // Show the API Key in the build - e.g useful in CI/CD
        new cdk.CfnOutput(this, 'API_Key', {
            value: apiKey.attrApiKey
        });
        // Save API Key to param store
        new SSM.StringParameter(this, 'apiKey', {
            stringValue: apiKey.attrApiKey,
            parameterName: 'apiKey',
        });
    }
}