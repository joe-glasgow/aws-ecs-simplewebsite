import {GraphqlApi, MappingTemplate} from "@aws-cdk/aws-appsync";
import {join} from "path";

const httpDataSource = (api: GraphqlApi, region: string) => {
    const httpDs = api.addHttpDataSource(
        'ds',
        `https://states.${region}.amazonaws.com/`,
        {
            name: 'httpDsWithStepF',
            description: 'from appsync to StepFunctions Workflow',
            authorizationConfig: {
                signingRegion: region,
                signingServiceName: 'states'
            }
        }
    );

    httpDs.createResolver({
        typeName: 'Mutation',
        fieldName: 'callStepFunction',
        requestMappingTemplate: MappingTemplate.fromFile(join(__dirname, 'request.vtl')),
        responseMappingTemplate: MappingTemplate.fromFile(join(__dirname, 'response.vtl'))
    });
    return httpDs;
}

export default httpDataSource;

