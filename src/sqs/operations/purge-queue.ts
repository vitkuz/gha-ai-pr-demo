import { PurgeQueueCommand, PurgeQueueCommandOutput } from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface PurgeQueueInput {
    queueUrl: string;
}

export const purgeQueue =
    (context: SqsContext) =>
    async (input: PurgeQueueInput): Promise<PurgeQueueCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl } = input;

        logger?.debug('purgeQueue:start', { data: { queueUrl } });

        try {
            const command: PurgeQueueCommand = new PurgeQueueCommand({
                QueueUrl: queueUrl,
            });
            const result: PurgeQueueCommandOutput = await client.send(command);
            logger?.debug('purgeQueue:success');
            return result;
        } catch (error) {
            logger?.debug('purgeQueue:error', { error });
            throw error;
        }
    };
