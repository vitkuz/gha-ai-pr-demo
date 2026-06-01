import { ReceiveMessageCommand, ReceiveMessageCommandOutput } from '@aws-sdk/client-sqs';
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
        const { queueUrl, maxNumberOfMessages, waitTimeSeconds, visibilityTimeout } = input;

        const maxMessages: number = Math.min(maxNumberOfMessages ?? 1, 10);

        logger?.debug('receiveMessages:start', { data: { queueUrl, maxMessages } });

        try {
            const command: ReceiveMessageCommand = new ReceiveMessageCommand({
                QueueUrl: queueUrl,
                MaxNumberOfMessages: maxMessages,
                WaitTimeSeconds: waitTimeSeconds,
                VisibilityTimeout: visibilityTimeout,
            });
            const result: ReceiveMessageCommandOutput = await client.send(command);
            logger?.debug('receiveMessages:success');
            return result;
        } catch (error) {
            logger?.debug('receiveMessages:error', { error });
            throw error;
        }
    };
