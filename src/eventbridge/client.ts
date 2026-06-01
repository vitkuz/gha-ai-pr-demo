import { EventBridgeClient, EventBridgeClientConfig } from '@aws-sdk/client-eventbridge';

export const createEventBridgeClient = (config: EventBridgeClientConfig): EventBridgeClient => {
    return new EventBridgeClient(config);
};
