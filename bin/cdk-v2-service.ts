#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Pipeline } from '../lib/pipeline';

const app = new cdk.App();
new Pipeline(app, 'CdkV2ServiceCustomBuildImageStack',
    {
        stackName: 'CdkV2ServiceCustomBuildImageStack'
    });
