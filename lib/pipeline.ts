import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {Repository} from 'aws-cdk-lib/aws-codecommit';
import {Effect, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {ServiceStage} from './service-stage';
import {BuildEnvironmentVariableType, ComputeType, LinuxBuildImage} from 'aws-cdk-lib/aws-codebuild';
import {Secret} from 'aws-cdk-lib/aws-secretsmanager';

const SECRET_MANAGER_NPM_TOKEN_NAME = 'appointmed-infrastructure/3rdparty/npm';

export class Pipeline extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const npmToken = Secret.fromSecretNameV2(this, 'NpmTokenSecret', SECRET_MANAGER_NPM_TOKEN_NAME);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'cdk-v2-service-custom-build-image',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'CodeRepository', 'cdk-v2-service-custom-build-image'), 'master'),
                installCommands: [
                    'echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > .npmrc && npm i -g npm && npm install -g typescript@4.0.2 && npm install -g tslint@5.5.0'
                ],
                commands: [
                    'npm install -g aws-cdk',
                    'npm ci',
                    'npm run build',
                    'npx cdk synth'
                ]
            }),
            synthCodeBuildDefaults: {
                buildEnvironment: {
                    computeType: ComputeType.SMALL,
                    privileged: true,
                    environmentVariables: {
                        NPM_TOKEN: {
                            type: BuildEnvironmentVariableType.SECRETS_MANAGER,
                            value: SECRET_MANAGER_NPM_TOKEN_NAME
                        }
                    },
                    buildImage: LinuxBuildImage.AMAZON_LINUX_2_ARM
                },
                rolePolicy: [
                    new PolicyStatement({
                        sid: 'ssm',
                        effect: Effect.ALLOW,
                        actions: [
                            'ssm:GetParameter'
                        ],
                        resources: [
                            `arn:aws:ssm:${this.region}:${this.account}:parameter/*`,
                        ]
                    }),
                    new PolicyStatement({
                        sid: 'secrets',
                        effect: Effect.ALLOW,
                        actions: [
                            'secretsmanager:GetSecretValue'
                        ],
                        resources: [
                            `arn:aws:secretsmanager:${this.region}:${this.account}:secret:appointmed-infrastructure/3rdparty/npm-ZlotH6`
                        ]
                    })
                ]
            }
        });

        pipeline.addStage(new ServiceStage(this, 'ServiceStage', {npmToken: npmToken.secretValue.toString()}));
    }
}
