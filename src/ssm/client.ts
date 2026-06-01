import { SSMClient, SSMClientConfig } from '@aws-sdk/client-ssm';

export const createSsmClient = (config: SSMClientConfig): SSMClient => {
    return new SSMClient(config);
};
