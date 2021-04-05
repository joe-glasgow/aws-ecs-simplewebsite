import {Construct} from "@aws-cdk/core";
import {SubnetType, Vpc} from "@aws-cdk/aws-ec2";

const auroraVPC = (stack: Construct) =>  new Vpc(stack, 'AuroraVpc', {
    maxAzs: 2, // Default is all AZs in region
    natGateways: 1,
    subnetConfiguration: [
        {cidrMask: 23, name: 'Private', subnetType: SubnetType.PRIVATE},
        {cidrMask: 23, name: 'Public', subnetType: SubnetType.PUBLIC}
    ]
});

export default auroraVPC;