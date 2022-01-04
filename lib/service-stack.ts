import { DockerImage, Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';

export class ServiceStack extends Stack {

    constructor(scope: Construct,
                id: string,
                properties: any) {
        super(scope, id, properties);

        const dockerImage = DockerImage.fromBuild(path.join('docker'));

        new NodejsFunction(this, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            memorySize: 1024,
            awsSdkConnectionReuse: true,
            architecture: Architecture.ARM_64,
            bundling: {
                externalModules: [
                    'aws-sdk'
                ],
                nodeModules: [],
                environment: {
                    NPM_TOKEN: properties.npmToken
                },
                forceDockerBundling: false,
                dockerImage: dockerImage,
                preCompilation: true,
                commandHooks: {
                    beforeBundling(): string[] {
                        return []
                    },
                    beforeInstall(): string[] {
                        return [
                            'cd ./asset-input/',
                            'npm --version',
                            'echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc '
                        ];
                    },
                    afterBundling(): string[] {
                        return [];
                    }
                }
            },
            handler: 'test',
            entry: __dirname + '/../lambda/index.ts'
        });

        new NodejsFunction(this, 'TestFunction2', {
            runtime: Runtime.NODEJS_14_X,
            memorySize: 1024,
            awsSdkConnectionReuse: true,
            architecture: Architecture.ARM_64,
            bundling: {
                externalModules: [
                    'aws-sdk'
                ],
                nodeModules: [],
                environment: {
                    NPM_TOKEN: properties.npmToken
                },
                forceDockerBundling: false,
                dockerImage: dockerImage,
                preCompilation: true,
                commandHooks: {
                    beforeBundling(): string[] {
                        return []
                    },
                    beforeInstall(): string[] {
                        return [
                            // 'npm update -g npm', //<<- this leads to error when building locally
                            'cd ./asset-input/',
                            'npm --version',
                            'echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc '
                        ];
                    },
                    afterBundling(): string[] {
                        return [];
                    }
                }
            },
            handler: 'test2',
            entry: __dirname + '/../lambda/index.ts'
        });
    }
}
