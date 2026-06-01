import {
    RemoveTargetsCommand,
    RemoveTargetsCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface RemoveTargetsInput {
    rule: string;
    ids: string[];
    eventBusName?: string;
}

export const removeTargets =
    (context: EventBridgeContext) =>
    async (input: RemoveTargetsInput): Promise<RemoveTargetsCommandOutput> => {
        const { client, logger } = context;
        const { rule, ids, eventBusName } = input;

        logger?.debug('removeTargets:start', { data: { rule, count: ids.length } });

        try {
            const command: RemoveTargetsCommand = new RemoveTargetsCommand({
                Rule: rule,
                Ids: ids,
                EventBusName: eventBusName,
            });
            const result: RemoveTargetsCommandOutput = await client.send(command);
            logger?.debug('removeTargets:success');
            return result;
        } catch (error) {
            logger?.debug('removeTargets:error', { error });
            throw error;
        }
    };
