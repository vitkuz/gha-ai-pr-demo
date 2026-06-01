import {
    DescribeImagesCommand,
    DescribeImagesCommandOutput,
    ImageIdentifier,
} from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface DescribeImagesInput {
    repositoryName: string;
    imageIds?: ImageIdentifier[];
    nextToken?: string;
}

export const describeImages =
    (context: EcrContext) =>
    async (input: DescribeImagesInput): Promise<DescribeImagesCommandOutput> => {
        const { client, logger } = context;
        const { repositoryName, imageIds, nextToken } = input;

        logger?.debug('describeImages:start', { data: { repositoryName } });

        try {
            const command: DescribeImagesCommand = new DescribeImagesCommand({
                repositoryName,
                imageIds,
                nextToken,
            });
            const result: DescribeImagesCommandOutput = await client.send(command);
            logger?.debug('describeImages:success', {
                data: { count: result.imageDetails?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('describeImages:error', { error });
            throw error;
        }
    };
