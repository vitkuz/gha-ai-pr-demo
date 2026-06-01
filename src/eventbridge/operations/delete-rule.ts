import {
    DeleteRuleCommand,
    DeleteRuleCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface DeleteRuleInput {
    name: string;
    eventBusName?: string;
    force?: boolean;
}

export const deleteRule =
    (context: EventBridgeContext) =>
    async (input: DeleteRuleInput): Promise<DeleteRuleCommandOutput> => {
        const { client, logger } = context;
        const { name, eventBusName, force } = input;

        logger?.debug('deleteRule:start', { data: { name } });

        try {
            const command: DeleteRuleCommand = new DeleteRuleCommand({
                Name: name,
                EventBusName: eventBusName,
                Force: force,
            });
            const result: DeleteRuleCommandOutput = await client.send(command);
            logger?.debug('deleteRule:success');
            return result;
        } catch (error) {
            logger?.debug('deleteRule:error', { error });
            throw error;
        }
    };
