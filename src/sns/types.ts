import { SNSClient } from '@aws-sdk/client-sns';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface SnsContext {
    client: SNSClient;
    logger?: Logger;
}
