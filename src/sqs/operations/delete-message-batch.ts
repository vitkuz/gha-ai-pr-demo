import {
    DeleteMessageBatchCommand,
    DeleteMessageBatchCommandOutput,
    DeleteMessageBatchRequestEntry,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface DeleteMessageBatchEntry {
    id: string;
    receiptHandle: string;
}

export interface DeleteMessageBatchInput {
    queueUrl: string;
    entries: DeleteMessageBatchEntry[];
}

export const deleteMessageBatch =
    (context: SqsContext) =>
    async (input: DeleteMessageBatchInput): Promise<DeleteMessageBatchCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, entries } = input;

        logger?.debug('deleteMessageBatch:start', { data: { queueUrl, count: entries.length } });

        try {
            const batchEntries: DeleteMessageBatchRequestEntry[] = entries.map((entry) => ({
                Id: entry.id,
                ReceiptHandle: entry.receiptHandle,
            }));
            const command: DeleteMessageBatchCommand = new DeleteMessageBatchCommand({
                QueueUrl: queueUrl,
                Entries: batchEntries,
            });
            const result: DeleteMessageBatchCommandOutput = await client.send(command);
            logger?.debug('deleteMessageBatch:success');
            return result;
        } catch (error) {
            logger?.debug('deleteMessageBatch:error', { error });
            throw error;
        }
    };
