import { SendMessageBatchCommand, SendMessageBatchCommandOutput } from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface SendMessageBatchEntry {
    id: string;
    body: string;
    delaySeconds?: number;
    messageAttributes?: Record<
        string,
        { DataType: string; StringValue?: string; BinaryValue?: Uint8Array }
    >;
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

        logger?.debug('sendMessageBatch:start', { data: { queueUrl, entryCount: entries.length } });

        try {
            const command = new SendMessageBatchCommand({
                QueueUrl: queueUrl,
                Entries: entries.map((e) => ({
                    Id: e.id,
                    MessageBody: e.body,
                    ...(e.delaySeconds !== undefined && { DelaySeconds: e.delaySeconds }),
                    ...(e.messageAttributes !== undefined && {
                        MessageAttributes: e.messageAttributes,
                    }),
                })),
            });
            const result = await client.send(command);
            logger?.debug('sendMessageBatch:success');
            return result;
        } catch (error) {
            logger?.debug('sendMessageBatch:error', { error });
            throw error;
        }
    };
