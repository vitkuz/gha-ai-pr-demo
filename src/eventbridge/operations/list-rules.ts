import {
    ListRulesCommand,
    ListRulesCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface ListRulesInput {
    eventBusName?: string;
    namePrefix?: string;
    nextToken?: string;
}

export const listRules =
    (context: EventBridgeContext) =>
    async (input: ListRulesInput): Promise<ListRulesCommandOutput> => {
        const { client, logger } = context;
        const { eventBusName, namePrefix, nextToken } = input;

        logger?.debug('listRules:start', { data: { eventBusName, namePrefix } });

        try {
            const command: ListRulesCommand = new ListRulesCommand({
                EventBusName: eventBusName,
                NamePrefix: namePrefix,
                NextToken: nextToken,
            });
            const result: ListRulesCommandOutput = await client.send(command);
            logger?.debug('listRules:success');
            return result;
        } catch (error) {
            logger?.debug('listRules:error', { error });
            throw error;
        }
    };
