import { ECRClient } from '@aws-sdk/client-ecr';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface EcrContext {
    client: ECRClient;
    logger?: Logger;
}
