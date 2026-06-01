import { DeleteRepositoryCommand, DeleteRepositoryCommandOutput } from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface DeleteRepositoryInput {
    repositoryName: string;
    force?: boolean;
}

export const deleteRepository =
    (context: EcrContext) =>
    async (input: DeleteRepositoryInput): Promise<DeleteRepositoryCommandOutput> => {
        const { client, logger } = context;
        const { repositoryName, force } = input;

        logger?.debug('deleteRepository:start', { data: { repositoryName } });

        try {
            const command: DeleteRepositoryCommand = new DeleteRepositoryCommand({
                repositoryName,
                force,
            });
            const result: DeleteRepositoryCommandOutput = await client.send(command);
            logger?.debug('deleteRepository:success', {
                data: { repository: result.repository?.repositoryName },
            });
            return result;
        } catch (error) {
            logger?.debug('deleteRepository:error', { error });
            throw error;
        }
    };
