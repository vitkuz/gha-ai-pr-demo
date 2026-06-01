import { PublishCommand, PublishCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface PublishInput {
    topicArn: string;
    message: string;
    subject?: string;
    messageAttributes?: Record<string, { DataType: string; StringValue: string }>;
}

export const publish =
    (context: SnsContext) =>
    async (input: PublishInput): Promise<PublishCommandOutput> => {
        const { client, logger } = context;
        const { topicArn, message, subject, messageAttributes } = input;

        logger?.debug('publish:start', { data: { topicArn, subject } });

        try {
            const command: PublishCommand = new PublishCommand({
                TopicArn: topicArn,
                Message: message,
                Subject: subject,
                MessageAttributes: messageAttributes,
            });
            const result: PublishCommandOutput = await client.send(command);
            logger?.debug('publish:success');
            return result;
        } catch (error) {
            logger?.debug('publish:error', { error });
            throw error;
        }
    };
