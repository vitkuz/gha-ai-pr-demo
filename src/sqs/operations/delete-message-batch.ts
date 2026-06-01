import {
    DeleteMessageBatchCommand,
    DeleteMessageBatchCommandOutput,
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

        logger?.debug('deleteMessageBatch:start', { data: { queueUrl, entryCount: entries.length } });

        try {
            const command = new DeleteMessageBatchCommand({
                QueueUrl: queueUrl,
                Entries: entries.map((e) => ({
                    Id: e.id,
                    ReceiptHandle: e.receiptHandle,
                })),
            });
            const result = await client.send(command);
            logger?.debug('deleteMessageBatch:success');
            return result;
        } catch (error) {
            logger?.debug('deleteMessageBatch:error', { error });
            throw error;
        }
    };
