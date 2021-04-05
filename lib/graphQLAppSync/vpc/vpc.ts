import {Construct} from "@aws-cdk/core";
import {NatProvider, SubnetType, InstanceType, Vpc} from "@aws-cdk/aws-ec2";

const natGatewayProvider = NatProvider.instance({
    instanceType: new InstanceType('t2.micro'),
});

const auroraVPC = (stack: Construct) =>  new Vpc(stack, 'AuroraVpc', {
    maxAzs: 2, // Default is all AZs in region
    natGateways: 1,
    natGatewayProvider,
    subnetConfiguration: [
        {cidrMask: 23, name: 'Private', subnetType: SubnetType.PRIVATE},
        {cidrMask: 23, name: 'Public', subnetType: SubnetType.PUBLIC}
    ]
});

export default auroraVPC;