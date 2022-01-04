import {Construct} from 'constructs';
import {Stage} from 'aws-cdk-lib';
import {ServiceStack} from './service-stack';

export class ServiceStage extends Stage {

    constructor(scope: Construct,
                id: string,
                properties: any) {
        super(scope, id);

        new ServiceStack(
            this,
            'ServiceStack',
            properties
        );
    }

}
