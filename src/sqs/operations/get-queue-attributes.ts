import {
    GetQueueAttributesCommand,
    GetQueueAttributesCommandOutput,
    QueueAttributeName,
} from '@aws-sdk/client-sqs';
import { SqsContext } from '../types';

export interface GetQueueAttributesInput {
    queueUrl: string;
    attributeNames?: QueueAttributeName[];
}

export const getQueueAttributes =
    (context: SqsContext) =>
    async (input: GetQueueAttributesInput): Promise<GetQueueAttributesCommandOutput> => {
        const { client, logger } = context;
        const { queueUrl, attributeNames = ['All'] } = input;

        logger?.debug('getQueueAttributes:start', { data: { queueUrl } });

        try {
            const command = new GetQueueAttributesCommand({
                QueueUrl: queueUrl,
                AttributeNames: attributeNames,
            });
            const result = await client.send(command);
            logger?.debug('getQueueAttributes:success');
            return result;
        } catch (error) {
            logger?.debug('getQueueAttributes:error', { error });
            throw error;
        }
    };
