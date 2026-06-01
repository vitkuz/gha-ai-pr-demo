import { CreateRepositoryCommand, CreateRepositoryCommandOutput } from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface CreateRepositoryInput {
    repositoryName: string;
    imageScanOnPush?: boolean;
    imageTagMutability?: 'MUTABLE' | 'IMMUTABLE';
}

export const createRepository =
    (context: EcrContext) =>
    async (input: CreateRepositoryInput): Promise<CreateRepositoryCommandOutput> => {
        const { client, logger } = context;
        const { repositoryName, imageScanOnPush, imageTagMutability } = input;

        logger?.debug('createRepository:start', { data: { repositoryName } });

        try {
            const command: CreateRepositoryCommand = new CreateRepositoryCommand({
                repositoryName,
                imageScanningConfiguration:
                    imageScanOnPush !== undefined ? { scanOnPush: imageScanOnPush } : undefined,
                imageTagMutability,
            });
            const result: CreateRepositoryCommandOutput = await client.send(command);
            logger?.debug('createRepository:success', {
                data: { repositoryArn: result.repository?.repositoryArn },
            });
            return result;
        } catch (error) {
            logger?.debug('createRepository:error', { error });
            throw error;
        }
    };
