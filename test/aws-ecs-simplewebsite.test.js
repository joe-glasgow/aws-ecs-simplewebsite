"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert_1 = require("@aws-cdk/assert");
const cdk = require("@aws-cdk/core");
const webapp_stack_1 = require("../lib/webapp-stack");
test('Empty Stack', () => {
    const app = new cdk.App({
        context: {
            domain: 'test.me.com'
        }
    });
    // WHEN
    const stack = new webapp_stack_1.WebappStack(app, 'MyTestStack', {
        env: {
            account: 'dummy',
            region: 'eu-west-1'
        }
    });
    // THEN
    assert_1.expect(stack).to(assert_1.haveResource("AWS::CloudFormation::CustomResource", {
        "DomainName": "test.me.com"
    }));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzLWVjcy1zaW1wbGV3ZWJzaXRlLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJhd3MtZWNzLXNpbXBsZXdlYnNpdGUudGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUFvRTtBQUNwRSxxQ0FBcUM7QUFDckMsc0RBQWtEO0FBRWxELElBQUksQ0FBQyxhQUFhLEVBQUUsR0FBRyxFQUFFO0lBQ3JCLE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQztRQUNwQixPQUFPLEVBQUU7WUFDTCxNQUFNLEVBQUUsYUFBYTtTQUN4QjtLQUNKLENBQUMsQ0FBQztJQUNILE9BQU87SUFDUCxNQUFNLEtBQUssR0FBRyxJQUFJLDBCQUFXLENBQUMsR0FBRyxFQUFFLGFBQWEsRUFBRTtRQUM5QyxHQUFHLEVBQUU7WUFDRCxPQUFPLEVBQUUsT0FBTztZQUNoQixNQUFNLEVBQUUsV0FBVztTQUN0QjtLQUNKLENBQUMsQ0FBQztJQUNILE9BQU87SUFDUCxlQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLHFCQUFZLENBQUUscUNBQXFDLEVBQUU7UUFDckUsWUFBWSxFQUFFLGFBQWE7S0FDOUIsQ0FBQyxDQUFDLENBQUE7QUFDUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4cGVjdCBhcyBleHBlY3RDREssIGhhdmVSZXNvdXJjZSB9IGZyb20gJ0Bhd3MtY2RrL2Fzc2VydCc7XG5pbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XG5pbXBvcnQgeyBXZWJhcHBTdGFjayB9IGZyb20gJy4uL2xpYi93ZWJhcHAtc3RhY2snO1xuXG50ZXN0KCdFbXB0eSBTdGFjaycsICgpID0+IHtcbiAgICBjb25zdCBhcHAgPSBuZXcgY2RrLkFwcCh7XG4gICAgICAgIGNvbnRleHQ6IHtcbiAgICAgICAgICAgIGRvbWFpbjogJ3Rlc3QubWUuY29tJ1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy8gV0hFTlxuICAgIGNvbnN0IHN0YWNrID0gbmV3IFdlYmFwcFN0YWNrKGFwcCwgJ015VGVzdFN0YWNrJywge1xuICAgICAgICBlbnY6IHtcbiAgICAgICAgICAgIGFjY291bnQ6ICdkdW1teScsXG4gICAgICAgICAgICByZWdpb246ICdldS13ZXN0LTEnXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvLyBUSEVOXG4gICAgZXhwZWN0Q0RLKHN0YWNrKS50byhoYXZlUmVzb3VyY2UoIFwiQVdTOjpDbG91ZEZvcm1hdGlvbjo6Q3VzdG9tUmVzb3VyY2VcIiwge1xuICAgICAgICBcIkRvbWFpbk5hbWVcIjogXCJ0ZXN0Lm1lLmNvbVwiXG4gICAgfSkpXG59KTtcbiJdfQ==