import { EventBridgeClientConfig } from '@aws-sdk/client-eventbridge';
import { createEventBridgeClient } from './client';
import { EventBridgeContext, Logger } from './types';
import { putEvents } from './operations/put-events';
import { putRule } from './operations/put-rule';
import { deleteRule } from './operations/delete-rule';
import { putTargets } from './operations/put-targets';
import { removeTargets } from './operations/remove-targets';
import { listRules } from './operations/list-rules';

export const createAdapter = (config: EventBridgeClientConfig, logger?: Logger) => {
    const client = createEventBridgeClient(config);
    const context: EventBridgeContext = { client, logger };

    return {
        client,
        putEvents: putEvents(context),
        putRule: putRule(context),
        deleteRule: deleteRule(context),
        putTargets: putTargets(context),
        removeTargets: removeTargets(context),
        listRules: listRules(context),
    };
};
