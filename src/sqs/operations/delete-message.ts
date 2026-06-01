import { DeleteMessageCommand, DeleteMessageCommandOutput } from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface DeleteMessageInput {
    queueUrl: string;
    receiptHandle: string;
}

export const deleteMessage =
    (context: SqsContext) =>
    async (input: DeleteMessageInput): Promise<DeleteMessageCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, receiptHandle } = input;

        logger?.debug('deleteMessage:start', { data: { queueUrl } });

        try {
            const command: DeleteMessageCommand = new DeleteMessageCommand({
                QueueUrl: queueUrl,
                ReceiptHandle: receiptHandle,
            });
            const result: DeleteMessageCommandOutput = await client.send(command);
            logger?.debug('deleteMessage:success');
            return result;
        } catch (error) {
            logger?.debug('deleteMessage:error', { error });
            throw error;
        }
    };
