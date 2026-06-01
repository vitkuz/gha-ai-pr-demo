import {
    PutTargetsCommand,
    PutTargetsCommandOutput,
    Target,
} from '@aws-sdk/client-eventbridge';
import { EventBridgeContext } from '../types';

export interface PutTargetsInputTarget {
    id: string;
    arn: string;
    input?: string;
}

export interface PutTargetsInput {
    rule: string;
    targets: PutTargetsInputTarget[];
    eventBusName?: string;
}

export const putTargets =
    (context: EventBridgeContext) =>
    async (input: PutTargetsInput): Promise<PutTargetsCommandOutput> => {
        const { client, logger } = context;
        const { rule, targets, eventBusName } = input;

        logger?.debug('putTargets:start', { data: { rule, count: targets.length } });

        try {
            const command: PutTargetsCommand = new PutTargetsCommand({
                Rule: rule,
                Targets: targets.map(
                    (t): Target => ({
                        Id: t.id,
                        Arn: t.arn,
                        Input: t.input,
                    }),
                ),
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
