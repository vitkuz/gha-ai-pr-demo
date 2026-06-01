import { LambdaClient } from '@aws-sdk/client-lambda';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface LambdaContext {
    client: LambdaClient;
    logger?: Logger;
}
