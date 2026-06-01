import {
    SendMessageBatchCommand,
    SendMessageBatchCommandOutput,
    SendMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface SendMessageBatchEntry {
    id: string;
    body: string;
    delaySeconds?: number;
}

export interface SendMessageBatchInput {
    queueUrl: string;
    entries: SendMessageBatchEntry[];
}

export const sendMessageBatch =
    (context: SqsContext) =>
    async (input: SendMessageBatchInput): Promise<SendMessageBatchCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, entries } = input;

        logger?.debug('sendMessageBatch:start', { data: { queueUrl, count: entries.length } });

        try {
            const batchEntries: SendMessageBatchRequestEntry[] = entries.map((entry) => ({
                Id: entry.id,
                MessageBody: entry.body,
                DelaySeconds: entry.delaySeconds,
            }));
            const command: SendMessageBatchCommand = new SendMessageBatchCommand({
                QueueUrl: queueUrl,
                Entries: batchEntries,
            });
            const result: SendMessageBatchCommandOutput = await client.send(command);
            logger?.debug('sendMessageBatch:success');
            return result;
        } catch (error) {
            logger?.debug('sendMessageBatch:error', { error });
            throw error;
        }
    };
