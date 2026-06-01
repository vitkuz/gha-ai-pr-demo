import { SSMClient } from '@aws-sdk/client-ssm';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface SsmContext {
    client: SSMClient;
    logger?: Logger;
}
