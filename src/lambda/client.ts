import { LambdaClient, LambdaClientConfig } from '@aws-sdk/client-lambda';

export const createLambdaClient = (config: LambdaClientConfig): LambdaClient => {
    return new LambdaClient(config);
};
