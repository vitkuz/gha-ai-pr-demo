import { ECRClient, ECRClientConfig } from '@aws-sdk/client-ecr';

export const createEcrClient = (config: ECRClientConfig): ECRClient => {
    return new ECRClient(config);
};
