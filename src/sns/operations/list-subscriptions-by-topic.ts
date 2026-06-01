import {
    ListSubscriptionsByTopicCommand,
    ListSubscriptionsByTopicCommandOutput,
} from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface ListSubscriptionsByTopicInput {
    topicArn: string;
    nextToken?: string;
}

export const listSubscriptionsByTopic =
    (context: SnsContext) =>
    async (
        input: ListSubscriptionsByTopicInput,
    ): Promise<ListSubscriptionsByTopicCommandOutput> => {
        const { client, logger } = context;
        const { topicArn, nextToken } = input;

        logger?.debug('listSubscriptionsByTopic:start', { data: { topicArn, nextToken } });

        try {
            const command: ListSubscriptionsByTopicCommand = new ListSubscriptionsByTopicCommand({
                TopicArn: topicArn,
                NextToken: nextToken,
            });
            const result: ListSubscriptionsByTopicCommandOutput = await client.send(command);
            logger?.debug('listSubscriptionsByTopic:success');
            return result;
        } catch (error) {
            logger?.debug('listSubscriptionsByTopic:error', { error });
            throw error;
        }
    };
