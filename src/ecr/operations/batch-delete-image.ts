import {
    BatchDeleteImageCommand,
    BatchDeleteImageCommandOutput,
    ImageIdentifier,
} from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface BatchDeleteImageInput {
    repositoryName: string;
    imageIds: ImageIdentifier[];
}

export const batchDeleteImage =
    (context: EcrContext) =>
    async (input: BatchDeleteImageInput): Promise<BatchDeleteImageCommandOutput> => {
        const { client, logger } = context;
        const { repositoryName, imageIds } = input;

        logger?.debug('batchDeleteImage:start', { data: { repositoryName, count: imageIds.length } });

        try {
            const command: BatchDeleteImageCommand = new BatchDeleteImageCommand({
                repositoryName,
                imageIds,
            });
            const result: BatchDeleteImageCommandOutput = await client.send(command);
            logger?.debug('batchDeleteImage:success', {
                data: { deletedCount: result.imageIds?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('batchDeleteImage:error', { error });
            throw error;
        }
    };
