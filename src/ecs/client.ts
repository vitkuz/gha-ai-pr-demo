import { ECSClient, ECSClientConfig } from '@aws-sdk/client-ecs';

export const createEcsClient = (config: ECSClientConfig): ECSClient => {
    return new ECSClient(config);
};
