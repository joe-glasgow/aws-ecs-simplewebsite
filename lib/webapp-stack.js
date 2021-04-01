"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebappStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const ecs_patterns = require("@aws-cdk/aws-ecs-patterns");
const aws_ecs_patterns_1 = require("@aws-cdk/aws-ecs-patterns");
const aws_route53_1 = require("@aws-cdk/aws-route53");
const path = require("path");
const aws_certificatemanager_1 = require("@aws-cdk/aws-certificatemanager");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
class WebappStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const domainName = this.node.tryGetContext('domain') || process.env.DOMAIN_NAME;
        const domainZone = aws_route53_1.PublicHostedZone.fromLookup(this, 'PublicHostedZone', {
            domainName,
            privateZone: false,
        });
        const vpc = new ec2.Vpc(this, "WebappVpc", {
            maxAzs: 3 // Default is all AZs in region
        });
        const cluster = new ecs.Cluster(this, "WebappCluster", {
            vpc: vpc
        });
        const certificate = new aws_certificatemanager_1.DnsValidatedCertificate(this, 'LBCertificate', {
            hostedZone: domainZone,
            domainName,
        });
        // Create a load-balanced Fargate service and make it public
        const lb = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "WebappFargateService", {
            cluster,
            cpu: 512,
            desiredCount: 1,
            taskImageOptions: {
                containerPort: 3000,
                image: ecs.ContainerImage.fromAsset(path.resolve(__dirname, '../simple'))
            },
            memoryLimitMiB: 1024,
            domainZone,
            protocol: aws_elasticloadbalancingv2_1.ApplicationProtocol.HTTPS,
            domainName,
            certificate,
            recordType: aws_ecs_patterns_1.ApplicationLoadBalancedServiceRecordType.ALIAS,
            publicLoadBalancer: true // Default is false
        });
        lb.loadBalancer.addRedirect();
    }
}
exports.WebappStack = WebappStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBwLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsid2ViYXBwLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDBEQUEwRDtBQUMxRCxnRUFBbUY7QUFDbkYsc0RBQXNEO0FBQ3RELDZCQUE2QjtBQUM3Qiw0RUFBd0U7QUFDeEUsb0ZBQXdFO0FBRXhFLE1BQWEsV0FBWSxTQUFRLEdBQUcsQ0FBQyxLQUFLO0lBQ3hDLFlBQVksS0FBb0IsRUFBRSxFQUFVLEVBQUUsS0FBc0I7UUFDbEUsS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFFeEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLElBQUksT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUE7UUFFL0UsTUFBTSxVQUFVLEdBQUcsOEJBQWdCLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxrQkFBa0IsRUFBRTtZQUN2RSxVQUFVO1lBQ1YsV0FBVyxFQUFFLEtBQUs7U0FDbkIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxHQUFHLEdBQUcsSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxXQUFXLEVBQUU7WUFDekMsTUFBTSxFQUFFLENBQUMsQ0FBQywrQkFBK0I7U0FDMUMsQ0FBQyxDQUFDO1FBRUgsTUFBTSxPQUFPLEdBQUcsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDckQsR0FBRyxFQUFFLEdBQUc7U0FDVCxDQUFDLENBQUM7UUFFSCxNQUFNLFdBQVcsR0FBRyxJQUFJLGdEQUF1QixDQUFDLElBQUksRUFBRSxlQUFlLEVBQUU7WUFDckUsVUFBVSxFQUFFLFVBQVU7WUFDdEIsVUFBVTtTQUNYLENBQUMsQ0FBQTtRQUVGLDREQUE0RDtRQUM1RCxNQUFNLEVBQUUsR0FBRyxJQUFJLFlBQVksQ0FBQyxxQ0FBcUMsQ0FBQyxJQUFJLEVBQUUsc0JBQXNCLEVBQUU7WUFDOUYsT0FBTztZQUNQLEdBQUcsRUFBRSxHQUFHO1lBQ1IsWUFBWSxFQUFFLENBQUM7WUFDZixnQkFBZ0IsRUFBRTtnQkFDaEIsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLEtBQUssRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQzthQUMxRTtZQUNELGNBQWMsRUFBRSxJQUFJO1lBQ3BCLFVBQVU7WUFDVixRQUFRLEVBQUUsZ0RBQW1CLENBQUMsS0FBSztZQUNuQyxVQUFVO1lBQ1YsV0FBVztZQUNYLFVBQVUsRUFBRSwyREFBd0MsQ0FBQyxLQUFLO1lBQzFELGtCQUFrQixFQUFFLElBQUksQ0FBQyxtQkFBbUI7U0FDN0MsQ0FBQyxDQUFBO1FBRUYsRUFBRSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQTtJQUMvQixDQUFDO0NBQ0Y7QUE1Q0Qsa0NBNENDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgY2RrIGZyb20gJ0Bhd3MtY2RrL2NvcmUnO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XG5pbXBvcnQgKiBhcyBlY3MgZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcbmltcG9ydCAqIGFzIGVjc19wYXR0ZXJucyBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjcy1wYXR0ZXJuc1wiO1xuaW1wb3J0IHtBcHBsaWNhdGlvbkxvYWRCYWxhbmNlZFNlcnZpY2VSZWNvcmRUeXBlfSBmcm9tIFwiQGF3cy1jZGsvYXdzLWVjcy1wYXR0ZXJuc1wiO1xuaW1wb3J0IHtQdWJsaWNIb3N0ZWRab25lfSBmcm9tIFwiQGF3cy1jZGsvYXdzLXJvdXRlNTNcIjtcbmltcG9ydCAqIGFzIHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7RG5zVmFsaWRhdGVkQ2VydGlmaWNhdGV9IGZyb20gXCJAYXdzLWNkay9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyXCI7XG5pbXBvcnQge0FwcGxpY2F0aW9uUHJvdG9jb2x9IGZyb20gXCJAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2MlwiO1xuXG5leHBvcnQgY2xhc3MgV2ViYXBwU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkNvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCwgcHJvcHMpO1xuXG4gICAgY29uc3QgZG9tYWluTmFtZSA9IHRoaXMubm9kZS50cnlHZXRDb250ZXh0KCdkb21haW4nKSB8fCBwcm9jZXNzLmVudi5ET01BSU5fTkFNRVxuXG4gICAgY29uc3QgZG9tYWluWm9uZSA9IFB1YmxpY0hvc3RlZFpvbmUuZnJvbUxvb2t1cCh0aGlzLCAnUHVibGljSG9zdGVkWm9uZScsIHtcbiAgICAgIGRvbWFpbk5hbWUsXG4gICAgICBwcml2YXRlWm9uZTogZmFsc2UsXG4gICAgfSlcblxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsIFwiV2ViYXBwVnBjXCIsIHtcbiAgICAgIG1heEF6czogMyAvLyBEZWZhdWx0IGlzIGFsbCBBWnMgaW4gcmVnaW9uXG4gICAgfSk7XG5cbiAgICBjb25zdCBjbHVzdGVyID0gbmV3IGVjcy5DbHVzdGVyKHRoaXMsIFwiV2ViYXBwQ2x1c3RlclwiLCB7XG4gICAgICB2cGM6IHZwY1xuICAgIH0pO1xuXG4gICAgY29uc3QgY2VydGlmaWNhdGUgPSBuZXcgRG5zVmFsaWRhdGVkQ2VydGlmaWNhdGUodGhpcywgJ0xCQ2VydGlmaWNhdGUnLCB7XG4gICAgICBob3N0ZWRab25lOiBkb21haW5ab25lLFxuICAgICAgZG9tYWluTmFtZSxcbiAgICB9KVxuXG4gICAgLy8gQ3JlYXRlIGEgbG9hZC1iYWxhbmNlZCBGYXJnYXRlIHNlcnZpY2UgYW5kIG1ha2UgaXQgcHVibGljXG4gICAgY29uc3QgbGIgPSBuZXcgZWNzX3BhdHRlcm5zLkFwcGxpY2F0aW9uTG9hZEJhbGFuY2VkRmFyZ2F0ZVNlcnZpY2UodGhpcywgXCJXZWJhcHBGYXJnYXRlU2VydmljZVwiLCB7XG4gICAgICBjbHVzdGVyLCAvLyBSZXF1aXJlZFxuICAgICAgY3B1OiA1MTIsIC8vIERlZmF1bHQgaXMgMjU2XG4gICAgICBkZXNpcmVkQ291bnQ6IDEsIC8vIERlZmF1bHQgaXMgMVxuICAgICAgdGFza0ltYWdlT3B0aW9uczoge1xuICAgICAgICBjb250YWluZXJQb3J0OiAzMDAwLFxuICAgICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21Bc3NldChwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vc2ltcGxlJykpXG4gICAgICB9LFxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEwMjQsIC8vIERlZmF1bHQgaXMgNTEyXG4gICAgICBkb21haW5ab25lLFxuICAgICAgcHJvdG9jb2w6IEFwcGxpY2F0aW9uUHJvdG9jb2wuSFRUUFMsXG4gICAgICBkb21haW5OYW1lLFxuICAgICAgY2VydGlmaWNhdGUsXG4gICAgICByZWNvcmRUeXBlOiBBcHBsaWNhdGlvbkxvYWRCYWxhbmNlZFNlcnZpY2VSZWNvcmRUeXBlLkFMSUFTLFxuICAgICAgcHVibGljTG9hZEJhbGFuY2VyOiB0cnVlIC8vIERlZmF1bHQgaXMgZmFsc2VcbiAgICB9KVxuXG4gICAgbGIubG9hZEJhbGFuY2VyLmFkZFJlZGlyZWN0KClcbiAgfVxufVxuIl19