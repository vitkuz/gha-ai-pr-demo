import {
    PutRuleCommand,
    PutRuleCommandOutput,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface PutRuleInput {
    name: string;
    eventPattern?: unknown;
    scheduleExpression?: string;
    state?: 'ENABLED' | 'DISABLED';
    eventBusName?: string;
}

export const putRule =
    (context: EventBridgeContext) =>
    async (input: PutRuleInput): Promise<PutRuleCommandOutput> => {
        const { client, logger } = context;
        const { name, eventPattern, scheduleExpression, state, eventBusName } =
            input;

        logger?.debug('putRule:start', { data: { name } });

        try {
            const command: PutRuleCommand = new PutRuleCommand({
                Name: name,
                EventPattern: eventPattern
                    ? JSON.stringify(eventPattern)
                    : undefined,
                ScheduleExpression: scheduleExpression,
                State: state,
                EventBusName: eventBusName,
            });
            const result: PutRuleCommandOutput = await client.send(command);
            logger?.debug('putRule:success');
            return result;
        } catch (error) {
            logger?.debug('putRule:error', { error });
            throw error;
        }
    };
