import {
    ReceiveMessageCommand,
    ReceiveMessageCommandOutput,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface ReceiveMessagesInput {
    queueUrl: string;
    maxNumberOfMessages?: number;
    waitTimeSeconds?: number;
    visibilityTimeout?: number;
}

export const receiveMessages =
    (context: SqsContext) =>
    async (input: ReceiveMessagesInput): Promise<ReceiveMessageCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, maxNumberOfMessages = 1, waitTimeSeconds, visibilityTimeout } = input;

        const cappedMax = Math.min(maxNumberOfMessages, 10);

        logger?.debug('receiveMessages:start', { data: { queueUrl, maxNumberOfMessages: cappedMax } });

        try {
            const command = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: cappedMax,
                ...(waitTimeSeconds !== undefined && { WaitTimeSeconds: waitTimeSeconds }),
                ...(visibilityTimeout !== undefined && { VisibilityTimeout: visibilityTimeout }),
            });
            const result = await client.send(command);
            logger?.debug('receiveMessages:success', { data: { messageCount: result.Messages?.length ?? 0 } });
            return result;
        } catch (error) {
            logger?.debug('receiveMessages:error', { error });
            throw error;
        }
    };
