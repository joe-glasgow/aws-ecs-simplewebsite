import {GraphqlApi, MappingTemplate} from "@aws-cdk/aws-appsync";
import {ServerlessCluster} from "@aws-cdk/aws-rds";
import { DatabaseSecret } from "@aws-cdk/aws-rds";
import {Construct} from "@aws-cdk/core";

const rdsDataSource = (api: GraphqlApi, cluster: ServerlessCluster, stack: Construct) => {
    // Create username and password secret for DB Cluster
    const secret = new DatabaseSecret(stack, 'AuroraSecret', {
        username: 'clusteradmin',
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
    return rdsDS;
}

export default rdsDataSource;