import * as wafv2 from '@aws-cdk/aws-wafv2';
import { Construct } from '@aws-cdk/core';

const WebAppWaf = (stack: Construct) => new wafv2.CfnWebACL(stack, 'waf', {
    description: 'ACL for WebApp',
    scope: 'REGIONAL',
    defaultAction: { allow: {} },
    visibilityConfig: {
        sampledRequestsEnabled: true,
        cloudWatchMetricsEnabled: true,
        metricName: 'tnc-firewall'
    },
    rules: [
        {
            name: 'AWS-AWSManagedRulesCommonRuleSet',
            priority: 1,
            statement: {
                managedRuleGroupStatement: {
                    vendorName: 'AWS',
                    name: 'AWSManagedRulesCommonRuleSet',
                    excludedRules : [
                        {
                            name: "NoUserAgent_HEADER"
                        }
                    ]
                }
            },
            overrideAction: { none: {}},
            visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'AWS-AWSManagedRulesCommonRuleSet'
            }
        },
        {
            name: 'LimitRequests1000',
            priority: 2,
            action: {
                block: {}
            },
            statement: {
                rateBasedStatement: {
                    limit: 1000,
                    aggregateKeyType: "IP"
                }
            },
            visibilityConfig: {
                sampledRequestsEnabled: true,
                cloudWatchMetricsEnabled: true,
                metricName: 'LimitRequests1000'
            }
        },
    ]
})

export default WebAppWaf;