import { DeleteTopicCommand, DeleteTopicCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface DeleteTopicInput {
    topicArn: string;
}

export const deleteTopic =
    (context: SnsContext) =>
    async (input: DeleteTopicInput): Promise<DeleteTopicCommandOutput> => {
        const { client, logger } = context;
        const { topicArn } = input;

        logger?.debug('deleteTopic:start', { data: { topicArn } });

        try {
            const command: DeleteTopicCommand = new DeleteTopicCommand({
                TopicArn: topicArn,
            });
            const result: DeleteTopicCommandOutput = await client.send(command);
            logger?.debug('deleteTopic:success');
            return result;
        } catch (error) {
            logger?.debug('deleteTopic:error', { error });
            throw error;
        }
    };
