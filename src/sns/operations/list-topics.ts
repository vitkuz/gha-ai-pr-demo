import { ListTopicsCommand, ListTopicsCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface ListTopicsInput {
    nextToken?: string;
}

export const listTopics =
    (context: SnsContext) =>
    async (input: ListTopicsInput = {}): Promise<ListTopicsCommandOutput> => {
        const { client, logger } = context;
        const { nextToken } = input;

        logger?.debug('listTopics:start', { data: { nextToken } });

        try {
            const command: ListTopicsCommand = new ListTopicsCommand({
                NextToken: nextToken,
            });
            const result: ListTopicsCommandOutput = await client.send(command);
            logger?.debug('listTopics:success');
            return result;
        } catch (error) {
            logger?.debug('listTopics:error', { error });
            throw error;
        }
    };
