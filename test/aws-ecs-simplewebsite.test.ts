import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { WebappStack } from '../lib/webapp-stack';

test('Empty Stack', () => {
    const app = new cdk.App({
        context: {
            domain: 'test.me.com'
        }
    });
    // WHEN
    const stack = new WebappStack(app, 'MyTestStack', {
        env: {
            account: 'dummy',
            region: 'eu-west-1'
        }
    });
    // THEN
    expectCDK(stack).to(haveResource( "AWS::CloudFormation::CustomResource", {
        "DomainName": "test.me.com"
    }))
});
