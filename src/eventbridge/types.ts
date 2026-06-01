import { EventBridgeClient } from '@aws-sdk/client-eventbridge';

export interface Logger {
    debug: (message: string, context?: { error?: any; data?: any }) => void;
    [key: string]: any;
}

export interface EventBridgeContext {
    client: EventBridgeClient;
    logger?: Logger;
}
