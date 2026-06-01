import {
    GetQueueUrlCommand,
    GetQueueUrlCommandOutput,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface GetQueueUrlInput {
    queueName: string;
}

export const getQueueUrl =
    (context: SqsContext) =>
    async (input: GetQueueUrlInput): Promise<GetQueueUrlCommandOutput> => {
        const { client, logger } = context;
        const { queueName } = input;

        logger?.debug('getQueueUrl:start', { data: { queueName } });

        try {
            const command = new GetQueueUrlCommand({
                QueueName: queueName,
            });
            const result = await client.send(command);
            logger?.debug('getQueueUrl:success');
            return result;
        } catch (error) {
            logger?.debug('getQueueUrl:error', { error });
            throw error;
        }
    };
