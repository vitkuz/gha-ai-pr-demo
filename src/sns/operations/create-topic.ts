import { CreateTopicCommand, CreateTopicCommandOutput } from '@aws-sdk/client-sns';
import { SnsContext } from '../types';

export interface CreateTopicInput {
    name: string;
}

export const createTopic =
    (context: SnsContext) =>
    async (input: CreateTopicInput): Promise<CreateTopicCommandOutput> => {
        const { client, logger } = context;
        const { name } = input;

        logger?.debug('createTopic:start', { data: { name } });

        try {
            const command: CreateTopicCommand = new CreateTopicCommand({
                Name: name,
            });
            const result: CreateTopicCommandOutput = await client.send(command);
            logger?.debug('createTopic:success');
            return result;
        } catch (error) {
            logger?.debug('createTopic:error', { error });
            throw error;
        }
    };
