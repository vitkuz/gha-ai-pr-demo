import { SNSClient, SNSClientConfig } from '@aws-sdk/client-sns';

export const createSnsClient = (config: SNSClientConfig): SNSClient => {
    return new SNSClient(config);
};
