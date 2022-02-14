import { Construct } from 'constructs';
import { Stage } from 'aws-cdk-lib';
import { ServiceStack } from './service-stack';

export interface StageProperties {
    readonly serviceName: string
    readonly npmToken?: string
}

export class ServiceStage extends Stage {

    constructor(scope: Construct,
                id: string,
                properties: StageProperties) {
        super(scope, id);

        new ServiceStack(
            this,
            'CdkServiceCustomBuildImage',
            {
                ...properties,
                stackName: `${properties.serviceName}-${id}`
            }
        );
    }

}
