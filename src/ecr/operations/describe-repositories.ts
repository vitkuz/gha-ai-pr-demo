import {
    DescribeRepositoriesCommand,
    DescribeRepositoriesCommandOutput,
} from '@aws-sdk/client-ecr';
import { EcrContext } from '../types';

export interface DescribeRepositoriesInput {
    repositoryNames?: string[];
    nextToken?: string;
}

export const describeRepositories =
    (context: EcrContext) =>
    async (input: DescribeRepositoriesInput): Promise<DescribeRepositoriesCommandOutput> => {
        const { client, logger } = context;
        const { repositoryNames, nextToken } = input;

        logger?.debug('describeRepositories:start', { data: { repositoryNames } });

        try {
            const command: DescribeRepositoriesCommand = new DescribeRepositoriesCommand({
                repositoryNames,
                nextToken,
            });
            const result: DescribeRepositoriesCommandOutput = await client.send(command);
            logger?.debug('describeRepositories:success', {
                data: { count: result.repositories?.length },
            });
            return result;
        } catch (error) {
            logger?.debug('describeRepositories:error', { error });
            throw error;
        }
    };
