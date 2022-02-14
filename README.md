# CDK v2 Example (Custom Build Image)

This example shows how to use CDK v2 and how to provision a lambda function with a custom build image.

The project is written in **Typescript**.

------------------------------------------------------------------------------------------------------------------------

## Table of Contents
1. [Introduction](#introduction)
2. [Bootstrap](#bootstrap)
3. [Deployment](#deployment)
4. [Staging](#staging)
5. [Useful Commands](#useful-commands)

------------------------------------------------------------------------------------------------------------------------

# Introduction

The example contains:
* CI/CD pipeline using CodePipeline
* passing a custom NPM token to the actual build to enable private NPM repository access for npm dependencies
* stage-support for the pipeline.
* System Manager Parameter store lookup: Look up a value from the SSM paramter store (in this example: npm token to access private npm repositories)
* custom build image using a Dockerfile
* two lambda functions using the same docker build image

------------------------------------------------------------------------------------------------------------------------

# Bootstrap

### Requirements
In order to build and deploy the project, you need:
* npm
* typescript: ```npm install -g typescript```
* cdk: ```npm install -g aws-cdk```

### Install dependencies:
```
    npm install
```

### Build the project
Now, you can build the project:
```
    npm run build
```

### Custom Build Image
You can modify your custom build image here: ```docker/Dockerfile```
The docker image is used to build your lambda functions.

------------------------------------------------------------------------------------------------------------------------

# Deployment
After a successful build, you can start the CDK deployment:
```
    cdk deploy
```

------------------------------------------------------------------------------------------------------------------------

# Staging
A word to staging: There are several ways to achieve staging for a CDK based CI/CD pipeline:

1) add multiple stages to your CI / CD pipeline and either deploy automatically to those or use a manual confirmation
   to do so
2) add another stack here: ```/bin/cdk-v2-service.ts```

While the first approach is the way to go for solo-branch repositories, I'd recommend to use multiple branches
and maintain a separate CI / CD pipeline for each branch.

You can see, that I define two stacks in ```/bin/cdk-v2-service.ts``` one for each branch and stage.
I pass on some values for latter use to define stack name, stage name and target branch to use.

You can use ```cdk deploy``` and define which stack you want to deploy: ```cdk deploy my-stack-prod```.

The CI/CD pipeline will make use of the stack deployment and configure its self-mutate step accordingly to update the proper
(staged) stack.

Just make sure to push your code to two branches and configure the proper branch to use in ```lib/pipeline.ts``` here:
```
    input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'CodeRepository', 'cdk-v2-service'), 'master'),
```
Just change the ```master``` branch to what ever you want. Adapt the source to your source provider; in this case I use CodePipeline,
but you can easily use another source provider here (e.g. GitHub).

------------------------------------------------------------------------------------------------------------------------

# Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
