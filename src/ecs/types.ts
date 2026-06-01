import { ECSClient } from '@aws-sdk/client-ecs';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface EcsContext {
    client: ECSClient;
    logger?: Logger;
}
