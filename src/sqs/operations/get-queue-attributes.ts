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
        const { queueUrl, attributeNames } = input;

        const names: QueueAttributeName[] = attributeNames ?? ['All'];

        logger?.debug('getQueueAttributes:start', { data: { queueUrl, names } });

        try {
            const command: GetQueueAttributesCommand = new GetQueueAttributesCommand({
                QueueUrl: queueUrl,
                AttributeNames: names,
            });
            const result: GetQueueAttributesCommandOutput = await client.send(command);
            logger?.debug('getQueueAttributes:success');
            return result;
        } catch (error) {
            logger?.debug('getQueueAttributes:error', { error });
            throw error;
        }
    };
