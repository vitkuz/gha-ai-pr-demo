import {
    SendMessageCommand,
    SendMessageCommandOutput,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface SendMessageInput {
    queueUrl: string;
    body: string;
    delaySeconds?: number;
    messageAttributes?: Record<string, { DataType: string; StringValue?: string; BinaryValue?: Uint8Array }>;
}

export const sendMessage =
    (context: SqsContext) =>
    async (input: SendMessageInput): Promise<SendMessageCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, body, delaySeconds, messageAttributes } = input;

        logger?.debug('sendMessage:start', { data: { queueUrl } });

        try {
            const command = new SendMessageCommand({
                QueueUrl: queueUrl,
                MessageBody: body,
                ...(delaySeconds !== undefined && { DelaySeconds: delaySeconds }),
                ...(messageAttributes !== undefined && { MessageAttributes: messageAttributes }),
            });
            const result = await client.send(command);
            logger?.debug('sendMessage:success');
            return result;
        } catch (error) {
            logger?.debug('sendMessage:error', { error });
            throw error;
        }
    };
