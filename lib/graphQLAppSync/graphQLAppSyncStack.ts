import * as cdk from '@aws-cdk/core';
import * as rds from '@aws-cdk/aws-rds'
import {join} from 'path'
import * as appsync from '@aws-cdk/aws-appsync';
import {CfnApiKey, MappingTemplate} from '@aws-cdk/aws-appsync';
import * as SSM from "@aws-cdk/aws-ssm";
import auroraVPC from "./vpc/vpc";

export class GraphQLStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        const api = new appsync.GraphqlApi(this, 'Api', {
            name: 'demo',
            schema: appsync.Schema.fromAsset(join(__dirname, 'schema.gql')),
            xrayEnabled: true,
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

        const httpDs = api.addHttpDataSource(
            'ds',
            `https://states.${region}.amazonaws.com/`,
            {
                name: 'httpDsWithStepF',
                description: 'from appsync to SytepFunctions Workflow',
                authorizationConfig: {
                    signingRegion: region,
                    signingServiceName: 'states'
                }
            }
        );

        httpDs.createResolver({
            typeName: 'Mutation',
            fieldName: 'callStepFunction',
            requestMappingTemplate: MappingTemplate.fromFile(join(__dirname,'request.vtl' )),
            responseMappingTemplate: MappingTemplate.fromFile(join(__dirname,'response.vtl'))
        });
        // Create username and password secret for DB Cluster
        const secret = new rds.DatabaseSecret(this, 'AuroraSecret', {
            username: 'clusteradmin',
        });

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
        const rdsDS = api.addRdsDataSource('rds', cluster, secret, 'demos');
        // Set up a resolver for an RDS query.
        rdsDS.createResolver({
            typeName: 'Query',
            fieldName: 'getDemosRds',
            requestMappingTemplate: MappingTemplate.fromString(`
              {
                "version": "2018-05-29",
                "statements": [
                  "SELECT * FROM demos"
                ]
              }
            `),
            responseMappingTemplate: MappingTemplate.fromString(`
                $util.rds.toJsonObject($ctx.result)
            `),
        });
        // Set up a resolver for an RDS mutation.
        rdsDS.createResolver({
            typeName: 'Mutation',
            fieldName: 'addDemoRds',
            requestMappingTemplate: MappingTemplate.fromString(`
              {
                "version": "2018-05-29",
                "statements": [
                  "INSERT INTO demos VALUES (:id, :version)",
                  "SELECT * WHERE id = :id"
                ],
                "variableMap": {
                  ":id": $util.toJson($util.autoId()),
                  ":version": $util.toJson($ctx.args.version)
                }
              }
            `),
            responseMappingTemplate: MappingTemplate.fromString(`
                $util.rds.toJsonObject($ctx.result)
            `),
        });
        // GraphQL API Endpoint
        new cdk.CfnOutput(this, 'Endpoint', {
            value: api.graphqlUrl
        });

        const paramGraphQLURL = new SSM.StringParameter(this, 'graphQLURL', {
            stringValue: api.graphqlUrl,
            parameterName: 'graphQLURL',
        });

        // API Key
        new cdk.CfnOutput(this, 'API_Key', {
            value: apiKey.attrApiKey
        });

        const paramApiKey = new SSM.StringParameter(this, 'apiKey', {
            stringValue: apiKey.attrApiKey,
            parameterName: 'apiKey',
        });
    }
}