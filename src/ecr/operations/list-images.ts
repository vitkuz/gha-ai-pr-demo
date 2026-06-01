import { ListImagesCommand, ListImagesCommandOutput } from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface ListImagesInput {
    repositoryName: string;
    nextToken?: string;
}

export const listImages =
    (context: EcrContext) =>
    async (input: ListImagesInput): Promise<ListImagesCommandOutput> => {
        const { client, logger } = context;
        const { repositoryName, nextToken } = input;

        logger?.debug('listImages:start', { data: { repositoryName } });

        try {
            const command: ListImagesCommand = new ListImagesCommand({
                repositoryName,
                nextToken,
            });
            const result: ListImagesCommandOutput = await client.send(command);
            logger?.debug('listImages:success', {
                data: { count: result.imageIds?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('listImages:error', { error });
            throw error;
        }
    };
