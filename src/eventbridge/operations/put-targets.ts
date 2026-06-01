import { PutTargetsCommand, PutTargetsCommandOutput } from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface PutTarget {
    id: string;
    arn: string;
    input?: string;
}

export interface PutTargetsInput {
    rule: string;
    targets: PutTarget[];
    eventBusName?: string;
}

export const putTargets =
    (context: EventBridgeContext) =>
    async (input: PutTargetsInput): Promise<PutTargetsCommandOutput> => {
        const { client, logger } = context;
        const { rule, targets, eventBusName } = input;

        logger?.debug('putTargets:start', {
            data: { rule, targetCount: targets.length, eventBusName },
        });

        try {
            const command: PutTargetsCommand = new PutTargetsCommand({
                Rule: rule,
                Targets: targets.map((t) => ({
                    Id: t.id,
                    Arn: t.arn,
                    Input: t.input,
                })),
                EventBusName: eventBusName,
            });
            const result: PutTargetsCommandOutput = await client.send(command);
            logger?.debug('putTargets:success');
            return result;
        } catch (error) {
            logger?.debug('putTargets:error', { error });
            throw error;
        }
    };
